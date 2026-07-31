import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/session";
import { logAgentEvent } from "@/lib/agent/auditLog";

const MAX_BODY_BYTES = 20_000;
const MAX_TEXT_CHARS = 2000;

/**
 * Persists the chat panel's thumbs up/down feedback — CopilotChat's own
 * onThumbsUp/onThumbsDown only update local React state (see
 * AssistantPanel.tsx's comment); nothing survives a reload unless it's sent
 * somewhere. Logged via the same logAgentEvent sink as everything else in
 * src/lib/agent/, so scripts/harvest-questions.mjs picks it up alongside
 * captured questions — a thumbs-up on a question is a strong signal that
 * question is ready to promote into scripts/eval/cases.ts as-is; a
 * thumbs-down flags one that needs a closer look before it's trusted.
 */
export async function POST(req: NextRequest) {
  const contentLength = req.headers.get("content-length");
  if (contentLength && Number(contentLength) > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Request too large" }, { status: 413 });
  }

  const session = verifySessionToken(req.cookies.get(SESSION_COOKIE_NAME)?.value);
  if (!session) {
    return NextResponse.json({ error: "No session — POST /api/session first" }, { status: 401 });
  }

  let body: { question?: unknown; answer?: unknown; rating?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (body.rating !== "up" && body.rating !== "down") {
    return NextResponse.json({ error: 'rating must be "up" or "down"' }, { status: 400 });
  }

  logAgentEvent({
    sessionRole: session.role,
    action: "feedback",
    detail: {
      rating: body.rating,
      question: typeof body.question === "string" ? body.question.slice(0, MAX_TEXT_CHARS) : null,
      answer: typeof body.answer === "string" ? body.answer.slice(0, MAX_TEXT_CHARS) : null,
    },
  });

  return NextResponse.json({ ok: true });
}
