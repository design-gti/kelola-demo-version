"use client";
import { useMemo, useState } from "react";
import { Badge, Button, Checkbox, ScrollArea, Select, TextInput } from "@mantine/core";
import { IconFilter, IconArrowsSort, IconSearch, IconUsers } from "@tabler/icons-react";
import { boxByOrder, defaultShade, TMConfig, TMPoint } from "@/data/talentMappingShared";
import EmployeeIdentity from "./EmployeeIdentity";

const FONT = "'Open Sans', sans-serif";

/** Jumlah minimal orang sebelum perbandingan punya arti. */
const MIN_COMPARE = 2;

/**
 * Pilihan urutan mengikuti SUMBU yang sedang dipakai box mapping.
 *
 * Dulu isinya ditulis tetap ("Potency tertinggi", "Performance tertinggi"),
 * padahal sumbunya bisa diganti di halaman Setting — daftarnya lalu menawarkan
 * pengurutan atas metrik yang tidak ada di grafik, dan menyembunyikan yang ada.
 * Sumbu Z hanya ikut kalau memang dinyalakan.
 */
type SortAxis = "x" | "y" | "z";
type SortKey = "name" | `${SortAxis}-desc` | `${SortAxis}-asc`;

const AXIS_VALUE: Record<SortAxis, (p: TMPoint) => number | null> = {
  x: p => p.rawX,
  y: p => p.rawY,
  z: p => p.rawZ ?? null,
};

function sortOptions(config: TMConfig): { value: SortKey; label: string }[] {
  const axes: { axis: SortAxis; label: string }[] = [
    { axis: "x", label: config.sumbuX },
    { axis: "y", label: config.sumbuY },
  ];
  if (config.useZ && config.sumbuZ) axes.push({ axis: "z", label: config.sumbuZ });
  return [
    ...axes.flatMap(a => [
      { value: `${a.axis}-desc` as SortKey, label: `${a.label} tertinggi` },
      { value: `${a.axis}-asc` as SortKey, label: `${a.label} terendah` },
    ]),
    { value: "name" as SortKey, label: "Nama (A-Z)" },
  ];
}

/**
 * Pembanding untuk satu pilihan urutan.
 *
 * Yang belum punya nilai selalu di BELAKANG, di kedua arah. Kalau null
 * diperlakukan sebagai angka terkecil, "skor terendah" akan diisi orang yang
 * skornya belum ada sama sekali — bukan orang yang skornya rendah.
 */
function comparatorFor(sort: SortKey): (a: TMPoint, b: TMPoint) => number {
  if (sort === "name") return (a, b) => a.name.localeCompare(b.name);
  const [axis, dir] = sort.split("-") as [SortAxis, "asc" | "desc"];
  const read = AXIS_VALUE[axis];
  return (a, b) => {
    const va = read(a);
    const vb = read(b);
    if (va == null && vb == null) return 0;
    if (va == null) return 1;
    if (vb == null) return -1;
    return dir === "desc" ? vb - va : va - vb;
  };
}

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
  const options = useMemo(() => sortOptions(config), [config]);
  /**
   * Pilihan yang tersimpan bisa menunjuk sumbu yang sudah tidak ada — misal
   * sumbu Z dimatikan setelah "Potency terendah" dipilih. Diperiksa saat dipakai,
   * bukan dibetulkan lewat effect, supaya tidak ada render tambahan.
   */
  const activeSort = options.some(o => o.value === sort) ? sort : options[0].value;
  const [picked, setPicked] = useState<string[]>([]);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = points.filter(
      p => !q || p.name.toLowerCase().includes(q) || p.positionTitle.toLowerCase().includes(q),
    );
    return [...list].sort(comparatorFor(activeSort));
  }, [points, query, activeSort]);

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
          value={activeSort}
          onChange={v => setSort((v as SortKey) ?? options[0].value)}
          data={options}
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
                {/* Tag kategori kotak duduk di bawah jabatan, bukan di sisi kanan
                    baris: panel ini hanya 300px dan sudah berisi checkbox, foto,
                    nama, serta jabatan — tag seperti "Emerging Star" di kanan
                    terpotong 24px oleh tepi area gulir. Di bawah jabatan ia dapat
                    seluruh lebar yang tersisa.

                    Warna tulisannya memakai shade 5, bukan warna box apa adanya:
                    warna box sengaja pucat supaya avatar di atasnya terbaca, dan
                    warna pucat itu di atas latar chip yang juga abu muda praktis
                    tak terbaca. Keluarga warnanya tetap sama, jadi kaitan ke
                    kotaknya tidak hilang. */}
                <EmployeeIdentity
                  employeeId={p.employeeId}
                  name={p.name}
                  position={p.positionTitle}
                  meta={box ? (
                    <span style={{ display: "inline-block", marginTop: 3, maxWidth: "100%", background: "#f1f3f5", color: defaultShade(box.color), fontFamily: FONT, fontSize: 9, fontWeight: 700, borderRadius: 999, padding: "2px 8px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {box.label}
                    </span>
                  ) : undefined}
                />
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
