"use client";
import { memo, useCallback, useMemo, useState } from "react";
import { ActionIcon, Button, Checkbox, NativeSelect, Table, Text, Textarea, TextInput, UnstyledButton } from "@mantine/core";
import { IconArrowsMove, IconChevronUp, IconPlus, IconSearch, IconTrash, IconX } from "@tabler/icons-react";
import { buildLibrary, byCategory, SCALE, type LibraryAspect } from "./aspects";
import { AspectPickerModal } from "./AspectPickerModal";
import { CreateCategoryModal } from "./CreateCategoryModal";
import { MoveToClusterModal } from "./MoveToClusterModal";

const ACCENT = "var(--mantine-color-primary-5)";
const CARD = "rounded-[8px] bg-white shadow-[2px_2px_15px_0px_rgba(0,0,0,0.1)]";

/** Label kolom taraf: ujungnya diberi keterangan, tengahnya angka saja. */
const levelLabel = (n: number) =>
  n === 1 ? "1 (Taraf Terendah)" : n === SCALE ? `${SCALE} (Taraf Tertinggi)` : String(n);

/** Isian satu aspek yang bisa diubah di halaman ini. */
type Draft = {
  /** undefined = belum disentuh, jadi yang tampil deskripsi asli aspeknya. */
  description?: string;
  /** undefined = belum disentuh, jadi yang tampil KB bawaan aspeknya. */
  keyBehaviours?: string[];
  keyBehaviourInput: string;
  /** Pemetaan taraf 1..5 → nama Key Behaviour. */
  levels: Record<number, string | null>;
};

// Satu objek dipakai bersama untuk aspek yang belum disentuh — kalau dibuat
// baru tiap render, memo pada baris jadi percuma karena prop-nya selalu beda.
const EMPTY_DRAFT: Draft = { keyBehaviourInput: "", levels: {} };

/**
 * Satu baris aspek. Di-memo karena tabel ini punya ratusan input: tanpa memo,
 * satu ketikan di satu sel merender ulang seluruh baris di kategori itu.
 */
