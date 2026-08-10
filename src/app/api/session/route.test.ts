import { NextRequest } from "next/server";
import { beforeAll, describe, expect, it } from "vitest";
import { SESSION_COOKIE_NAME } from "@/lib/session";
import { POST } from "./route";

beforeAll(() => {
  // createSessionToken() melempar tanpa ini (src/lib/session/index.ts:30).
  process.env.SESSION_SECRET = "rahasia-untuk-tes";
});

const postSession = () =>
  POST(
    new NextRequest("https://demo.test/api/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: "hr" }),
    })
  );

describe("POST /api/session", () => {
  it("menyetel cookie yang selamat di iframe lintas situs", async () => {
    const res = await postSession();
    const cookie = res.cookies.get(SESSION_COOKIE_NAME);

    // Tanpa ketiganya, cookie diperlakukan sebagai pihak ketiga di dalam iframe
    // Integro: /api/copilotkit menjawab 401 dan panel asisten gagal mount.
    expect(cookie?.sameSite).toBe("none");
    expect(cookie?.secure).toBe(true);
    expect(cookie?.partitioned).toBe(true);
  });

  it("tetap httpOnly", async () => {
    const res = await postSession();

    expect(res.cookies.get(SESSION_COOKIE_NAME)?.httpOnly).toBe(true);
  });
});
