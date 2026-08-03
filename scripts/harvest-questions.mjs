#!/usr/bin/env node
// Plain Node script (no TS, no src/ imports) so it can run standalone against
// an exported log file without pulling in the app's build/path-alias setup —
// matches this repo's existing scripts/*.mjs convention.
//
// Reads structured "[agent-audit] {...}" lines (the format logAgentEvent
// emits — see src/lib/agent/auditLog.ts) from a file (arg) or stdin, groups
// them by requestId to pair each captured question with the tool(s) it
// triggered, clusters near-identical phrasings together, and ranks by
// frequency. Output is a starting point for picking real, frequently-asked
// questions to promote into scripts/eval/cases.ts — NOT an automatic
// eval-case generator: a human still needs to confirm the right tool/answer
// before adding one (see the printed reminder at the end).
//
// Usage:
//   vercel logs --json <deployment-url> > /tmp/logs.ndjson
//   node scripts/harvest-questions.mjs /tmp/logs.ndjson [--top=20]
// or, piped:
//   vercel logs --json <deployment-url> | node scripts/harvest-questions.mjs

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const AUDIT_LINE_RE = /\[agent-audit\]\s*(\{.*\})\s*$/;

function normalizeForClustering(text) {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter(Boolean)
    .sort()
    .join(" ");
}

function parseAuditEvents(raw) {
  const events = [];
  for (const line of raw.split("\n")) {
    const match = AUDIT_LINE_RE.exec(line);
    if (!match) continue;
    try {
      events.push(JSON.parse(match[1]));
    } catch {
      // Skip lines where the JSON got truncated/wrapped by the log exporter.
    }
  }
  return events;
}

// Thumbs up/down from the chat panel (see src/app/api/feedback/route.ts) —
// a direct, already-paired {question, answer, rating} signal, unlike the
// tool-trace correlation above. Reported separately: thumbs-up entries are
// candidates to promote into scripts/eval/cases.ts largely as-is; thumbs-down
// ones flag a real answer that needs a closer look before anyone trusts it.
function extractFeedback(events) {
  return events
    .filter(e => e.action === "feedback" && (e.detail?.rating === "up" || e.detail?.rating === "down"))
    .map(e => ({ rating: e.detail.rating, question: e.detail.question ?? null, answer: e.detail.answer ?? null, timestamp: e.timestamp }));
}

function correlateByRequest(events) {
  const byRequest = new Map();
  for (const event of events) {
    const requestId = event.requestId ?? event.detail?.requestId;
    if (!requestId) continue;
    const entry = byRequest.get(requestId) ?? { question: null, tools: [] };
    if (event.action === "question") {
      entry.question = event.detail?.text ?? null;
    } else {
      entry.tools.push({ name: event.action, args: event.detail ?? {} });
    }
    byRequest.set(requestId, entry);
  }
  return [...byRequest.values()].filter(e => e.question);
}

