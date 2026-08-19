"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ActionIcon, Button, Checkbox, Menu, Modal, NativeSelect, Pagination, SegmentedControl, Table, Tabs, Text, TextInput } from "@mantine/core";
import {
  IconArrowsMaximize,
  IconArrowsMinimize,
  IconChevronLeft,
  IconColumns3,
  IconFileSpreadsheet,
  IconHistory,
  IconSearch,
  IconUpload,
} from "@tabler/icons-react";
import { fieldsOf, findProfile, hasKbLayer, historyOf, kbFieldsOf, rowsFor } from "../profiles";

const ACCENT = "var(--mantine-color-primary-5)";
const CARD = "rounded-[8px] bg-white shadow-[2px_2px_15px_0px_rgba(0,0,0,0.1)]";

/** Lebar kolom nilai; disamakan supaya angka satu digit tetap sejajar. */
const VALUE_COL = 120;

/**
 * Kolom Employee menempel di kiri saat tabel digulir mendatar.
 *
 * Di lapisan Key Behaviour ada 195 kolom nilai; begitu digulir beberapa layar,
 * angka-angkanya kehilangan pemiliknya dan tabel jadi tidak bisa dibaca. Sel
 * yang menempel WAJIB punya latar tidak tembus pandang — kalau transparan,
 * kolom yang lewat di belakangnya akan tembus menimpa tulisannya.
 *
 * Sorot baris dikelola sendiri lewat group-hover, bukan highlightOnHover milik
 * Mantine: yang itu mewarnai <tr>, sedangkan sel yang menempel punya latarnya
 * sendiri dan tidak ikut berubah — satu sel akan tetap putih sementara sisa
 * barisnya menggelap.
 */
const STICKY_BG = "#fff";
const STICKY_COL = "sticky left-0 z-[2] border-r border-[#f1f3f5]";