const AspectRow = memo(function AspectRow({
  aspect,
  draft,
  checked,
  onToggle,
  onChange,
}: {
  aspect: LibraryAspect;
  draft: Draft;
  checked: boolean;
  onToggle: (label: string) => void;
  onChange: (label: string, next: Partial<Draft>) => void;
}) {
  // Sumber tunggal untuk dua tempat: daftar chip di kolom Key Behavior dan
  // pilihan di kolom taraf 1-5. KB yang dihapus langsung hilang dari keduanya.
  const options = draft.keyBehaviours ?? aspect.keyBehaviours;

  return (
    <Table.Tr>
      <Table.Td w={40}>
        <Checkbox checked={checked} onChange={() => onToggle(aspect.label)} size="xs" aria-label={`Pilih aspek ${aspect.label}`} />
      </Table.Td>
      <Table.Td miw={180}>
        <Text size="xs" c="#495057">
          {aspect.label}
        </Text>
      </Table.Td>
      <Table.Td w={300}>
        {/* Textarea autosize, bukan TextInput: deskripsi aspek panjang-panjang,
            dan di isian satu baris ujungnya terpotong tanpa tanda apa pun.
            Dengan autosize, kotaknya tumbuh mengikuti isi dan barisnya ikut
            meninggi. */}
        <Textarea
          variant="unstyled"
          size="xs"
          autosize
          minRows={1}
          placeholder="Description"
          value={draft.description ?? aspect.description}
          onChange={(e) => onChange(aspect.label, { description: e.currentTarget.value })}
          aria-label={`Deskripsi ${aspect.label}`}
        />
      </Table.Td>
      <Table.Td w={280}>
        {/* KB tampil sebagai daftar butir, bukan satu teks panjang: butirnya
            dipakai satu-satu di pemetaan taraf, jadi harus bisa dibaca dan
            dihapus satu-satu juga. */}
        <div className="flex flex-col gap-[6px]">
          {options.map((kb) => (
            <span key={kb} className="kb-chip">
              <span className="kb-chip-label">{kb}</span>
              <UnstyledButton
                onClick={() => onChange(aspect.label, { keyBehaviours: options.filter((x) => x !== kb) })}
                aria-label={`Hapus Key Behavior ${kb} dari ${aspect.label}`}
                className="kb-chip-remove"
              >
                <IconX size={13} stroke={1.8} />
              </UnstyledButton>
            </span>
          ))}
          {/* Satu isian untuk menambah, dipisah dengan "|" — sesuai rancangan,
              biar admin bisa menempel banyak KB sekaligus. */}
          <TextInput
            variant="unstyled"
            size="xs"
            placeholder="Enter to submit Key Behavior, will auto separate item with '|'"
            value={draft.keyBehaviourInput}
            onChange={(e) => onChange(aspect.label, { keyBehaviourInput: e.currentTarget.value })}
            onKeyDown={(e) => {
              if (e.key !== "Enter") return;
              e.preventDefault();
              const baru = e.currentTarget.value
                .split("|")
                .map((s) => s.trim())
                .filter((s) => s && !options.includes(s));
              if (baru.length === 0) return;
              onChange(aspect.label, { keyBehaviours: [...options, ...baru], keyBehaviourInput: "" });
            }}
            aria-label={`Tambah Key Behavior ${aspect.label}`}
          />
        </div>
      </Table.Td>
      <Table.Td w={130}>
        {/* Belum ada sumber datanya; ditandai apa adanya, bukan diisi tebakan. */}
        <Text size="xs" c="#6c757d">
          Under Review
        </Text>
      </Table.Td>
      {Array.from({ length: SCALE }, (_, i) => i + 1).map((level) => (
        <Table.Td key={level} w={150}>
          {/* NativeSelect, bukan Select: Select membangun combobox lengkap
              (portal, store, pencarian) per sel, dan di tab Hard ada ratusan
              sel — itu yang bikin perpindahan tab tersendat. Pilihannya cuma
              3-4 KB per aspek, jadi pencarian memang tidak diperlukan. */}
          <NativeSelect
            variant="unstyled"
            size="xs"
            data={[{ value: "", label: "select key behavior" }, ...options]}
            value={draft.levels[level] ?? ""}
            onChange={(e) => onChange(aspect.label, { levels: { ...draft.levels, [level]: e.currentTarget.value || null } })}
            aria-label={`Key Behavior taraf ${level} untuk ${aspect.label}`}
          />
        </Table.Td>
      ))}
      <Table.Td w={80}>
        <ActionIcon variant="subtle" color="red" aria-label={`Hapus aspek ${aspect.label}`}>
          <IconTrash size={16} stroke={1.6} />
        </ActionIcon>
      </Table.Td>
    </Table.Tr>
  );
});

/** Satu kategori aspek: bisa dilipat, punya pencarian sendiri. */
function CategoryCard({
  category,
  aspects,
  drafts,
  selected,
  forceOpen,
  onToggle,
  onChange,
}: {
  category: string;
  aspects: LibraryAspect[];
  drafts: Record<string, Draft>;
  selected: Set<string>;
  /** Dipaksa terbuka saat pencarian global aktif. */
  forceOpen: boolean;
  onToggle: (label: string) => void;
  onChange: (label: string, next: Partial<Draft>) => void;
}) {
  // Semua kategori tertutup dulu: daftarnya jadi terbaca sekali pandang, dan
  // tidak ada satu baris pun yang dipasang sebelum kategorinya benar-benar dibuka.
  const [manualOpen, setManualOpen] = useState(false);
  const open = forceOpen || manualOpen;
  const setOpen = setManualOpen;
  const [query, setQuery] = useState("");
  const [limit, setLimit] = useState("10");

  const matched = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? aspects.filter((a) => a.label.toLowerCase().includes(q)) : aspects;
  }, [aspects, query]);

  // Dibatasi seperti tabel lain di halaman admin. Selain soal jumlah yang
  // terbaca, ini juga yang menahan jumlah input yang dipasang sekaligus —
  // kategori Technical Core sendiri isinya 58 aspek × 8 input per baris.
  const rows = matched.slice(0, Number(limit));

  return (
    <div className={`${CARD} p-[16px]`}>
      <UnstyledButton onClick={() => setOpen((v) => !v)} aria-expanded={open} className="flex w-full items-center gap-[10px]">
        <IconChevronUp
          size={16}
          stroke={1.8}
          color="#495057"
          style={{ transform: open ? undefined : "rotate(180deg)", transition: "transform 0.15s" }}
        />
        <Text size="sm" fw={700} c="#212529">
          {category}
        </Text>
        <Text size="xs" c="#6c757d">
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
              w={240}
              rightSection={<IconSearch size={16} stroke={1.6} color="#adb5bd" />}
            />
            {/* Belum punya alur — halaman admin masih rangka. */}
            <Button variant="outline" leftSection={<IconPlus size={16} stroke={1.6} />}>
              Add Custom Aspect
            </Button>
          </div>

          <Table.ScrollContainer minWidth={1400} mt="md">
            <Table className="aspect-table" verticalSpacing="sm" horizontalSpacing="md" highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th />
                  <Table.Th>Aspect Name</Table.Th>
                  <Table.Th>Description</Table.Th>
                  <Table.Th>Key Behavior</Table.Th>
                  <Table.Th>Prediction Tools</Table.Th>
                  {Array.from({ length: SCALE }, (_, i) => i + 1).map((n) => (
                    <Table.Th key={n}>{levelLabel(n)}</Table.Th>
                  ))}
                  <Table.Th>Actions</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {rows.map((a) => (
                  <AspectRow
                    key={a.label}
                    aspect={a}
                    draft={drafts[a.label] ?? EMPTY_DRAFT}
                    checked={selected.has(a.label)}
                    onToggle={onToggle}
                    onChange={onChange}
                  />
                ))}
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>

          {rows.length === 0 && (
            <Text size="xs" c="#adb5bd" ta="center" py={24}>
              Tidak ada aspek yang cocok.
            </Text>
          )}

          <div className="mt-[16px] flex items-center gap-[16px] border-t border-[#e9ecef] pt-[12px]">
            <span className="flex items-center gap-[8px]">
              <Text size="xs" style={{ color: ACCENT }}>
                Limit :
              </Text>
              <NativeSelect
                value={limit}
                onChange={(e) => setLimit(e.currentTarget.value)}
                data={["10", "25", "50", "100"]}
                size="xs"
                w={90}
                aria-label={`Jumlah baris ${category}`}
              />
            </span>
            <Text size="xs" c="#6c757d">
              Total Data : {matched.length}
            </Text>
          </div>
        </>
      )}
    </div>
  );
}

