import { Briefcase, Star, UserX, ArrowRightLeft, Target, Loader2, AlertCircle, Check } from "lucide-react";
import type { Employee, OrgChartNode } from "../data/orgChartData";
import type { HeatmapConfig } from "../components/HeatmapSettings";
import { NEUTRAL_BORDER, isTalent, needDevelopmentColor, matchPercent, type LayerId } from "./layers";
import { initiativeSuccessColor, type Initiative } from "./initiatives";

export const CARD_W = 208;
/**
 * Foto full-bleed dibiarkan persegi (1:1) mengikuti rasio berkas avatar aslinya,
 * jadi `object-fit: cover` tidak memotong apa pun. Tingginya ikut lebar kartu.
 */
const PHOTO_RATIO = "1 / 1";
/** Selokan foto ke tepi kartu, kiri dan kanan. */
const PHOTO_GUTTER = 8;
/** Aksen mode simulasi = palet `secondary` Prodigy. */
/*
 * Sinyal heatmap tidak berhenti di garis tepi.
 *
 * Warna heatmap dulu hanya jadi border 3px. Pada zoom jauh — dan itu justru cara
 * peta ini paling sering dilihat — garis setipis itu praktis lenyap, sehingga
 * kartu berisiko tinggi tidak lebih menonjol daripada yang aman. Karena itu
 * warnanya dilanjutkan jadi cahaya: kursi memancarkan bayangan berwarna ke luar,
 * dan foto orangnya menerima cahaya yang sama dari dalam.
 *
 * Nilai berikut adalah imbuhan alpha heksadesimal pada warna heatmap-nya.
 */
/** Halo rapat di tepi kartu — menegaskan warnanya tanpa mengaburkan garis. */
const SEAT_GLOW_RING = "40";
/** Cahaya dekat yang memeluk tepi kartu. */
const SEAT_GLOW_NEAR = "8c";
/** Pendar jauh; ini yang membuat kartu terbaca "menyala" dari kejauhan. */
const SEAT_GLOW_FAR = "59";
/** Cahaya dari dalam pada foto, untuk layer yang menempel pada ORANG. */
const PHOTO_GLOW = "a6";
/**
 * Semburat warna kursi. SATU nilai untuk seluruh kartu — baris posisi dan badan
 * kartu sama pekatnya, jadi warnanya terbaca sebagai satu bidang utuh, bukan dua
 * blok bertingkat. Yang membedakan baris posisi tinggal garis putus-putusnya.
 */
const SEAT_TINT = "2b";

const SIM_ACCENT = "var(--mantine-color-secondary-5)";
const SIM_ACCENT_DARK = "var(--mantine-color-secondary-9)";
/** Aksen mode Compare — primary Prodigy, beda dari simulasi (oranye) & initiatives (ungu). */
const COMPARE_ACCENT = "#016699";
/** Kartu yang menu aksinya sedang terbuka. */
const ACTIVE_ACCENT = "#016699";

/**
 * Data opsional yang ikut dicetak di kartu, dipilih lewat "Filter Card Data".
 * Bentuknya sama persis dengan yang dipakai V1/V3 (DataVisibilityModal), jadi
 * pilihan user terbawa saat berpindah versi.
 */
export interface CardFieldVisibility {
  gender: boolean;
  city: boolean;
  maritalStatus: boolean;
  performance: boolean;
  iq: boolean;
  capability: boolean;
  commitment: boolean;
  contribution: boolean;
}

