"use client";
import { useMemo, useState } from "react";
import { Badge, Button, Checkbox, ScrollArea, Select, TextInput } from "@mantine/core";
import { IconFilter, IconArrowsSort, IconSearch, IconUsers } from "@tabler/icons-react";
import { boxByOrder, resolveColor, TMConfig, TMPoint } from "@/data/talentMappingShared";

const FONT = "'Open Sans', sans-serif";

/** Jumlah minimal orang sebelum perbandingan punya arti. */
const MIN_COMPARE = 2;

type SortKey = "name" | "x-desc" | "y-desc";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "y-desc", label: "Potency tertinggi" },
  { value: "x-desc", label: "Performance tertinggi" },
  { value: "name", label: "Nama (A-Z)" },
];

/**
 * iProfile menomori orang `pNN`, TDP `EMPnnn`. Sama dengan toTdpId di
 * iprofile/imports/Frame45227.tsx — lihat generateEmployeeId di
 * tdp/data/tdpEmployees.ts.
 */
function toTdpId(pid: string): string {
  const angka = pid.replace(/[^0-9]/g, "");
  return angka ? `EMP${angka.padStart(3, "0")}` : pid;
}

/**
 * Panel kendali di kiri 9-box: menyaring, mengurutkan, dan memilih karyawan
 * untuk dibandingkan di TDP.
 *
 * Daftarnya sengaja memakai titik yang sudah tersaring, bukan seluruh
 * karyawan — panel dan 9-box di sebelahnya harus selalu bercerita hal yang
 * sama. Kalau sebuah kotak sedang dipilih, isinya menyempit ke kotak itu.
 */
