"use client";
import { useState } from "react";
import TMTRBox from "@/components/talent/TMTRBox";
import type { MappingView } from "./mappingViews";

const FONT = "'Open Sans', sans-serif";

/**
 * Ukuran grafik di tampilan ini, dalam px.
 *
 * Lebih kecil dari mode satu tab (500) supaya dua sampai tiga grafik terbaca
 * sekaligus tanpa menggulir, tapi tidak lebih kecil dari ini: di bawah ~350px
 * nama kotak mulai terpangkas dan titik orang saling menempel, dan tampilan
 * yang dimaksudkan untuk MEMBANDINGKAN justru jadi tidak bisa dibaca.
 */
const OVERVIEW_BOX_SIZE = 380;

/**
 * Semua box mapping berdampingan dalam satu layar.
 *
 * Yang ditampilkan hanya grafiknya — tanpa panel kendali, tabel, maupun
 * ringkasan. Pertanyaan yang dijawab tampilan ini adalah "sebarannya beda di
 * mana antar mapping", dan segala hal lain di halaman utama justru menyita
 * ruang yang dibutuhkan untuk menjawabnya.
 */
export default function MappingOverview({ views }: { views: MappingView[] }) {
  /**
   * Box yang sedang dibuka utuh, per mapping.
   *
   * Disimpan per tab, bukan satu nilai bersama: membandingkan "kotak Star di
   * High-Po" dengan "kotak Star di Mi-Po" berdampingan justru alasan tampilan
   * ini ada, dan itu mustahil kalau membuka satu box menutup box di kartu lain.
   */
  const [zoomed, setZoomed] = useState<Record<string, number | null>>({});
  return (
    <div style={{ fontFamily: FONT }}>
      {/*
       * Satu baris yang menggulir mendatar, bukan grid yang membungkus.
       *
       * Grafiknya berukuran mati (TMTRBox menempatkan titik dalam persen dari
       * ukuran itu), jadi barisan yang membungkus akan menyisakan lajur kosong
       * di kanan pada lebar layar mana pun. Dengan satu baris, urutan tabnya juga
       * tetap terbaca sebagai urutan — sama seperti di baris tab.
       */}
      <div className="overflow-x-auto pb-[8px]">
        <div className="flex items-start gap-[16px]" style={{ width: "max-content" }}>
          {views.map(v => (
            <div
              key={v.id}
              className="rounded-[12px] bg-white p-[16px]"
              style={{ boxShadow: "2px 4px 10px rgba(0,0,0,0.07)" }}
            >
              <div className="mb-[8px] flex items-baseline justify-between gap-[12px]">
                <span style={{ fontSize: 14, fontWeight: 700, color: "#495057" }}>{v.label}</span>
                {/* Jumlah orang SETELAH saringan — angka inilah yang sedang
                    digambar, jadi menyebut total mentah malah menyesatkan. */}
                <span style={{ fontSize: 12, color: "#adb5bd", whiteSpace: "nowrap" }}>
                  {v.points.length} karyawan
                </span>
              </div>
              {/* Klik satu box membukanya utuh DI KARTU INI — tidak berpindah
                  tab. Klik latar box yang sedang dibuka mengembalikannya ke
                  sembilan kotak, sama seperti di halaman utama. */}
              <TMTRBox
                config={v.cfg}
                points={v.points}
                size={OVERVIEW_BOX_SIZE}
                selectedBox={zoomed[v.id] ?? null}
                onBoxClick={order => setZoomed(prev => ({ ...prev, [v.id]: order }))}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
