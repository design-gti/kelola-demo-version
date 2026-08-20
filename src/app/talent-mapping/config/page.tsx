"use client";
import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Paper, Select, TextInput, NumberInput, Switch, Button, Badge, ColorPicker as MantineColorPicker } from "@mantine/core";
import { IconChevronDown, IconPencil, IconTrash, IconPlus, IconColorPicker } from "@tabler/icons-react";
import AppBreadcrumb from "@/components/Breadcrumb";
import {
  LAYOUTS, METRICS, DEFAULT_TAG_OPTIONS, isTalentTag, makeConfigById, boxByOrder, resolveColor, defaultShade, metricLabel,
  TMConfig, MetricKey, AxisBand,
} from "@/data/talentMappingShared";
import { getEffectiveConfig, saveConfig, type ConfigId } from "@/data/talentMappingConfig";

const FONT = "'Open Sans', sans-serif";
const ACCENT = "#016699";

/** Lama sorotan kartu yang barusan bertukar nomor, dalam ms. */
const SWAP_FLASH_MS = 1200;

/** Nomor box tertinggi yang bisa dipilih. */
const MAX_BOX_NUMBER = 27;

// recompute derived mins (min[0]=0, min[i]=prev.max+0.01) after a max edit
function withMins(bands: AxisBand[]): AxisBand[] {
  return bands.map((b, i) => ({ ...b, min: i === 0 ? 0 : bands[i - 1].max + 0.01 }));
}

