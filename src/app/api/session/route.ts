import { NextRequest, NextResponse } from "next/server";
import { MANAGER_TEAM_IDS } from "@/data/managerTeamData";
import { createSessionToken, verifySessionToken, SESSION_COOKIE_NAME, type SessionRole } from "@/lib/session";

const ONE_DAY_SECONDS = 60 * 60 * 24;

export async function POST(req: NextRequest) {
  let role: SessionRole;
  try {
    const body = await req.json();
    role = body.role;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (role !== "hr" && role !== "manager") {
    return NextResponse.json({ error: 'role must be "hr" or "manager"' }, { status: 400 });
  }

  // Reuses the app's one modeled manager scope — see managerTeamData.ts's own
  // comment: there is exactly one demo manager today, not a real
  // manager→report graph. HR is unrestricted, matching what the HR dashboard
  // view already shows in the UI today.
  const scopeIds = role === "manager" ? MANAGER_TEAM_IDS : null;
  const token = createSessionToken(role, scopeIds);

  const res = NextResponse.json({ role, scopeIds });
  res.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: ONE_DAY_SECONDS,
    path: "/",
  });
  return res;
}

export async function GET(req: NextRequest) {
  const session = verifySessionToken(req.cookies.get(SESSION_COOKIE_NAME)?.value);
  if (!session) return NextResponse.json({ session: null }, { status: 200 });
  return NextResponse.json({ session });
}
