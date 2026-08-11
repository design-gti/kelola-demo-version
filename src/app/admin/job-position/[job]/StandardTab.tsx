"use client";
import { useMemo, useState } from "react";
import { ActionIcon, Button, NativeSelect, Switch, Table, Text, TextInput, Tooltip, UnstyledButton } from "@mantine/core";
import { IconChevronUp, IconInfoCircle, IconPlus, IconSearch, IconTrash } from "@tabler/icons-react";
import { ASPECT_CATALOG, STANDARDS_BY_JOB } from "@/data/model/aspects.generated";

const ACCENT = "var(--mantine-color-primary-5)";
const MAX_STANDARD = 5;
/** Standar awal tiap aspek sebelum diatur. */
const DEFAULT_STANDARD = 2;

type Aspect = { label: string; category: string; description: string };
type Setting = { standard: number; mandatory: boolean };

/** Baris pemilih standar 1..5 — kotak yang terpilih disorot. */
function StandardPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center gap-[4px]">
      {Array.from({ length: MAX_STANDARD }, (_, i) => i + 1).map((n) => {
        const selected = n === value;
        return (
          <UnstyledButton
            key={n}
            onClick={() => onChange(n)}
            aria-label={`Set standar ${n}`}
            aria-pressed={selected}
            style={{
              width: 26,
              height: 26,
              borderRadius: "var(--mantine-radius-sm)",
              border: `1px solid ${selected ? ACCENT : "#dee2e6"}`,
              background: selected ? "var(--mantine-color-primary-2)" : "transparent",
              color: selected ? ACCENT : "#495057",
              fontSize: 12,
              fontWeight: selected ? 700 : 400,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {n}
          </UnstyledButton>
        );
      })}
    </div>
  );
}

/** Satu kategori aspek: bisa dilipat, punya pencarian & batas baris sendiri. */
function CategorySection({
  category,
  aspects,
  settings,
  dirty,
  onChange,
  onCancel,
  onSave,
}: {
  category: string;
  aspects: Aspect[];
  settings: Record<string, Setting>;
  /** Ada perubahan yang belum disimpan di kategori ini. */
  dirty: boolean;
  onChange: (label: string, next: Partial<Setting>) => void;
  onCancel: () => void;
  onSave: () => void;
}) {
  const [open, setOpen] = useState(true);
  const [query, setQuery] = useState("");
  const [limit, setLimit] = useState("10");

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const matched = q ? aspects.filter((a) => a.label.toLowerCase().includes(q)) : aspects;
    return matched.slice(0, Number(limit));
  }, [aspects, query, limit]);

  return (
    <div className="rounded-[8px] bg-white shadow-[2px_2px_15px_0px_rgba(0,0,0,0.1)] p-[16px]">
      <UnstyledButton
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center gap-[10px]"
      >
        <IconChevronUp
          size={16}
          stroke={1.8}
          color="#495057"
          style={{ transform: open ? undefined : "rotate(180deg)", transition: "transform 0.15s" }}
        />
        <Text size="sm" fw={700} c="#212529">
          {category}
        </Text>
        <Text size="xs" style={{ color: ACCENT }}>
          {aspects.length} Aspect
        </Text>
      </UnstyledButton>

      {open && (
        <>
          <div className="mt-[16px] flex flex-wrap items-center justify-between gap-[12px]">
            <TextInput
              value={query}
              onChange={(e) => setQuery(e.currentTarget.value)}
              placeholder="Search something"
              radius="xl"
              w={240}
              rightSection={<IconSearch size={16} stroke={1.6} color="#adb5bd" />}
            />
            {/* Tabelnya diedit langsung di tempat, jadi tombolnya baru muncul
                begitu ada yang berubah — sebelum itu tidak ada yang bisa
                disimpan maupun dibatalkan. */}
            {dirty && (
              <div className="flex items-center gap-[8px]">
                <Button variant="outline" radius="xl" onClick={onCancel}>
                  Cancel
                </Button>
                <Button radius="xl" onClick={onSave}>
                  Save Changes
                </Button>
              </div>
            )}
          </div>

          <Table mt="md" verticalSpacing="sm" horizontalSpacing="md" highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Aspect Name</Table.Th>
                <Table.Th>Aspect Description</Table.Th>
                <Table.Th>Standard</Table.Th>
                <Table.Th>Key Behavior Showed</Table.Th>
                <Table.Th>Mandatory Aspect</Table.Th>
                <Table.Th w={90}>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {rows.map((aspect) => {
                const setting = settings[aspect.label] ?? { standard: DEFAULT_STANDARD, mandatory: false };
                return (
                  <Table.Tr key={aspect.label}>
                    <Table.Td>
                      <span className="flex items-center gap-[8px]">
                        <Tooltip label={aspect.description || "Penjelasan aspek belum diisi"} position="top" withArrow>
                          <IconInfoCircle size={16} stroke={1.6} color="#adb5bd" />
                        </Tooltip>
                        <Text size="sm" c="#495057">
                          {aspect.label}
                        </Text>
                      </span>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" c={aspect.description ? "#495057" : "#adb5bd"}>
                        {aspect.description || "-"}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <StandardPicker
                        value={setting.standard}
                        onChange={(standard) => onChange(aspect.label, { standard })}
                      />
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" c="var(--mantine-color-secondary-6)">
                        Under Review/Unset
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Switch
                        checked={setting.mandatory}
                        onChange={(e) => onChange(aspect.label, { mandatory: e.currentTarget.checked })}
                        label={setting.mandatory ? "Yes" : "No"}
                        size="sm"
                        aria-label={`Jadikan ${aspect.label} aspek wajib`}
                      />
                    </Table.Td>
                    <Table.Td>
                      <ActionIcon variant="subtle" color="red" aria-label={`Hapus aspek ${aspect.label}`}>
                        <IconTrash size={16} stroke={1.6} />
                      </ActionIcon>
                    </Table.Td>
                  </Table.Tr>
                );
              })}
            </Table.Tbody>
          </Table>

          <div className="mt-[16px] flex items-center gap-[16px] border-t border-[#e9ecef] pt-[12px]">
            <span className="flex items-center gap-[8px]">
              <Text size="xs" style={{ color: ACCENT }}>
                Limit :
              </Text>
              <NativeSelect
                value={limit}
                onChange={(e) => setLimit(e.currentTarget.value)}
                data={["10", "25", "50"]}
                size="xs"

                w={80}
                aria-label="Jumlah baris per halaman"
              />
            </span>
            <Text size="xs" c="#6c757d">
              Total Data : {aspects.length}
            </Text>
          </div>
        </>
      )}
    </div>
  );
}