/** Nilai yang dicetak, urut sesuai urutan di modal. */
export function extraFieldsOf(person: Employee, visible?: CardFieldVisibility) {
  if (!visible) return [];
  const p = person as Employee & { capability?: number; commitment?: number; contribution?: number };
  const rows: { label: string; value: string }[] = [];
  // Kalau dicentang tapi datanya kosong, barisnya tetap muncul dengan "-" —
  // sama seperti V1: jangan diam-diam hilang seolah pilihannya tidak berlaku.
  const push = (on: boolean, label: string, value: unknown) => {
    if (on) rows.push({ label, value: value == null || value === "" ? "-" : String(value) });
  };
  push(visible.gender, "Gender", p.gender);
  push(visible.city, "City", p.city);
  push(visible.maritalStatus, "Marital Status", p.maritalStatus);
  push(visible.performance, "Performance", p.performance);
  push(visible.iq, "IQ", p.iq);
  push(visible.capability, "Capability", p.capability);
  push(visible.commitment, "Commitment", p.commitment);
  push(visible.contribution, "Contribution", p.contribution);
  return rows;
}

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
  /** Data tambahan yang dipilih lewat "Filter Card Data". */
  fields?: CardFieldVisibility;
  /**
   * Menu aksi kartu ini sedang terbuka. Menunya mengambang di samping kartu dan
   * bisa jauh dari kursinya saat kanvas padat, jadi kartunya perlu ditandai —
   * kalau tidak, user tidak tahu menu itu milik siapa.
   */
  menuOpen?: boolean;
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
  fields,
  menuOpen,
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
  const matchValue = matchScore ?? person?.competencyScore ?? 0;
  // Warna bar match: hijau/kuning/merah, ambangnya sama dengan ReadinessPill.
  const matchColor = matchValue >= 80 ? "#2f9e44" : matchValue >= 60 ? "#f08c00" : "#e03131";

  const extraFields = person ? extraFieldsOf(person, fields) : [];

  // Menu terbuka menang atas warna heatmap: ia menandai apa yang BARU SAJA
  // diklik user, jadi harus terbaca seketika di antara kartu berwarna lain.
  const frameColor = selected
    ? COMPARE_ACCENT
    : picked
      ? SIM_ACCENT
      : menuOpen
        ? ACTIVE_ACCENT
        : riskColor ?? NEUTRAL_BORDER;
  const frameWidth = selected || picked || menuOpen ? 3 : riskColor ? 3 : 1;

  return (
    <div
      data-orgcard-v2={seat.id}
      onClick={onClick}
      style={{
        width: CARD_W,
        // Warna heatmap KURSI menyelimuti seluruh badan kartu, bukan cuma baris
        // posisinya. Fotonya sendiri tidak tersentuh: ia punya kotak sendiri di
        // atas latar ini, dan area foto adalah jatah sinyal ORANG.
        background: riskColor ? `${riskColor}${SEAT_TINT}` : "white",
        border: `${frameWidth}px solid ${frameColor}`,
        borderRadius: 12,
        overflow: "visible",
        cursor: onClick ? "pointer" : "default",
        fontFamily: "'Open Sans', sans-serif",
        position: "relative",
        boxShadow: selected
          ? `0 0 0 4px ${COMPARE_ACCENT}33`
          : menuOpen
            ? `0 0 0 4px ${ACTIVE_ACCENT}33, 0 6px 24px 4px ${ACTIVE_ACCENT}59`
          : picked
            ? "0 0 0 4px rgba(245,158,11,0.28)"
            : isSwapTarget
              ? "0 0 0 3px rgba(245,158,11,0.18)"
              : riskColor
                /*
                 * Tiga lapis, bukan satu: halo rapat menjaga tepinya tetap tajam,
                 * lapis dekat memeluk kartu, lapis jauh menyebar keluar. Satu
                 * bayangan tunggal harus memilih antara tajam atau luas — dan
                 * yang dibutuhkan di sini keduanya sekaligus.
                 */
                ? `0 0 0 4px ${riskColor}${SEAT_GLOW_RING}, 0 0 22px 4px ${riskColor}${SEAT_GLOW_NEAR}, 0 8px 48px 12px ${riskColor}${SEAT_GLOW_FAR}`
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
          background: riskColor ? "transparent" : "#f8f9fa",
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

      {/* ================= WILAYAH ORANG =================
          Fotonya sengaja besar dan persegi, seperti kartu V1: pada
          jarak zoom org chart, wajah adalah satu-satunya penanda yang masih
          terbaca — avatar 46px sebelumnya terlalu kecil untuk itu. Nama ditaruh
          di atas foto (dengan gradasi gelap supaya kontras), sehingga area putih
          di bawah foto bebas dipakai sinyal angka. */}
      <div
        style={{
          position: "relative",
          // Margin, bukan padding: rasio 1:1 harus dihitung dari lebar foto yang
          // sudah menyusut, bukan lebar kartu.
          margin: `0 ${PHOTO_GUTTER}px`,
          aspectRatio: PHOTO_RATIO,
          borderRadius: 8,
          overflow: "hidden",
          background: vacant ? "#e9ecef" : "#d6e6ff",
        }}
      >
        {vacant ? (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <UserX size={40} strokeWidth={1.5} style={{ color: "#adb5bd" }} />
          </div>
        ) : (
          <img
            src={person!.imageUrl}
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        )}

        {/* Gradasi gelap = alas nama. Berhenti di 62% supaya wajah tidak tertutup. */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.35) 38%, rgba(0,0,0,0) 62%)",
            pointerEvents: "none",
          }}
        />

        {/* Layer Need Development = sinyal ORANG, jadi warnanya masuk ke dalam
            foto sebagai cahaya, bukan menempel di bingkai kartu (itu jatah
            sinyal KURSI). Garis tegas 2px menjaga batasnya tetap terbaca,
            sementara cahaya lebar di belakangnya yang memberi kesan menyala. */}
        {devColor && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              // Blur selebar sepertiga foto: cahayanya harus terasa menjalar ke
              // tengah, bukan sekadar garis tebal yang buram di tepi.
              boxShadow: `inset 0 0 0 2px ${devColor}, inset 0 0 40px 14px ${devColor}${PHOTO_GLOW}`,
              pointerEvents: "none",
            }}
          />
        )}

        {talent && (
          <span
            title="Talent"
            style={{
              position: "absolute",
              top: 6,
              right: 6,
              display: "flex",
              alignItems: "center",
              gap: 3,
              padding: "2px 7px 2px 5px",
              borderRadius: 20,
              background: "#fbbf24",
              boxShadow: "0 1px 4px rgba(0,0,0,0.25)",
            }}
          >
            <Star size={9} style={{ color: "white", fill: "white" }} />
            <span style={{ fontSize: 8, fontWeight: 800, color: "white", letterSpacing: 0.3 }}>TALENT</span>
          </span>
        )}

        <div
          title={person?.name}
          style={{
            position: "absolute",
            left: 10,
            right: 10,
            bottom: 8,
            fontSize: 13,
            fontWeight: 700,
            color: "white",
            textShadow: "0 1px 3px rgba(0,0,0,0.55)",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            fontStyle: vacant ? "italic" : "normal",
          }}
        >
          {vacant ? "Vacant seat" : person!.name}
        </div>
      </div>

      {/* ================= ANGKA ORANG ================= */}
      <div
        style={{
          padding: "8px 10px 10px",
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          gap: 6,
          borderBottomLeftRadius: 10,
          borderBottomRightRadius: 10,
          // Transparan supaya semburat kursi di latar kartu tembus ke sini.
          background: "transparent",
        }}
      >
        {person && (
          <div title="Kecocokan kompetensi vs standar kursi ini">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 3 }}>
              <span
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  color: "#868e96",
                  letterSpacing: 0.3,
                  textTransform: "uppercase",
                  // Labelnya panjang; dipotong dengan elipsis daripada
                  // mendorong angka persennya keluar dari kartu.
                  minWidth: 0,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                % Match to Current Position
              </span>
              <span style={{ fontSize: 11, fontWeight: 800, color: matchColor }}>{matchValue}%</span>
            </div>
            <div style={{ height: 4, borderRadius: 2, background: "#e9ecef", overflow: "hidden" }}>
              <div style={{ width: `${matchValue}%`, height: "100%", borderRadius: 2, background: matchColor }} />
            </div>
          </div>
        )}

        {vacant && (
          <div style={{ fontSize: 10, color: "#adb5bd", textAlign: "center" }}>Belum ada occupant</div>
        )}

        {/* Data pilihan user. Dipisah garis dari blok Match supaya jelas ini
            tambahan, bukan bagian tetap kartu. */}
        {extraFields.length > 0 && (
          <div style={{ borderTop: "1px dashed #e9ecef", paddingTop: 6, display: "flex", flexDirection: "column", gap: 3 }}>
            {extraFields.map(f => (
              <div key={f.label} style={{ display: "flex", justifyContent: "space-between", gap: 8, fontSize: 10 }}>
                <span style={{ color: "#868e96", whiteSpace: "nowrap" }}>{f.label}</span>
                <span
                  title={f.value}
                  style={{ color: "#212529", fontWeight: 700, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                >
                  {f.value}
                </span>
              </div>
            ))}
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
