"use client";
import { useState } from "react";
import { Badge, Button, Group, Modal, Text, TextInput } from "@mantine/core";

/**
 * Membuat kategori aspek baru.
 *
 * Satu isian dipakai berulang: tiap kali Enter ditekan, namanya turun jadi chip
 * dan kolomnya kosong lagi — jadi beberapa kategori bisa dibuat sekaligus tanpa
 * membuka-tutup modal. Tombol Create baru hidup setelah ada minimal satu chip.
 *
 * Isinya baru dipasang saat modal terbuka (lihat `opened && ...`), sehingga
 * nama yang diketik tapi tidak jadi dibuat tidak tertinggal di sesi berikutnya.
 */
export function CreateCategoryModal({
  opened,
  existing,
  onClose,
  onCreate,
}: {
  opened: boolean;
  /** Nama kategori yang sudah ada — dipakai menolak duplikat. */
  existing: string[];
  onClose: () => void;
  onCreate: (names: string[]) => void;
}) {
  return (
    <Modal opened={opened} onClose={onClose} title="Create Category Aspect" size="md" padding="lg">
      {opened && <CreateCategoryForm existing={existing} onClose={onClose} onCreate={onCreate} />}
    </Modal>
  );
}

function CreateCategoryForm({
  existing,
  onClose,
  onCreate,
}: {
  existing: string[];
  onClose: () => void;
  onCreate: (names: string[]) => void;
}) {
  const [value, setValue] = useState("");
  const [names, setNames] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const submit = () => {
    const name = value.trim();
    if (!name) return;
    // Dicocokkan tanpa membedakan huruf besar-kecil: "Software" dan "software"
    // akan tampil sebagai dua accordion yang membingungkan kalau dibiarkan.
    const taken = [...existing, ...names].some((n) => n.toLowerCase() === name.toLowerCase());
    if (taken) {
      setError(`Kategori "${name}" sudah ada.`);
      return;
    }
    setNames((prev) => [...prev, name]);
    setValue("");
    setError(null);
  };

  const remove = (name: string) => setNames((prev) => prev.filter((n) => n !== name));

  return (
    <div className="flex flex-col gap-[16px]">
      <div className="flex flex-col gap-[6px]">
        <Text size="sm" fw={700} c="#212529">
          Category Name
        </Text>
        <TextInput
          value={value}
          onChange={(e) => {
            setValue(e.currentTarget.value);
            setError(null);
          }}
          onKeyDown={(e) => {
            if (e.key !== "Enter") return;
            // Modal Mantine menutup diri saat Enter menembus ke form; di sini
            // Enter memang tombol utamanya, jadi ditahan di tempat.
            e.preventDefault();
            submit();
          }}
          placeholder="Write..."
          error={error}
          aria-label="Nama kategori"
          data-autofocus
        />
        <Text size="xs" c="#6c757d">
          Tulis nama Category yang mau ditambahkan lalu klik &quot;Enter&quot;
        </Text>
      </div>

      {names.length > 0 && (
        <Group gap={8}>
          {names.map((name) => (
            <Badge
              key={name}
              color="primary"
              variant="light"
              size="lg"
              // Badge memakai huruf kapital semua; nama kategori ditulis
              // pengguna, jadi ditampilkan persis seperti yang diketik.
              tt="none"
              rightSection={
                <span
                  role="button"
                  tabIndex={0}
                  aria-label={`Hapus ${name}`}
                  onClick={() => remove(name)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") remove(name);
                  }}
                  style={{ cursor: "pointer", display: "inline-flex", alignItems: "center" }}
                >
                  ×
                </span>
              }
            >
              {name}
            </Badge>
          ))}
        </Group>
      )}

      <Group justify="flex-end">
        <Button
          // Tanpa chip tidak ada yang bisa dibuat — tombolnya dimatikan
          // daripada memunculkan pesan galat setelah diklik.
          disabled={names.length === 0}
          onClick={() => {
            onCreate(names);
            onClose();
          }}
        >
          Create Category
        </Button>
      </Group>
    </div>
  );
}
