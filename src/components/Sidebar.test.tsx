// @vitest-environment jsdom
import type { ReactNode } from "react";
import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import Sidebar from "./Sidebar";

vi.mock("next/navigation", () => ({
  usePathname: () => "/vismap",
}));

vi.mock("next/link", () => ({
  default: ({ children, href }: { children: ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

const sidebarWidth = () =>
  document.documentElement.style.getPropertyValue("--sidebar-w");

afterEach(() => {
  cleanup();
  delete document.documentElement.dataset.embed;
  document.documentElement.style.removeProperty("--sidebar-w");
  localStorage.clear();
});

describe("Sidebar", () => {
  it("tidak menulis ulang --sidebar-w saat mode embed aktif", () => {
    // Skrip inline di layout.tsx sudah menyetel keduanya sebelum React mount.
    document.documentElement.dataset.embed = "1";
    document.documentElement.style.setProperty("--sidebar-w", "0px");

    render(<Sidebar />);

    // Kalau penjaga hilang, efek mount Sidebar menimpanya jadi "220px" dan
    // konten tergeser 220px ke kanan padahal sidebarnya tak terlihat.
    expect(sidebarWidth()).toBe("0px");
  });

  it("tetap menyetel --sidebar-w seperti biasa di luar mode embed", () => {
    render(<Sidebar />);

    expect(sidebarWidth()).toBe("220px");
  });

  it("menandai <aside> dengan data-app-sidebar agar bisa disasar CSS", () => {
    const { container } = render(<Sidebar />);

    expect(container.querySelector("aside[data-app-sidebar]")).not.toBeNull();
  });
});
