"use client";
import { useMemo, useState } from "react";
import { Paper, Badge, Avatar as MantineAvatar, Select, Pagination, Text } from "@mantine/core";
import { IconArrowUpRight } from "@tabler/icons-react";
import AppBreadcrumb from "@/components/Breadcrumb";
import TMTRBox from "@/components/talent/TMTRBox";
import DonutChart from "@/components/talent/DonutChart";
import { TI_CONFIG, TR_CONFIG, TI_POINTS, TR_POINTS, donutTags, boxByOrder, resolveColor, TMConfig, TMPoint } from "@/data/talentMappingData";

const FONT = "'Open Sans', sans-serif";
const ACCENT = "#016699";

function initials(name: string) {
  return name.split(" ").slice(0, 2).map(w => w[0] || "").join("").toUpperCase();
}
function darker(token: string) {
  const shades: Record<string, string> = { error: "#DE350B", secondary: "#F28700", primary: "#016699", success: "#00875A", neutral: "#868E96" };
  return shades[token.split(".")[0]] ?? "#495057";
}

function OutlinePill({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <Badge
      variant="outline"
      radius="xl"
      style={{ fontSize: 9, fontFamily: FONT, color, borderColor: color, background: "#fff", whiteSpace: "nowrap" }}
    >
      {children}
    </Badge>
  );
}

function Avatar({ name }: { name: string }) {
  return (
    <MantineAvatar radius="xl" size={28} style={{ flexShrink: 0, background: "#e6f3f8" }}>
      <span style={{ color: ACCENT, fontFamily: FONT, fontWeight: 700, fontSize: 10 }}>{initials(name)}</span>
    </MantineAvatar>
  );
}

const TI_COLS = "1.4fr 1.5fr 0.9fr 0.8fr 1.1fr 1fr 0.5fr";
const TR_COLS = "1.5fr 1.4fr 1fr 0.8fr 1.1fr 1.1fr 0.5fr";

function HeaderCell({ children }: { children: React.ReactNode }) {
  return <span style={{ fontSize: 11, fontWeight: 700, color: "#adb5bd", textTransform: "uppercase", letterSpacing: "0.3px" }}>{children}</span>;
}

function Cell({ children, muted }: { children: React.ReactNode; muted?: boolean }) {
  return <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: muted ? "#ced4da" : "#495057" }}>{children}</span>;
}

function TablePanel({ config, points }: { config: TMConfig; points: TMPoint[] }) {
  const isTI = config.id === "TI";
  const cols = isTI ? TI_COLS : TR_COLS;
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const pageCount = Math.max(1, Math.ceil(points.length / limit));
  const curPage = Math.min(page, pageCount);
  const pageRows = points.slice((curPage - 1) * limit, curPage * limit);
  // curPage clamps to pageCount, so a shrinking filter can't strand you on an empty page

  return (
    <Paper radius={12} style={{ boxShadow: "2px 4px 10px rgba(0,0,0,0.07)", padding: "16px 8px", fontFamily: FONT, fontSize: 12 }}>
      <div style={{ display: "grid", gridTemplateColumns: cols, gap: 12, padding: "0 12px 10px", borderBottom: "1px solid #e9ecef" }}>
        {isTI
          ? <><HeaderCell>Position</HeaderCell><HeaderCell>Employee</HeaderCell><HeaderCell>Performance (X)</HeaderCell><HeaderCell>Potency (Y)</HeaderCell><HeaderCell>Box Category</HeaderCell><HeaderCell>HAV status</HeaderCell><HeaderCell>Action</HeaderCell></>
          : <><HeaderCell>Employee</HeaderCell><HeaderCell>Position</HeaderCell><HeaderCell>Competency (X)%</HeaderCell><HeaderCell>Potency (Y)</HeaderCell><HeaderCell>Box Category</HeaderCell><HeaderCell>Readiness</HeaderCell><HeaderCell>Action</HeaderCell></>}
      </div>
      {points.length === 0 && (
        <div style={{ padding: "40px 0", textAlign: "center", color: "#adb5bd" }}>Tidak ada data.</div>
      )}
      {pageRows.map(p => {
        const box = boxByOrder(config, p.order);
        const boxColor = box ? darker(box.color) : "#adb5bd";
        return (
          <div key={p.employeeId} style={{ display: "grid", gridTemplateColumns: cols, gap: 12, alignItems: "center", padding: "12px", borderBottom: "1px solid #f0f0f0" }}>
            {isTI ? (
              <>
                <Cell>{p.positionTitle}</Cell>
                <span style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}><Avatar name={p.name} /><span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</span></span>
                <Cell muted={p.rawX == null}>{p.rawX ?? "{No data}"}</Cell>
                <Cell muted={p.rawY == null}>{p.rawY ?? "{No data}"}</Cell>
                <span>{box ? <OutlinePill color={boxColor}>{box.label}</OutlinePill> : <Cell muted>-</Cell>}</span>
                <span>{box?.tag === "talent" ? <OutlinePill color="#00875A">Talent</OutlinePill> : <OutlinePill color="#F28700">Non Talent</OutlinePill>}</span>
                <span style={{ color: ACCENT, cursor: "pointer", display: "inline-flex" }}><IconArrowUpRight size={16} /></span>
              </>
            ) : (
              <>
                <span style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}><Avatar name={p.name} /><span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</span></span>
                <Cell>{p.positionTitle}</Cell>
                <Cell muted={p.rawX == null}>{p.rawX != null ? `${p.rawX}%` : "{No data}"}</Cell>
                <Cell muted={p.rawY == null}>{p.rawY ?? "{No data}"}</Cell>
                <span>{box ? <OutlinePill color={boxColor}>{box.label}</OutlinePill> : <Cell muted>-</Cell>}</span>
                <Cell muted>-</Cell>
                <span style={{ color: ACCENT, cursor: "pointer", display: "inline-flex" }}><IconArrowUpRight size={16} /></span>
              </>
            )}
          </div>
        );
      })}

      {points.length > 0 && (
        <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 12px 4px", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#6c757d" }}>
            <Text size="sm" c="#6c757d">Limit :</Text>
            <Select
              data={["10", "25", "50"]}
              value={String(limit)}
              onChange={(v) => { if (v) { setLimit(Number(v)); setPage(1); } }}
              radius="xl"
              size="xs"
              w={72}
              allowDeselect={false}
              comboboxProps={{ withinPortal: true }}
            />
          </div>
          <Pagination value={curPage} onChange={setPage} total={pageCount} color="primary" radius="xl" size="sm" />
          <Text c="#adb5bd" ml="auto">Total Data : {points.length}</Text>
        </div>
      )}
    </Paper>
  );
}

