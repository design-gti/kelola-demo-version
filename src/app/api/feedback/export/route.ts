import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/session";
import { isAuditStoreConfigured, listAuditEvents } from "@/lib/agent/auditStore";

interface FeedbackRow {
  timestamp: string;
  rating: "up" | "down";
  question: string | null;
  answer: string | null;
}

// RFC4180-ish: quote a field only when it contains a comma, quote, or
// newline, doubling any internal quotes — matches scripts/harvest-questions.mjs's
// CSV writer, kept as a separate copy since that script is deliberately
// standalone (no src/ imports — see its own header comment).
function csvField(value: string | null): string {
  const s = value ?? "";
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function toCsv(rows: FeedbackRow[]): string {
  const header = ["timestamp", "rating", "question", "answer"];
  const lines = rows.map(r => [r.timestamp, r.rating, r.question, r.answer].map(csvField).join(","));
  return [header.join(","), ...lines].join("\n") + "\n";
}

/**
 * Downloadable CSV recap of every thumbs up/down click, straight from the
 * durable Redis sink (see auditStore.ts) — no CLI, no `vercel logs` pull.
 * Gated to "hr" sessions: feedback text can quote an employee's data back
 * (see /api/feedback's own MAX_TEXT_CHARS comment), so this is sensitive in
 * the same way any other aggregate HR view is.
 */
export async function GET(req: NextRequest) {
  const session = verifySessionToken(req.cookies.get(SESSION_COOKIE_NAME)?.value);
  if (!session) {
    return NextResponse.json({ error: "No session — POST /api/session first" }, { status: 401 });
  }
  if (session.role !== "hr") {
    return NextResponse.json({ error: "Only an hr session can export the feedback recap" }, { status: 403 });
  }

  if (!isAuditStoreConfigured()) {
    return NextResponse.json(
      {
        error:
          "No durable feedback store configured. Set UPSTASH_REDIS_REST_URL/UPSTASH_REDIS_REST_TOKEN " +
          "(see .env.example) — until then, feedback only reaches console/Vercel Runtime Logs, exportable " +
          "via `vercel logs --json <url> | node scripts/harvest-questions.mjs`.",
      },
      { status: 501 }
    );
  }

  const events = await listAuditEvents();
  const rows: FeedbackRow[] = events
    .filter(e => e.action === "feedback" && (e.detail?.rating === "up" || e.detail?.rating === "down"))
    .map(e => ({
      timestamp: e.timestamp,
      rating: e.detail?.rating as "up" | "down",
      question: typeof e.detail?.question === "string" ? e.detail.question : null,
      answer: typeof e.detail?.answer === "string" ? e.detail.answer : null,
    }));

  return new NextResponse(toCsv(rows), {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="feedback-recap-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
