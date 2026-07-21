"use client";
import { useState } from "react";

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
    <div className="bg-white rounded-[12px] p-[16px] w-full flex flex-col gap-[12px]" style={{ boxShadow: "2px 4px 10px rgba(0,0,0,0.07)" }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <p style={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 700, fontSize: 12, color: "#495057" }}>
          Monitoring IDP
        </p>
        <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 10, color: "#adb5bd" }}>
          {SOURCE.length} total IDP
        </span>
      </div>

      {/* Filter tabs with counts */}
      <div style={{ display: "flex", gap: 4, background: "#f8f9fa", borderRadius: 8, padding: 4 }}>
        {ALL_FILTERS.map(f => {
          const count = f.value === "All" ? SOURCE.length : counts[f.value as IDPStatus];
          return (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              style={{ flex: 1, border: "none", borderRadius: 6, padding: "5px 4px", fontFamily: "'Open Sans', sans-serif", fontSize: 10, fontWeight: filter === f.value ? 700 : 400, color: filter === f.value ? "#016699" : "#6c757d", background: filter === f.value ? "#fff" : "transparent", cursor: "pointer", boxShadow: filter === f.value ? "0 1px 3px rgba(0,0,0,0.08)" : "none", transition: "all 0.15s", whiteSpace: "nowrap" }}
            >
              {f.label} <span style={{ fontSize: 9, opacity: 0.8 }}>({count})</span>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div style={{ position: "relative" }}>
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#adb5bd" }}>
          <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search employee or aspect..."
          style={{ width: "100%", paddingLeft: 28, paddingRight: 10, height: 30, borderRadius: 9999, border: "1px solid #dee2e6", fontFamily: "'Open Sans', sans-serif", fontSize: 10, color: "#495057", outline: "none", boxSizing: "border-box" }}
        />
      </div>

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
                window.location.href = `/idp/${page}?id=${encodeURIComponent(e.id)}&name=${encodeURIComponent(e.name)}`;
              }}
              onMouseEnter={e2 => { (e2.currentTarget as HTMLDivElement).style.background = "#e9ecef"; (e2.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)"; }}
              onMouseLeave={e2 => { (e2.currentTarget as HTMLDivElement).style.background = "#f8f9fa"; (e2.currentTarget as HTMLDivElement).style.boxShadow = "none"; }}
            >
              {/* Employee */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#e7f5ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: "'Open Sans', sans-serif", fontWeight: 700, fontSize: 9, color: "#016699" }}>
                  {e.initials}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 700, fontSize: 10, color: "#212529", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{e.name}</div>
                  <div style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 9, color: "#6c757d", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{e.aspect}</div>
                </div>
              </div>

              {/* Status badge */}
              <div style={{ display: "inline-flex", alignItems: "center", gap: 4, background: cfg.bg, borderRadius: 20, padding: "3px 8px", width: "fit-content" }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.dot, flexShrink: 0 }} />
                <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 9, fontWeight: 600, color: cfg.text, whiteSpace: "nowrap" }}>{e.status}</span>
              </div>

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
    </div>
  );
}
