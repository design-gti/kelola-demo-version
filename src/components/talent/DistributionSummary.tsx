"use client";
import { resolveColor, textOn } from "@/data/talentMappingShared";

const FONT = "'Open Sans', sans-serif";

/** Tinggi lintasan bar; cukup untuk memuat angka di dalam isiannya. */
const TRACK_H = 22;

/**
 * Di bawah ambang ini isian bar terlalu sempit untuk memuat tulisannya, jadi
 * angkanya ditaruh DI LUAR isian. Kalau dipaksa di dalam dengan min-width,
 * isiannya melebar melewati persentase yang diwakilinya — bar 2% tergambar
 * selebar 15% dan grafiknya jadi berbohong.
 */
const INSIDE_MIN_PCT = 26;

export interface DistributionSlice {
  name: string;
  value: number;
  color: string;
}

/**
 * Ringkasan sebaran: satu bar per kategori, bertumpuk tegak di samping 9-box.
 *
 * Dulu ketiga kategori berbagi satu batang bersegmen. Bentuk itu menekankan
 * perbandingan antar kategori tapi menyulitkan pembacaan besaran masing-masing:
 * segmen yang tidak dimulai dari titik nol yang sama tidak bisa dibandingkan
 * panjangnya terhadap keseluruhan. Dengan satu lintasan penuh per kategori,
 * setiap bar terbaca sebagai bagian dari total.
 */
export default function DistributionSummary({ data, total: totalOverride }: {
  data: DistributionSlice[];
  /**
   * Pembagi persentase. Biasanya jumlah seluruh isi bar, tapi saat satu kotak
   * difokuskan hanya ADA satu bar — tanpa pembagi dari luar, bar itu selalu
   * terbaca 100% padahal isinya cuma sebagian dari keseluruhan.
   */
  total?: number;
}) {
  const total = totalOverride ?? data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, fontFamily: FONT }}>
      {data.map((d, i) => {
        // Total nol tetap digambar sebagai bar kosong, bukan disembunyikan:
        // kategorinya memang ada, isinya yang belum ada.
        const pct = total === 0 ? 0 : Math.round((d.value / total) * 100);
        const bg = resolveColor(d.color);
        const inside = pct >= INSIDE_MIN_PCT;
        const label = `${pct}% (${d.value})`;
        return (
          <div key={i}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#495057", marginBottom: 6 }}>{d.name}</div>
            <div
              title={`${d.name}: ${d.value} dari ${total} (${pct}%)`}
              style={{ display: "flex", alignItems: "center", height: TRACK_H, borderRadius: 4, background: "#dee2e6", overflow: "hidden" }}
            >
              <div
                style={{
                  width: `${pct}%`,
                  height: "100%",
                  background: bg,
                  color: textOn(bg),
                  fontSize: 10,
                  fontWeight: 400,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  flexShrink: 0,
                }}
              >
                {inside && label}
              </div>
              {!inside && (
                <span style={{ fontSize: 10, fontWeight: 400, color: "#495057", padding: "0 8px", whiteSpace: "nowrap" }}>
                  {label}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
