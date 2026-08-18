"use client";
import { resolveColor, textOn } from "@/data/talentMappingShared";

const FONT = "'Open Sans', sans-serif";

export interface DistributionSlice {
  name: string;
  value: number;
  color: string;
}

/**
 * Ringkasan sebaran sebagai satu batang melintang, menggantikan donut.
 *
 * Bentuknya dipilih karena ia mendatar: donut memakan tinggi yang di halaman
 * ini lebih berguna untuk 9-box. Persentase dan jumlahnya ditulis di dalam
 * segmen, jadi tidak perlu legenda terpisah di bawahnya.
 */
export default function DistributionBar({ data }: { data: DistributionSlice[] }) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  if (total === 0) {
    return (
      <div style={{ height: 28, borderRadius: 6, background: "#f1f3f5", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontSize: 11, color: "#adb5bd" }}>
        No data
      </div>
    );
  }

  return (
    <div style={{ display: "flex", height: 28, borderRadius: 6, overflow: "hidden" }}>
      {data.filter(d => d.value > 0).map((d, i) => {
        const pct = Math.round((d.value / total) * 100);
        const bg = resolveColor(d.color);
        return (
          <div
            key={i}
            title={`${d.name}: ${d.value} (${pct}%)`}
            style={{
              // Segmen sempit tetap perlu terbaca, jadi lebarnya dari nilai
              // tapi tidak pernah menyusut di bawah isinya sendiri.
              flexGrow: d.value,
              flexBasis: 0,
              minWidth: "fit-content",
              background: bg,
              color: textOn(bg),
              fontFamily: FONT,
              fontSize: 11,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              padding: "0 10px",
              whiteSpace: "nowrap",
            }}
          >
            {d.name} {pct}% ({d.value})
          </div>
        );
      })}
    </div>
  );
}
