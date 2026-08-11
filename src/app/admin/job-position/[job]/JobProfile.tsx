"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ActionIcon, Button, Group, Menu, Modal, NativeSelect, Table, Tabs, Text, TextInput } from "@mantine/core";
import {
  IconArmchair,
  IconAward,
  IconChevronLeft,
  IconDotsVertical,
  IconFileSearch,
  IconPencil,
  IconPlus,
  IconSearch,
  IconTrash,
  IconUserCircle,
  IconX,
} from "@tabler/icons-react";
import { findJob, positionsOf } from "../jobs";
import { StandardTab } from "./StandardTab";
import { EditJobModal, type JobForm } from "./EditJobModal";
import { JobDescModal } from "./JobDescModal";
import { descriptionOf } from "../jobDescriptions";

const ACCENT = "var(--mantine-color-primary-5)";
/** Kartu di halaman ini memakai gaya kartu menu utama: bayangan, tanpa garis tepi. */
const CARD = "rounded-[8px] bg-white shadow-[2px_2px_15px_0px_rgba(0,0,0,0.1)]";

export function JobProfile({ name }: { name: string }) {
  const job = useMemo(() => findJob(name), [name]);
  const positions = useMemo(() => positionsOf(name), [name]);
  const [query, setQuery] = useState("");
  const [limit, setLimit] = useState("10");
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [descOpen, setDescOpen] = useState(false);
  /**
   * Hasil edit hanya hidup di halaman ini. Nama & grade Job berasal dari
   * participants.csv yang tidak bisa ditulis dari browser, jadi perubahannya
   * tampil supaya alurnya kelihatan, tapi hilang saat halaman dimuat ulang.
   */
  const [override, setOverride] = useState<Partial<JobForm>>({});

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    // Pencarian sengaja tidak mengubah urutan: hierarkinya tetap terbaca,
    // baris yang tidak cocok saja yang hilang.
    const matched = q
      ? positions.filter((p) => p.title.toLowerCase().includes(q) || p.incumbent.toLowerCase().includes(q))
      : positions;
    return matched.slice(0, Number(limit));
  }, [positions, query, limit]);

  if (!job) {
    return (
      <div className="p-[24px]">
        <p className="text-[12px] text-[#adb5bd]">Job &ldquo;{name}&rdquo; tidak ditemukan.</p>
      </div>
    );
  }

  const displayName = override.name ?? job.name;
  const displayLevel = override.grade ?? job.level;
  const jobDescription = override.description ?? descriptionOf(job.name);

  return (
    <div className="flex flex-col gap-[16px] p-[24px]">
      {/* Breadcrumb */}
      <div className="flex items-center gap-[8px]">
        <Link href="/admin/job-position" className="flex items-center" aria-label="Kembali ke Job & Position">
          <IconChevronLeft size={18} stroke={1.8} color="#495057" />
        </Link>
        <Link href="/admin/job-position" className="text-[14px] font-bold" style={{ color: ACCENT }}>
          Job &amp; Position
        </Link>
        <Text size="sm" c="#adb5bd">
          /
        </Text>
        <Text size="sm" c="#495057" fw={700}>
          Job Profile
        </Text>
      </div>

      {/* Ringkasan Job */}
      <div className={`${CARD} p-[16px]`}>
        <div className="flex items-start justify-between gap-[12px]">
          <span className="flex items-center gap-[8px]">
            <h1 className="font-['Avenir:Heavy',sans-serif] text-[14px] text-[#212529]">{displayName}</h1>
            {override.critical && (
              <span className="rounded-[800px] bg-[#fff2e4] px-[8px] py-[2px] text-[10px] font-bold uppercase text-[#ca6f00]">
                Critical
              </span>
            )}
          </span>
          <Menu position="bottom-end" withinPortal>
            <Menu.Target>
              <ActionIcon variant="subtle" color="gray" aria-label="Aksi lain">
                <IconDotsVertical size={16} stroke={1.6} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item leftSection={<IconPencil size={14} stroke={1.6} />} onClick={() => setEditOpen(true)}>
                Edit Job
              </Menu.Item>
              <Menu.Item
                color="red"
                leftSection={<IconTrash size={14} stroke={1.6} />}
                onClick={() => setDeleteOpen(true)}
              >
                Delete Job
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </div>

        <div className="mt-[12px] flex flex-wrap items-center justify-between gap-[12px] rounded-[8px] bg-[#f8f9fa] px-[16px] py-[12px]">
          <div className="flex items-center gap-[14px]">
            <span className="flex items-center gap-[5px] text-[12px] text-[#6c757d]" title="Job level tertinggi di dalamnya">
              <IconAward size={16} stroke={1.6} color="#adb5bd" />
              {displayLevel}
            </span>
            <span className="flex items-center gap-[5px] text-[12px] text-[#6c757d]" title="Jumlah posisi">
              <IconArmchair size={16} stroke={1.6} color="#adb5bd" />
              {job.positions}
            </span>
          </div>
          <Button
            radius="xl"
            rightSection={<IconFileSearch size={16} stroke={1.6} />}
            onClick={() => setDescOpen(true)}
          >
            Job Desc
          </Button>
        </div>
      </div>

      {/* Isi Job */}
      <div className={`${CARD} p-[16px]`}>
        <Tabs defaultValue="position">
          <Tabs.List>
            <Tabs.Tab value="position">Position</Tabs.Tab>
            <Tabs.Tab value="standard">Standard</Tabs.Tab>
            <Tabs.Tab value="criteria">Criteria</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="position" pt="md">
            <div className="flex flex-wrap items-center justify-between gap-[12px]">
              <TextInput
                value={query}
                onChange={(e) => setQuery(e.currentTarget.value)}
                placeholder="Search something"
                radius="xl"
                w={240}
                rightSection={<IconSearch size={16} stroke={1.6} color="#adb5bd" />}
              />
              {/* Belum punya alur — halaman admin masih rangka. */}
              <Button variant="outline" radius="xl" leftSection={<IconPlus size={16} stroke={1.6} />}>
                Add Position
              </Button>
            </div>

            <Table mt="md" verticalSpacing="sm" horizontalSpacing="md" highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Position</Table.Th>
                  <Table.Th>Incumbent</Table.Th>
                  <Table.Th>Report To</Table.Th>
                  <Table.Th w={120}>Actions</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {rows.map((row) => (
                  <Table.Tr key={row.participantId}>
                    <Table.Td>
                      {/* Indentasi mengikuti kedalaman di hierarki Vismap —
                          atasan dulu, bawahannya menjorok ke kanan. */}
                      <Text size="sm" c="#495057" style={{ paddingLeft: row.depth * 18 }}>
                        {row.title}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <span className="flex items-center gap-[8px]">
                        <IconUserCircle size={20} stroke={1.4} color="#adb5bd" />
                        <Text size="sm" c="#495057">
                          {row.incumbent}
                        </Text>
                      </span>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" c="#495057">
                        {row.reportTo ?? "-"}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <span className="flex items-center gap-[4px]">
                        <ActionIcon variant="subtle" color="gray" aria-label={`Lepas ${row.incumbent} dari posisi`}>
                          <IconX size={16} stroke={1.6} />
                        </ActionIcon>
                        <ActionIcon variant="subtle" color="red" aria-label={`Hapus posisi ${row.title}`}>
                          <IconTrash size={16} stroke={1.6} />
                        </ActionIcon>
                      </span>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>

            <div className="mt-[16px] flex items-center gap-[16px] border-t border-[#e9ecef] pt-[12px]">
              <span className="flex items-center gap-[8px]">
                <Text size="xs" c="#6c757d">
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
                Total Data : {positions.length}
              </Text>
            </div>
          </Tabs.Panel>

          <Tabs.Panel value="standard" pt="md">
            <StandardTab job={name} />
          </Tabs.Panel>

          {/* Criteria menyusul — kontennya belum di-brief. */}
          <Tabs.Panel value="criteria" pt="md">
            <Text size="xs" c="#adb5bd">
              Belum ada kriteria untuk Job ini.
            </Text>
          </Tabs.Panel>
        </Tabs>
      </div>

      <EditJobModal
        opened={editOpen}
        initial={{
          name: displayName,
          critical: override.critical ?? false,
          grade: displayLevel,
          description: override.description ?? descriptionOf(job.name),
        }}
        onClose={() => setEditOpen(false)}
        onSubmit={(value) => {
          setOverride(value);
          setEditOpen(false);
        }}
      />

      <JobDescModal
        opened={descOpen}
        value={jobDescription}
        onClose={() => setDescOpen(false)}
        onSave={(description) => setOverride((prev) => ({ ...prev, description }))}
      />

      <Modal opened={deleteOpen} onClose={() => setDeleteOpen(false)} title="Delete Job">
        <Text size="sm" c="#495057">
          Hapus Job <b>{displayName}</b>? {positions.length} posisi di dalamnya ikut kehilangan induknya.
          Tindakan ini tidak bisa dibatalkan.
        </Text>
        <Group justify="flex-end" mt="lg">
          <Button variant="outline" onClick={() => setDeleteOpen(false)}>
            Cancel
          </Button>
          <Button
            color="red"
            onClick={() => {
              // Belum ada penghapusan sungguhan — datanya berasal dari
              // participants.csv yang tidak bisa ditulis dari browser. Alurnya
              // ditutup dengan kembali ke daftar Job.
              setDeleteOpen(false);
              router.push("/admin/job-position");
            }}
          >
            Delete
          </Button>
        </Group>
      </Modal>
    </div>
  );
}