/**
 * Tab Standard: mengatur standar aspek untuk satu Job — berapa skor minimum
 * tiap aspek, dan apakah aspek itu wajib.
 *
 * Di sinilah standar per Job diatur: aspek yang sama bisa punya standar berbeda
 * antar Job, jadi daftar dan nilainya diambil dari standar milik Job ini, bukan
 * dari katalog global.
 *
 * Perubahannya hidup di state komponen saja — hasil seed tidak bisa ditulis dari
 * browser, jadi nilai yang diubah kembali ke awal saat halaman dimuat ulang.
 */
export function StandardTab({ job }: { job: string }) {
  // Katalognya modul TS, bukan fetch — siap sejak render pertama.
  const standardsOfJob = useMemo(() => STANDARDS_BY_JOB[job] ?? {}, [job]);
  const aspects = useMemo<Aspect[]>(
    () =>
      ASPECT_CATALOG.filter((a) => a.label in standardsOfJob).map((a) => ({
        label: a.label,
        category: a.category,
        description: a.description,
      })),
    [standardsOfJob],
  );
  /** Nilai awal = standar Job hasil seed. */
  const initial = useMemo<Record<string, Setting>>(() => {
    const out: Record<string, Setting> = {};
    for (const a of aspects) out[a.label] = { standard: standardsOfJob[a.label], mandatory: false };
    return out;
  }, [aspects, standardsOfJob]);
  /** Nilai yang sedang diedit. */
  const [settings, setSettings] = useState<Record<string, Setting>>(initial);
  /** Nilai terakhir yang disimpan — pembanding untuk mendeteksi perubahan & bahan Cancel. */
  const [saved, setSaved] = useState<Record<string, Setting>>(initial);

  const byCategory = useMemo(() => {
    const map = new Map<string, Aspect[]>();
    for (const a of aspects) {
      const list = map.get(a.category);
      if (list) list.push(a);
      else map.set(a.category, [a]);
    }
    return [...map.entries()];
  }, [aspects]);

  const settingOf = (source: Record<string, Setting>, label: string): Setting =>
    source[label] ?? { standard: DEFAULT_STANDARD, mandatory: false };

  const update = (label: string, next: Partial<Setting>) =>
    setSettings((prev) => ({ ...prev, [label]: { ...settingOf(prev, label), ...next } }));

  const isDirty = (list: Aspect[]) =>
    list.some((a) => {
      const now = settingOf(settings, a.label);
      const before = settingOf(saved, a.label);
      return now.standard !== before.standard || now.mandatory !== before.mandatory;
    });

  /** Kembalikan aspek satu kategori ke nilai tersimpan; kategori lain tidak tersentuh. */
  const cancel = (list: Aspect[]) =>
    setSettings((prev) => {
      const next = { ...prev };
      for (const a of list) next[a.label] = settingOf(saved, a.label);
      return next;
    });

  const save = (list: Aspect[]) =>
    setSaved((prev) => {
      const next = { ...prev };
      for (const a of list) next[a.label] = settingOf(settings, a.label);
      return next;
    });

  if (aspects.length === 0) {
    return (
      <Text size="xs" c="#adb5bd">
        Belum ada aspek yang bisa diatur.
      </Text>
    );
  }

  return (
    <div className="flex flex-col gap-[16px]">
      <div className="flex justify-end">
        {/* Belum punya alur — halaman admin masih rangka. */}
        <Button variant="outline" radius="xl" leftSection={<IconPlus size={16} stroke={1.6} />}>
          Choose Aspect
        </Button>
      </div>

      {byCategory.map(([category, list]) => (
        <CategorySection
          key={category}
          category={category}
          aspects={list}
          settings={settings}
          dirty={isDirty(list)}
          onChange={update}
          onCancel={() => cancel(list)}
          onSave={() => save(list)}
        />
      ))}
    </div>
  );
}
