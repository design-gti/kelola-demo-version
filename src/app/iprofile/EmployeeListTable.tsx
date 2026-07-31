"use client";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Paper, TextInput, Select, Pagination, Text } from "@mantine/core";
import { IconSearch, IconArrowUpRight, IconChevronUp, IconChevronDown, IconSelector } from "@tabler/icons-react";
import type { IProfileEmployee } from "@/data/iprofileEmployees";

const FONT = "'Open Sans', sans-serif";
const ACCENT = "#016699";

type SortKey = "name" | "email" | "position" | "joinDate";

function parseJoinDate(d: string) {
  const [day, month, year] = d.split("/").map(Number);
  return year * 10000 + month * 100 + day;
}

function SortIcon({ active, dir }: { active: boolean; dir: "asc" | "desc" }) {
  if (!active) return <IconSelector size={13} style={{ color: "#ced4da" }} />;
  return dir === "asc" ? <IconChevronUp size={13} style={{ color: ACCENT }} /> : <IconChevronDown size={13} style={{ color: ACCENT }} />;
}

function HeaderCell({
  children,
  sortKey,
  activeKey,
  dir,
  onSort,
}: {
  children: React.ReactNode;
  sortKey?: SortKey;
  activeKey: SortKey | null;
  dir: "asc" | "desc";
  onSort: (key: SortKey) => void;
}) {
  if (!sortKey) {
    return <span style={{ fontSize: 12, fontWeight: 700, color: "#495057" }}>{children}</span>;
  }
  return (
    <button
      onClick={() => onSort(sortKey)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 4,
        background: "none",
        border: "none",
        padding: 0,
        cursor: "pointer",
        fontFamily: FONT,
        fontSize: 12,
        fontWeight: 700,
        color: "#495057",
      }}
    >
      {children}
      <SortIcon active={activeKey === sortKey} dir={dir} />
    </button>
  );
}

const COLS = "0.5fr 2fr 2.2fr 2fr 1.2fr 0.8fr";

export default function EmployeeListTable({ employees, from }: { employees: IProfileEmployee[]; from?: string }) {
  const router = useRouter();
  const onSelect = (employee: IProfileEmployee) => {
    router.push(`/iprofile?id=${employee.id}${from ? `&from=${from}` : ""}`);
  };
  const [keyword, setKeyword] = useState("");
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const term = keyword.trim().toLowerCase();
    const rows = term
      ? employees.filter(
          (e) =>
            e.name.toLowerCase().includes(term) ||
            e.email.toLowerCase().includes(term) ||
            e.position.toLowerCase().includes(term)
        )
      : employees;

    if (!sortKey) return rows;
    const sorted = [...rows].sort((a, b) => {
      const av = sortKey === "joinDate" ? parseJoinDate(a.joinDate) : a[sortKey].toLowerCase();
      const bv = sortKey === "joinDate" ? parseJoinDate(b.joinDate) : b[sortKey].toLowerCase();
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [employees, keyword, sortKey, sortDir]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / limit));
  const curPage = Math.min(page, pageCount);
  const pageRows = filtered.slice((curPage - 1) * limit, curPage * limit);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, fontFamily: FONT }}>
      <div style={{ fontSize: 16, fontWeight: 700, color: "#495057" }}>Employee List</div>

      <Paper radius={12} style={{ boxShadow: "2px 4px 10px rgba(0,0,0,0.07)", padding: "16px 20px", fontFamily: FONT, fontSize: 13 }}>
        <TextInput
          value={keyword}
          onChange={(e) => { setKeyword(e.currentTarget.value); setPage(1); }}
          placeholder="Search something"
          radius="xl"
          size="xs"
          leftSection={<IconSearch size={14} />}
          style={{ maxWidth: 280, marginBottom: 16 }}
        />

        <div style={{ display: "grid", gridTemplateColumns: COLS, gap: 12, padding: "0 12px 10px", borderBottom: "1px solid #e9ecef" }}>
          <HeaderCell activeKey={sortKey} dir={sortDir} onSort={handleSort}>No.</HeaderCell>
          <HeaderCell sortKey="name" activeKey={sortKey} dir={sortDir} onSort={handleSort}>Employee Name</HeaderCell>
          <HeaderCell sortKey="email" activeKey={sortKey} dir={sortDir} onSort={handleSort}>Email</HeaderCell>
          <HeaderCell sortKey="position" activeKey={sortKey} dir={sortDir} onSort={handleSort}>Position</HeaderCell>
          <HeaderCell sortKey="joinDate" activeKey={sortKey} dir={sortDir} onSort={handleSort}>Join Date</HeaderCell>
          <HeaderCell activeKey={sortKey} dir={sortDir} onSort={handleSort}>Actions</HeaderCell>
        </div>

        {pageRows.length === 0 && (
          <div style={{ padding: "40px 0", textAlign: "center", color: "#adb5bd" }}>Tidak ada data.</div>
        )}

        {pageRows.map((emp, i) => (
          <div
            key={emp.id}
            onClick={() => onSelect(emp)}
            style={{
              display: "grid",
              gridTemplateColumns: COLS,
              gap: 12,
              alignItems: "center",
              padding: "12px",
              borderBottom: "1px solid #f0f0f0",
              cursor: "pointer",
            }}
          >
            <span style={{ color: "#495057" }}>{(curPage - 1) * limit + i + 1}</span>
            <span style={{ color: ACCENT, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{emp.name}</span>
            <span style={{ color: "#495057", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{emp.email}</span>
            <span style={{ overflow: "hidden" }}>
              <span
                style={{
                  display: "inline-block",
                  fontSize: 10,
                  fontWeight: 700,
                  color: ACCENT,
                  background: "#e7f5ff",
                  borderRadius: 999,
                  padding: "3px 10px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: "100%",
                }}
              >
                {emp.position}
              </span>
            </span>
            <span style={{ color: "#495057" }}>{emp.joinDate}</span>
            <span
              onClick={(e) => { e.stopPropagation(); onSelect(emp); }}
              style={{ color: ACCENT, cursor: "pointer", display: "inline-flex" }}
              aria-label={`Open profile for ${emp.name}`}
            >
              <IconArrowUpRight size={16} />
            </span>
          </div>
        ))}

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
          <Text c="#adb5bd" ml="auto">Total Data : {filtered.length}</Text>
        </div>
      </Paper>
    </div>
  );
}
