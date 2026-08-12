"use client";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ActionIcon, Badge, Paper, TextInput, Select, Pagination, Table, Text, UnstyledButton } from "@mantine/core";
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

/**
 * Sel header. Kolom yang bisa diurutkan dirender sebagai tombol di dalam
 * `<th>` — bukan `<th>` yang diberi onClick — supaya tetap terjangkau keyboard
 * dan terbaca sebagai kontrol oleh pembaca layar.
 */
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
  if (!sortKey) return <>{children}</>;
  return (
    <UnstyledButton
      onClick={() => onSort(sortKey)}
      style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "inherit", fontWeight: "inherit", color: "inherit" }}
    >
      {children}
      <SortIcon active={activeKey === sortKey} dir={dir} />
    </UnstyledButton>
  );
}

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

        <Table verticalSpacing="sm" horizontalSpacing="md" highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th w={60}>No.</Table.Th>
              <Table.Th>
                <HeaderCell sortKey="name" activeKey={sortKey} dir={sortDir} onSort={handleSort}>Employee Name</HeaderCell>
              </Table.Th>
              <Table.Th>
                <HeaderCell sortKey="email" activeKey={sortKey} dir={sortDir} onSort={handleSort}>Email</HeaderCell>
              </Table.Th>
              <Table.Th>
                <HeaderCell sortKey="position" activeKey={sortKey} dir={sortDir} onSort={handleSort}>Position</HeaderCell>
              </Table.Th>
              <Table.Th w={130}>
                <HeaderCell sortKey="joinDate" activeKey={sortKey} dir={sortDir} onSort={handleSort}>Join Date</HeaderCell>
              </Table.Th>
              <Table.Th w={80}>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {pageRows.map((emp, i) => (
              <Table.Tr key={emp.id} onClick={() => onSelect(emp)} style={{ cursor: "pointer" }}>
                <Table.Td c="#495057">{(curPage - 1) * limit + i + 1}</Table.Td>
                <Table.Td style={{ color: ACCENT, fontWeight: 600 }}>{emp.name}</Table.Td>
                <Table.Td c="#495057">{emp.email}</Table.Td>
                <Table.Td>
                  <Badge color="primary" variant="light" radius="xl" size="sm">
                    {emp.position}
                  </Badge>
                </Table.Td>
                <Table.Td c="#495057">{emp.joinDate}</Table.Td>
                <Table.Td>
                  <ActionIcon
                    variant="subtle"
                    color="primary"
                    onClick={(e) => { e.stopPropagation(); onSelect(emp); }}
                    aria-label={`Buka profil ${emp.name}`}
                  >
                    <IconArrowUpRight size={16} />
                  </ActionIcon>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>

        {pageRows.length === 0 && (
          <Text ta="center" py={40} c="#adb5bd">
            Tidak ada data.
          </Text>
        )}

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
