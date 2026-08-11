"use client";
import Link from "next/link";
import { Breadcrumbs, Anchor, Text } from "@mantine/core";
import { IconChevronLeft } from "@tabler/icons-react";
import { usePathname } from "next/navigation";
import { menuTitle } from "@/lib/nav";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  /** For in-page state transitions (e.g. detail→list) instead of a real route change. */
  onClick?: () => void;
}

/**
 * Shared Prodigy breadcrumb: "‹ Home / Section / Current". Last item is never a link.
 * Pass `noPadding` when the parent container already provides its own padding
 * (e.g. Vismap's fixed top bar), to avoid doubling up horizontal spacing.
 */
export default function AppBreadcrumb({ items, noPadding }: { items: BreadcrumbItem[]; noPadding?: boolean }) {
  const pathname = usePathname();

  // Sejak header aplikasi menampilkan nama menu, breadcrumb satu tingkat yang
  // isinya sama persis dengan nama itu cuma mengulang — disembunyikan di sini
  // supaya tidak perlu dihapus satu per satu di tiap halaman, dan breadcrumb
  // yang benar-benar berjenjang tetap tampil.
  if (items.length === 1 && items[0].label === menuTitle(pathname)) return null;

  return (
    <Breadcrumbs
      separator="/"
      separatorMargin={6}
      style={{
        fontFamily: "'Open Sans', sans-serif",
        fontSize: 12,
        padding: noPadding ? "10px 0 0" : "10px 16px 0",
        flexWrap: "nowrap",
        alignItems: "center",
      }}
    >
      {items.map((item, i) => {
        const isFirst = i === 0;
        const isLast = i === items.length - 1;
        const clickable = (item.href || item.onClick) && !isLast;
        // Inner span (not a Mantine polymorphic prop) so the flex layout always applies —
        // Mantine's own `style` merging on Anchor/button roots is unreliable.
        const content = (
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4, whiteSpace: "nowrap" }}>
            {isFirst && <IconChevronLeft size={14} />}
            {item.label}
          </span>
        );
        if (clickable && item.href) {
          return (
            <Anchor key={i} component={Link} href={item.href} c="primary" fw={600} underline="never">
              {content}
            </Anchor>
          );
        }
        if (clickable) {
          return (
            <Anchor key={i} component="button" onClick={item.onClick} c="primary" fw={600} underline="never">
              {content}
            </Anchor>
          );
        }
        return (
          <Text key={i} c={isLast ? "#495057" : "primary"} fw={600} style={{ whiteSpace: "nowrap" }}>
            {item.label}
          </Text>
        );
      })}
    </Breadcrumbs>
  );
}
