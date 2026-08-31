import { describe, it, expect, vi, afterEach } from "vitest";
import { ensureSession } from "./ensureSession";

/**
 * The contract CopilotProvider depends on: ensureSession() reports whether a
 * session now exists, and reports FALSE (never throws, never a false positive)
 * when the endpoint is broken. Mounting <CopilotKit> on a false positive is
 * what put the "Runtime info request failed with status 500" overlay over the
 * whole page locally.
 */
const jsonResponse = (body: unknown, ok = true, status = 200) =>
  ({ ok, status, json: async () => body }) as unknown as Response;

const htmlErrorResponse = () =>
  ({
    ok: false,
    status: 500,
    // What `next dev` actually answers with when its worker has panicked:
    // an HTML error page, so .json() rejects.
    json: async () => {
      throw new SyntaxError("Unexpected token '<'");
    },
  }) as unknown as Response;

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("ensureSession", () => {
  it("returns true when a session already exists, without posting one", async () => {
    const fetchMock = vi.fn(async () => jsonResponse({ session: { role: "hr" } }));
    vi.stubGlobal("fetch", fetchMock);

    await expect(ensureSession()).resolves.toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("posts a session when none exists yet, and reports the POST's result", async () => {
    const fetchMock = vi.fn(async (_url: string, init?: RequestInit) =>
      init?.method === "POST" ? jsonResponse({ role: "hr" }) : jsonResponse({ session: null }),
    );
    vi.stubGlobal("fetch", fetchMock);

    await expect(ensureSession()).resolves.toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("returns false when the POST that creates the session fails", async () => {
    const fetchMock = vi.fn(async (_url: string, init?: RequestInit) =>
      init?.method === "POST" ? htmlErrorResponse() : jsonResponse({ session: null }),
    );
    vi.stubGlobal("fetch", fetchMock);

    await expect(ensureSession()).resolves.toBe(false);
  });

  it("returns false on a 500 instead of throwing on the HTML error body", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => htmlErrorResponse()));

    await expect(ensureSession()).resolves.toBe(false);
  });

  it("returns false when a 200 carries an unparseable body", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({ ok: true, status: 200, json: async () => { throw new SyntaxError("nope"); } }) as unknown as Response),
    );

    await expect(ensureSession()).resolves.toBe(false);
  });
});
