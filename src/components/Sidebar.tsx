"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavLink, UnstyledButton, Text, Tooltip } from "@mantine/core";
import { Home, ChevronDown, ArrowRight, ArrowLeft, UserCog } from "lucide-react";
// Daftar menu tinggal di satu tempat: header memakainya untuk menentukan judul
// halaman, jadi kalau disalin di sini keduanya bisa berbeda tanpa ketahuan.
import { ADMIN_ITEMS, NAV_ITEMS } from "@/lib/nav";
// Ikon buka/tutup rail diambil dari Tabler — itu set ikon yang dipakai Prodigy
// (@talentlytica/prodigy meng-import @tabler/icons-react), jadi bentuknya sama
// dengan yang dipakai produk lain di design system ini.
import { IconLayoutSidebarLeftCollapse, IconLayoutSidebarLeftExpand } from "@tabler/icons-react";

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
/**
 * Latar rail: gradasi vertikal primary-5 → primary-6 (#016699 → #005079).
 * Dua langkah bertetangga dalam satu tuple warna, jadi perpindahannya halus dan
 * seluruh isi rail tetap punya kontras yang sama terhadap teks putih.
 */
const RAIL_BG = "linear-gradient(180deg, var(--mantine-color-primary-5) 0%, var(--mantine-color-primary-6) 100%)";
const ON_RAIL = "var(--mantine-color-white)";
// Latar item nav (diam / hover / aktif) dan tombol mode ada di globals.css —
// lihat blok `.sidebar-rail`. Yang tersisa di sini hanya nilai yang benar-benar
// dipakai sebagai inline style.
/** Panel latar untuk anak-anak sebuah grup — lebih samar dari sorotan aktif. */
const GROUP_BG = "rgba(255,255,255,0.10)";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>("base-management");
  const pathname = usePathname();
  /**
   * Mode admin mengganti seluruh isi menu, bukan menambah satu item baru.
   * Diturunkan dari URL, bukan disimpan sebagai state: kalau state, membuka
   * /admin/aspect langsung (refresh, bookmark) akan menampilkan menu utama
   * sementara isinya halaman admin.
   */
  const adminMode = pathname.startsWith("/admin");

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

  /** Gaya item nav dipakai bersama menu utama & menu admin supaya keduanya identik. */
  const navStyles = (active: boolean, indented = false) => ({
    root: {
      // Item tidak lagi selebar rail penuh: ia blok membulat dengan jarak dari
      // tepi, sesuai pola sorotan design system. Garis kiri 3px yang dulu
      // dipakai sudah tidak perlu — sorotannya sendiri yang jadi penanda.
      // Jarak dari tepi rail diberikan lewat padding kontainer (nav / panel
      // grup), bukan margin item. NavLink bawaan lebarnya 100%: kalau diberi
      // margin kiri-kanan, kotaknya justru terdorong keluar rail, dan kalau
      // lebarnya dipaksa `auto` ia menyusut ke isi sehingga di mode ikon tidak
      // lagi center.
      margin: "2px 0",
      borderRadius: "var(--mantine-radius-md)",
      // Di mode lebar, hierarki sub menu dibawa oleh indentasi (24px vs 10px).
      padding: collapsed ? "10px 0" : `9px 12px 9px ${indented ? 24 : 10}px`,
      justifyContent: collapsed ? "center" : "flex-start",
      // Latar (diam / hover / aktif) sengaja TIDAK diset di sini. `styles`
      // Mantine adalah inline style, jadi selector seperti "&:hover" diabaikan
      // diam-diam — hover-nya tidak akan pernah jalan. Semuanya diatur lewat
      // CSS di globals.css yang menyasar .sidebar-rail, memakai atribut
      // data-active yang sudah dipasang NavLink sendiri.
      transition: "background 0.15s",
    },
    section: { marginInlineEnd: collapsed ? 0 : 10 },
    // Di mode ikon label memang kosong, tapi wadahnya masih memakan sisa ruang
    // dan mendorong ikon ke kiri — jadi wadahnya sekalian dimatikan supaya
    // ikon benar-benar di tengah kotaknya.
    body: { display: collapsed ? "none" : undefined },
    label: {
      color: ON_RAIL,
      fontSize: "var(--mantine-font-size-sm)",
      fontWeight: active ? 700 : 400,
      whiteSpace: "nowrap" as const,
      overflow: "hidden",
    },
    chevron: { color: ON_RAIL },
  });

  return (
    <aside
      className="sidebar-rail"
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
          <IconLayoutSidebarLeftExpand size={20} color="rgba(255,255,255,0.7)" stroke={1.8} />
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
            <IconLayoutSidebarLeftCollapse size={20} color="rgba(255,255,255,0.7)" stroke={1.8} style={{ flexShrink: 0 }} />
          </>
        )}
      </UnstyledButton>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "8px 8px 0" }}>
        {adminMode
          ? ADMIN_ITEMS.map(({ id, label, href, icon: Icon, children }) => {
              const opened = openGroup === id;
              // Induk grup tidak pernah ikut tersorot: ia bukan tujuan, dan
              // penanda aktif di dua tingkat sekaligus bikin ambigu halaman
              // mana yang sebenarnya sedang dibuka. Konteksnya sudah dibawa
              // oleh grup yang terbuka + sorotan di anaknya.
              const active = !children && !!href && isActive(href);
              const shared = {
                label: collapsed ? undefined : label,
                active,
                leftSection: <Icon size={18} color="#fff" strokeWidth={1.8} style={{ flexShrink: 0 }} />,
                styles: navStyles(active),
              };
              // Grup pembungkus dan item link dirender terpisah: yang pertama
              // tombol pembuka/penutup, yang kedua <Link> betulan.
              const item = children ? (
                // Anak-anak dirender sebagai saudara, bukan lewat prop
                // `children` NavLink: dengan begitu chevron otomatis Mantine
                // tidak ikut muncul, dan di mode ikon tidak ada apa pun yang
                // menggeser ikon dari titik tengah. Membuka/menutup grup tetap
                // bisa dari ikon induknya.
                <div key={id}>
                  <NavLink
                    {...shared}
                    rightSection={
                      collapsed ? undefined : (
                        <ChevronDown
                          size={14}
                          color="#fff"
                          style={{ transform: opened ? "rotate(180deg)" : undefined, transition: "transform 0.15s" }}
                        />
                      )
                    }
                    onClick={() => setOpenGroup(opened ? null : id)}
                  />
                  {/* Panel latar HANYA dipakai di mode ikon: di sana tidak ada
                      indentasi maupun label yang bisa menandakan "ini bagian
                      dari grup di atasnya". Di mode lebar, indentasi sudah
                      cukup — panelnya justru jadi kotak besar yang ramai. */}
                  {opened && (
                    <div
                      style={
                        collapsed
                          ? { background: GROUP_BG, borderRadius: "var(--mantine-radius-md)", margin: "2px 0 4px", padding: 4 }
                          : { margin: "0 0 4px" }
                      }
                    >
                      {children.map(({ label: childLabel, href: childHref, icon: ChildIcon }) => (
                        <NavLink
                          key={childHref}
                          component={Link}
                          href={childHref}
                          label={collapsed ? undefined : childLabel}
                          active={isActive(childHref)}
                          leftSection={<ChildIcon size={16} color="#fff" strokeWidth={1.8} style={{ flexShrink: 0 }} />}
                          styles={navStyles(isActive(childHref), true)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <NavLink key={id} component={Link} href={href!} {...shared} />
              );
              return collapsed ? (
                <Tooltip key={id} label={label} position="right" withArrow openDelay={200}>
                  <div>{item}</div>
                </Tooltip>
              ) : (
                item
              );
            })
          : NAV_ITEMS.map(({ label, href, icon: Icon }) => {
              const active = isActive(href);
              const item = (
                <NavLink
                  key={href}
                  component={Link}
                  href={href}
                  active={active}
                  label={collapsed ? undefined : label}
                  leftSection={<Icon size={18} color="#fff" strokeWidth={1.8} style={{ flexShrink: 0 }} />}
                  styles={navStyles(active)}
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

      {/* Tombol mode di dasar rail: masuk ke Admin Settings, atau kembali ke
          menu utama. Satu tombol yang berganti peran — bukan dua tombol —
          karena keduanya tidak pernah relevan bersamaan. */}
      <div style={{ padding: collapsed ? "8px 6px 12px" : "8px 12px 12px", flexShrink: 0 }}>
        <Tooltip
          label={adminMode ? "Kembali ke menu utama" : "Admin Settings"}
          position="right"
          withArrow
          openDelay={200}
          disabled={!collapsed}
        >
          <UnstyledButton
            component={Link}
            // Masuk lewat halaman admin pertama, keluar lewat Beranda — jadi
            // mode-nya selalu cocok dengan isi yang sedang ditampilkan.
            href={adminMode ? "/" : "/admin/aspect"}
            aria-label={adminMode ? "Kembali ke menu utama" : "Buka Admin Settings"}
            // Latarnya (diam & hover) diatur di globals.css — alasan yang sama
            // dengan item nav: inline style tidak bisa membawa state :hover.
            className="sidebar-mode-btn"
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: collapsed ? "center" : "space-between",
              gap: 8,
              padding: collapsed ? "10px 0" : "10px 14px",
              borderRadius: 999,
              transition: "background 0.15s",
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: 10, overflow: "hidden" }}>
              {adminMode ? (
                <Home size={16} color="#fff" strokeWidth={1.8} style={{ flexShrink: 0 }} />
              ) : (
                <UserCog size={16} color="#fff" strokeWidth={1.8} style={{ flexShrink: 0 }} />
              )}
              {!collapsed && (
                <Text size="sm" fw={700} c={ON_RAIL} style={{ whiteSpace: "nowrap" }}>
                  {adminMode ? "Back" : "Admin Settings"}
                </Text>
              )}
            </span>
            {!collapsed &&
              (adminMode ? (
                <ArrowLeft size={16} color="#fff" strokeWidth={1.8} style={{ flexShrink: 0 }} />
              ) : (
                <ArrowRight size={16} color="#fff" strokeWidth={1.8} style={{ flexShrink: 0 }} />
              ))}
          </UnstyledButton>
        </Tooltip>
      </div>
    </aside>
  );
}