export default function MappingSidePanel({
  config,
  points,
  jobTargets,
  jobTarget,
  onJobTargetChange,
  onOpenFilter,
  activeFilterCount,
}: {
  config: TMConfig;
  points: TMPoint[];
  /** Hanya dipakai mode TR; di TI kompetensi bukan sumbu mana pun. */
  jobTargets?: { id: string; title: string }[];
  jobTarget?: string | null;
  onJobTargetChange?: (v: string | null) => void;
  onOpenFilter: () => void;
  activeFilterCount: number;
}) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("y-desc");
  const [picked, setPicked] = useState<string[]>([]);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = points.filter(
      p => !q || p.name.toLowerCase().includes(q) || p.positionTitle.toLowerCase().includes(q),
    );
    const by: Record<SortKey, (a: TMPoint, b: TMPoint) => number> = {
      name: (a, b) => a.name.localeCompare(b.name),
      "x-desc": (a, b) => (b.rawX ?? -1) - (a.rawX ?? -1),
      "y-desc": (a, b) => (b.rawY ?? -1) - (a.rawY ?? -1),
    };
    return [...list].sort(by[sort]);
  }, [points, query, sort]);

  // Pilihan yang orangnya sudah tidak tampil (tersaring keluar) tidak ikut
  // terbawa ke TDP — yang dibandingkan harus yang benar-benar terlihat.
  const pickedShown = picked.filter(id => shown.some(p => p.employeeId === id));

  const toggle = (id: string) =>
    setPicked(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));

  /** Sematkan yang terpilih lalu buka perbandingan TDP. */
  const compare = () => {
    try {
      localStorage.setItem("shared_pinned", JSON.stringify(pickedShown.map(toTdpId)));
      // Saringan tabel yang tertinggal bisa menyembunyikan orang yang sudah
      // tersemat, jadi dibersihkan.
      localStorage.removeItem("tableVisibleEmployeeIds");
    } catch {
      // localStorage bisa ditolak (mode privat); perbandingan tetap dibuka.
    }
    window.location.href = "/tdp-view?tab=compare&from=talent-mapping";
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, height: "100%" }}>
      <div style={{ display: "flex", gap: 8 }}>
        <Button
          variant="default"
          size="xs"
          onClick={onOpenFilter}
          leftSection={<IconFilter size={14} />}
          rightSection={activeFilterCount > 0 ? <Badge size="xs" circle color="primary">{activeFilterCount}</Badge> : null}
          styles={{ root: { fontFamily: FONT, fontWeight: 600, flex: 1 } }}
        >
          Filter
        </Button>
        <Select
          size="xs"
          value={sort}
          onChange={v => setSort((v as SortKey) ?? "y-desc")}
          data={SORT_OPTIONS}
          leftSection={<IconArrowsSort size={14} />}
          allowDeselect={false}
          comboboxProps={{ withinPortal: true }}
          styles={{ root: { flex: 1 }, input: { fontFamily: FONT, fontSize: 11 } }}
        />
      </div>

      {jobTargets && onJobTargetChange && (
        <Select
          size="xs"
          label="Competency Score to"
          placeholder="Select job target"
          value={jobTarget ?? null}
          onChange={onJobTargetChange}
          data={jobTargets.map(t => ({ value: t.id, label: t.title }))}
          comboboxProps={{ withinPortal: true }}
          styles={{
            label: { fontFamily: FONT, fontSize: 10, color: "#adb5bd", marginBottom: 4 },
            input: { fontFamily: FONT, fontSize: 12 },
          }}
        />
      )}

      <TextInput
        size="xs"
        placeholder="Search"
        value={query}
        onChange={e => setQuery(e.currentTarget.value)}
        leftSection={<IconSearch size={14} />}
        styles={{ input: { fontFamily: FONT, fontSize: 12 } }}
      />

      <ScrollArea.Autosize mah={420} type="auto" style={{ flex: 1 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, paddingRight: 6 }}>
          {shown.map(p => {
            const box = p.order != null ? boxByOrder(config, p.order) : null;
            return (
              <label
                key={p.employeeId}
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "6px 8px", borderRadius: 8, cursor: "pointer",
                  border: "1px solid #e9ecef", background: picked.includes(p.employeeId) ? "#e6f3f8" : "#fff",
                }}
              >
                <Checkbox
                  size="xs"
                  checked={picked.includes(p.employeeId)}
                  onChange={() => toggle(p.employeeId)}
                  styles={{ input: { cursor: "pointer" } }}
                />
                {/* Nama dapat seluruh lebar; kategori box turun ke baris
                    sendiri — nama orang yang terpotong lebih merugikan
                    daripada daftar yang sedikit lebih tinggi. */}
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: "block", fontFamily: FONT, fontSize: 12, fontWeight: 600, color: "#495057", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {p.name}
                  </span>
                  <span style={{ display: "block", fontFamily: FONT, fontSize: 10, color: "#adb5bd", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {p.positionTitle}
                  </span>
                  {box && (
                    <span style={{ display: "inline-block", marginTop: 3, background: "#f1f3f5", color: resolveColor(box.color), fontFamily: FONT, fontSize: 9, fontWeight: 700, borderRadius: 999, padding: "1px 8px" }}>
                      {box.label}
                    </span>
                  )}
                </span>
              </label>
            );
          })}
          {shown.length === 0 && (
            <div style={{ fontFamily: FONT, fontSize: 11, color: "#adb5bd", padding: "12px 0", textAlign: "center" }}>
              No matching employee
            </div>
          )}
        </div>
      </ScrollArea.Autosize>

      {/* Membandingkan butuh minimal dua orang — satu orang tidak dibandingkan
          dengan apa pun. Tombolnya baru menyala setelah syarat itu terpenuhi. */}
      <Button
        variant="filled"
        color="primary"
        size="sm"
        disabled={pickedShown.length < MIN_COMPARE}
        onClick={compare}
        leftSection={<IconUsers size={16} />}
        styles={{ root: { fontFamily: FONT, fontWeight: 600 } }}
      >
        View Data &amp; Compare{pickedShown.length > 0 ? ` (${pickedShown.length})` : ""}
      </Button>
    </div>
  );
}