function MiniGrid({ cols, rows, active }: { cols: number; rows: number; active: boolean }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols},6px)`, gridTemplateRows: `repeat(${rows},6px)`, gap: 2 }}>
      {Array.from({ length: cols * rows }).map((_, i) => (
        <div key={i} style={{ width: 6, height: 6, borderRadius: 1, background: active ? ACCENT : "#ced4da" }} />
      ))}
    </div>
  );
}

/**
 * Pil tag. Dipakai di kotak terpilih maupun di daftar pilihan, jadi yang
 * terlihat sama persis dengan yang dipilih.
 */
function TagChip({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ background: "#e7f5ff", color: ACCENT, fontFamily: FONT, fontSize: 10, fontWeight: 700, textTransform: "uppercase", borderRadius: 999, padding: "3px 12px", whiteSpace: "nowrap", display: "inline-block" }}>
      {children}
    </span>
  );
}

/**
 * Palet bawaan = warna design system, ditulis sebagai token supaya ikut berubah
 * kalau palet tokennya diperbarui. Warna buatan user disimpan sebagai hex mentah;
 * `resolveColor` meneruskan apa pun yang bukan token, jadi keduanya bisa hidup
 * di medan `box.color` yang sama tanpa penanda tambahan.
 */
const PRESET_COLORS = [
  "primary.2", "secondary.1", "error.2", "success.2",
  "primary.3", "secondary.3", "error.3", "neutral.2",
];

const HEX_RE = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;

/** Menempelkan alpha (0–100) sebagai dua digit terakhir hex 8-digit. */
function withOpacity(hex: string, pct: number): string {
  if (pct >= 100) return hex;
  const full = hex.length === 4 ? "#" + hex.slice(1).split("").map(c => c + c).join("") : hex;
  return full + Math.round((pct / 100) * 255).toString(16).padStart(2, "0");
}

function Swatch({ color, selected, onClick, title }: { color: string; selected: boolean; onClick: () => void; title?: string }) {
  return (
    <span
      role="button" title={title ?? color} onClick={onClick}
      style={{
        width: 26, height: 26, borderRadius: "50%", background: resolveColor(color), cursor: "pointer",
        // Cincin pemilih ditaruh di luar lingkaran (outline), bukan border, supaya
        // warna yang ditampilkan tidak menyusut saat terpilih.
        outline: selected ? `2px solid ${ACCENT}` : "1px solid rgba(0,0,0,0.08)",
        outlineOffset: selected ? 2 : 0,
        display: "block", flexShrink: 0,
      }}
    />
  );
}

/** Pemilih warna penuh: bidang saturasi + hue (Mantine), hex, opacity, eyedropper. */
function CustomColorModal({ initial, onCancel, onSave }: {
  initial: string;
  onCancel: () => void;
  onSave: (hex: string) => void;
}) {
  const start = HEX_RE.test(initial) ? initial : resolveColor(initial);
  const [hex, setHex] = useState(HEX_RE.test(start) ? start : "#486E82");
  const [draft, setDraft] = useState(hex);
  const [opacity, setOpacity] = useState(100);
  // Modal ini hanya dirender setelah user klik, jadi tidak pernah ikut SSR —
  // aman membaca `window` saat render dan tidak ada beda hidrasi.
  const hasEyeDropper = typeof window !== "undefined" && "EyeDropper" in window;

  const pickFromScreen = async () => {
    try {
      const ED = (window as unknown as { EyeDropper: new () => { open: () => Promise<{ sRGBHex: string }> } }).EyeDropper;
      const { sRGBHex } = await new ED().open();
      setHex(sRGBHex); setDraft(sRGBHex);
    } catch { /* user menutup eyedropper */ }
  };

  const commitDraft = (v: string) => {
    const t = v.trim();
    setDraft(t);
    if (HEX_RE.test(t)) setHex(t);
  };

  return (
    // Ditempel ke viewport, bukan ke popover di sebelahnya: kartu box tersebar
    // sampai tepi layar, jadi panel yang di-anchor ke induknya pasti terpotong
    // untuk kartu paling kanan atau paling bawah. Di tengah layar selalu utuh.
    <div
      onMouseDown={e => e.stopPropagation()}
      onClick={e => { if (e.target === e.currentTarget) onCancel(); }}
      style={{ position: "fixed", inset: 0, zIndex: 400, background: "rgba(0,0,0,0.35)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
    >
    <div style={{ width: 300, maxWidth: "100%", maxHeight: "100%", overflowY: "auto", background: "#fff", border: "1px solid #e9ecef", borderRadius: 12, boxShadow: "0 10px 30px rgba(0,0,0,0.16)", padding: 14 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: "#868e96", marginBottom: 8 }}>Custom color</div>
      <MantineColorPicker value={hex} onChange={v => { setHex(v); setDraft(v); }} format="hex" fullWidth size="sm" />

      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12 }}>
        <span style={{ width: 34, height: 34, borderRadius: "50%", background: withOpacity(hex, opacity), border: "1px solid rgba(0,0,0,0.08)", flexShrink: 0 }} />
        {hasEyeDropper && (
          <Button variant="default" radius="xl" size="xs" onClick={pickFromScreen} title="Pick color from screen">
            <IconColorPicker size={15} />
          </Button>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: "#495057" }}>Hex</span>
        <TextInput value={draft} onChange={e => commitDraft(e.currentTarget.value)} size="xs" radius="xl" style={{ flex: 1 }}
          error={draft.length > 0 && !HEX_RE.test(draft.trim())} styles={{ input: { fontFamily: FONT } }} />
        <NumberInput value={opacity} onChange={v => setOpacity(Math.min(100, Math.max(0, Number(v) || 0)))}
          min={0} max={100} suffix="%" hideControls size="xs" radius="xl" w={72} styles={{ input: { fontFamily: FONT, textAlign: "center" } }} />
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 14 }}>
        <button onClick={onCancel} style={{ background: "none", border: "none", cursor: "pointer", color: ACCENT, fontFamily: FONT, fontWeight: 700, fontSize: 12 }}>Cancel</button>
        <Button size="xs" radius="xl" color={ACCENT} disabled={!HEX_RE.test(hex)} onClick={() => onSave(withOpacity(hex, opacity))}>Save</Button>
      </div>
    </div>
    </div>
  );
}

function BoxColorPicker({ value, customs, onPick, onAddCustom }: {
  value: string;
  customs: string[];
  onPick: (color: string) => void;
  onAddCustom: (hex: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [full, setFull] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!boxRef.current?.contains(e.target as Node)) { setOpen(false); setFull(false); }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  const choose = (c: string) => { onPick(c); setOpen(false); setFull(false); };

  return (
    <div ref={boxRef} style={{ position: "relative" }}>
      <span
        role="button" title="Change box color" onClick={() => setOpen(o => !o)}
        style={{ width: 16, height: 16, borderRadius: "50%", background: resolveColor(value), cursor: "pointer", display: "block", border: "1px solid rgba(0,0,0,0.12)" }}
      />

      {open && (
        <div style={{ position: "absolute", zIndex: 30, top: "calc(100% + 6px)", right: 0, background: "#fff", border: "1px solid #e9ecef", borderRadius: 12, boxShadow: "0 6px 20px rgba(0,0,0,0.12)", padding: 12 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 26px)", gap: 8 }}>
            {PRESET_COLORS.map(c => (
              <Swatch key={c} color={c} selected={c === value} onClick={() => choose(c)} />
            ))}
          </div>

          <div style={{ fontSize: 12, fontWeight: 700, color: "#495057", margin: "12px 0 8px" }}>Custom</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
            {customs.map(c => (
              <Swatch key={c} color={c} selected={c === value} onClick={() => choose(c)} />
            ))}
            <span
              role="button" title="Add custom color" onClick={() => setFull(true)}
              style={{ width: 26, height: 26, borderRadius: "50%", border: `1px solid ${full ? ACCENT : "#ced4da"}`, cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
            >
              <IconPlus size={14} style={{ color: full ? ACCENT : "#868e96" }} />
            </span>
          </div>

          {full && (
            <CustomColorModal
              initial={value}
              onCancel={() => setFull(false)}
              onSave={hex => { onAddCustom(hex); choose(hex); }}
            />
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Pemilih tag box: daftar tag siap pakai yang bisa disunting, dihapus, dan
 * ditambah sendiri lewat baris isian di bawahnya.
 *
 * Bukan `Select` bawaan karena tiap baris membawa aksinya sendiri (ubah,
 * hapus) dan ada baris isian di kaki daftar — Select hanya tahu memilih.
 */
function TagPicker({ value, options, onPick, onRename, onRemove, onAdd }: {
  value: string | null;
  options: string[];
  onPick: (v: string) => void;
  onRename: (from: string, to: string) => void;
  onRemove: (v: string) => void;
  onAdd: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [fresh, setFresh] = useState("");
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!boxRef.current?.contains(e.target as Node)) { setOpen(false); setEditing(null); }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  const commitRename = () => {
    const to = draft.trim();
    if (editing && to && to !== editing) onRename(editing, to);
    setEditing(null);
  };
  const commitAdd = () => {
    const v = fresh.trim();
    if (!v) return;
    onAdd(v);
    onPick(v);
    setFresh("");
    setOpen(false);
  };

  return (
    <div ref={boxRef} style={{ position: "relative" }}>
      <div
        role="button"
        onClick={() => setOpen(o => !o)}
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, minHeight: 30, padding: "4px 10px", border: "1px solid #dee2e6", borderRadius: 999, cursor: "pointer", background: "#fff" }}
      >
        {value ? <TagChip>{value}</TagChip> : <span style={{ fontSize: 11, color: "#adb5bd" }}>Choose tag</span>}
        <IconChevronDown size={14} style={{ color: "#adb5bd", flexShrink: 0 }} />
      </div>

      {open && (
        <div style={{ position: "absolute", zIndex: 20, top: "calc(100% + 4px)", left: 0, right: 0, minWidth: 220, background: "#fff", border: "1px solid #e9ecef", borderRadius: 10, boxShadow: "0 6px 20px rgba(0,0,0,0.12)", overflow: "hidden" }}>
          <div style={{ maxHeight: 200, overflowY: "auto" }}>
            {options.map(opt => (
              <div key={opt} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 10px" }}>
                {editing === opt ? (
                  <TextInput
                    value={draft}
                    onChange={e => setDraft(e.currentTarget.value)}
                    onBlur={commitRename}
                    onKeyDown={e => { if (e.key === "Enter") commitRename(); if (e.key === "Escape") setEditing(null); }}
                    autoFocus size="xs" radius="xl" style={{ flex: 1 }} styles={{ input: { fontFamily: FONT } }}
                  />
                ) : (
                  <span role="button" onClick={() => { onPick(opt); setOpen(false); }} style={{ flex: 1, cursor: "pointer" }}>
                    <TagChip>{opt}</TagChip>
                  </span>
                )}
                <IconPencil size={15} role="button" title="Ubah tag"
                  onClick={() => { setEditing(opt); setDraft(opt); }}
                  style={{ color: "#868e96", cursor: "pointer", flexShrink: 0 }} />
                <IconTrash size={15} role="button" title="Hapus tag"
                  onClick={() => onRemove(opt)}
                  style={{ color: "#e03131", cursor: "pointer", flexShrink: 0 }} />
              </div>
            ))}
            {options.length === 0 && (
              <div style={{ padding: "10px", fontSize: 11, color: "#adb5bd", textAlign: "center" }}>Belum ada tag</div>
            )}
          </div>
          <div style={{ borderTop: "1px solid #e9ecef", padding: "6px 10px" }}>
            <TextInput
              value={fresh}
              onChange={e => setFresh(e.currentTarget.value)}
              onKeyDown={e => { if (e.key === "Enter") commitAdd(); }}
              onBlur={commitAdd}
              placeholder="Enter new tag..."
              variant="unstyled"
              size="xs"
              styles={{ input: { fontFamily: FONT, fontStyle: "italic", fontSize: 12 } }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Pemilih nomor box.
 *
 * Nomornya urut naik, bukan urutan tata letak: user mencari "#4", bukan
 * "kotak keempat dari kiri-bawah". Nomor yang sudah dipakai box lain tidak
 * disembunyikan — memilihnya menukar posisi keduanya, dan itu memang cara
 * memindahkan box ke tempat lain.
 */
function BoxNumberPicker({ value, options, onPick }: {
  value: number;
  options: number[];
  onPick: (v: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => { if (!boxRef.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  return (
    <div ref={boxRef} style={{ position: "relative" }}>
      <div
        role="button"
        onClick={() => setOpen(o => !o)}
        style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 10px", border: "1px solid #dee2e6", borderRadius: 999, cursor: "pointer", background: "#fff", width: 84, justifyContent: "space-between" }}
      >
        <span style={{ fontFamily: FONT, fontSize: 12, fontWeight: 700, color: "#868e96" }}>#{value}</span>
        <IconChevronDown size={14} style={{ color: "#adb5bd", flexShrink: 0 }} />
      </div>

      {open && (
        <div style={{ position: "absolute", zIndex: 30, top: "calc(100% + 4px)", left: 0, minWidth: 200, background: "#fff", border: "1px solid #e9ecef", borderRadius: 10, boxShadow: "0 6px 20px rgba(0,0,0,0.12)", overflow: "hidden" }}>
          <div style={{ padding: "10px 12px 8px" }}>
            <div style={{ fontFamily: FONT, fontSize: 12, fontWeight: 700, color: "#343a40" }}>Select Box Number</div>
            <div style={{ fontFamily: FONT, fontSize: 11, color: "#adb5bd", lineHeight: 1.4, marginTop: 2 }}>
              If the number is already in use, it will be swapped.
            </div>
          </div>
          <div style={{ maxHeight: 220, overflowY: "auto", paddingBottom: 4 }}>
            {options.map(o => {
              const active = o === value;
              return (
                <div
                  key={o}
                  role="button"
                  onClick={() => { if (!active) onPick(o); setOpen(false); }}
                  style={{ padding: "8px 12px", cursor: "pointer", background: active ? ACCENT : "transparent", color: active ? "#fff" : "#868e96", fontFamily: FONT, fontSize: 13, fontWeight: 700 }}
                >
                  #{o}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function DefaultBtn({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} style={{ background: "none", border: "none", cursor: "pointer", color: ACCENT, fontFamily: FONT, fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
      ↺ Default
    </button>
  );
}

function AxisCard({ title, keyVal, onKey, bands, onMax, onLabel, placeholder, swatches }: {
  title: string; keyVal?: MetricKey; onKey: (k: MetricKey) => void;
  bands: AxisBand[]; onMax: (i: number, v: number) => void; onLabel: (i: number, v: string) => void;
  placeholder?: string;
  /** Warna pita di sisi kiri kriteria — dipakai sumbu Z, di mana pita tidak
   *  punya sumbu bergaris untuk menunjukkan warnanya. */
  swatches?: boolean;
}) {
  return (
    <div style={{ minWidth: 0, background: "#f8f9fa", borderRadius: 10, padding: 16 }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: "#495057", marginBottom: 6 }}>{title} <span style={{ color: "#fa5252" }}>*</span></div>
      <Select
        data={METRICS.map(m => ({ value: m.key, label: m.label }))}
        value={keyVal ?? null} onChange={v => v && onKey(v as MetricKey)}
        placeholder={placeholder}
        size="sm" radius="xl" mb={14} styles={{ input: { fontFamily: FONT } }}
      />
      <div style={{ display: "grid", gridTemplateColumns: `${swatches ? "10px " : ""}1fr 70px 70px`, gap: 8, fontSize: 11, fontWeight: 700, color: "#868e96", marginBottom: 4 }}>
        {swatches && <span />}
        <span>Criteria *</span><span>Min</span><span>Max *</span>
      </div>
      {bands.map((b, i) => (
        <div key={i} style={{ display: "grid", gridTemplateColumns: `${swatches ? "10px " : ""}1fr 70px 70px`, gap: 8, marginBottom: 8, alignItems: "center" }}>
          {/* Warna sama persis dengan cincin di 9-box — lihat defaultShade. */}
          {swatches && <span style={{ width: 10, height: 26, borderRadius: 3, background: defaultShade(b.color) }} />}
          <TextInput value={b.label} onChange={e => onLabel(i, e.currentTarget.value)} size="xs" radius="xl" styles={{ input: { fontFamily: FONT } }} />
          <NumberInput value={b.min} disabled size="xs" radius="xl" hideControls />
          <NumberInput value={b.max} onChange={v => onMax(i, typeof v === "number" ? v : Number(v) || 0)} size="xs" radius="xl" hideControls min={0} max={100} />
        </div>
      ))}
    </div>
  );
}

function ConfigInner() {
  const router = useRouter();
  const params = useSearchParams();
  // Id apa pun diterima, bukan hanya TI/TR — tab buatan user punya id sendiri.
  const configId: ConfigId = params.get("config") || "TI";
  const [cfg, setCfg] = useState<TMConfig>(() => makeConfigById(configId));
  // load the saved config for this box mapping (re-runs if the ?config= id
  // changes). Wrapper fn keeps the effect off the setState-in-effect lint.
  useEffect(() => { const load = () => setCfg(getEffectiveConfig(configId)); load(); }, [configId]);

  const setBandMax = (axis: "rangesX" | "rangesY" | "rangesZ", i: number, v: number) =>
    setCfg(c => {
      const bands = (c[axis] ?? []).map((b, j) => (j === i ? { ...b, max: v } : b));
      return { ...c, [axis]: withMins(bands) };
    });
  const setBandLabel = (axis: "rangesX" | "rangesY" | "rangesZ", i: number, v: string) =>
    setCfg(c => ({ ...c, [axis]: (c[axis] ?? []).map((b, j) => (j === i ? { ...b, label: v } : b)) }));
  const setMetric = (axis: "X" | "Y" | "Z", k: MetricKey) =>
    setCfg(c => {
      if (axis === "X") return { ...c, sumbuXKey: k, sumbuX: metricLabel(k) };
      if (axis === "Y") return { ...c, sumbuYKey: k, sumbuY: metricLabel(k) };
      return { ...c, sumbuZKey: k, sumbuZ: metricLabel(k) };
    });
  /** Mematikan sumbu Z hanya menyembunyikannya; pilihan metriknya tetap
   *  tersimpan, jadi menyalakannya lagi tidak memaksa mengisi ulang. */
  const toggleZ = (on: boolean) => setCfg(c => ({ ...c, useZ: on }));
  const pickLayout = (layoutId: string) =>
    setCfg(c => makeConfigById(configId, layoutId, { sumbuXKey: c.sumbuXKey, sumbuYKey: c.sumbuYKey }));
  const setBoxLabel = (order: number, v: string) =>
    setCfg(c => ({ ...c, boxes: c.boxes.map(b => (b.order === order ? { ...b, label: v } : b)) }));
  /**
   * Satu tag per box, dipakai kedua mode. `tag` ikut diturunkan supaya
   * ringkasan Talent/Non Talent dan kolom tabel tetap bekerja tanpa perubahan.
   */
  const setBoxTag = (order: number, v: string) =>
    setCfg(c => ({ ...c, boxes: c.boxes.map(b => (b.order === order ? { ...b, readiness: v, tag: isTalentTag(v) ? "talent" : null } : b)) }));

  const setBoxColor = (order: number, color: string) =>
    setCfg(c => ({ ...c, boxes: c.boxes.map(b => (b.order === order ? { ...b, color } : b)) }));

  // Warna buatan user dipegang di konfigurasi, bukan state lokal picker: satu
  // warna yang didaftarkan lewat satu box langsung tersedia untuk box lain dan
  // ikut tersimpan bersama konfigurasinya.
  const colorOptions = cfg.colorOptions ?? [];
  const addColorOption = (hex: string) =>
    setCfg(c => (colorOptions.includes(hex) ? c : { ...c, colorOptions: [...colorOptions, hex] }));

  const tagOptions = cfg.tagOptions ?? DEFAULT_TAG_OPTIONS;
  const addTag = (v: string) =>
    setCfg(c => (tagOptions.includes(v) ? c : { ...c, tagOptions: [...tagOptions, v] }));
  /** Mengubah nama tag ikut memperbarui box yang memakainya — kalau tidak,
   *  box itu menyimpan tag yang sudah tidak ada di daftar. */
  const renameTag = (from: string, to: string) =>
    setCfg(c => ({
      ...c,
      tagOptions: tagOptions.map(t => (t === from ? to : t)),
      boxes: c.boxes.map(b => (b.readiness === from ? { ...b, readiness: to, tag: isTalentTag(to) ? "talent" : null } : b)),
    }));
  const removeTag = (v: string) =>
    setCfg(c => ({
      ...c,
      tagOptions: tagOptions.filter(t => t !== v),
      boxes: c.boxes.map(b => (b.readiness === v ? { ...b, readiness: null, tag: null } : b)),
    }));
  const resetAxes = () => setCfg(c => { const d = makeConfigById(configId, c.layout, { sumbuXKey: c.sumbuXKey, sumbuYKey: c.sumbuYKey }); return { ...c, rangesX: d.rangesX, rangesY: d.rangesY, rangesZ: d.rangesZ }; });
  const resetBoxes = () => setCfg(c => ({ ...c, boxes: makeConfigById(configId, c.layout).boxes }));

  /**
   * Nomor yang bisa dipilih di tiap kartu box: 1..27, bukan hanya nomor yang
   * sedang terpakai.
   *
   * Layout terbesar cuma punya 12 kotak, jadi membatasi pilihan ke nomor yang
   * ada berarti nomor box hanya bisa DITUKAR antar kotak — tidak bisa dinaikkan
   * ke deret lain, misalnya menomori ulang mengikuti kode internal organisasi.
   * Memilih nomor yang belum terpakai memindahkan nomornya saja, tanpa menukar
   * dengan siapa pun (lihat swapBoxOrder).
   */
  const allOrders = Array.from({ length: MAX_BOX_NUMBER }, (_, i) => i + 1);

  /**
   * Tukar nomor dua box.
   *
   * `ordering` memetakan sel grid ke nomor box, jadi menukar nomornya berarti
   * isi kedua box (nama, warna, tag) bertukar tempat di matriks — tanpa
   * mengubah tata letak gridnya sendiri.
   */
  const swapBoxOrder = (from: number, to: number) => {
    setCfg(c => ({
      ...c,
      // Ditukar di DUA tempat sekaligus: nomor pada box, dan nomor pada sel
      // grid di `ordering`. Kalau hanya box yang ditukar, isinya yang berpindah
      // sel; kalau hanya ordering, isinya juga ikut berpindah. Menukar keduanya
      // membuat isi tetap di selnya dan yang berganti hanya nomornya — itulah
      // yang dimaksud "mengubah urutan nomor box".
      boxes: c.boxes.map(b =>
        b.order === from ? { ...b, order: to } : b.order === to ? { ...b, order: from } : b,
      ),
      ordering: c.ordering.map(row =>
        row.map(o => (o === from ? to : o === to ? from : o)),
      ),
    }));
    // Kartu tetap di tempatnya karena susunannya mengikuti matriks — yang
    // bertukar isinya. Tanpa penanda, pertukaran itu mudah terlewat dan
    // terbaca seolah tombolnya tidak bekerja.
    setSwapped([from, to]);
  };

  // Sorotan singkat pada dua kartu yang barusan bertukar.
  const [swapped, setSwapped] = useState<number[]>([]);
  useEffect(() => {
    if (swapped.length === 0) return;
    const t = setTimeout(() => setSwapped([]), SWAP_FLASH_MS);
    return () => clearTimeout(t);
  }, [swapped]);

  const persistAndGo = () => { saveConfig(configId, cfg); router.push("/talent-mapping"); };

  return (
    <div style={{ fontFamily: FONT }}>
      <AppBreadcrumb items={[{ label: "Talent Mapping", href: "/talent-mapping" }, { label: `Setting ${cfg.name}` }]} />
      <div style={{ padding: "12px 16px 40px", maxWidth: 1000, margin: "0 auto" }}>

        {/* Layout carousel */}
        <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 8, marginBottom: 16 }}>
          {LAYOUTS.map(l => {
            const active = cfg.layout === l.id;
            return (
              <div key={l.id} onClick={() => pickLayout(l.id)}
                style={{ flex: "0 0 auto", minWidth: 220, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: 16, borderRadius: 10, background: "#fff", border: active ? `2px solid ${ACCENT}` : "1px solid #e9ecef" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ width: 16, height: 16, borderRadius: "50%", border: `2px solid ${active ? ACCENT : "#ced4da"}`, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                    {active && <span style={{ width: 8, height: 8, borderRadius: "50%", background: ACCENT }} />}
                  </span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#343a40" }}>{l.label}</div>
                    {l.recommended && <Badge size="xs" radius="sm" color="blue" variant="light" mt={2}>RECOMENDED</Badge>}
                  </div>
                </div>
                <MiniGrid cols={l.x.length} rows={l.y.length} active={active} />
              </div>
            );
          })}
        </div>

        {/* Axis card */}
        <Paper radius={12} p={20} mb={16} withBorder>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <Switch
              checked={!!cfg.useZ}
              onChange={e => toggleZ(e.currentTarget.checked)}
              label="Use the third axis"
              styles={{ label: { fontFamily: FONT, color: cfg.useZ ? "#495057" : "#868e96", fontSize: 12 } }}
            />
            <DefaultBtn onClick={resetAxes} />
          </div>
          {/* Kolom sumbu berjajar dalam satu baris. Grid, bukan flex-wrap:
              dengan flex tiap kartu punya lebar dasar sendiri dan kartu ketiga
              melompat ke baris baru; grid membagi lebar yang ada rata. */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
            <AxisCard title="Select X Axis Data (Horizontal)" keyVal={cfg.sumbuXKey} onKey={k => setMetric("X", k)}
              bands={cfg.rangesX} onMax={(i, v) => setBandMax("rangesX", i, v)} onLabel={(i, v) => setBandLabel("rangesX", i, v)} />
            <AxisCard title="Select Y Axis Data (Vertical)" keyVal={cfg.sumbuYKey} onKey={k => setMetric("Y", k)}
              bands={cfg.rangesY} onMax={(i, v) => setBandMax("rangesY", i, v)} onLabel={(i, v) => setBandLabel("rangesY", i, v)} />
            {cfg.useZ && (
              <AxisCard title="Select Z Axis Data (Radius)" keyVal={cfg.sumbuZKey} onKey={k => setMetric("Z", k)}
                placeholder="Select z axis data (radius)"
                swatches
                bands={cfg.rangesZ ?? []} onMax={(i, v) => setBandMax("rangesZ", i, v)} onLabel={(i, v) => setBandLabel("rangesZ", i, v)} />
            )}
          </div>
        </Paper>

        {/* Box grid — arranged to match the matrix (ordering rows top→bottom) */}
        <Paper radius={12} p={20} mb={16} withBorder>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}><DefaultBtn onClick={resetBoxes} /></div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {cfg.ordering.map((row, ri) => (
              <div key={ri} style={{ display: "grid", gridTemplateColumns: `repeat(${row.length}, 1fr)`, gap: 12 }}>
                {row.map(order => {
                  const b = boxByOrder(cfg, order)!;
                  return (
                    <div key={order} style={{
                      border: swapped.includes(order) ? `1px solid ${ACCENT}` : "1px solid #e9ecef",
                      background: swapped.includes(order) ? "#e6f3f8" : undefined,
                      transition: "background 0.3s, border-color 0.3s",
                      borderRadius: 10, padding: 14,
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                        <BoxNumberPicker value={order} options={allOrders} onPick={to => swapBoxOrder(order, to)} />
                        <BoxColorPicker value={b.color} customs={colorOptions} onPick={c => setBoxColor(order, c)} onAddCustom={addColorOption} />
                      </div>

                      <div style={{ fontSize: 11, fontWeight: 700, color: "#868e96", marginBottom: 4 }}>Box Name</div>
                      <TextInput value={b.label} onChange={e => setBoxLabel(order, e.currentTarget.value)} size="xs" radius="xl" mb={10} styles={{ input: { fontFamily: FONT } }} />

                      <div style={{ fontSize: 11, fontWeight: 700, color: "#868e96", marginBottom: 4 }}>Tag</div>
                      <TagPicker
                        value={b.readiness ?? null}
                        options={tagOptions}
                        onPick={v => setBoxTag(order, v)}
                        onRename={renameTag}
                        onRemove={removeTag}
                        onAdd={addTag}
                      />
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </Paper>

        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, alignItems: "center" }}>
          <button onClick={() => router.push("/talent-mapping")} style={{ background: "none", border: "none", cursor: "pointer", color: ACCENT, fontFamily: FONT, fontWeight: 700, fontSize: 13 }}>Cancel</button>
          {/* ponytail: Preview == Save (persist + view) for now; add a non-persisted preview mode if needed. */}
          <Button onClick={persistAndGo} radius="xl" color="orange">Preview</Button>
          <Button onClick={persistAndGo} radius="xl" color={ACCENT}>Save</Button>
        </div>
      </div>
    </div>
  );
}

// useSearchParams() must sit under a Suspense boundary (App Router requirement).
export default function TalentMappingConfigPage() {
  return (
    <Suspense fallback={null}>
      <ConfigInner />
    </Suspense>
  );
}
