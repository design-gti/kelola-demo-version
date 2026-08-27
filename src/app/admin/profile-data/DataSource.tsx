"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ActionIcon, Badge, Button, Modal, NativeSelect, NumberInput, Switch, Table, Text, TextInput } from "@mantine/core";
import { IconPlus, IconRefresh, IconPencil, IconTrash, IconSearch } from "@tabler/icons-react";
import {
  allProfiles,
  addExtension,
  removeExtension,
  toggleProfile,
  PROFILE_DATA_EVENT,
  EXTENSION_COLUMN_TYPES,
  type ExtensionColumn,
  type ProfileEntry,
} from "./profiles";

/**
 * Batas atas jumlah kolom bidang tambahan.
 *
 * Bukan angka keramat, tapi tabel detail menggulir mendatar per kolom 120px —
 * di atas seratus kolom tabelnya tidak lagi bisa ditelusuri, dan kolom kosong
 * sebanyak itu tidak menerangkan apa pun.
 */
const MAX_EXTENSION_COLUMNS = 100;

const ACCENT = "var(--mantine-color-primary-5)";
/** Kartu di halaman ini memakai gaya kartu menu utama: bayangan, tanpa garis tepi. */
const CARD = "rounded-[8px] bg-white shadow-[2px_2px_15px_0px_rgba(0,0,0,0.1)]";

interface Integration {
  appName: string;
  originApi: string;
  syncedAt: string | null;
}

/**
 * Satu kartu bidang data. Judulnya tautan ke halaman detail; sakelarnya berhenti
 * di sini (stopPropagation) supaya menyalakan/mematikan bidang tidak sekalian
 * membuka detailnya.
 */
function ProfileCard({ profile, onToggle, onRemove }: {
  profile: ProfileEntry;
  onToggle: () => void;
  onRemove?: () => void;
}) {
  return (
    <div className={`${CARD} px-[16px] py-[14px]`}>
      <div className="flex items-start justify-between gap-[12px]">
        <Link
          href={`/admin/profile-data/${profile.slug}`}
          className="font-bold text-[14px] leading-[normal] hover:underline"
          style={{ color: ACCENT }}
        >
          {profile.name}
        </Link>
        <div className="flex items-center gap-[4px]">
          {onRemove && (
            <ActionIcon variant="subtle" color="red" size="sm" onClick={onRemove} aria-label={`Hapus ${profile.name}`}>
              <IconTrash size={15} stroke={1.6} />
            </ActionIcon>
          )}
          <Switch
            checked={profile.enabled}
            onChange={onToggle}
            color="primary"
            size="sm"
            aria-label={`${profile.enabled ? "Matikan" : "Nyalakan"} ${profile.name}`}
          />
        </div>
      </div>
      <p className="mt-[8px] text-[12px] text-[#6c757d]">{profile.description}</p>
    </div>
  );
}

