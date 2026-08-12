"use client";
import { useState } from "react";
import { Button, Group, Modal, Textarea } from "@mantine/core";
import { IconSparkles } from "@tabler/icons-react";

/**
 * Modal Job Description — sekaligus tempat mengeditnya, tidak perlu pindah ke
 * modal Edit Job untuk sekadar menambah satu baris.
 */
export function JobDescModal({
  opened,
  value,
  onClose,
  onSave,
  onGenerate,
}: {
  opened: boolean;
  value: string;
  onClose: () => void;
  onSave: (next: string) => void;
  /** Membuka modal rekomendasi aspek; modal ini ditutup oleh pemanggilnya. */
  onGenerate: () => void;
}) {
  return (
    <Modal opened={opened} onClose={onClose} title="Job Description" size={560} padding="lg">
      {/* Isinya baru dipasang saat modal terbuka, jadi draft-nya lahir ulang
          tiap kali dibuka — tidak ada sisa ketikan dari sesi sebelumnya. */}
      {opened && <JobDescForm value={value} onSave={onSave} onGenerate={onGenerate} />}
    </Modal>
  );
}

function JobDescForm({
  value,
  onSave,
  onGenerate,
}: {
  value: string;
  onSave: (next: string) => void;
  onGenerate: () => void;
}) {
  /** Teks tersimpan; jadi pembanding "ada perubahan" sekaligus bahan Cancel. */
  const [saved, setSaved] = useState(value);
  const [draft, setDraft] = useState(value);
  const dirty = draft !== saved;

  return (
    <div className="flex flex-col gap-[16px]">
      <Textarea
        autosize
        minRows={8}
        maxRows={16}
        value={draft}
        onChange={(e) => setDraft(e.currentTarget.value)}
        placeholder="Tulis deskripsi jabatan…"
        aria-label="Job Description"
      />

      <Group justify="flex-end">
        {/* Cancel & Save baru muncul begitu ada perubahan — sebelum itu tidak
            ada yang bisa disimpan maupun dibatalkan. */}
        {dirty && (
          <Button variant="outline" color="gray" onClick={() => setDraft(saved)}>
            Cancel
          </Button>
        )}
        {/* Pintu masuk kedua ke rekomendasi aspek — sama persis dengan tombol
            "Generate Aspect by Job Desc." di tab Aspect. Dimatikan saat
            deskripsinya masih kosong: tidak ada yang bisa dibaca. */}
        <Button
          variant="outline"
          disabled={draft.trim() === ""}
          leftSection={<IconSparkles size={16} stroke={1.6} />}
          onClick={() => {
            // Yang dibaca perekomendasi adalah deskripsi TERSIMPAN, jadi
            // ketikan yang belum disimpan ikut disimpan dulu — kalau tidak,
            // hasilnya diturunkan dari teks lama tanpa ada yang menyadari.
            if (dirty) {
              setSaved(draft);
              onSave(draft);
            }
            onGenerate();
          }}
        >
          Generate Aspect by Job Desc.
        </Button>
        {dirty && (
          <Button
            onClick={() => {
              setSaved(draft);
              onSave(draft);
            }}
          >
            Save Changes
          </Button>
        )}
      </Group>
    </div>
  );
}
