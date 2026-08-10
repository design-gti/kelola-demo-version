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
    // Halaman ini di-embed sebagai iframe lintas situs di Integro. Dengan
    // SameSite=Lax browser memperlakukan cookie ini sebagai pihak ketiga dan
    // tidak mengirimkannya, sehingga GET /api/session selalu null dan
    // /api/copilotkit menjawab 401. `partitioned` (CHIPS) membuat Chrome dan
    // Firefox tetap menyimpannya, terisolasi per situs induk.
    //
    // SameSite=None MEWAJIBKAN Secure. Browser Chrome/Firefox memperlakukan localhost
    // sebagai origin tepercaya dan menerima Secure cookie bahkan di http://localhost.
    // Jadi `next dev` biasa tetap berfungsi. Yang patah adalah dev di host non-localhost
    // atas plain http: `next dev -H 0.0.0.0` diakses via `http://192.168.x.x`, demo ke
    // rekan sejaring, atau tunnel http — di situ kelola_session DAN kelola-role-v2 hilang.
    // Workaround: `next dev --experimental-https` atau akses melalui HTTPS/tunnel yang tepat.
    sameSite: "none",
    secure: true,
    partitioned: true,
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
