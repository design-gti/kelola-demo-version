"use client";
import { useContext, useMemo } from "react";
import { Tooltip } from "@mantine/core";
import { ProfileContext } from "../lib/ProfileContext";
import {
  PERSONALITY_FACTORS,
  POLE_HIGH_MIN,
  POLE_LOW_MAX,
  STEN_MAX,
  STEN_MIN,
  poleFor,
  stenScoresFor,
  type PersonalityFactor,
} from "../data/personalityFactors";

const FONT = "'Open Sans', sans-serif";
const ACCENT = "#016699";

/**
 * Tinggi maksimum daftar faktor, dalam px.
 *
 * Enam belas baris tidak mungkin muat utuh di kartu selebar 368px tanpa membuat
 * kolomnya jauh lebih panjang dari dua kolom lainnya. Jadi isinya yang bergulir,
 * sama seperti kartu Development Plan.
 */
const LIST_MAX_HEIGHT = 420;

/** Panjang trek skala, dalam px — sisa lebar setelah kode, nama, dan angka. */
const TRACK_HEIGHT = 3;
const MARKER = 16;

/**
 * Satu baris faktor: kode, nama, skala STEN, dan keterangan kutub yang berlaku.
 *
 * Laporan cetak menaruh kalimat kutub kiri DAN kanan mengapit skalanya. Di
 * kartu ini hanya kutub yang benar-benar berlaku yang ditulis — kalimat di sisi
 * yang tidak dicapai orang ini tidak menerangkan apa pun tentang dia, dan
 * memuat keduanya di lebar 336px memangkas dua-duanya jadi tak terbaca.
 * Keduanya tetap tersedia lewat tooltip.
 */
function FactorRow({ factor, sten }: { factor: PersonalityFactor; sten: number }) {
  const pole = poleFor(factor, sten);
  // Titik tengah petak ke-n dari sepuluh petak; jadi STEN 1 tidak menempel di
  // ujung kiri trek dan STEN 10 tidak terpotong di ujung kanan.
  const pct = ((sten - STEN_MIN + 0.5) / (STEN_MAX - STEN_MIN + 1)) * 100;

  return (
    /*
     * Tooltip design system, bukan atribut `title` bawaan browser: title
     * menunggu sekitar satu detik sebelum muncul dan jedanya tidak bisa disetel
     * sama sekali. Di daftar 16 baris yang justru ditelusuri dengan menyapukan
     * kursor, jeda itu membuat keterangannya praktis tak pernah terlihat.
     */
    <Tooltip
      openDelay={0}
      transitionProps={{ duration: 80 }}
      position="left"
      withArrow
      multiline
      w={230}
      label={
        <span style={{ fontFamily: FONT, fontSize: 11, lineHeight: 1.5 }}>
          <b>{factor.name}</b> ({factor.code}) — STEN {sten}
          <br />
          {STEN_MIN}: {factor.low}
          <br />
          {STEN_MAX}: {factor.high}
        </span>
      }
    >
    <div className="flex items-start gap-[8px] py-[7px]">
      {/* Kode faktor: penanda baku 16PF, dipakai orang yang sudah hafal
          kodenya untuk menemukan barisnya tanpa membaca namanya. */}
      <span
        className="flex shrink-0 items-center justify-center rounded-[4px] bg-[#f1f3f5]"
        style={{ width: 26, height: 18, fontFamily: FONT, fontSize: 9, fontWeight: 700, color: "#868e96" }}
      >
        {factor.code}
      </span>

      <span className="min-w-0 flex-1">
        {/* Angkanya tidak ditulis di samping nama: ia sudah ada di dalam
            marker, dan dua kali angka yang sama di satu baris membuat pembaca
            mencari perbedaan yang tidak ada. */}
        <span className="block truncate" style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, color: "#495057" }}>
          {factor.name}
        </span>

        {/* Trek skala. Marker-nya lingkaran berisi angka, seperti di laporan,
            supaya nilainya terbaca tanpa harus menghitung petak. */}
        <span className="relative block" style={{ height: MARKER, marginTop: 3 }}>
          <span
            className="absolute left-0 right-0 rounded-full bg-[#dee2e6]"
            style={{ top: (MARKER - TRACK_HEIGHT) / 2, height: TRACK_HEIGHT }}
          />
          {/* Petak-petak skala: sepuluh, jadi jarak antar nilai terlihat. */}
          {Array.from({ length: STEN_MAX - STEN_MIN }).map((_, i) => (
            <span
              key={i}
              className="absolute bg-[#e9ecef]"
              style={{ left: `${((i + 1) / (STEN_MAX - STEN_MIN + 1)) * 100}%`, top: (MARKER - 7) / 2, width: 1, height: 7 }}
            />
          ))}
          <span
            className="absolute flex items-center justify-center rounded-full"
            style={{
              left: `${pct}%`, transform: "translateX(-50%)", top: 0,
              width: MARKER, height: MARKER, background: ACCENT,
              fontFamily: FONT, fontSize: 9, fontWeight: 700, color: "#fff",
            }}
          >
            {sten}
          </span>
        </span>

        <span
          className="mt-[3px] block truncate"
          style={{ fontFamily: FONT, fontSize: 10, color: pole.muted ? "#adb5bd" : "#868e96", fontStyle: pole.muted ? "italic" : undefined }}
        >
          {pole.text}
        </span>
      </span>
    </div>
    </Tooltip>
  );
}