function Panel({ config, points }: { config: TMConfig; points: TMPoint[] }) {
  const [selectedBox, setSelectedBox] = useState<number | null>(null);
  const tags = useMemo(() => donutTags(config, points), [config, points]);
  const tableRows = selectedBox != null ? points.filter(p => p.order === selectedBox) : points;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", gap: 16, alignItems: "stretch", flexWrap: "wrap" }}>
        {/* Grid card */}
        <div style={{ flex: "1 1 420px", background: "#fff", borderRadius: 12, boxShadow: "2px 4px 10px rgba(0,0,0,0.07)", padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 8 }}>
            {config.id === "TR" ? (
              <div>
                <div style={{ fontSize: 11, color: "#adb5bd", marginBottom: 4 }}>Job Target</div>
                <select style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #e9ecef", fontFamily: FONT, fontSize: 12, color: "#adb5bd", minWidth: 200 }} defaultValue="">
                  <option value="" disabled>Pilih job target</option>
                </select>
              </div>
            ) : (
              <button style={{ background: "none", border: "none", cursor: "pointer", color: ACCENT, fontFamily: FONT, fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
                <span>▽</span> Filter
              </button>
            )}
            <span style={{ color: "#adb5bd", cursor: "pointer" }}>⚙</span>
          </div>
          <div style={{ display: "flex", justifyContent: "center", paddingTop: 8 }}>
            <TMTRBox config={config} points={points} selectedBox={selectedBox} onBoxClick={setSelectedBox} />
          </div>
        </div>

        {/* Donut card */}
        <div style={{ flex: "1 1 320px", background: "#fff", borderRadius: 12, boxShadow: "2px 4px 10px rgba(0,0,0,0.07)", padding: 20, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 13, color: "#495057", textAlign: "center" }}>Distribusi {config.name}</div>
          <DonutChart data={tags} centerLabel={`${points.length} ${config.unit}`} />
          <div style={{ display: "flex", flexDirection: "column", gap: 4, width: "100%", maxWidth: 250 }}>
            {tags.map((t, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: FONT, fontSize: 12, color: "#495057" }}>
                <span style={{ width: 12, height: 12, borderRadius: "50%", background: resolveColor(`${t.color}.5`), flexShrink: 0 }} />
                <span style={{ flex: 1 }}>{t.name}</span>
                <span>({t.value})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <TablePanel config={config} points={tableRows} />
    </div>
  );
}

export default function TalentMappingPage() {
  const [tab, setTab] = useState<"TI" | "TR">("TI");
  const config = tab === "TI" ? TI_CONFIG : TR_CONFIG;
  const points = tab === "TI" ? TI_POINTS : TR_POINTS;

  return (
    <div style={{ fontFamily: FONT }}>
      <AppBreadcrumb items={[{ label: "Talent Mapping" }]} />
      <div style={{ padding: "12px 16px 40px" }}>
      <div style={{ display: "flex", gap: 24, borderBottom: "1px solid #e9ecef", marginBottom: 16 }}>
        {/* ponytail: Talent Readiness tab hidden for now — re-add ["TR", "Talent Readiness"] to show it */}
        {([["TI", "Human Asset Value"]] as const).map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)} style={{
            background: "none", border: "none", cursor: "pointer", fontFamily: FONT, fontSize: 13, fontWeight: 600,
            padding: "0 0 10px", color: tab === id ? ACCENT : "#adb5bd",
            borderBottom: tab === id ? `2px solid ${ACCENT}` : "2px solid transparent",
          }}>{label}</button>
        ))}
      </div>
      <Panel key={tab} config={config} points={points} />
      </div>
    </div>
  );
}
