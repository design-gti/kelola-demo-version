"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavLink, UnstyledButton, Text, Tooltip } from "@mantine/core";
import {
  Home,
  BarChart2,
  Network,
  FileText,
  User,
  Map,
  Users,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Beranda", href: "/", icon: Home },
  { label: "iProfile", href: "/iprofile", icon: User },
  { label: "Visibility Map", href: "/vismap", icon: Network },
  { label: "Talent Decision", href: "/tdp-view", icon: BarChart2 },
  { label: "Talent Mapping", href: "/talent-mapping", icon: Map },
  { label: "Team Profile", href: "/team-profile", icon: Users },
  { label: "IDP", href: "/idp", icon: FileText },
];

/**
 * Rail navigasi kiri.
 *
 * Warna/tipografi diambil dari token Prodigy (CSS variable yang di-generate
 * MantineProvider) alih-alih nilai hardcode, dan item nav-nya pakai `NavLink`
 * Mantine supaya state `active`-nya jadi state komponen betulan — bukan
 * kondisional style yang ditulis sendiri. Latar rail sengaja tetap
 * primary-5 (biru Kelola), jadi seluruh isinya diberi warna putih lewat
 * `styles`, karena varian bawaan NavLink didesain untuk latar terang.
 */
const RAIL_BG = "var(--mantine-color-primary-5)";
const ON_RAIL = "var(--mantine-color-white)";
/** Sorotan item aktif: putih transparan, cukup kontras di atas primary-5. */
const ACTIVE_BG = "rgba(255,255,255,0.15)";
const HOVER_BG = "rgba(255,255,255,0.08)";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const saved = localStorage.getItem("sidebar-collapsed");
    if (saved !== null) setCollapsed(saved === "true");
  }, []);

  const setSidebarVar = (isCollapsed: boolean) => {
    document.documentElement.style.setProperty("--sidebar-w", isCollapsed ? "60px" : "220px");
  };

  useEffect(() => { setSidebarVar(collapsed); }, [collapsed]);

  const toggle = () => {
    setCollapsed((v) => {
      const next = !v;
      localStorage.setItem("sidebar-collapsed", String(next));
      setSidebarVar(next);
      return next;
    });
  };

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <aside
      style={{
        width: collapsed ? 60 : 220,
        background: RAIL_BG,
        display: "flex",
        flexDirection: "column",
        transition: "width 0.22s ease",
        position: "fixed",
        top: 0,
        left: 0,
        height: "100vh",
        overflowY: "auto",
        zIndex: 50,
      }}
    >
      {/* Header */}
      <UnstyledButton
        onClick={toggle}
        title={collapsed ? "Expand" : "Collapse"}
        style={{
          padding: collapsed ? "8px 0" : "8px 16px",
          borderBottom: "1px solid rgba(255,255,255,0.12)",
          minHeight: 52,
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          overflow: "hidden",
          width: "100%",
          textAlign: "left",
        }}
      >
        {collapsed ? (
          <ChevronRight size={16} color="rgba(255,255,255,0.7)" />
        ) : (
          <>
            <div>
              <Text fw={800} size="md" c={ON_RAIL} lh={1.2}>
                Kelola
              </Text>
              <Text size="xs" c="rgba(255,255,255,0.6)" mt={2}>
                Demo Environment
              </Text>
            </div>
            <ChevronLeft size={16} color="rgba(255,255,255,0.7)" style={{ flexShrink: 0 }} />
          </>
        )}
      </UnstyledButton>

      {/* Nav */}
      <nav style={{ flex: 1, paddingTop: 8 }}>
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const active = isActive(href);
          const item = (
            <NavLink
              key={href}
              component={Link}
              href={href}
              active={active}
              label={collapsed ? undefined : label}
              leftSection={<Icon size={18} color="#fff" strokeWidth={1.8} style={{ flexShrink: 0 }} />}
              styles={{
                root: {
                  padding: collapsed ? "10px 0" : "10px 16px",
                  justifyContent: collapsed ? "center" : "flex-start",
                  // Sorotan aktif: latar + garis kiri, ditulis di sini supaya
                  // menang atas varian bawaan NavLink yang dirancang untuk latar terang.
                  backgroundColor: active ? ACTIVE_BG : "transparent",
                  borderLeft: `3px solid ${active ? "#fff" : "transparent"}`,
                  transition: "background 0.15s",
                  "&:hover": { backgroundColor: active ? ACTIVE_BG : HOVER_BG },
                },
                section: { marginInlineEnd: collapsed ? 0 : 10 },
                label: {
                  color: ON_RAIL,
                  fontSize: "var(--mantine-font-size-sm)",
                  fontWeight: active ? 700 : 400,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                },
              }}
            />
          );
          // Saat rail menyempit labelnya hilang, jadi namanya dimunculkan lewat tooltip.
          return collapsed ? (
            <Tooltip key={href} label={label} position="right" withArrow openDelay={200}>
              <div>{item}</div>
            </Tooltip>
          ) : (
            item
          );
        })}
      </nav>
    </aside>
  );
}