/**
 * Kartu 16 Personality Factors.
 *
 * Ringkasan dari laporan 16PF: tiap faktor satu baris, bukan satu blok. Yang
 * dibuang dari laporan aslinya adalah hal yang berulang di setiap baris —
 * tulisan "STEN Score", ikon faktor, dan kalimat kutub yang tidak dicapai —
 * bukan angkanya atau maknanya.
 */
export function PersonalityFactorsCard() {
  const { employeeId } = useContext(ProfileContext);
  const scores = useMemo(() => stenScoresFor(employeeId || "default"), [employeeId]);

  return (
    <div
      className="flex shrink-0 flex-col gap-[10px] rounded-[8px] bg-white p-[16px] shadow-[2px_2px_15px_0px_rgba(0,0,0,0.1)]"
      style={{ width: 368 }}
      data-name="16 Personality Factors"
    >
      <div className="flex items-baseline justify-between gap-[8px]">
        <p style={{ fontFamily: FONT, fontSize: 14, fontWeight: 700, color: "#495057" }}>16 Personality Factors</p>
        {/* Keterangan skala ditulis SEKALI di kepala kartu, bukan diulang di
            setiap baris seperti di laporan cetak. */}
        <p style={{ fontFamily: FONT, fontSize: 10, color: "#adb5bd", whiteSpace: "nowrap" }}>STEN 1–10</p>
      </div>

      <div className="overflow-y-auto pr-[2px]" style={{ maxHeight: LIST_MAX_HEIGHT }}>
        {PERSONALITY_FACTORS.map((f, i) => (
          <div key={f.code} className={i > 0 ? "border-t border-[#f1f3f5]" : undefined}>
            <FactorRow factor={f} sten={scores[f.code]} />
          </div>
        ))}
      </div>

      <p style={{ fontFamily: FONT, fontSize: 9, color: "#adb5bd", lineHeight: 1.5 }}>
        1&ndash;{POLE_LOW_MAX} condong ke kutub kiri, {POLE_HIGH_MIN}&ndash;{STEN_MAX} ke kutub kanan,
        {" "}{POLE_LOW_MAX + 1}&ndash;{POLE_HIGH_MIN - 1} rata-rata. Arahkan kursor ke satu baris untuk melihat kedua kutubnya.
      </p>
    </div>
  );
}
