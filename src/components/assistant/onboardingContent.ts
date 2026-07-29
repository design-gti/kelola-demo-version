export type PageKey = "/" | "/tdp-view" | "/vismap" | "/idp" | "/iprofile" | "/talent-mapping" | "/team-profile";

export interface PageIntro {
  title: string;
  body: string;
}

/**
 * Static, human-authored — deliberately not LLM-generated, so first-touch
 * copy is reviewable and hallucination-free. Live Q&A about the same page
 * goes through the chat underneath this, not through this file.
 */
export const ONBOARDING_PAGE_INTROS: Record<PageKey, PageIntro> = {
  "/": {
    title: "Beranda",
    body: "Ringkasan utama: succession risk, kebutuhan development, dan kartu-kartu lain yang bisa kamu susun ulang lewat pengaturan dashboard.",
  },
  "/tdp-view": {
    title: "TDP (Talent Data Platform)",
    body: "Data lengkap seluruh karyawan — kelengkapan profil, skor, dan riwayat penilaian.",
  },
  "/vismap": {
    title: "Vismap",
    body: "Peta organisasi dan kesiapan suksesi. Bisa juga dipakai untuk simulasi kecocokan seseorang terhadap posisi tertentu.",
  },
  "/idp": {
    title: "IDP (Individual Development Plan)",
    body: "Rencana pengembangan tiap karyawan — status, due date, dan riwayat program development.",
  },
  "/iprofile": {
    title: "iProfile",
    body: "Profil detail satu karyawan: skor, personality (DISC), rencana karier, dan data kepegawaian.",
  },
  "/talent-mapping": {
    title: "Talent Mapping",
    body: "Distribusi karyawan dalam grid 9-box berdasarkan performance dan potency.",
  },
  "/team-profile": {
    title: "Team Profile",
    body: "Daftar tim, anggotanya, dan (di tab Interaction) panduan cara berinteraksi berdasarkan tipe DISC dominan mereka.",
  },
};

export function resolvePageKey(pathname: string): PageKey | null {
  const match = (Object.keys(ONBOARDING_PAGE_INTROS) as PageKey[]).find(
    key => key === "/" ? pathname === "/" : pathname.startsWith(key)
  );
  return match ?? null;
}

export const ROLE_GREETING = "Halo! Saya asisten Kelola. Supaya bisa bantu dengan tepat, kamu di sini sebagai apa?";
