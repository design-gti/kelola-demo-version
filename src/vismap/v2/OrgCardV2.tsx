import { Briefcase, Star, UserX, ArrowRightLeft, Target, Loader2, AlertCircle, Check } from "lucide-react";
import type { Employee, OrgChartNode } from "../data/orgChartData";
import type { HeatmapConfig } from "../components/HeatmapSettings";
import { NEUTRAL_BORDER, isTalent, needDevelopmentColor, matchPercent, type LayerId } from "./layers";
import { initiativeSuccessColor, type Initiative } from "./initiatives";

export const CARD_W = 208;
/** Aksen mode simulasi = palet `secondary` Prodigy. */
const SIM_ACCENT = "var(--mantine-color-secondary-5)";
const SIM_ACCENT_DARK = "var(--mantine-color-secondary-9)";
/** Aksen mode Compare — primary Prodigy, beda dari simulasi (oranye) & initiatives (ungu). */
const COMPARE_ACCENT = "#016699";

interface Props {
  /** KURSI: posisi, critical position, dan struktur bawahannya. Tidak ikut pindah saat simulasi. */
  seat: OrgChartNode;
  /** ORANG yang sedang menempati kursi ini. null = kursi kosong. Ini yang bertukar saat simulasi. */
  person: Employee | null;
  layers: Set<LayerId>;
  heatmapConfig: HeatmapConfig;
  /** Warna succession risk kursi ini — dihitung di luar karena tergantung occupancy simulasi. */
  riskColor?: string | null;
  onClick?: (e: React.MouseEvent) => void;
  /** Orang di kartu ini sedang "diangkat" untuk ditukar (mode simulasi). */
  picked?: boolean;
  /** Kandidat tujuan pertukaran (mode simulasi, setelah ada yang diangkat). */
  isSwapTarget?: boolean;
  /** Occupant kursi ini berubah dibanding data asli (mode simulasi). */
  changed?: boolean;
  /** Orang yang SEMULA menempati kursi ini — ditampilkan sebagai kartu kecil bergaris putus-putus. */
  previousPerson?: Employee | null;
  /** Inisiatif/goal PALING BARU milik occupant kursi ini (mode Initiatives). */
  goal?: Initiative;
  /** Mode pilih-untuk-Compare aktif — kartu berorang menampilkan checkbox. */
  selectable?: boolean;
  /** Kartu ini tercentang di mode Compare. */
  selected?: boolean;
}

/**
 * Kartu org chart V2.
 *
 * Dua "wilayah" visual yang independen:
 *   1. Frame + baris posisi (atas)  -> sinyal KURSI
 *   2. Blok orang (bawah)           -> sinyal ORANG
 * Sehingga beberapa layer heatmap bisa menyala sekaligus tanpa saling menimpa,
 * dan orangnya bisa ditukar antar kursi tanpa mengubah strukturnya.
 */
