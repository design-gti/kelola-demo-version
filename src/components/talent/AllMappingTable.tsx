"use client";
import { useMemo, useState } from "react";
import { Avatar, Badge, Pagination, Paper, Select, Table, Text } from "@mantine/core";
import { defaultShade, boxByOrder, METRICS, type EmployeeMetrics, type MetricKey } from "@/data/talentMappingShared";
import type { MappingView } from "./mappingViews";

const FONT = "'Open Sans', sans-serif";
const ACCENT = "#016699";

/** Lebar kolom Employee yang menempel; kolomnya tidak boleh ikut bergeser. */
const STICKY_W = 220;

function initials(name: string) {
  return name.split(" ").slice(0, 2).map(w => w[0] || "").join("").toUpperCase();
}

/**
 * Metrik yang benar-benar dipakai sebagai sumbu oleh salah satu mapping.
 *
 * Kolom skornya diturunkan dari sini, bukan ditulis tetap: mapping buatan user
 * boleh memakai kombinasi metrik apa pun, dan menuliskan kolom "Competency"
 * dan "Performance" secara tetap akan menampilkan angka yang tidak dipakai
 * mapping mana pun — sekaligus menyembunyikan yang dipakai.
 */
function axisMetrics(views: MappingView[]): { key: MetricKey; label: string }[] {
  const used = new Set<MetricKey>();
  views.forEach(v => {
    used.add(v.cfg.sumbuXKey);
    used.add(v.cfg.sumbuYKey);
    if (v.cfg.useZ && v.cfg.sumbuZKey) used.add(v.cfg.sumbuZKey);
  });
  // Urutannya mengikuti katalog metrik, bukan urutan tab — supaya kolomnya
  // tidak berpindah-pindah tiap kali user menambah atau menghapus mapping.
  return METRICS.filter(m => used.has(m.key));
}

/**
 * Tabel tab All Box Mapping: satu baris per karyawan, satu kolom per mapping.
 *
 * Bukan gabungan baris dari tiap mapping (satu baris per orang per mapping):
 * empat mapping bawaan akan menghasilkan ratusan baris yang mengulang orang
 * yang sama dengan skor yang sama persis, dan yang berbeda cuma nama kotaknya.
 * Bentuk matriks ini menjawab pertanyaan yang sama dengan deretan grafik di
 * atasnya, tapi per orang: "ia jatuh di kotak mana di tiap mapping".
 */
export default function AllMappingTable({ views, metrics }: { views: MappingView[]; metrics: EmployeeMetrics[] }) {
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);

  const cols = useMemo(() => axisMetrics(views), [views]);

  const rows = useMemo(() => {
    // Peta employeeId -> nomor kotak, per mapping.
    const byTab = views.map(v => {
      const at = new Map<string, number | null>();
      v.points.forEach(p => at.set(p.employeeId, p.order));
      return { view: v, at };
    });

    /*
     * Barisnya hanya orang yang muncul di SETIDAKNYA satu mapping.
     *
     * Kalau seluruh karyawan dibariskan, orang yang tersaring keluar dari semua
     * mapping akan tampil sebagai baris penuh tanda "–" — baris yang tidak
     * menerangkan apa pun, dan tidak ada padanannya di grafik mana pun di atas.
     */
    return metrics
      .filter(m => byTab.some(t => t.at.has(m.employeeId)))
      .map(m => ({
        employeeId: m.employeeId,
        name: m.name,
        positionTitle: m.positionTitle,
        scores: cols.map(c => m[c.key]),
        boxes: byTab.map(t => {
          const order = t.at.get(m.employeeId);
          if (order === undefined) return null;           // tidak lolos saringan mapping ini
          const box = order == null ? null : boxByOrder(t.view.cfg, order);
          return box ? { label: box.label, color: defaultShade(box.color) } : null;
        }),
      }));
  }, [views, metrics, cols]);

  const pageCount = Math.max(1, Math.ceil(rows.length / limit));
  const curPage = Math.min(page, pageCount);
  const pageRows = rows.slice((curPage - 1) * limit, curPage * limit);

  return (
    <Paper radius={12} style={{ boxShadow: "2px 4px 10px rgba(0,0,0,0.07)", padding: "16px 8px", fontFamily: FONT, fontSize: 12 }}>
      {/* Kolom mapping tumbuh mengikuti jumlah tab, jadi tabelnya menggulir
          mendatar — dan kolom Employee menempel di kiri supaya angka di kanan
          tidak kehilangan pemiliknya, sama seperti tabel di Profile Data. */}
      <div className="overflow-x-auto">
        <Table verticalSpacing="sm" horizontalSpacing="md" highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th
                className="sticky left-0 z-[2]"
                style={{ background: "#fff", minWidth: STICKY_W, width: STICKY_W }}
              >
                Employee
              </Table.Th>
              <Table.Th style={{ minWidth: 160 }}>Position</Table.Th>
              {cols.map(c => (
                <Table.Th key={c.key} style={{ minWidth: 110, whiteSpace: "nowrap" }}>{c.label}</Table.Th>
              ))}
              {views.map(v => (
                <Table.Th key={v.id} style={{ minWidth: 150, whiteSpace: "nowrap" }}>{v.label}</Table.Th>
              ))}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {pageRows.map(r => (
              <Table.Tr key={r.employeeId} className="group">
                <Table.Td
                  className="sticky left-0 z-[1] group-hover:bg-[#f8f9fa]"
                  style={{ background: "#fff", minWidth: STICKY_W, width: STICKY_W }}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                    <Avatar radius="xl" size={28} src={`/avatars/employee/${r.employeeId}.png`} style={{ flexShrink: 0, background: "#e6f3f8" }}>
                      <span style={{ color: ACCENT, fontFamily: FONT, fontWeight: 700, fontSize: 10 }}>{initials(r.name)}</span>
                    </Avatar>
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.name}</span>
                  </span>
                </Table.Td>
                <Table.Td>
                  <span style={{ color: "#495057" }}>{r.positionTitle}</span>
                </Table.Td>
                {r.scores.map((v, i) => (
                  <Table.Td key={cols[i].key}>
                    {v ?? <span style={{ color: "#ced4da" }}>-</span>}
                  </Table.Td>
                ))}
                {r.boxes.map((b, i) => (
                  <Table.Td key={views[i].id}>
                    {b ? (
                      <Badge variant="outline" radius="xl" style={{ fontSize: 10, fontFamily: FONT, color: b.color, borderColor: b.color, background: "#fff", whiteSpace: "nowrap" }}>
                        {b.label}
                      </Badge>
                    ) : (
                      // Tidak lolos saringan mapping ini — jadi saringan tiap tab
                      // ikut terbaca di tabel, bukan cuma di grafiknya.
                      <span style={{ color: "#ced4da" }} title={`Tidak termasuk ${views[i].label}`}>–</span>
                    )}
                  </Table.Td>
                ))}
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </div>

      {rows.length > 0 && (
        <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 12px 4px", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#6c757d" }}>
            <Text size="sm" c="#6c757d">Limit :</Text>
            <Select
              data={["10", "25", "50"]}
              value={String(limit)}
              onChange={(v) => { if (v) { setLimit(Number(v)); setPage(1); } }}
              radius="xl" size="xs" w={72} allowDeselect={false}
              comboboxProps={{ withinPortal: true }}
            />
          </div>
          <Pagination value={curPage} onChange={setPage} total={pageCount} color="primary" radius="xl" size="sm" />
          <Text c="#adb5bd" ml="auto">Total Data : {rows.length}</Text>
        </div>
      )}
    </Paper>
  );
}