export function ProfileDetail({ slug }: { slug: string }) {
  const profile = useMemo(() => findProfile(slug), [slug]);
  const kbLayer = useMemo(() => hasKbLayer(slug), [slug]);

  /**
   * Lapisan yang sedang dilihat: skor per aspek, atau skor per Key Behaviour.
   *
   * Lapisan KB memuat SELURUH KB dari semua aspek — 195 kolom. Ini memang
   * bacaan data mentah, jadi KB-nya tidak diikat ke aspek tertentu; yang
   * mempersempit adalah pemilih kolom, yang dikelompokkan per aspek.
   */
  const [layer, setLayer] = useState<"aspect" | "kb">("aspect");

  const [tab, setTab] = useState<string | null>("data");
  const [query, setQuery] = useState("");
  const [limit, setLimit] = useState("10");
  const [page, setPage] = useState(1);
  /** Kolom yang disembunyikan; 13 aspek sekaligus terlalu lebar untuk dibaca. */
  const [hidden, setHidden] = useState<string[]>([]);
  /** Ganti lapisan/aspek berarti kumpulan kolomnya lain; kolom yang disembunyikan
   *  ikut dikosongkan supaya sembunyian lama tidak menempel ke nama kolom baru. */
  const resetColumns = () => { setHidden([]); setPage(1); };
  const [history, setHistory] = useState<{ name: string; field: string; seed: number; value: number | null } | null>(null);
  const [files, setFiles] = useState<{ name: string; size: number }[]>([]);

  /**
   * Mode fokus: kartu ini menutupi seluruh jendela, sidebar dan header aplikasi
   * ikut tertutup.
   *
   * Dipakai lapisan tetap (position: fixed) alih-alih Fullscreen API bawaan
   * browser: halaman ini dipasang sebagai iframe lintas situs di Integro, dan
   * requestFullscreen di dalam iframe bergantung pada izin allow="fullscreen"
   * dari halaman induk — kalau induknya tidak memberi, tombolnya diam tanpa
   * pesan. Lapisan tetap selalu bekerja, di mana pun halaman ini dipasang.
   */
  const [full, setFull] = useState(false);
  useEffect(() => {
    if (!full) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setFull(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [full]);

  const fields = useMemo(
    () => (layer === "kb" ? kbFieldsOf(slug) : fieldsOf(slug)),
    [layer, slug],
  );
  const rows = useMemo(() => rowsFor(fields), [fields]);
  const shown = fields.map((f, i) => ({ ...f, index: i })).filter((f) => !hidden.includes(f.key));

  /** Kolom dikelompokkan per aspek untuk pemilih kolom; lapisan aspek jadi satu grup tanpa nama. */
  const groups = useMemo(() => {
    const out: { aspect: string | null; fields: typeof fields }[] = [];
    for (const f of fields) {
      const aspect = f.aspect ?? null;
      const last = out[out.length - 1];
      if (last && last.aspect === aspect) last.fields.push(f);
      else out.push({ aspect, fields: [f] });
    }
    return out;
  }, [fields]);

  const matched = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => r.name.toLowerCase().includes(q) || r.email.toLowerCase().includes(q));
  }, [rows, query]);

  const per = Number(limit);
  const pageCount = Math.max(1, Math.ceil(matched.length / per));
  // Dijepit ke pageCount: saringan yang menyusut tidak boleh meninggalkan
  // pengguna di halaman yang sudah tidak punya baris.
  const curPage = Math.min(page, pageCount);
  const pageRows = matched.slice((curPage - 1) * per, curPage * per);

  if (!profile) {
    return (
      <div className="flex flex-col gap-[16px] p-[24px]">
        <Link href="/admin/profile-data" className="flex items-center gap-[8px] text-[14px] font-bold" style={{ color: ACCENT }}>
          <IconChevronLeft size={18} stroke={1.8} /> Back
        </Link>
        <p className="text-[12px] text-[#adb5bd]">Data profile &ldquo;{slug}&rdquo; tidak ditemukan.</p>
      </div>
    );
  }

  return (
    <div
      className={
        full
          ? "fixed inset-0 z-[200] flex flex-col gap-[16px] overflow-auto bg-[#f8f9fa] p-[24px]"
          : "flex flex-col gap-[16px] p-[24px]"
      }
    >
      {/* Kepala: Back + nama bidang, sejajar dengan pola halaman Job & Position */}
      <div className="flex items-center gap-[8px]">
        <Link
          href="/admin/profile-data"
          className="flex items-center gap-[4px] text-[14px] font-bold"
          style={{ color: ACCENT }}
          aria-label="Kembali ke Profile Data"
        >
          <IconChevronLeft size={18} stroke={1.8} />
          Back
        </Link>
        <Text size="sm" c="#495057" fw={700}>{profile.name}</Text>
        {!profile.enabled && (
          // Bidang yang dimatikan tetap bisa dibuka — datanya masih ada, cuma
          // tidak ditampilkan di profil talenta. Tanpa penanda ini, halamannya
          // terbaca seolah aktif.
          <Text size="xs" c="#adb5bd">(tidak ditampilkan di iProfile)</Text>
        )}
      </div>

      <div className={`${CARD} p-[16px]`}>
        <Tabs value={tab} onChange={setTab} variant="default">
          <Tabs.List grow>
            <Tabs.Tab value="data" fw={700} fz={13}>Data</Tabs.Tab>
            <Tabs.Tab value="upload" fw={700} fz={13}>Upload File</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="data" pt="md">
            {fields.length === 0 ? (
              // Bidang tambahan didaftarkan user dan belum punya sumber angka.
              // Ditulis apa adanya, bukan tabel kosong tanpa kolom.
              <div className="py-[40px] text-center">
                <p className="text-[12px] text-[#6c757d]">Belum ada kolom data untuk {profile.name}.</p>
                <p className="mt-[4px] text-[12px] text-[#adb5bd]">
                  Isi datanya lewat tab Upload File, atau hubungkan sumbernya di App Integration.
                </p>
              </div>
            ) : (
              <>
                <div className="mb-[12px] flex flex-wrap items-center gap-[12px]">
                  <TextInput
                    value={query}
                    onChange={(e) => { setQuery(e.currentTarget.value); setPage(1); }}
                    placeholder="Search employee"
                    radius="xl"
                    w={260}
                    rightSection={<IconSearch size={16} stroke={1.6} color="#adb5bd" />}
                  />
                  {/* Ketiga kendali tabel dikumpulkan di satu wadah kanan: pemilih
                      lapisan, pemilih kolom, dan mode fokus semuanya mengatur
                      tampilan tabel yang sama, jadi mereka satu kelompok — bukan
                      tersebar mengikuti sisa ruang. */}
                  <div className="ml-auto flex flex-wrap items-center gap-[10px]">
                  {kbLayer && (
                    <SegmentedControl
                      value={layer}
                      onChange={(v) => { setLayer(v as "aspect" | "kb"); resetColumns(); }}
                      data={[
                        { value: "aspect", label: "Aspect" },
                        { value: "kb", label: "Key Behaviour" },
                      ]}
                      size="xs"
                      radius="xl"
                      color="primary"
                    />
                  )}
                  <Menu shadow="md" width={260} closeOnItemClick={false}>
                    <Menu.Target>
                      <ActionIcon variant="subtle" color="gray" aria-label="Pilih kolom yang tampil">
                        <IconColumns3 size={18} stroke={1.6} />
                      </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <div className="flex items-center justify-between px-[10px] py-[6px]">
                        <Menu.Label p={0}>Kolom</Menu.Label>
                        <div className="flex gap-[6px]">
                          <Button variant="subtle" size="compact-xs" color="primary" onClick={() => setHidden([])}>
                            Semua
                          </Button>
                          <Button
                            variant="subtle" size="compact-xs" color="gray"
                            onClick={() => setHidden(fields.map((f) => f.key))}
                          >
                            Kosongkan
                          </Button>
                        </div>
                      </div>
                      <div className="max-h-[300px] overflow-y-auto px-[10px] py-[4px]">
                        {groups.map((g) => (
                          <div key={g.aspect ?? "-"} className="mb-[10px]">
                            {/* Kolom KB dikelompokkan per aspek pemiliknya: 195 butir
                                dalam satu daftar rata tidak bisa ditelusuri, dan
                                mencari satu aspek adalah cara paling wajar
                                mempersempit tabelnya. */}
                            {g.aspect && (
                              <div className="mb-[4px] flex items-center justify-between">
                                <span className="text-[11px] font-bold text-[#495057]">{g.aspect}</span>
                                <Button
                                  variant="subtle" size="compact-xs" color="primary"
                                  onClick={() => {
                                    const keys = g.fields.map((f) => f.key);
                                    const allShown = keys.every((k) => !hidden.includes(k));
                                    setHidden((prev) =>
                                      allShown
                                        ? [...prev, ...keys]
                                        : prev.filter((k) => !keys.includes(k)),
                                    );
                                  }}
                                >
                                  {g.fields.every((f) => !hidden.includes(f.key)) ? "Sembunyikan" : "Tampilkan"}
                                </Button>
                              </div>
                            )}
                            {g.fields.map((f) => (
                              <Checkbox
                                key={f.key}
                                label={f.level != null ? "L" + f.level + " · " + f.label : f.label}
                                size="xs"
                                color="primary"
                                mb={8}
                                checked={!hidden.includes(f.key)}
                                onChange={() =>
                                  setHidden((prev) =>
                                    prev.includes(f.key) ? prev.filter((x) => x !== f.key) : [...prev, f.key],
                                  )
                                }
                              />
                            ))}
                          </div>
                        ))}
                      </div>
                    </Menu.Dropdown>
                  </Menu>
                  <ActionIcon
                    variant="subtle" color="gray"
                    onClick={() => setFull((v) => !v)}
                    aria-label={full ? "Keluar dari mode fokus" : "Mode fokus layar penuh"}
                    title={full ? "Keluar dari mode fokus (Esc)" : "Mode fokus layar penuh"}
                  >
                    {full ? <IconArrowsMinimize size={18} stroke={1.6} /> : <IconArrowsMaximize size={18} stroke={1.6} />}
                  </ActionIcon>
                  </div>
                </div>

                {/* Tabel bisa jauh lebih lebar dari kartunya (satu aspek satu
                    kolom), jadi yang menggulir adalah wadah ini — bukan badan
                    halaman. */}
                <div className="overflow-x-auto">
                  <Table verticalSpacing="sm" horizontalSpacing="md" className="text-[12px]">
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th
                          className={STICKY_COL}
                          style={{ minWidth: 320, whiteSpace: "nowrap", background: STICKY_BG, zIndex: 3 }}
                        >
                          Employee <span style={{ color: "#e03131" }}>*</span>
                        </Table.Th>
                        <Table.Th style={{ minWidth: 160 }}>Last Update</Table.Th>
                        {shown.map((f) => (
                          // Judul dipangkas dengan ellipsis dan nama utuhnya
                          // dititipkan ke title: nama aspek bisa panjang, dan
                          // membiarkannya melebar membuat tabel tak terbaca.
                          <Table.Th key={f.key} style={{ minWidth: VALUE_COL, maxWidth: VALUE_COL }}>
                            {/* Aspek dan taraf ikut disebut di kolom KB. Tanpa
                                aspeknya, 195 kolom KB kehilangan konteks; tanpa
                                tarafnya, butir yang mirip di taraf berbeda
                                terbaca sama. */}
                            {f.aspect && (
                              <span className="block truncate text-[10px] font-normal text-[#adb5bd]" title={f.aspect}>
                                {f.aspect}
                              </span>
                            )}
                            <span className="block truncate" title={f.label}>
                              {f.level != null && <span className="mr-[4px] text-[10px] text-[#adb5bd]">L{f.level}</span>}
                              {f.label}
                            </span>
                          </Table.Th>
                        ))}
                        <Table.Th style={{ minWidth: 80 }}>Action</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {pageRows.map((r, ri) => (
                        <Table.Tr key={r.employeeId} className="group hover:bg-[#f8f9fa]">
                          <Table.Td
                            className={STICKY_COL + " group-hover:bg-[#f8f9fa]"}
                            style={{ whiteSpace: "nowrap", background: STICKY_BG }}
                          >
                            <span className="text-[#495057]">{r.name}</span>
                            <span className="text-[#adb5bd]"> | {r.email}</span>
                          </Table.Td>
                          <Table.Td className="text-[#adb5bd]">{r.lastUpdate}</Table.Td>
                          {shown.map((f) => (
                            <Table.Td key={f.key}>
                              {r.values[f.index] ?? <span className="text-[#ced4da]">-</span>}
                            </Table.Td>
                          ))}
                          <Table.Td>
                            <ActionIcon
                              variant="subtle" color="primary" aria-label={`Riwayat nilai ${r.name}`}
                              onClick={() =>
                                setHistory({
                                  name: r.name,
                                  field: shown[0]?.label ?? profile.name,
                                  seed: (curPage - 1) * per + ri,
                                  value: r.values[shown[0]?.index ?? 0] ?? null,
                                })
                              }
                            >
                              <IconHistory size={17} stroke={1.6} />
                            </ActionIcon>
                          </Table.Td>
                        </Table.Tr>
                      ))}
                      {pageRows.length === 0 && (
                        <Table.Tr>
                          <Table.Td colSpan={shown.length + 3} className="py-[24px] text-center text-[12px] text-[#adb5bd]">
                            Tidak ada karyawan yang cocok.
                          </Table.Td>
                        </Table.Tr>
                      )}
                    </Table.Tbody>
                  </Table>
                </div>

                <div className="mt-[12px] flex flex-wrap items-center justify-between gap-[12px]">
                  <div className="flex items-center gap-[8px] text-[12px] text-[#6c757d]">
                    Show
                    <NativeSelect
                      value={limit}
                      onChange={(e) => { setLimit(e.currentTarget.value); setPage(1); }}
                      data={["10", "25", "50"]}
                      size="xs"
                      w={72}
                    />
                    dari {matched.length} karyawan
                  </div>
                  <Pagination value={curPage} onChange={setPage} total={pageCount} size="sm" color="primary" radius="xl" />
                </div>
              </>
            )}
          </Tabs.Panel>

          <Tabs.Panel value="upload" pt="md">
            <div className="flex flex-col items-center gap-[10px] rounded-[8px] border border-dashed border-[#dee2e6] px-[16px] py-[36px] text-center">
              <IconFileSpreadsheet size={30} stroke={1.4} color="#adb5bd" />
              <p className="text-[13px] font-bold text-[#495057]">Unggah data {profile.name}</p>
              <p className="max-w-[420px] text-[12px] text-[#6c757d]">
                Berkas .xlsx atau .csv dengan satu kolom Employee dan satu kolom per bidang data.
              </p>
              <Button
                component="label" color="primary" radius="xl"
                leftSection={<IconUpload size={16} stroke={1.6} />}
              >
                Pilih Berkas
                <input
                  type="file" hidden multiple accept=".csv,.xlsx,.xls"
                  onChange={(e) => {
                    const picked = Array.from(e.currentTarget.files ?? []).map((f) => ({ name: f.name, size: f.size }));
                    setFiles((prev) => [...prev, ...picked]);
                    // Nilainya dikosongkan supaya memilih berkas yang sama dua
                    // kali tetap memicu onChange.
                    e.currentTarget.value = "";
                  }}
                />
              </Button>
              {/* Dikatakan terus terang: berkasnya tidak diproses. Tanpa ini,
                  daftar di bawah terbaca seolah datanya sudah masuk. */}
              <Text size="xs" c="#adb5bd">
                Belum ada backend pemroses — berkas hanya didaftar di sini selama sesi ini.
              </Text>
            </div>

            {files.length > 0 && (
              <Table verticalSpacing="sm" horizontalSpacing="md" className="mt-[16px] text-[12px]">
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Nama Berkas</Table.Th>
                    <Table.Th>Ukuran</Table.Th>
                    <Table.Th>Status</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {files.map((f, i) => (
                    <Table.Tr key={f.name + i}>
                      <Table.Td>{f.name}</Table.Td>
                      <Table.Td className="text-[#adb5bd]">{(f.size / 1024).toFixed(1)} KB</Table.Td>
                      <Table.Td className="text-[#adb5bd]">Menunggu diproses</Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            )}
          </Tabs.Panel>
        </Tabs>
      </div>

      {history && (
        <Modal opened onClose={() => setHistory(null)} title={`Riwayat — ${history.name}`} radius={12} centered>
          <Text size="xs" c="#adb5bd" mb={10}>{history.field}</Text>
          {historyOf(history.value, history.seed).length === 0 ? (
            <Text size="sm" c="#6c757d">Belum ada nilai yang tercatat untuk kolom ini.</Text>
          ) : (
            <Table verticalSpacing="xs" className="text-[12px]">
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Waktu</Table.Th>
                  <Table.Th>Nilai</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {historyOf(history.value, history.seed).map((h, i) => (
                  <Table.Tr key={h.at}>
                    <Table.Td className="text-[#adb5bd]">{h.at}</Table.Td>
                    <Table.Td fw={i === 0 ? 700 : 400}>{h.value}</Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          )}
        </Modal>
      )}
    </div>
  );
}