export function AspectLibrary() {
  // Katalognya modul TS, bukan fetch — siap sejak render pertama.
  const aspects = useMemo(() => buildLibrary(), []);

  /** Pencarian lintas seluruh kategori. */
  const [search, setSearch] = useState("");

  /**
   * Kategori buatan pengguna. Sengaja hidup di state saja: katalognya hasil
   * seed yang tidak bisa ditulis dari browser, jadi kategori baru bertahan
   * selama sesi dan kembali ke semula begitu halaman dimuat ulang.
   */
  const [extraCategories, setExtraCategories] = useState<string[]>([]);

  /** Aspek yang dihapus lewat bar seleksi — sama sementaranya dengan yang lain. */
  const [removed, setRemoved] = useState<Set<string>>(new Set());
  /** Kategori baru untuk aspek yang dipindahkan; menimpa kategori asli katalog. */
  const [movedTo, setMovedTo] = useState<Record<string, string>>({});

  const visible = useMemo(
    () =>
      aspects
        .filter((a) => !removed.has(a.label))
        .map((a) => (movedTo[a.label] ? { ...a, category: movedTo[a.label] } : a)),
    [aspects, removed, movedTo],
  );

  const groups = useMemo(() => {
    const q = search.trim().toLowerCase();
    // Disaring sebelum dikelompokkan, jadi kategori yang tidak punya hasil
    // sama sekali tidak ikut dirender.
    const found = byCategory(q ? visible.filter((a) => a.label.toLowerCase().includes(q)) : visible);
    // Kategori baru belum punya aspek. Tetap ditampilkan (kecuali sedang
    // mencari, karena isinya pasti tidak cocok) supaya hasil "Create Category"
    // kelihatan dan bisa jadi tujuan pemindahan aspek nanti.
    if (q) return found;
    // Kategori buatan pengguna yang belum kebagian aspek tetap perlu muncul —
    // yang sudah terisi lewat "Move to Cluster" sudah dibawa `found`.
    const terisi = new Set(found.map(([c]) => c));
    return [...found, ...extraCategories.filter((c) => !terisi.has(c)).map((c) => [c, []] as [string, LibraryAspect[]])];
  }, [visible, search, extraCategories]);

  const [drafts, setDrafts] = useState<Record<string, Draft>>({});
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [importOpen, setImportOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [moveOpen, setMoveOpen] = useState(false);

  // Dibungkus useCallback supaya identitasnya tetap antar-render — kalau
  // berubah, memo pada AspectRow tidak menahan apa pun.
  const change = useCallback(
    (label: string, next: Partial<Draft>) =>
      setDrafts((prev) => ({ ...prev, [label]: { ...(prev[label] ?? EMPTY_DRAFT), ...next } })),
    [],
  );

  const toggle = useCallback(
    (label: string) =>
      setSelected((prev) => {
        const next = new Set(prev);
        if (next.has(label)) next.delete(label);
        else next.add(label);
        return next;
      }),
    [],
  );

  return (
    <div className="flex flex-col gap-[16px]">
      <div className="flex flex-wrap items-center justify-between gap-[12px]">
        <Text size="xs" c="#6c757d">
          Skala Nilai : {SCALE}
        </Text>
        <Button onClick={() => setImportOpen(true)}>Aspect Library</Button>
      </div>


      {/* Baris ini milik tab yang sedang aktif: pencariannya menyapu semua
          kategori di dalam tab itu, dan "Create Category Aspect" jelas membuat
          kategori untuk rumpun yang sedang dibuka — bukan untuk keduanya. */}
      <div className="flex flex-wrap items-center justify-between gap-[12px]">
        <TextInput
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
          placeholder="Cari aspek"
          w={300}
          rightSection={<IconSearch size={16} stroke={1.6} color="#adb5bd" />}
        />
        <Button
          variant="outline"
          leftSection={<IconPlus size={16} stroke={1.6} />}
          onClick={() => setCategoryOpen(true)}
        >
          Create Category Aspect
        </Button>
      </div>

      {groups.length === 0 ? (
        <div className={`${CARD} p-[16px]`}>
          <Text size="xs" c="#adb5bd">
            {search.trim()
              ? `Tidak ada aspek yang cocok dengan "${search.trim()}".`
              : "Belum ada aspek yang terpakai di Job mana pun."}
          </Text>
        </div>
      ) : (
        groups.map(([category, list]) => (
          <CategoryCard
            key={category}
            category={category}
            aspects={list}
            // Saat mencari, semua kategori yang punya hasil dibuka — kalau
            // tidak, hasil pencarian bisa bersembunyi di kartu yang terlipat.
            forceOpen={search.trim() !== ""}
            drafts={drafts}
            selected={selected}
            onToggle={toggle}
            onChange={change}
          />
        ))
      )}

      {/* Bar seleksi — muncul hanya saat ada aspek tercentang. Mengambang di
          bawah layar, bukan di dalam kartu kategori, karena seleksinya bisa
          menyeberang kategori dan barnya harus tetap terlihat sejauh apa pun
          tabel digulung. */}
      {selected.size > 0 && (
        <div className="selection-bar">
          <Text size="sm" c="#495057">
            {selected.size} selected
          </Text>
          <Button
            variant="subtle"
            color="gray"
            leftSection={<IconTrash size={16} stroke={1.6} />}
            onClick={() => {
              setRemoved((prev) => new Set([...prev, ...selected]));
              setSelected(new Set());
            }}
          >
            Delete
          </Button>
          <Button
            variant="subtle"
            leftSection={<IconArrowsMove size={16} stroke={1.6} />}
            onClick={() => setMoveOpen(true)}
          >
            Move to Cluster
          </Button>
        </div>
      )}

      <MoveToClusterModal
        opened={moveOpen}
        count={selected.size}
        clusters={groups.map(([category]) => category)}
        onClose={() => setMoveOpen(false)}
        onMove={(cluster) => {
          setMovedTo((prev) => {
            const next = { ...prev };
            selected.forEach((label) => (next[label] = cluster));
            return next;
          });
          setSelected(new Set());
          setMoveOpen(false);
        }}
      />

      <CreateCategoryModal
        opened={categoryOpen}
        existing={groups.map(([category]) => category)}
        onClose={() => setCategoryOpen(false)}
        onCreate={(names) => setExtraCategories((prev) => [...prev, ...names])}
      />

      <AspectPickerModal
        opened={importOpen}
        aspects={aspects}
        onClose={() => setImportOpen(false)}
        onAdd={(labels) => {
          // Belum ada tempat menyimpan hasil import; untuk sekarang aspek
          // terpilih ditandai tercentang di tabel supaya alurnya terlihat.
          setSelected((prev) => new Set([...prev, ...labels]));
          setImportOpen(false);
        }}
      />
    </div>
  );
}
