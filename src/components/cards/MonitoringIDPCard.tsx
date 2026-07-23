"use client";
import { useState } from "react";
import { Paper, SegmentedControl, TextInput, Avatar, Badge, Text } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";

type IDPStatus = "In Progress" | "Expired" | "Need Review";

interface IDPEntry {
  id: number;
  name: string;
  initials: string;
  position: string;
  status: IDPStatus;
  dueDate: string;
  aspect: string;
}

const STATUS_CONFIG: Record<IDPStatus, { bg: string; text: string; dot: string }> = {
  "In Progress": { bg: "#e7f5ff", text: "#0c6192", dot: "#68b1ff" },
  "Expired":     { bg: "#fff0f0", text: "#c0392b", dot: "#e74c3c" },
  "Need Review": { bg: "#fff8e6", text: "#856404", dot: "#fd9f28" },
};

const ALL_FILTERS: { label: string; value: IDPStatus | "All" }[] = [
  { label: "All",         value: "All" },
  { label: "Need Review", value: "Need Review" },
  { label: "In Progress", value: "In Progress" },
  { label: "Expired",     value: "Expired" },
];

const IDP_DATA: IDPEntry[] = [
  { id:1,  name:"Budi Santoso",     initials:"BS", position:"Manajer Operasional",           status:"In Progress", dueDate:"2026-07-15", aspect:"Kreativitas" },
  { id:2,  name:"Siti Rahayu",      initials:"SR", position:"Kepala Divisi Keuangan",        status:"In Progress", dueDate:"2026-08-10", aspect:"Leadership" },
  { id:3,  name:"Dewi Kusuma",      initials:"DK", position:"HR Business Partner",           status:"Need Review", dueDate:"2026-06-30", aspect:"Kemampuan Membaca Akhlak" },
  { id:4,  name:"Rizky Pratama",    initials:"RP", position:"Manajer Pemasaran",             status:"Need Review", dueDate:"2026-07-05", aspect:"Logika berpikir" },
  { id:5,  name:"Nurul Hidayah",    initials:"NH", position:"Analis Data Senior",            status:"In Progress", dueDate:"2026-09-01", aspect:"Analytical Thinking" },
  { id:6,  name:"Maya Sari",        initials:"MS", position:"Kepala Legal",                  status:"Need Review", dueDate:"2026-07-20", aspect:"Kemampuan Membaca Akhlak" },
  { id:7,  name:"Intan Permata",    initials:"IP", position:"Senior Finance Analyst",        status:"In Progress", dueDate:"2026-08-25", aspect:"Analytical Thinking" },
  { id:8,  name:"Fajar Nugroho",    initials:"FN", position:"IT Security Lead",              status:"Expired",     dueDate:"2026-05-15", aspect:"Logika berpikir" },
  { id:9,  name:"Eko Prasetyo",     initials:"EP", position:"VP Operasional",               status:"Expired",     dueDate:"2026-04-30", aspect:"Leadership" },
  { id:10, name:"Lina Marlina",     initials:"LM", position:"Senior Marketing Manager",      status:"Need Review", dueDate:"2026-06-28", aspect:"Problem Solving" },
  { id:11, name:"Putri Andini",     initials:"PA", position:"Manajer Kepatuhan",             status:"Need Review", dueDate:"2026-07-10", aspect:"Kreativitas" },
  { id:12, name:"Agus Salim",       initials:"AS", position:"Kepala Riset & Inovasi",        status:"In Progress", dueDate:"2026-09-15", aspect:"Analytical Thinking" },
  { id:13, name:"Bambang Sutrisno", initials:"BS", position:"Direktur Teknologi",            status:"Expired",     dueDate:"2026-05-31", aspect:"Problem Solving" },
  { id:14, name:"Sri Mulyani",      initials:"SM", position:"Kepala Strategi Korporat",      status:"In Progress", dueDate:"2026-10-01", aspect:"Leadership" },
];

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
}

function isOverdue(dateStr: string) {
  return new Date(dateStr) < new Date();
}

