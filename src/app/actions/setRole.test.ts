import { describe, expect, it, vi, beforeEach } from "vitest";
import { ROLE_COOKIE } from "@/lib/role";

// Mock next/headers sebelum import setRole
const mockCookiesModule: {
  setCalls: any[];
  set: ReturnType<typeof vi.fn>;
} = {
  setCalls: [],
  set: vi.fn(),
};

// Set up the set function to track calls
mockCookiesModule.set.mockImplementation((...args: any[]) => {
  mockCookiesModule.setCalls.push(args);
});

vi.mock("next/headers", () => ({
  cookies: vi.fn(async () => ({
    set: mockCookiesModule.set,
  })),
}));

// Import setelah mock
import { setRole } from "./setRole";

describe("setRole", () => {
  beforeEach(() => {
    // Reset mock sebelum setiap test
    mockCookiesModule.set.mockClear();
    mockCookiesModule.setCalls = [];
  });

  it("menyetel cookie kelola-role-v2 dengan atribut embed yang benar", async () => {
    await setRole("hr");

    // Verifikasi bahwa .set() dipanggil
    expect(mockCookiesModule.set).toHaveBeenCalledTimes(1);

    // Tangkap argumen yang diteruskan ke .set()
    const [cookieName, cookieValue, options] = mockCookiesModule.setCalls[0];

    // Verifikasi nama dan nilai cookie
    expect(cookieName).toBe(ROLE_COOKIE);
    expect(cookieValue).toBe("hr");

    // Verifikasi atribut yang selamat di iframe lintas situs
    expect(options.sameSite).toBe("none");
    expect(options.secure).toBe(true);
    expect(options.partitioned).toBe(true);

    // Verifikasi bahwa httpOnly tetap terjaga
    expect(options.httpOnly).toBe(true);

    // Verifikasi atribut lainnya
    expect(options.path).toBe("/");
    expect(options.maxAge).toBe(60 * 60 * 24 * 180);
  });

  it("bekerja dengan role manager", async () => {
    await setRole("manager");

    expect(mockCookiesModule.set).toHaveBeenCalledTimes(1);
    const [, cookieValue] = mockCookiesModule.setCalls[0];
    expect(cookieValue).toBe("manager");
  });
});
