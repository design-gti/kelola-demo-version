"use server";

import { cookies } from "next/headers";
import { ROLE_COOKIE, type UserRole } from "@/lib/role";

export async function setRole(role: UserRole): Promise<void> {
  const store = await cookies();
  store.set(ROLE_COOKIE, role, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 180,
  });
}
