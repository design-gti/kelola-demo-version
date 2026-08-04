import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/session";
import { isAuditStoreConfigured, listAuditEvents } from "@/lib/agent/auditStore";

interface QuestionRow {
  timestamp: string;
  sessionRole: string;
  question: string;
}

// RFC4180-ish: quote a field only when it contains a comma, quote, or
// newline, doubling any internal quotes — matches feedback/export's writer.
function csvField(value: string): string {
  return /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

function toCsv(rows: QuestionRow[]): string {
  const header = ["timestamp", "sessionRole", "question"];
  const lines = rows.map(r => [r.timestamp, r.sessionRole, r.question].map(csvField).join(","));
  return [header.join(","), ...lines].join("\n") + "\n";
}

/**
 * Downloadable CSV of every question asked — unlike /api/feedback/export,
 * not limited to the ones that got a thumbs up/down. Every turn logs a
 * "question" event from /api/copilotkit regardless of feedback; this just
 * surfaces that same durable Redis data. Same gating as feedback/export.
 */
export async function GET(req: NextRequest) {
  const session = verifySessionToken(req.cookies.get(SESSION_COOKIE_NAME)?.value);
  if (!session) {
    return NextResponse.json({ error: "No session — POST /api/session first" }, { status: 401 });
  }
  if (session.role !== "hr") {
    return NextResponse.json({ error: "Only an hr session can export the question recap" }, { status: 403 });
  }

  if (!isAuditStoreConfigured()) {
    return NextResponse.json(
      {
        error:
          "No durable question store configured. Set UPSTASH_REDIS_REST_URL/UPSTASH_REDIS_REST_TOKEN " +
          "(see .env.example) — until then, questions only reach console/Vercel Runtime Logs, exportable " +
          "via `vercel logs --json <url> | node scripts/harvest-questions.mjs`.",
      },
      { status: 501 }
    );
  }

  const events = await listAuditEvents();
  const rows: QuestionRow[] = events
    .filter(e => e.action === "question" && typeof e.detail?.text === "string")
    .map(e => ({
      timestamp: e.timestamp,
      sessionRole: e.sessionRole,
      question: e.detail!.text as string,
    }));

  return new NextResponse(toCsv(rows), {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="questions-recap-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
