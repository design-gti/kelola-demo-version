"use server";

import { cookies } from "next/headers";
import { ROLE_COOKIE, type UserRole } from "@/lib/role";

export async function setRole(role: UserRole): Promise<void> {
  const store = await cookies();
  store.set(ROLE_COOKIE, role, {
    path: "/",
    httpOnly: true,
    // Alasan sama dengan kelola_session di api/session/route.ts: tanpa ini,
    // di dalam iframe Integro getRole() diam-diam jatuh ke "hr" — pengguna
    // memilih "Manager" di RoleSwitcher, tampilan tidak berubah, nol error.
    sameSite: "none",
    secure: true,
    partitioned: true,
    maxAge: 60 * 60 * 24 * 180,
  });
}
