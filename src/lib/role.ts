import { cookies } from "next/headers";

// -v2 karena cookie lama (kelola-role tanpa partisi, SameSite=Lax) tetap tersimpan
// di browser pengguna dengan TTL 180 hari dan mengalahkan cookie baru (terpartisi,
// SameSite=None). Nama baru mencegah tabrakan; cookie lama akan kedaluwarsa sendiri.
export const ROLE_COOKIE = "kelola-role-v2";
export type UserRole = "hr" | "manager";

/**
 * Demo-only role signal — NOT real access control. Anyone can set this
 * cookie themselves, exactly as they can flip the SegmentedControl today.
 * The only property this buys is that a given render only computes/ships
 * data for the role actually selected, instead of unconditionally
 * computing/shipping everything for every role to every visitor.
 */
export async function getRole(): Promise<UserRole> {
  const store = await cookies();
  return store.get(ROLE_COOKIE)?.value === "manager" ? "manager" : "hr";
}
