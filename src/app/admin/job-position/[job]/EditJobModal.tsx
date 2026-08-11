"use client";
import { useState } from "react";
import { Button, Modal, NumberInput, Switch, Text, Textarea, TextInput, Tooltip } from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";

export type JobForm = {
  name: string;
  critical: boolean;
  grade: number;
  description: string;
};

/**
 * Modal Edit Job. Isian dibuat sebagai salinan lokal dan baru dikirim ke
 * pemanggil lewat "Update Data" — jadi menutup modal tanpa menyimpan tidak
 * mengubah apa pun.
 */
export function EditJobModal({
  opened,
  initial,
  onClose,
  onSubmit,
}: {
  opened: boolean;
  initial: JobForm;
  onClose: () => void;
  onSubmit: (value: JobForm) => void;
}) {
  return (
    <Modal opened={opened} onClose={onClose} title="Edit Job" size={520} padding="lg" centered>
      {/* Isinya baru dipasang saat modal terbuka, jadi state formulir lahir
          ulang tiap kali dibuka — tidak perlu di-reset lewat effect, dan sisa
          ketikan sesi sebelumnya tidak ikut terbawa. */}
      {opened && <EditJobForm initial={initial} onSubmit={onSubmit} />}
    </Modal>
  );
}

function EditJobForm({ initial, onSubmit }: { initial: JobForm; onSubmit: (value: JobForm) => void }) {
  const [form, setForm] = useState<JobForm>(initial);
  const nameEmpty = form.name.trim() === "";

  /**
   * Nilai event WAJIB dibaca di luar callback `setForm`. Callback itu
   * dijalankan React belakangan, dan saat itu `e.currentTarget` sudah null —
   * membacanya di dalam sana bikin halaman crash begitu isian disentuh.
   */
  const set = <K extends keyof JobForm>(key: K, value: JobForm[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  return (
    <div className="flex flex-col gap-[16px]">
        <TextInput
          label="Nama"
          required
          value={form.name}
          onChange={(e) => set("name", e.currentTarget.value)}
          error={nameEmpty ? "Nama tidak boleh kosong" : null}
        />

        <div>
          <Text size="sm" fw={700} mb={6}>
            Critical Job
          </Text>
          <Switch
            checked={form.critical}
            onChange={(e) => set("critical", e.currentTarget.checked)}
            label={form.critical ? "Critical Job" : "Standard Job"}
          />
        </div>

        <div>
          {/* Label dirakit sendiri supaya ikon penjelasnya bisa menempel di
              sebelah teks — prop `label` NumberInput hanya menerima teks polos. */}
          <Text size="sm" fw={700} mb={6}>
            <span className="flex items-center gap-[4px]">
              Grade
              <Tooltip label="1 = tingkat tertinggi" position="top" withArrow>
                <IconInfoCircle size={14} stroke={1.6} color="#adb5bd" />
              </Tooltip>
              <span style={{ color: "var(--mantine-color-error-6)" }}>*</span>
            </span>
          </Text>
          <NumberInput
            min={1}
            max={9}
            clampBehavior="strict"
            value={form.grade}
            onChange={(v) => {
              if (typeof v === "number") set("grade", v);
            }}
            aria-label="Grade"
          />
        </div>

      <Textarea
        label="Job Description"
        autosize
        minRows={6}
        maxRows={12}
        value={form.description}
        onChange={(e) => set("description", e.currentTarget.value)}
        placeholder="Tulis deskripsi jabatan…"
      />

      <div>
        <Button disabled={nameEmpty} onClick={() => onSubmit(form)}>
          Update Data
        </Button>
      </div>
    </div>
  );
}
