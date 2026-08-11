import {
  Home,
  BarChart2,
  Network,
  FileText,
  User,
  Map,
  Users,
  Briefcase,
  Percent,
  Shield,
  History,
} from "lucide-react";

export type NavIcon = typeof Home;

export type NavItem = { label: string; href: string; icon: NavIcon };

/** Menu utama aplikasi. */
export const NAV_ITEMS: NavItem[] = [
  { label: "Beranda", href: "/", icon: Home },
  { label: "iProfile", href: "/iprofile", icon: User },
  { label: "Visibility Map", href: "/vismap", icon: Network },
  { label: "Talent Decision", href: "/tdp-view", icon: BarChart2 },
  { label: "Talent Mapping", href: "/talent-mapping", icon: Map },
  { label: "Team Profile", href: "/team-profile", icon: Users },
  { label: "IDP", href: "/idp", icon: FileText },
];

export type AdminChild = NavItem;
export type AdminItem = { id: string; label: string; icon: NavIcon; href?: string; children?: AdminChild[] };

/**
 * Menu mode Admin Settings. "Base Management" tidak punya href sendiri: ia
 * cuma pembungkus, yang bisa dibuka adalah anak-anaknya.
 */
export const ADMIN_ITEMS: AdminItem[] = [
  {
    id: "base-management",
    label: "Base Management",
    icon: Briefcase,
    children: [
      { label: "Aspect", href: "/admin/aspect", icon: Briefcase },
      { label: "Job and Position", href: "/admin/job-position", icon: Percent },
      { label: "Employee", href: "/admin/employee", icon: Users },
    ],
  },
  { id: "profile-data", label: "Profile Data", href: "/admin/profile-data", icon: FileText },
  { id: "criteria", label: "Criteria", href: "/admin/criteria", icon: Percent },
  { id: "role-access", label: "Role Access", href: "/admin/role-access", icon: Shield },
  { id: "activity-log", label: "Activity Log", href: "/admin/activity-log", icon: History },
];

/**
 * Nama menu untuk sebuah URL — dipakai header sebagai judul halaman.
 *
 * Dicocokkan dari yang paling panjang supaya sub-menu menang atas induknya
 * (`/admin/job-position` tidak keburu tertangkap oleh entri yang lebih pendek),
 * dan halaman turunan ikut nama menu induknya — `/admin/job-position/Teknologi`
 * tetap berjudul "Job and Position".
 */
export function menuTitle(pathname: string): string {
  const candidates: { href: string; label: string }[] = [
    ...NAV_ITEMS.map(({ href, label }) => ({ href, label })),
    ...ADMIN_ITEMS.flatMap((item) =>
      item.children
        ? item.children.map(({ href, label }) => ({ href, label }))
        : item.href
          ? [{ href: item.href, label: item.label }]
          : [],
    ),
  ].sort((a, b) => b.href.length - a.href.length);

  const hit = candidates.find(({ href }) => (href === "/" ? pathname === "/" : pathname.startsWith(href)));
  return hit?.label ?? "";
}
