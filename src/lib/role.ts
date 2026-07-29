import { cookies } from "next/headers";

export const ROLE_COOKIE = "kelola-role";
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