// RFC4180-ish: quote a field only when it contains a comma, quote, or
// newline, doubling any internal quotes — so this opens cleanly in Excel/
// Google Sheets without a separate JSON->CSV conversion step.
function csvField(value) {
  const s = value == null ? "" : String(value);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function feedbackToCsv(feedback) {
  const header = ["timestamp", "rating", "question", "answer"];
  const rows = feedback.map(f => [f.timestamp, f.rating, f.question, f.answer]);
  return [header, ...rows].map(row => row.map(csvField).join(",")).join("\n") + "\n";
}

function clusterByQuestion(entries) {
  const clusters = new Map();
  for (const { question, tools } of entries) {
    const key = normalizeForClustering(question);
    if (!key) continue;
    const cluster = clusters.get(key) ?? { count: 0, examples: new Set(), toolCounts: new Map() };
    cluster.count += 1;
    cluster.examples.add(question);
    for (const tool of tools) {
      const toolKey = JSON.stringify({ name: tool.name, args: tool.args });
      cluster.toolCounts.set(toolKey, (cluster.toolCounts.get(toolKey) ?? 0) + 1);
    }
    clusters.set(key, cluster);
  }
  return [...clusters.values()]
    .map(c => ({
      count: c.count,
      examples: [...c.examples],
      tools: [...c.toolCounts.entries()]
        .map(([toolKey, count]) => ({ ...JSON.parse(toolKey), count }))
        .sort((a, b) => b.count - a.count),
    }))
    .sort((a, b) => b.count - a.count);
}

function main() {
  const args = process.argv.slice(2);
  const topArg = args.find(a => a.startsWith("--top="));
  const top = topArg ? Number(topArg.slice("--top=".length)) : 20;
  const filePath = args.find(a => !a.startsWith("--"));

  const raw = filePath ? readFileSync(filePath, "utf-8") : readFileSync(0, "utf-8");
  const events = parseAuditEvents(raw);
  const entries = correlateByRequest(events);
  const clusters = clusterByQuestion(entries).slice(0, top);
  const feedback = extractFeedback(events);

  if (clusters.length === 0 && feedback.length === 0) {
    console.error("No \"[agent-audit]\" question or feedback events found in input. Nothing to harvest yet.");
    process.exit(1);
  }

  if (clusters.length > 0) {
    console.log(`Top ${clusters.length} most-asked question clusters (of ${entries.length} captured questions):\n`);
    clusters.forEach((c, i) => {
      console.log(`${i + 1}. (${c.count}x) "${c.examples[0]}"`);
      if (c.examples.length > 1) console.log(`   other phrasings: ${c.examples.slice(1, 4).join(" | ")}${c.examples.length > 4 ? " | ..." : ""}`);
      if (c.tools.length) console.log(`   tool(s) triggered: ${c.tools.map(t => `${t.name}(${JSON.stringify(t.args)}) x${t.count}`).join(", ")}`);
      else console.log("   tool(s) triggered: none captured");
      console.log("");
    });
  }

  if (feedback.length > 0) {
    const up = feedback.filter(f => f.rating === "up");
    const down = feedback.filter(f => f.rating === "down");
    console.log(`Feedback: ${up.length} thumbs-up, ${down.length} thumbs-down.\n`);
    if (down.length > 0) {
      console.log("Thumbs-down — needs a closer look before trusting the answer:");
      down.forEach((f, i) => {
        console.log(`${i + 1}. Q: "${f.question ?? "(unknown)"}"`);
        console.log(`   A: "${f.answer ?? "(unknown)"}"`);
      });
      console.log("");
    }
    if (up.length > 0) {
      console.log("Thumbs-up — candidates to promote into scripts/eval/cases.ts largely as-is:");
      up.forEach((f, i) => console.log(`${i + 1}. Q: "${f.question ?? "(unknown)"}" → A: "${f.answer ?? "(unknown)"}"`));
      console.log("");
    }
  }

  const outPath = fileURLToPath(new URL("./eval/harvested-questions.json", import.meta.url));
  writeFileSync(outPath, JSON.stringify(clusters, null, 2));
  console.log(`Full question-cluster data written to ${outPath}`);

  if (feedback.length > 0) {
    const feedbackOutPath = fileURLToPath(new URL("./eval/harvested-feedback.json", import.meta.url));
    writeFileSync(feedbackOutPath, JSON.stringify(feedback, null, 2));
    console.log(`Full feedback data written to ${feedbackOutPath}`);

    const feedbackCsvPath = fileURLToPath(new URL("./eval/harvested-feedback.csv", import.meta.url));
    writeFileSync(feedbackCsvPath, feedbackToCsv(feedback));
    console.log(`Feedback recap (rating, question, answer, timestamp) written to ${feedbackCsvPath} — open directly in Excel/Google Sheets`);
  }

  console.log(
    "\nReminder: before promoting any of these into scripts/eval/cases.ts, confirm the tool/args actually" +
    " match what SHOULD have been called — this harvest reflects what the model did, not what's necessarily correct." +
    " A thumbs-up is a strong signal, not a guarantee."
  );
}

main();
