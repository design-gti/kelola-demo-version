"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ActionIcon, Button, List, Modal, Text, Tooltip, UnstyledButton } from "@mantine/core";
import { IconBell, IconInfoCircle } from "@tabler/icons-react";
import { menuTitle } from "@/lib/nav";
import { menuInfo } from "@/lib/menuInfo";
import { MENU_INFO_BUTTON_ATTR, MENU_INFO_EVENT, restartTour } from "@/lib/tourSignals";

/**
 * Header standar untuk semua halaman: kotak putih mengambang dengan bayangan,
 * isinya cuma dua — nama menu di kiri, lonceng notifikasi di kanan.
 *
 * Judulnya diturunkan dari URL lewat `menuTitle`, bukan dioper tiap halaman.
 * Dengan begitu halaman baru otomatis dapat judul yang benar, dan tidak ada
 * halaman yang bisa menuliskan judul yang berbeda dari nama menunya sendiri.
 *
 * Breadcrumb sengaja TIDAK di sini: header ini tetap dua isi, sementara jejak
 * navigasi tinggal di dalam halaman, tepat di bawah header.
 */

/** Setinggi blok logo di sidebar, supaya garis atas keduanya sejajar. */
export const HEADER_HEIGHT = 52;

export default function AppHeader() {
  const pathname = usePathname();
  const title = menuTitle(pathname);
  const info = menuInfo(pathname);
  const [infoOpen, setInfoOpen] = useState(false);

  /*
   * Tur onboarding perlu tahu kapan penjelasan menu dibuka dan ditutup, supaya
   * langkahnya maju TEPAT setelah user benar-benar membacanya. Dikabarkan lewat
   * event di window, bukan lewat context/prop: header ini dipakai semua halaman
   * dan turnya hidup di luar pohon komponennya, jadi menariknya ke satu provider
   * bersama hanya untuk satu boolean justru mengikat keduanya tanpa perlu.
   */
  useEffect(() => {
    window.dispatchEvent(new CustomEvent(MENU_INFO_EVENT, { detail: { open: infoOpen, pathname } }));
  }, [infoOpen, pathname]);

  return (
    <>
    <header
      style={{
        // `position: fixed`, bukan `sticky`. Sticky bergantung pada leluhur
        // yang menggulung, dan di aplikasi ini `body` punya overflow-y: auto —
        // akibatnya header ikut tergulung dan hilang dari layar. `fixed`
        // mengunci ke viewport, tidak peduli siapa yang menggulung.
        position: "fixed",
        top: 0,
        left: "var(--sidebar-w, 220px)",
        right: 0,
        // Mengikuti animasi lebar rail supaya tepi kirinya tidak melompat.
        transition: "left 0.22s ease",
        zIndex: 40,
        height: HEADER_HEIGHT,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        padding: "0 20px",
        background: "var(--mantine-color-white)",
        boxShadow: "2px 2px 15px 0px rgba(0,0,0,0.1)",
      }}
    >
      <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <Text size="sm" fw={700} c="#212529">
          {title}
        </Text>
        {/* Ikonnya baru muncul kalau menunya memang punya penjelasan — kalau
            dipasang selalu, pengguna akan mengklik sesuatu yang tak berisi. */}
        {info && (
          <Tooltip label={`Tentang menu ${title}`} position="right" withArrow>
            <UnstyledButton
              {...{ [MENU_INFO_BUTTON_ATTR]: "" }}
              onClick={() => setInfoOpen(true)}
              aria-label={`Penjelasan menu ${title}`}
              style={{ display: "flex", alignItems: "center" }}
            >
              <IconInfoCircle size={16} stroke={1.6} color="#adb5bd" />
            </UnstyledButton>
          </Tooltip>
        )}
      </span>
      {/* Belum punya alur — aplikasi ini belum punya data notifikasi. */}
      <ActionIcon variant="subtle" color="gray" size="lg" aria-label="Notifikasi">
        <IconBell size={20} stroke={1.6} />
      </ActionIcon>
    </header>

    <Modal opened={infoOpen} onClose={() => setInfoOpen(false)} title={`Tentang ${title}`} size="lg" padding="lg">
      {info && (
        <div className="flex flex-col gap-[20px]">
          <Section label="Definisi">
            <Text size="sm" c="#495057">
              {info.definition}
            </Text>
          </Section>
          <Section label="Kegunaan">
            <List size="sm" spacing={6} c="#495057">
              {info.usage.map((u) => (
                <List.Item key={u}>{u}</List.Item>
              ))}
            </List>
          </Section>
          <Section label="Value">
            <Text size="sm" c="#495057">
              {info.value}
            </Text>
          </Section>

          {/* Petunjuk ke ikon ini hanya muncul sekali per menu. Tanpa jalan
              masuk kedua, orang yang terlanjur melewatkannya tidak punya cara
              memunculkannya lagi — dan di sinilah ia akan mencarinya, karena
              inilah satu-satunya tempat "penjelasan" di aplikasi. */}
          <Button
            variant="subtle"
            size="xs"
            style={{ alignSelf: "flex-start" }}
            onClick={() => {
              setInfoOpen(false);
              restartTour();
            }}
          >
            Tampilkan lagi petunjuk panduan
          </Button>
        </div>
      )}
    </Modal>
    </>
  );
}

/** Satu blok penjelasan: label kecil di atas, isinya di bawah. */
function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-[6px]">
      <Text size="xs" fw={700} c="var(--mantine-color-primary-5)" tt="uppercase">
        {label}
      </Text>
      {children}
    </div>
  );
}
