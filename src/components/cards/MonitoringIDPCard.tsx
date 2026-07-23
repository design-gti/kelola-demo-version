"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type IDPStatus = "In Progress" | "Expired" | "Need Review" | "Completed";

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
  "Completed":   { bg: "#e6f7ed", text: "#1a7a43", dot: "#2ea865" },
};

const ALL_FILTERS: { label: string; value: IDPStatus | "All" }[] = [
  { label: "All",         value: "All" },
  { label: "Need Review", value: "Need Review" },
  { label: "In Progress", value: "In Progress" },
  { label: "Completed",   value: "Completed" },
];

// Shape of the shared IDP source (public/data/idp-data.json) — same file the IDP
// module reads, so home Monitoring IDP mirrors it exactly and every row opens the
// correct person's detail (matched by employee id).
interface IdpProgram { statusLabel: string; period: string; aspectLabel: string }
interface IdpEmployee { id: number; name: string; role: string; idps: IdpProgram[] }

// "Jan 15 - Feb 28, 2025" / "Dec 5, 2024 - Mar 11, 2025" → ISO end date
function periodEnd(period: string): string {
  const end = (period || "").split(" - ")[1] ?? period;
  const d = new Date(end);
  return isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 10);
}
function statusOf(idps: IdpProgram[]): IDPStatus {
  const labels = idps.map(i => (i.statusLabel || "").toUpperCase());
  if (labels.includes("PENDING")) return "Need Review";
  if (labels.includes("IN PROGRESS")) return "In Progress";
  return "Completed";
}
function toEntries(employees: IdpEmployee[]): IDPEntry[] {
  return employees.map(e => {
    const active = e.idps.find(i => (i.statusLabel || "").toUpperCase() !== "DONE") ?? e.idps[0];
    return {
      id: e.id,
      name: e.name,
      initials: e.name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase(),
      position: e.role,
      status: statusOf(e.idps),
      dueDate: active ? periodEnd(active.period) : "",
      aspect: active?.aspectLabel ?? "",
    };
  });
}

function formatDate(dateStr: string) {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? "-" : d.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
}

function isOverdue(dateStr: string) {
  return !!dateStr && new Date(dateStr) < new Date();
}

export default function MonitoringIDPCard({ maxEntries }: { maxEntries?: number } = {}) {
  const router = useRouter();
  const [filter, setFilter] = useState<IDPStatus | "All">("All");
  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState<IDPEntry[]>([]);

  useEffect(() => {
    fetch("/data/idp-data.json")
      .then(r => r.json())
      .then((d: { employees: IdpEmployee[] }) => setEntries(toEntries(d.employees ?? [])))
      .catch(() => {});
  }, []);

  const SOURCE = maxEntries ? entries.slice(0, maxEntries) : entries;

  const filtered = SOURCE.filter(e => {
    const matchStatus = filter === "All" || e.status === filter;
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.position.toLowerCase().includes(search.toLowerCase()) ||
      e.aspect.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

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
          const count = f.value === "All" ? SOURCE.length : SOURCE.filter(e => e.status === f.value).length;
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
                router.push(`/idp?page=detail-idp-manager.html&id=${encodeURIComponent(e.id)}&name=${encodeURIComponent(e.name)}`);
              }}
              onMouseEnter={e2 => { (e2.currentTarget as HTMLDivElement).style.background = "#e9ecef"; (e2.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)"; }}
              onMouseLeave={e2 => { (e2.currentTarget as HTMLDivElement).style.background = "#f8f9fa"; (e2.currentTarget as HTMLDivElement).style.boxShadow = "none"; }}
            >
              {/* Employee */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#e7f5ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: "'Open Sans', sans-serif", fontWeight: 700, fontSize: 9, color: "#016699" }}>
                  {e.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()}
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
