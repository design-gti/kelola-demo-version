import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/session";
import { getInsights } from "@/lib/agent/insightsEngine";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const session = verifySessionToken(req.cookies.get(SESSION_COOKIE_NAME)?.value);
  // No session yet is a normal, non-error state here (e.g. a request that
  // races CopilotProvider's own session bootstrap) — just nothing to show.
  if (!session) return NextResponse.json({ insights: [] });
  return NextResponse.json({ insights: await getInsights(session) });
}
