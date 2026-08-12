"use client";
import { useMemo, useState } from "react";
import { Badge, Button, Checkbox, Group, Modal, Table, Tabs, Text, TextInput } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import type { LibraryAspect } from "./aspects";

/** "all" = semua kategori; nilai lain adalah nama kategori. */
type CategoryFilter = string;

/**
 * Memilih aspek dari library aspek aktif — aspek yang sudah terpakai di suatu
 * Job. Dipakai dua tempat: halaman Aspect (mengimpor ke kategori) dan Job
 * Profile (menambahkan ke aspek milik Job), karena keduanya memilih dari daftar
 * yang sama dengan kolom yang sama.
 *
 * Isinya baru dipasang saat modal terbuka (lihat pemanggilan `opened && ...`),
 * jadi pilihan yang belum di-Add tidak tertinggal di sesi berikutnya.
 */
export function AspectPickerModal({
  opened,
  aspects,
  title = "Aspect Library",
  addLabel = "Add Aspect",
  alreadyAdded = [],
  onClose,
  onAdd,
}: {
  opened: boolean;
  aspects: LibraryAspect[];
  /** Judul modal — beda konteks, beda kalimat. */
  title?: string;
  addLabel?: string;
  /** Aspek yang sudah ada di tujuan: tampil tercentang mati, tidak bisa dipilih lagi. */
  alreadyAdded?: string[];
  onClose: () => void;
  onAdd: (labels: string[]) => void;
}) {
  return (
    <Modal opened={opened} onClose={onClose} title={title} size={980} padding="lg">
      {opened && (
        <AspectPickerForm
          aspects={aspects}
          addLabel={addLabel}
          alreadyAdded={alreadyAdded}
          onClose={onClose}
          onAdd={onAdd}
        />
      )}
    </Modal>
  );
}

function AspectPickerForm({
  aspects,
  addLabel,
  alreadyAdded,
  onClose,
  onAdd,
}: {
  aspects: LibraryAspect[];
  addLabel: string;
  alreadyAdded: string[];
  onClose: () => void;
  onAdd: (labels: string[]) => void;
}) {
  const added = useMemo(() => new Set(alreadyAdded), [alreadyAdded]);
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  // Tab diturunkan dari data, bukan ditulis tetap — kategori baru ikut muncul
  // di sini tanpa perlu menyentuh komponen ini lagi.
  const categories = useMemo(() => [...new Set(aspects.map((a) => a.category))], [aspects]);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return aspects
      .filter((a) => (category === "all" ? true : a.category === category))
      .filter((a) => (q ? a.label.toLowerCase().includes(q) : true));
  }, [aspects, category, query]);

  const toggle = (label: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });

  // Centang-semua bekerja pada baris yang sedang tampil saja — kalau menyapu
  // seluruh library, satu klik bisa memilih 94 aspek yang tidak terlihat. Yang
  // sudah ada di tujuan dilewati: mencentangnya tidak menambah apa pun.
  const selectable = useMemo(() => rows.filter((a) => !added.has(a.label)), [rows, added]);
  const allShownSelected = selectable.length > 0 && selectable.every((a) => selected.has(a.label));
  const someShownSelected = selectable.some((a) => selected.has(a.label));
  const toggleAllShown = () =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (allShownSelected) selectable.forEach((a) => next.delete(a.label));
      else selectable.forEach((a) => next.add(a.label));
      return next;
    });

  return (
    <div className="flex flex-col gap-[16px]">
      <TextInput
        value={query}
        onChange={(e) => setQuery(e.currentTarget.value)}
        placeholder="Search"
        w={320}
        rightSection={<IconSearch size={16} stroke={1.6} color="#adb5bd" />}
      />

      <Tabs value={category} onChange={(v) => setCategory(v ?? "all")}>
        <Tabs.List>
          <Tabs.Tab value="all">All</Tabs.Tab>
          {categories.map((c) => (
            <Tabs.Tab key={c} value={c}>
              {c}
            </Tabs.Tab>
          ))}
        </Tabs.List>
      </Tabs>

      <Table.ScrollContainer minWidth={700} mah={420} type="native">
        <Table verticalSpacing="sm" horizontalSpacing="md" highlightOnHover stickyHeader>
          <Table.Thead>
            <Table.Tr>
              <Table.Th w={44}>
                <Checkbox
                  size="xs"
                  checked={allShownSelected}
                  indeterminate={someShownSelected && !allShownSelected}
                  onChange={toggleAllShown}
                  aria-label="Pilih semua aspek yang tampil"
                />
              </Table.Th>
              <Table.Th w={200}>Aspect</Table.Th>
              <Table.Th>Description</Table.Th>
              <Table.Th w={150}>Category</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {rows.map((a) => {
              const isAdded = added.has(a.label);
              return (
                <Table.Tr key={a.label}>
                  <Table.Td>
                    <Checkbox
                      size="xs"
                      checked={isAdded || selected.has(a.label)}
                      disabled={isAdded}
                      onChange={() => toggle(a.label)}
                      aria-label={isAdded ? `${a.label} sudah ditambahkan` : `Pilih ${a.label}`}
                    />
                  </Table.Td>
                  <Table.Td c="#495057">{a.label}</Table.Td>
                  <Table.Td>
                    <Text size="sm" c={a.description ? "#495057" : "#adb5bd"}>
                      {a.description || "-"}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Badge color="primary" variant="light" size="sm">
                      {a.category}
                    </Badge>
                  </Table.Td>
                </Table.Tr>
              );
            })}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>

      {rows.length === 0 && (
        <Text size="xs" c="#adb5bd" ta="center" py={24}>
          Tidak ada aspek yang cocok.
        </Text>
      )}

      <Group justify="space-between">
        <Text size="xs" c="#6c757d">
          {selected.size} aspek dipilih
        </Text>
        <Group gap={8}>
          <Button variant="outline" color="gray" onClick={onClose}>
            Cancel
          </Button>
          <Button disabled={selected.size === 0} onClick={() => onAdd([...selected])}>
            {addLabel}
          </Button>
        </Group>
      </Group>
    </div>
  );
}