export default function MonitoringIDPCard({ maxEntries }: { maxEntries?: number } = {}) {
  const [filter, setFilter] = useState<IDPStatus | "All">("All");
  const [search, setSearch] = useState("");

  const SOURCE = maxEntries ? IDP_DATA.slice(0, maxEntries) : IDP_DATA;

  const filtered = SOURCE.filter(e => {
    const matchStatus = filter === "All" || e.status === filter;
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.position.toLowerCase().includes(search.toLowerCase()) ||
      e.aspect.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const counts = {
    "In Progress": SOURCE.filter(e => e.status === "In Progress").length,
    "Expired":     SOURCE.filter(e => e.status === "Expired").length,
    "Need Review": SOURCE.filter(e => e.status === "Need Review").length,
  };

  return (
    <Paper radius={12} p={16} w="100%" style={{ boxShadow: "2px 4px 10px rgba(0,0,0,0.07)", display: "flex", flexDirection: "column", gap: 12 }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <Text fw={700} size="sm" c="#495057" style={{ fontFamily: "'Open Sans', sans-serif" }}>
          Monitoring IDP
        </Text>
        <Text size="xs" c="#adb5bd" style={{ fontFamily: "'Open Sans', sans-serif" }}>
          {SOURCE.length} total IDP
        </Text>
      </div>

      {/* Filter tabs with counts */}
      <SegmentedControl
        fullWidth
        value={filter}
        onChange={(v) => setFilter(v as IDPStatus | "All")}
        color="#fff"
        size="xs"
        data={ALL_FILTERS.map(f => {
          const count = f.value === "All" ? SOURCE.length : counts[f.value as IDPStatus];
          return {
            value: f.value,
            label: (
              <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 10, whiteSpace: "nowrap", color: filter === f.value ? "#016699" : "#6c757d", fontWeight: filter === f.value ? 700 : 400 }}>
                {f.label} <span style={{ fontSize: 9, opacity: 0.8 }}>({count})</span>
              </span>
            ),
          };
        })}
      />

      {/* Search */}
      <TextInput
        value={search}
        onChange={e => setSearch(e.currentTarget.value)}
        placeholder="Search employee or aspect..."
        radius="xl"
        size="xs"
        leftSection={<IconSearch size={12} />}
      />

      {/* Table header */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 100px 90px", gap: 8, padding: "0 4px" }}>
        {["Employee", "Status", "Due Date"].map(h => (
          <span key={h} style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 9, fontWeight: 700, color: "#adb5bd", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</span>
        ))}
      </div>

      {/* Employee rows */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 280, overflowY: "auto" }}>
        {filtered.length === 0 && (
          <div style={{ padding: "20px 0", textAlign: "center", fontFamily: "'Open Sans', sans-serif", fontSize: 11, color: "#adb5bd" }}>No data found</div>
        )}
        {filtered.map(e => {
          const cfg = STATUS_CONFIG[e.status];
          const overdue = e.status !== "Expired" && isOverdue(e.dueDate);
          return (
            <div
              key={e.id}
              className="group/row"
              style={{ display: "grid", gridTemplateColumns: "1fr 100px 90px", gap: 8, alignItems: "center", padding: "8px 8px", borderRadius: 8, background: "#f8f9fa", cursor: "pointer", transition: "background 0.15s, box-shadow 0.15s" }}
              onClick={() => {
                const page = e.status === "Need Review" ? "detail-review-idp.html" : "detail-idp-manager.html";
                window.location.href = `/idp?page=${page}&id=${encodeURIComponent(e.id)}&name=${encodeURIComponent(e.name)}`;
              }}
              onMouseEnter={e2 => { (e2.currentTarget as HTMLDivElement).style.background = "#e9ecef"; (e2.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)"; }}
              onMouseLeave={e2 => { (e2.currentTarget as HTMLDivElement).style.background = "#f8f9fa"; (e2.currentTarget as HTMLDivElement).style.boxShadow = "none"; }}
            >
              {/* Employee */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                <Avatar size={28} radius="xl" style={{ flexShrink: 0, background: "#e7f5ff" }}>
                  <span style={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 700, fontSize: 9, color: "#016699" }}>{e.initials}</span>
                </Avatar>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 700, fontSize: 10, color: "#212529", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{e.name}</div>
                  <div style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 9, color: "#6c757d", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{e.aspect}</div>
                </div>
              </div>

              {/* Status badge */}
              <Badge
                variant="light"
                radius="xl"
                leftSection={<div style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.dot }} />}
                style={{ background: cfg.bg, color: cfg.text, textTransform: "none", fontWeight: 600, fontSize: 9, width: "fit-content", fontFamily: "'Open Sans', sans-serif" }}
              >
                {e.status}
              </Badge>

              {/* Due date */}
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 9, fontWeight: 600, color: overdue ? "#c0392b" : "#495057" }}>
                  {formatDate(e.dueDate)}
                </span>
                {overdue && (
                  <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 8, color: "#c0392b" }}>Overdue</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Paper>
  );
}