export default function OrgCardV2({
  seat,
  person,
  layers,
  heatmapConfig,
  riskColor = null,
  onClick,
  picked,
  isSwapTarget,
  changed,
  previousPerson,
  goal,
  selectable,
  selected,
}: Props) {
  const vacant = !person;

  // --- layer KURSI ---
  const showCritical = layers.has("critical-position") && !!seat.criticalPosition;

  // --- layer ORANG (dilewati kalau kursinya kosong) ---
  const devColor =
    person && layers.has("need-development") ? needDevelopmentColor(person, seat.position, heatmapConfig) : null;
  const talent = !!person && layers.has("talent") && isTalent(person, heatmapConfig);
  // Tag "% Ready to Promote" tidak digambar di sini — posisinya di luar kartu,
  // persis di atasnya (lihat ReadyToPromoteTag di NodeV2), sama seperti V1.

  // "Score" di bawah nama = kecocokan aspek kompetensi orang ini terhadap
  // standar KURSI yang dia tempati sekarang — bukan competencyScore statis lagi.
  // Fallback ke competencyScore kalau data aspeknya tidak ada (mis. kursi vacant).
  const matchScore = person ? matchPercent(person.id, seat.position) : null;

  const frameColor = selected ? COMPARE_ACCENT : picked ? SIM_ACCENT : riskColor ?? NEUTRAL_BORDER;
  const frameWidth = selected || picked ? 3 : riskColor ? 3 : 1;

  return (
    <div
      data-orgcard-v2={seat.id}
      onClick={onClick}
      style={{
        width: CARD_W,
        background: "white",
        border: `${frameWidth}px solid ${frameColor}`,
        borderRadius: 12,
        overflow: "visible",
        cursor: onClick ? "pointer" : "default",
        fontFamily: "'Open Sans', sans-serif",
        position: "relative",
        boxShadow: selected
          ? `0 0 0 4px ${COMPARE_ACCENT}33`
          : picked
            ? "0 0 0 4px rgba(245,158,11,0.28)"
            : isSwapTarget
              ? "0 0 0 3px rgba(245,158,11,0.18)"
              : riskColor
                ? `0 0 0 4px ${riskColor}22`
                : "0 1px 3px rgba(0,0,0,0.08)",
        transition: "border-color 0.15s, box-shadow 0.15s",
      }}
    >
      {/* Checkbox mode Compare — cuma kartu berorang yang bisa dipilih. */}
      {selectable && person && (
        <span
          aria-hidden
          style={{
            position: "absolute",
            top: -9,
            left: -9,
            width: 20,
            height: 20,
            borderRadius: 5,
            background: selected ? COMPARE_ACCENT : "white",
            border: `2px solid ${selected ? COMPARE_ACCENT : "#adb5bd"}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 6,
            boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
          }}
        >
          {selected && <Check size={12} strokeWidth={3.5} style={{ color: "white" }} />}
        </span>
      )}
      {/* Jejak occupant sebelumnya: kartu kecil di samping, disambung garis putus-putus.
          Absolute + z-index tinggi supaya tidak menggeser layout org chart. */}
      {previousPerson && (
        <div
          style={{
            position: "absolute",
            left: "100%",
            top: "50%",
            transform: "translateY(-50%)",
            display: "flex",
            alignItems: "center",
            zIndex: 25,
            pointerEvents: "none",
          }}
        >
          {/* garis putus-putus penyambung */}
          <div style={{ width: 18, borderTop: `1px dashed ${SIM_ACCENT}`, flexShrink: 0 }} />
          <div
            title={`${previousPerson.name} previously filled this position`}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              background: "white",
              border: `1px dashed ${SIM_ACCENT}`,
              borderRadius: 8,
              padding: "3px 6px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.10)",
              maxWidth: 116,
            }}
          >
            <img
              src={previousPerson.imageUrl}
              alt=""
              style={{
                width: 22,
                height: 22,
                borderRadius: "50%",
                objectFit: "cover",
                background: "#e9ecef",
                opacity: 0.75,
                flexShrink: 0,
              }}
            />
            <span style={{ minWidth: 0 }}>
              <span
                style={{
                  display: "block",
                  fontSize: 7,
                  fontWeight: 800,
                  color: SIM_ACCENT_DARK,
                  letterSpacing: 0.3,
                  textTransform: "uppercase",
                }}
              >
                Was here
              </span>
              <span
                style={{
                  display: "block",
                  fontSize: 9,
                  fontWeight: 700,
                  color: "#6c757d",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {previousPerson.name}
              </span>
            </span>
          </div>
        </div>
      )}

      {/* Penanda occupant kursi ini sudah diubah oleh simulasi */}
      {changed && (
        <span
          title="Occupant changed by simulation"
          style={{
            position: "absolute",
            top: -8,
            right: -8,
            width: 20,
            height: 20,
            borderRadius: "50%",
            background: SIM_ACCENT,
            border: "1.5px solid white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 5,
          }}
        >
          <ArrowRightLeft size={10} style={{ color: "white" }} strokeWidth={3} />
        </span>
      )}

      {/* ================= WILAYAH KURSI / POSISI ================= */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "6px 8px",
          background: riskColor ? `${riskColor}1a` : "#f8f9fa",
          borderBottom: `1px dashed ${riskColor ?? "#e9ecef"}`,
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
        }}
      >
        <Briefcase size={12} style={{ color: riskColor ?? "#6c757d", flexShrink: 0 }} strokeWidth={2.5} />
        <span
          title={seat.position}
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: "#495057",
            textTransform: "uppercase",
            letterSpacing: 0.2,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            flex: 1,
          }}
        >
          {seat.position || "-"}
        </span>
        {showCritical && (
          <span
            title="Critical Position"
            style={{
              flexShrink: 0,
              fontSize: 8,
              fontWeight: 800,
              color: "white",
              background: "#dc2626",
              borderRadius: 20,
              padding: "1px 6px",
              letterSpacing: 0.3,
            }}
          >
            CRITICAL
          </span>
        )}
      </div>

      {/* ================= WILAYAH ORANG ================= */}
      <div style={{ padding: "10px 10px 12px", display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
        <div style={{ position: "relative", marginBottom: 4 }}>
          {vacant ? (
            <div
              style={{
                width: 46,
                height: 46,
                borderRadius: "50%",
                background: "#f1f3f5",
                border: "2px dashed #adb5bd",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <UserX size={18} style={{ color: "#adb5bd" }} />
            </div>
          ) : (
            <img
              src={person!.imageUrl}
              alt=""
              style={{
                width: 46,
                height: 46,
                borderRadius: "50%",
                objectFit: "cover",
                background: "#e9ecef",
                border: devColor ? `3px solid ${devColor}` : "2px solid #e9ecef",
                display: "block",
              }}
            />
          )}
          {talent && (
            <span
              title="Talent"
              style={{
                position: "absolute",
                top: -4,
                right: -4,
                width: 18,
                height: 18,
                borderRadius: "50%",
                background: "#fbbf24",
                border: "1.5px solid white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Star size={9} style={{ color: "white", fill: "white" }} />
            </span>
          )}
        </div>

        <div
          title={person?.name}
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: vacant ? "#adb5bd" : "#212529",
            maxWidth: "100%",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            fontStyle: vacant ? "italic" : "normal",
          }}
        >
          {vacant ? "Vacant seat" : person!.name}
        </div>

        {person && (
          <div title="Kecocokan kompetensi vs standar kursi ini" style={{ fontSize: 10, color: "#6c757d" }}>
            Match {matchScore ?? person.competencyScore}%
          </div>
        )}

        {/* Layer Initiatives — kalau aktif, SEMUA kartu berorang menampilkan tag
            ini (persentase kalau ada goal, "No initiatives" kalau belum diisi)
            supaya jelas dibedakan dari kartu yang memang belum pernah dicek. */}
        {person && layers.has("initiatives") && (
          goal ? (
            <div
              title={goal.text}
              style={{
                marginTop: 4,
                display: "flex",
                alignItems: "center",
                gap: 4,
                maxWidth: "100%",
                borderRadius: 20,
                padding: "2px 8px",
                fontSize: 10,
                fontWeight: 800,
                ...(goal.status === "mapped" && goal.successPercent != null
                  ? { color: initiativeSuccessColor(goal.successPercent), background: initiativeSuccessColor(goal.successPercent) + "1a" }
                  : goal.status === "error"
                    ? { color: "#DE350B", background: "#DE350B1a" }
                    : { color: "#6c757d", background: "#f1f3f5" }),
              }}
            >
              {goal.status === "mapping" ? (
                <Loader2 size={10} className="animate-spin" />
              ) : goal.status === "error" ? (
                <AlertCircle size={10} />
              ) : (
                <Target size={10} />
              )}
              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {goal.status === "mapping" ? "Menganalisis…" : goal.status === "error" ? "Gagal mapping" : `${goal.successPercent}% goal`}
              </span>
            </div>
          ) : (
            <div
              title="Belum ada inisiatif untuk orang ini"
              style={{
                marginTop: 4,
                display: "flex",
                alignItems: "center",
                gap: 4,
                borderRadius: 20,
                padding: "2px 8px",
                fontSize: 10,
                fontWeight: 700,
                color: "#adb5bd",
                background: "#f8f9fa",
                border: "1px dashed #dee2e6",
              }}
            >
              <Target size={10} />
              <span>No initiatives</span>
            </div>
          )
        )}
      </div>
    </div>
  );
}
