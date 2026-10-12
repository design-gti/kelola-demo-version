"use client";
import { useEffect, useState, type ComponentType } from "react";
import { KerangkaTdp } from "@/components/kerangka/layarKerangka";

// Pulau TDP (diport dari tdp-prototype / kelola-web). CSV diambil lalu disuntikkan ke
// csvSource SEBELUM App-nya diimpor dinamis, supaya definisi kolom yang dihitung saat
// modul dimuat membaca datanya. Client-only.
//
// Beda dari kelola-web: di sana CSV dan data tambahan datang dari backend
// (`/api/tdp-csv`, `/api/data-tambahan`). Demo ini tidak punya backend, jadi CSV-nya
// berkas statis `public/data/tdp-employees.csv` (dibangkitkan `npm run seed`), dan data
// tambahan diturunkan dari data extension di Profile Data — lihat `dataTambahanDemo`.
export default function TDPPage() {
  const [App, setApp] = useState<ComponentType | null>(null);

  useEffect(() => {
    let alive = true;
    void (async () => {
      try {
        const res = await fetch("/data/tdp-employees.csv");
        const teks = res.ok ? await res.text() : "";
        const { setRawCsv } = await import("@/tdp/data/csvSource");
        setRawCsv(teks);

        // Data tambahan gagal = tanpa data tambahan, bukan layar rusak.
        try {
          const { store } = await import("@/data/model/store");
          const { bangunDataTambahan } = await import("@/tdp/lib/dataTambahanDemo");
          const { setDataTambahan } = await import("@/tdp/lib/dataTambahanTdp");
          setDataTambahan(bangunDataTambahan(store.participants.map((p) => p.id)));
        } catch {
          /* lanjut tanpa data tambahan */
        }
      } catch {
        /* fall through — App renders with empty data */
      }
      const mod = await import("@/tdp/App");
      if (alive) setApp(() => mod.default);
    })();
    return () => { alive = false; };
  }, []);

  return (
    <div className="tdp-root" style={{ height: "calc(100vh - 52px)", overflow: "hidden", background: "var(--background)" }}>
      {/* Kerangka, bukan tulisan "Loading TDP…": penantian di sini yang terpanjang di
          seluruh aplikasi (CSV diambil dulu, baru modul App-nya diimpor), dan satu baris
          abu-abu di pojok kiri atas terbaca seperti halaman yang rusak. */}
      {App ? <App /> : <KerangkaTdp />}
    </div>
  );
}
