"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  { label: "TDP", href: "/tdp-view", icon: BarChart2 },
  { label: "Vismap", href: "/vismap", icon: Network },
  { label: "IDP", href: "/idp", icon: FileText },
  { label: "iProfile", href: "/iprofile", icon: User },
  { label: "Talent Mapping", href: "/talent-mapping", icon: Map },
  { label: "Team Profile", href: "/team-profile", icon: Users },
];

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
        background: "#016699",
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
      <button
        onClick={toggle}
        style={{
          padding: collapsed ? "8px 0" : "8px 16px",
          borderBottom: "1px solid rgba(255,255,255,0.12)",
          minHeight: 52,
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          overflow: "hidden",
          background: "none",
          border: "none",
          borderBottom: "1px solid rgba(255,255,255,0.12)",
          cursor: "pointer",
          width: "100%",
          textAlign: "left",
        }}
        title={collapsed ? "Expand" : "Collapse"}
      >
        {collapsed ? (
          <ChevronRight size={16} color="rgba(255,255,255,0.7)" />
        ) : (
          <>
            <div>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: 15, fontFamily: "Open Sans, sans-serif", lineHeight: 1.2 }}>
                Kelola
              </div>
              <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 10, fontFamily: "Open Sans, sans-serif", marginTop: 2 }}>
                Demo Environment
              </div>
            </div>
            <ChevronLeft size={16} color="rgba(255,255,255,0.7)" style={{ flexShrink: 0 }} />
          </>
        )}
      </button>

      {/* Nav */}
      <nav style={{ flex: 1, paddingTop: 8 }}>
        {NAV_ITEMS.map(({ label, href, icon: Icon, placeholder }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: collapsed ? "10px 0" : "10px 16px",
                justifyContent: collapsed ? "center" : "flex-start",
                textDecoration: "none",
                background: active ? "rgba(255,255,255,0.15)" : "transparent",
                borderLeft: active ? "3px solid #fff" : "3px solid transparent",
                opacity: placeholder ? 0.45 : 1,
                transition: "background 0.15s",
                cursor: placeholder ? "default" : "pointer",
              }}
              onClick={placeholder ? (e) => e.preventDefault() : undefined}
            >
              <Icon size={18} color="#fff" strokeWidth={1.8} style={{ flexShrink: 0 }} />
              {!collapsed && (
                <span style={{
                  color: "#fff",
                  fontSize: 13,
                  fontFamily: "Open Sans, sans-serif",
                  fontWeight: active ? 700 : 400,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                }}>
                  {label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

    </aside>
  );
}
