"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Paper, Select, TextInput, NumberInput, Switch, Button, Badge } from "@mantine/core";
import AppBreadcrumb from "@/components/Breadcrumb";
import {
  LAYOUTS, METRICS, makeConfig, boxByOrder, resolveColor, metricLabel,
  TMConfig, MetricKey, AxisBand,
} from "@/data/talentMappingData";
import { getEffectiveTIConfig, saveTIConfig } from "@/data/talentMappingConfig";

const FONT = "'Open Sans', sans-serif";
const ACCENT = "#016699";

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

function DefaultBtn({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} style={{ background: "none", border: "none", cursor: "pointer", color: ACCENT, fontFamily: FONT, fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
      ↺ Default
    </button>
  );
}

function AxisCard({ title, keyVal, onKey, bands, onMax, onLabel }: {
  title: string; keyVal: MetricKey; onKey: (k: MetricKey) => void;
  bands: AxisBand[]; onMax: (i: number, v: number) => void; onLabel: (i: number, v: string) => void;
}) {
  return (
    <div style={{ flex: "1 1 340px", background: "#f8f9fa", borderRadius: 10, padding: 16 }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: "#495057", marginBottom: 6 }}>{title} <span style={{ color: "#fa5252" }}>*</span></div>
      <Select
        data={METRICS.map(m => ({ value: m.key, label: m.label }))}
        value={keyVal} onChange={v => v && onKey(v as MetricKey)}
        size="sm" radius="xl" mb={14} styles={{ input: { fontFamily: FONT } }}
      />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 70px 70px", gap: 8, fontSize: 11, fontWeight: 700, color: "#868e96", marginBottom: 4 }}>
        <span>Kriteria *</span><span>Min</span><span>Max *</span>
      </div>
      {bands.map((b, i) => (
        <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 70px 70px", gap: 8, marginBottom: 8, alignItems: "center" }}>
          <TextInput value={b.label} onChange={e => onLabel(i, e.currentTarget.value)} size="xs" radius="xl" styles={{ input: { fontFamily: FONT } }} />
          <NumberInput value={b.min} disabled size="xs" radius="xl" hideControls />
          <NumberInput value={b.max} onChange={v => onMax(i, typeof v === "number" ? v : Number(v) || 0)} size="xs" radius="xl" hideControls min={0} max={100} />
        </div>
      ))}
    </div>
  );
}

export default function TalentMappingConfigPage() {
  const router = useRouter();
  const [cfg, setCfg] = useState<TMConfig>(() => makeConfig("9box"));
  // load saved config on mount (wrapper fn keeps the effect off the setState-in-effect lint)
  useEffect(() => { const load = () => setCfg(getEffectiveTIConfig()); load(); }, []);

  const setBandMax = (axis: "rangesX" | "rangesY", i: number, v: number) =>
    setCfg(c => {
      const bands = c[axis].map((b, j) => (j === i ? { ...b, max: v } : b));
      return { ...c, [axis]: withMins(bands) };
    });
  const setBandLabel = (axis: "rangesX" | "rangesY", i: number, v: string) =>
    setCfg(c => ({ ...c, [axis]: c[axis].map((b, j) => (j === i ? { ...b, label: v } : b)) }));
  const setMetric = (axis: "X" | "Y", k: MetricKey) =>
    setCfg(c => (axis === "X" ? { ...c, sumbuXKey: k, sumbuX: metricLabel(k) } : { ...c, sumbuYKey: k, sumbuY: metricLabel(k) }));
  const pickLayout = (id: string) =>
    setCfg(c => makeConfig(id, { sumbuXKey: c.sumbuXKey, sumbuYKey: c.sumbuYKey }));
  const setBoxLabel = (order: number, v: string) =>
    setCfg(c => ({ ...c, boxes: c.boxes.map(b => (b.order === order ? { ...b, label: v } : b)) }));
  const toggleTag = (order: number) =>
    setCfg(c => ({ ...c, boxes: c.boxes.map(b => (b.order === order ? { ...b, tag: b.tag ? null : "talent" } : b)) }));
  const resetAxes = () => setCfg(c => { const d = makeConfig(c.layout, { sumbuXKey: c.sumbuXKey, sumbuYKey: c.sumbuYKey }); return { ...c, rangesX: d.rangesX, rangesY: d.rangesY }; });
  const resetBoxes = () => setCfg(c => ({ ...c, boxes: makeConfig(c.layout).boxes }));

  const persistAndGo = () => { saveTIConfig(cfg); router.push("/talent-mapping"); };

  return (
    <div style={{ fontFamily: FONT }}>
      <AppBreadcrumb items={[{ label: "Talent Mapping", href: "/talent-mapping" }, { label: "Setting Talent Identification" }]} />
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
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 8 }}><DefaultBtn onClick={resetAxes} /></div>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <AxisCard title="Pilih Data Sumbu X (Horizontal)" keyVal={cfg.sumbuXKey} onKey={k => setMetric("X", k)}
              bands={cfg.rangesX} onMax={(i, v) => setBandMax("rangesX", i, v)} onLabel={(i, v) => setBandLabel("rangesX", i, v)} />
            <AxisCard title="Pilih Data Sumbu Y (Vertical)" keyVal={cfg.sumbuYKey} onKey={k => setMetric("Y", k)}
              bands={cfg.rangesY} onMax={(i, v) => setBandMax("rangesY", i, v)} onLabel={(i, v) => setBandLabel("rangesY", i, v)} />
          </div>
          {/* ponytail: third-axis toggle is visual-only (demo has no Z axis); wire when a 3rd metric matters. */}
          <Switch mt={16} disabled label="Tidak gunakan Sumbu ketiga" styles={{ label: { fontFamily: FONT, color: "#868e96" } }} />
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
                    <div key={order} style={{ border: "1px solid #e9ecef", borderRadius: 10, padding: 14 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                        <span style={{ fontWeight: 700, color: "#343a40", fontSize: 13 }}>Box {order}</span>
                        <span style={{ width: 14, height: 14, borderRadius: "50%", background: "#fff", border: `2px solid ${resolveColor(b.color)}` }} />
                      </div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "#868e96", marginBottom: 4 }}>Label <span style={{ color: "#fa5252" }}>*</span></div>
                      <TextInput value={b.label} onChange={e => setBoxLabel(order, e.currentTarget.value)} size="xs" radius="xl" mb={10} styles={{ input: { fontFamily: FONT } }} />
                      <Switch checked={b.tag === "talent"} onChange={() => toggleTag(order)} label="Tag as talent" size="sm" styles={{ label: { fontFamily: FONT, fontSize: 11, color: "#868e96" } }} />
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
