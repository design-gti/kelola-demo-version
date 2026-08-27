"use client";
import { useContext, useMemo } from "react";
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

/** Tebal trek skala dan garis condongnya, serta besar marker — dalam px. */
const TRACK_HEIGHT = 3;
const MARKER = 16;

/** Titik netral skala STEN, dalam persen lebar trek. */
const CENTER_PCT = 50;

/** Gelembung kutub: lebar tetap supaya kiri dan kanan seimbang. */
const POLE_BUBBLE_WIDTH = 116;

/**
 * Gelembung keterangan kutub, muncul mengapit trek saat barisnya di-hover.
 *
 * Dua-duanya ditampilkan sekaligus karena skala 16PF memang bipolar: satu
 * kutub tidak berarti apa-apa tanpa lawannya. Sisi yang DICAPAI orang ini
 * diberi warna aksen, sisi lawannya abu tua — kalau keduanya digambar sama
 * kuat, pembaca masih harus menebak mana yang berlaku.
 *
 * Ditempel di dalam TREK (absolute), bukan lewat portal: keduanya masih berada
 * di dalam lebar kartu, jadi tidak ada yang perlu dijepit ke tepi layar.
 *
 * Digantung di bawah treknya, bukan di atas: kalau di atas, ia menutupi nama
 * faktor — padahal nama itulah yang sedang ditunjuk kursor, dan menutupinya
 * membuat orang lupa keterangan ini milik baris yang mana.
 */
function PoleBubble({ side, text, active }: { side: "left" | "right"; text: string; active: boolean }) {
  return (
    <span
      className={`pointer-events-none absolute z-[3] opacity-0 transition-opacity duration-100 group-hover/factor:opacity-100 ${side === "left" ? "left-0" : "right-0"}`}
      style={{
        top: MARKER + 6,
        width: POLE_BUBBLE_WIDTH,
        background: active ? ACCENT : "#343a40",
        color: "#fff",
        borderRadius: 4,
        padding: "5px 7px",
        fontFamily: FONT,
        fontSize: 9,
        fontStyle: "italic",
        lineHeight: 1.35,
        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
      }}
    >
      {text}
      {/* Ekor gelembung: kotak diputar, jadi warnanya selalu ikut induknya. */}
      <span
        className="absolute"
        style={{
          top: -3,
          [side]: 10,
          width: 7,
          height: 7,
          transform: "rotate(45deg)",
          background: active ? ACCENT : "#343a40",
        } as React.CSSProperties}
      />
    </span>
  );
}

/** Hex → rgba, untuk menipiskan pangkal garis di titik tengah. */
function withAlpha(hex: string, alpha: number): string {
  const h = hex.replace("#", "");
  const [r, g, b] = [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16));
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

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

  /*
   * Garis biru dari TITIK TENGAH skala ke posisi skornya.
   *
   * Yang dibaca dari 16PF bukan "tinggi atau rendah", melainkan condong ke kutub
   * mana — dan itu sulit ditangkap dari sebuah titik yang berdiri sendiri di
   * atas garis abu. Dengan pangkalnya selalu di tengah, arah dan panjang garis
   * langsung menyatakan ke mana dan seberapa jauh orangnya condong, tanpa perlu
   * membandingkan posisi titik antar baris.
   *
   * Gradiennya menipis ke arah tengah supaya pangkalnya tidak terbaca sebagai
   * batas keras — tengah adalah titik netral, bukan awal sebuah nilai.
   */
  const leansRight = pct >= CENTER_PCT;
  const fill = {
    left: `${Math.min(CENTER_PCT, pct)}%`,
    width: `${Math.abs(pct - CENTER_PCT)}%`,
    background: leansRight
      ? `linear-gradient(to right, ${withAlpha(ACCENT, 0.15)}, ${ACCENT})`
      : `linear-gradient(to left, ${withAlpha(ACCENT, 0.15)}, ${ACCENT})`,
  };

  const leansLow = sten <= POLE_LOW_MAX;
  const leansHigh = sten >= POLE_HIGH_MIN;

  return (
    /*
     * Keterangan kedua kutub muncul lewat hover pada barisnya — memakai
     * group-hover, bukan state React: yang berubah hanya keterlihatan dua
     * elemen, dan menyimpannya di state berarti seluruh daftar 16 baris
     * dirender ulang setiap kali kursor berpindah baris.
     */
    <div className="group/factor relative flex items-start gap-[8px] py-[7px]">
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
          {/* Penanda titik tengah — pangkal garis biru harus terlihat, kalau
              tidak, garisnya terbaca sebagai bar biasa yang mulai dari kiri. */}
          <span
            className="absolute bg-[#ced4da]"
            style={{ left: `${CENTER_PCT}%`, top: (MARKER - 11) / 2, width: 1, height: 11 }}
          />
          <span
            className="absolute rounded-full"
            style={{ ...fill, top: (MARKER - TRACK_HEIGHT) / 2, height: TRACK_HEIGHT }}
          />
          {/* Kelas pf-marker dipakai aturan hover di globals.css: menaikkan
              skala butuh transform, sedangkan transform di sini sudah dipakai
              untuk menengahkan titiknya — keduanya harus ditulis bersamaan,
              dan itu tidak bisa dilakukan dari dua tempat berbeda. */}
          <span
            className="pf-marker absolute flex items-center justify-center rounded-full"
            style={{
              // transform TIDAK ditulis di sini: gaya inline mengalahkan
              // stylesheet, jadi aturan hover di globals.css tidak akan pernah
              // bisa menambahkan scale. Penengahan -50% ikut tinggal di sana.
              left: `${pct}%`, top: 0,
              width: MARKER, height: MARKER, background: ACCENT,
              fontFamily: FONT, fontSize: 9, fontWeight: 700, color: "#fff",
            }}
          >
            {sten}
          </span>

          {/* Kutub rendah di kiri, kutub tinggi di kanan — sejajar dengan arah
              skalanya, jadi letak gelembungnya sendiri sudah menyatakan sisi
              mana yang sedang diterangkan. */}
          <PoleBubble side="left" text={factor.low} active={leansLow} />
          <PoleBubble side="right" text={factor.high} active={leansHigh} />
        </span>

        <span
          className="mt-[3px] block truncate"
          style={{ fontFamily: FONT, fontSize: 10, color: pole.muted ? "#adb5bd" : "#868e96", fontStyle: pole.muted ? "italic" : undefined }}
        >
          {pole.text}
        </span>
      </span>
    </div>
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