function AddDataModal({ onClose, onCreate }: {
  onClose: () => void;
  onCreate: (name: string, description: string, columns: ExtensionColumn[]) => void;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  /**
   * Daftar kolom ITU SENDIRI yang jadi sumber kebenaran; angka "Jumlah Kolom"
   * hanyalah panjangnya.
   *
   * Kalau angkanya disimpan terpisah lalu daftar disamakan lewat effect, ada
   * satu render di mana keduanya tidak cocok — dan menyetel state di dalam
   * effect juga ditolak lint di proyek ini. Menyesuaikan panjang daftar tepat
   * saat angkanya diubah membuat keduanya tidak pernah berbeda.
   */
  const [columns, setColumns] = useState<ExtensionColumn[]>([]);
  const [touched, setTouched] = useState(false);

  const resize = (v: number | string) => {
    const n = Math.max(0, Math.min(MAX_EXTENSION_COLUMNS, Math.trunc(Number(v) || 0)));
    // Isi kolom yang sudah diketik dipertahankan saat jumlahnya bertambah, dan
    // saat berkurang lalu ditambah lagi kolom yang kembali muncul memang kosong.
    setColumns((prev) => Array.from({ length: n }, (_, i) => prev[i] ?? { label: "", type: "Text" }));
  };

  const setColumn = (i: number, patch: Partial<ExtensionColumn>) =>
    setColumns((prev) => prev.map((c, j) => (j === i ? { ...c, ...patch } : c)));

  /* Semua wajib. Ditandai hanya setelah user menekan Create — memerahkan form
     yang belum sempat diisi menuduh orang atas kesalahan yang belum ia buat. */
  const missingName = touched && name.trim() === "";
  const missingDesc = touched && description.trim() === "";
  const missingColumn = (i: number) => touched && columns[i].label.trim() === "";

  const submit = () => {
    setTouched(true);
    if (name.trim() === "" || description.trim() === "") return;
    if (columns.some((c) => c.label.trim() === "")) return;
    onCreate(name, description, columns);
  };

  return (
    <Modal opened onClose={onClose} title="Create Data Extension" radius={12} centered>
      <div className="flex flex-col gap-[12px]">
        <TextInput
          label="Name"
          placeholder="Masukan name"
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
          error={missingName ? "Name belum diisi" : undefined}
          radius="xl"
          withAsterisk
        />
        <TextInput
          label="Description"
          placeholder="Masukan description"
          value={description}
          onChange={(e) => setDescription(e.currentTarget.value)}
          error={missingDesc ? "Description belum diisi" : undefined}
          radius="xl"
          withAsterisk
        />
        {/* Jumlah kolom menentukan bentuk tabel detailnya. Dibatasi bilangan
            bulat tak negatif: kolom pecahan atau minus tidak punya arti, dan
            NumberInput yang tak dibatasi akan meneruskannya apa adanya. */}
        <NumberInput
          label="Jumlah Kolom"
          value={columns.length}
          onChange={resize}
          min={0}
          max={MAX_EXTENSION_COLUMNS}
          allowDecimal={false}
          allowNegative={false}
          clampBehavior="strict"
          radius="xl"
          withAsterisk
        />

        {/* Satu baris per kolom, muncul mengikuti angka di atas. Nama dan tipe
            disandingkan dalam satu baris: keduanya menerangkan kolom yang sama,
            dan menumpuknya membuat daftar sepuluh kolom jadi dua puluh baris. */}
        {columns.map((c, i) => (
          <div key={i} className="flex items-start gap-[10px]">
            <TextInput
              label={`Kolom ${i + 1}`}
              placeholder={`Masukan kolom ${i + 1}`}
              value={c.label}
              onChange={(e) => setColumn(i, { label: e.currentTarget.value })}
              error={missingColumn(i) ? "Nama kolom belum diisi" : undefined}
              radius="xl"
              withAsterisk
              className="flex-1"
            />
            <NativeSelect
              label="Tipe Data"
              value={c.type}
              onChange={(e) => setColumn(i, { type: e.currentTarget.value as ExtensionColumn["type"] })}
              data={EXTENSION_COLUMN_TYPES}
              radius="xl"
              withAsterisk
              /* Cukup untuk "Number (Decimal)", pilihan terpanjang; di 130px
                 tulisannya terpotong di tengah kata. */
              w={168}
            />
          </div>
        ))}
        {/* Satu tombol saja, seperti rancangannya. Menutup modal tetap bisa
            lewat tombol silang di kepala dan lewat Escape, jadi jalan keluarnya
            tidak hilang. */}
        <Button color="primary" radius="xl" onClick={submit} className="mt-[4px] self-start">
          Create
        </Button>
      </div>
    </Modal>
  );
}

export function DataSource() {
  /**
   * Daftar bidang hidup di simpanan sesi (lihat profiles.ts), jadi dibaca lewat
   * langganan peristiwa: halaman detail dan modal bisa mengubahnya, dan daftar
   * di sini harus ikut tanpa perlu dimuat ulang.
   */
  const [profiles, setProfiles] = useState<ProfileEntry[]>(() => allProfiles());
  useEffect(() => {
    const read = () => setProfiles(allProfiles());
    window.addEventListener(PROFILE_DATA_EVENT, read);
    return () => window.removeEventListener(PROFILE_DATA_EVENT, read);
  }, []);

  const [query, setQuery] = useState("");
  const [addOpen, setAddOpen] = useState(false);

  const [integrations, setIntegrations] = useState<Integration[]>([
    { appName: "Talentlytica Database", originApi: "https://career.talentlytica.net", syncedAt: null },
  ]);
  const [editing, setEditing] = useState<number | null>(null);
  const [draft, setDraft] = useState<Integration | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return profiles;
    return profiles.filter(
      (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q),
    );
  }, [profiles, query]);

  const defaults = filtered.filter((p) => p.kind === "default");
  const extensions = filtered.filter((p) => p.kind === "extension");

  /** Cap waktu sinkron dibaca saat ditekan, bukan saat render — aman dari beda hidrasi. */
  const sync = (i: number) =>
    setIntegrations((prev) =>
      prev.map((row, idx) => (idx === i ? { ...row, syncedAt: new Date().toLocaleString("id-ID") } : row)),
    );

  return (
    <div className="flex flex-col gap-[16px]">
      {/* App Integration */}
      <section className={`${CARD} p-[16px]`}>
        <p className="mb-[12px] text-[13px] font-bold text-[#495057]">App Integration</p>
        <Table verticalSpacing="sm" horizontalSpacing="md" className="text-[12px]">
          <Table.Thead>
            <Table.Tr>
              {["App Name", "Origin API", "Status Sync", "Actions"].map((h) => (
                <Table.Th key={h} className="text-[12px]">{h}</Table.Th>
              ))}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {integrations.map((row, i) => (
              <Table.Tr key={row.originApi + i}>
                <Table.Td>{row.appName}</Table.Td>
                <Table.Td>
                  <span style={{ color: ACCENT }}>{row.originApi}</span>
                </Table.Td>
                <Table.Td>
                  {row.syncedAt ? (
                    <Badge color="green" variant="light" radius="sm" tt="uppercase" fz={9}>
                      Synced {row.syncedAt}
                    </Badge>
                  ) : (
                    <Badge color="gray" variant="filled" radius="sm" tt="uppercase" fz={9}>
                      Not sync yet
                    </Badge>
                  )}
                </Table.Td>
                <Table.Td>
                  <div className="flex items-center gap-[6px]">
                    <ActionIcon
                      variant="subtle" color="orange" aria-label="Ubah integrasi"
                      onClick={() => { setEditing(i); setDraft({ ...row }); }}
                    >
                      <IconPencil size={16} stroke={1.6} />
                    </ActionIcon>
                    <ActionIcon variant="subtle" color="primary" aria-label="Sinkronkan sekarang" onClick={() => sync(i)}>
                      <IconRefresh size={16} stroke={1.6} />
                    </ActionIcon>
                    <ActionIcon
                      variant="subtle" color="red" aria-label="Hapus integrasi"
                      onClick={() => setIntegrations((prev) => prev.filter((_, idx) => idx !== i))}
                    >
                      <IconTrash size={16} stroke={1.6} />
                    </ActionIcon>
                  </div>
                </Table.Td>
              </Table.Tr>
            ))}
            {integrations.length === 0 && (
              <Table.Tr>
                <Table.Td colSpan={4} className="text-center text-[12px] text-[#adb5bd]">
                  Belum ada aplikasi yang terhubung.
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </section>

      {/* Data Profile */}
      <section className={`${CARD} p-[16px]`}>
        <div className="mb-[16px] flex flex-wrap items-center justify-between gap-[12px]">
          <p className="text-[16px] font-bold" style={{ color: ACCENT }}>Data Profile</p>
          <TextInput
            value={query}
            onChange={(e) => setQuery(e.currentTarget.value)}
            placeholder="Search"
            radius="xl"
            w={260}
            rightSection={<IconSearch size={16} stroke={1.6} color="#adb5bd" />}
          />
        </div>

        <p className="mb-[10px] text-[12px] text-[#adb5bd]">Default Data</p>
        {defaults.length === 0 ? (
          <p className="py-[12px] text-[12px] text-[#adb5bd]">Tidak ada data bawaan yang cocok.</p>
        ) : (
          <div className="grid grid-cols-1 gap-[12px] sm:grid-cols-2 xl:grid-cols-4">
            {defaults.map((p) => (
              <ProfileCard key={p.slug} profile={p} onToggle={() => toggleProfile(p.slug)} />
            ))}
          </div>
        )}

        <p className="mb-[10px] mt-[20px] text-[12px] text-[#adb5bd]">Tambahan Profile Extension</p>
        <div className="grid grid-cols-1 gap-[12px] sm:grid-cols-2 xl:grid-cols-4">
          {extensions.map((p) => (
            <ProfileCard
              key={p.slug}
              profile={p}
              onToggle={() => toggleProfile(p.slug)}
              onRemove={() => removeExtension(p.slug)}
            />
          ))}
          {/* Kartu "Tambah Data" hanya muncul saat tidak sedang mencari: ia bukan
              hasil pencarian, jadi menampilkannya di antara hasil membuat
              seolah ada bidang bernama demikian. */}
          {query.trim() === "" && (
            <div className={`${CARD} flex items-center justify-center px-[16px] py-[24px]`}>
              <Button
                variant="outline" color="primary" radius="xl"
                leftSection={<IconPlus size={16} stroke={1.6} />}
                onClick={() => setAddOpen(true)}
              >
                Tambah Data
              </Button>
            </div>
          )}
          {extensions.length === 0 && query.trim() !== "" && (
            <p className="py-[12px] text-[12px] text-[#adb5bd]">Tidak ada data tambahan yang cocok.</p>
          )}
        </div>
      </section>

      {/* Dirender hanya saat terbuka, jadi tiap kali dibuka isinya segar. */}
      {addOpen && (
        <AddDataModal
          onClose={() => setAddOpen(false)}
          onCreate={(name, description, columns) => { addExtension(name, description, columns); setAddOpen(false); }}
        />
      )}

      {editing !== null && draft && (
        <Modal opened onClose={() => setEditing(null)} title="Ubah App Integration" radius={12} centered>
          <div className="flex flex-col gap-[12px]">
            <TextInput
              label="App Name" radius="xl" value={draft.appName}
              onChange={(e) => setDraft({ ...draft, appName: e.currentTarget.value })}
            />
            <TextInput
              label="Origin API" radius="xl" value={draft.originApi}
              onChange={(e) => setDraft({ ...draft, originApi: e.currentTarget.value })}
            />
            <Text size="xs" c="#adb5bd">
              Perubahan berlaku selama sesi ini; tidak ada backend yang menyimpannya.
            </Text>
            <div className="flex justify-end gap-[8px]">
              <Button variant="outline" color="primary" radius="xl" onClick={() => setEditing(null)}>Cancel</Button>
              <Button
                color="primary" radius="xl"
                onClick={() => {
                  setIntegrations((prev) => prev.map((row, idx) => (idx === editing ? draft : row)));
                  setEditing(null);
                }}
              >
                Save
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
