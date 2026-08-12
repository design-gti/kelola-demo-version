"use client";
import { useEffect, useMemo, useState } from "react";
import { Badge, Button, Checkbox, Group, Loader, Modal, Table, Text } from "@mantine/core";
import { IconSparkles } from "@tabler/icons-react";
import type { LibraryAspect } from "@/app/admin/aspect/aspects";
import { recommendAspects } from "./recommendAspects";

/** Tahapan yang ditampilkan selama proses berjalan, berganti tiap ~700ms. */
const STEPS = [
  "Membaca job description…",
  "Menelusuri library aspek…",
  "Menyusun rekomendasi…",
];

const STEP_MS = 700;

/**
 * Menurunkan rekomendasi aspek dari job description sebuah Job.
 *
 * Perhitungannya seketika (lihat recommendAspects — pencocokan kata, bukan
 * panggilan model), tapi tetap ditampilkan bertahap: tanpa jeda, hasilnya
 * muncul begitu saja dan tidak terbaca sebagai sesuatu yang sedang diproses.
 */
export function GenerateAspectModal({
  opened,
  jobDescription,
  library,
  alreadyAdded,
  onClose,
  onAdd,
}: {
  opened: boolean;
  jobDescription: string;
  library: LibraryAspect[];
  /** Aspek yang sudah ada di Job — dikeluarkan dari rekomendasi. */
  alreadyAdded: string[];
  onClose: () => void;
  onAdd: (labels: string[]) => void;
}) {
  return (
    <Modal opened={opened} onClose={onClose} title="Rekomendasi Aspect" size={860} padding="lg">
      {opened && (
        <GenerateAspectBody
          jobDescription={jobDescription}
          library={library}
          alreadyAdded={alreadyAdded}
          onClose={onClose}
          onAdd={onAdd}
        />
      )}
    </Modal>
  );
}

function GenerateAspectBody({
  jobDescription,
  library,
  alreadyAdded,
  onClose,
  onAdd,
}: {
  jobDescription: string;
  library: LibraryAspect[];
  alreadyAdded: string[];
  onClose: () => void;
  onAdd: (labels: string[]) => void;
}) {
  const [step, setStep] = useState(0);
  const done = step >= STEPS.length;

  // Aspek yang sudah ada di Job tetap ikut direkomendasikan — ditandai "Added"
  // di tabel, bukan disembunyikan. Kalau dibuang diam-diam, hasilnya berubah
  // tiap kali modal dibuka ulang dan orang mengira rekomendasinya tidak tetap.
  const added = useMemo(() => new Set(alreadyAdded), [alreadyAdded]);
  const results = useMemo(
    () => recommendAspects(jobDescription, library),
    [jobDescription, library],
  );

  // Semua rekomendasi tercentang sejak awal: yang muncul memang usulan untuk
  // ditambahkan, jadi mencabut yang tidak cocok lebih sedikit klik daripada
  // mencentang satu per satu. Yang disimpan justru yang DICABUT — kalau yang
  // disimpan daftar tercentangnya, isinya harus diisi lewat effect begitu hasil
  // muncul, dan state yang ditulis dari effect selalu telat satu render.
  const [unchecked, setUnchecked] = useState<Set<string>>(new Set());
  const selected = useMemo(
    () => results.map((r) => r.aspect.label).filter((l) => !added.has(l) && !unchecked.has(l)),
    [results, unchecked, added],
  );
  /** Yang masih bisa dipilih — yang sudah ada di Job tidak ikut dihitung. */
  const selectable = useMemo(
    () => results.map((r) => r.aspect.label).filter((l) => !added.has(l)),
    [results, added],
  );

  useEffect(() => {
    if (done) return;
    const id = setTimeout(() => setStep((s) => s + 1), STEP_MS);
    return () => clearTimeout(id);
  }, [step, done]);

  if (!done) {
    return (
      <div className="flex flex-col items-center gap-[12px] py-[48px]">
        <Loader size="md" />
        <Text size="sm" fw={700} c="#212529">
          {STEPS[step]}
        </Text>
        <Text size="xs" c="#6c757d">
          Mencocokkan job description dengan {library.length} aspek di library.
        </Text>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="flex flex-col gap-[16px]">
        <Text size="sm" c="#6c757d">
          {jobDescription.trim()
            ? "Tidak ada aspek di library yang cocok dengan job description ini. Coba lengkapi job description-nya, atau pilih aspek sendiri lewat Choose Aspect."
            : "Job description Job ini masih kosong, jadi belum ada yang bisa dibaca. Isi dulu lewat tombol Job Desc."}
        </Text>
        <Group justify="flex-end">
          <Button variant="outline" color="gray" onClick={onClose}>
            Tutup
          </Button>
        </Group>
      </div>
    );
  }

  const toggle = (label: string) =>
    setUnchecked((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });

  const allSelected = selectable.length > 0 && selected.length === selectable.length;

  return (
    <div className="flex flex-col gap-[16px]">
      <Text size="xs" c="#6c757d">
        {results.length} aspek dari library dinilai paling dekat dengan job description Job ini.
        Centang yang mau ditambahkan.
      </Text>

      <Table.ScrollContainer minWidth={560} mah={420} type="native">
        <Table verticalSpacing="sm" horizontalSpacing="md" highlightOnHover stickyHeader>
          <Table.Thead>
            <Table.Tr>
              <Table.Th w={44}>
                <Checkbox
                  size="xs"
                  checked={allSelected}
                  indeterminate={!allSelected && selected.length > 0}
                  onChange={() => setUnchecked(allSelected ? new Set(selectable) : new Set())}
                  aria-label="Pilih semua rekomendasi"
                />
              </Table.Th>
              <Table.Th w={200}>Aspect</Table.Th>
              <Table.Th>Description</Table.Th>
              <Table.Th w={140}>Category</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {results.map(({ aspect }) => {
              const isAdded = added.has(aspect.label);
              return (
              <Table.Tr key={aspect.label}>
                <Table.Td>
                  <Checkbox
                    size="xs"
                    checked={isAdded || !unchecked.has(aspect.label)}
                    disabled={isAdded}
                    onChange={() => toggle(aspect.label)}
                    aria-label={isAdded ? `${aspect.label} sudah ditambahkan` : `Pilih ${aspect.label}`}
                  />
                </Table.Td>
                <Table.Td c="#495057">
                  <span className="flex flex-wrap items-center gap-[6px]">
                    {aspect.label}
                    {isAdded && (
                      <Badge color="gray" variant="light" size="sm" tt="none">
                        Added
                      </Badge>
                    )}
                  </span>
                </Table.Td>
                <Table.Td>
                  <Text size="sm" c="#495057">
                    {aspect.description}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Badge color="primary" variant="light" size="sm">
                    {aspect.category}
                  </Badge>
                </Table.Td>
              </Table.Tr>
              );
            })}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>

      <Group justify="space-between">
        <Text size="xs" c="#6c757d">
          {selected.length} aspek dipilih
        </Text>
        <Group gap={8}>
          <Button variant="outline" color="gray" onClick={onClose}>
            Cancel
          </Button>
          <Button
            disabled={selected.length === 0}
            leftSection={<IconSparkles size={16} stroke={1.6} />}
            onClick={() => {
              onAdd(selected);
              onClose();
            }}
          >
            Add Aspect
          </Button>
        </Group>
      </Group>
    </div>
  );
}
