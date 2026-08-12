"use client";
import { useState } from "react";
import { Button, Group, Modal, Radio, Stack, Text } from "@mantine/core";

/**
 * Memindahkan aspek terpilih ke cluster (kategori) lain.
 *
 * Pilihannya diambil dari kategori yang sedang ada di halaman — termasuk yang
 * baru dibuat lewat "Create Category Aspect", jadi kategori kosong akhirnya
 * punya cara untuk diisi.
 */
export function MoveToClusterModal({
  opened,
  count,
  clusters,
  onClose,
  onMove,
}: {
  opened: boolean;
  /** Berapa aspek yang akan dipindahkan — ditulis di tombolnya. */
  count: number;
  clusters: string[];
  onClose: () => void;
  onMove: (cluster: string) => void;
}) {
  return (
    <Modal opened={opened} onClose={onClose} title="Move to Cluster" size="md" padding="lg">
      {opened && <MoveForm count={count} clusters={clusters} onClose={onClose} onMove={onMove} />}
    </Modal>
  );
}

function MoveForm({
  count,
  clusters,
  onClose,
  onMove,
}: {
  count: number;
  clusters: string[];
  onClose: () => void;
  onMove: (cluster: string) => void;
}) {
  const [pilihan, setPilihan] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-[16px]">
      <Text size="sm" c="#6c757d">
        {count} aspek akan dipindahkan ke cluster yang dipilih.
      </Text>

      <Radio.Group value={pilihan} onChange={setPilihan} aria-label="Cluster tujuan">
        <Stack gap={10}>
          {clusters.map((c) => (
            <Radio key={c} value={c} label={c} />
          ))}
        </Stack>
      </Radio.Group>

      <Group justify="flex-end">
        <Button variant="outline" color="gray" onClick={onClose}>
          Cancel
        </Button>
        <Button disabled={!pilihan} onClick={() => pilihan && onMove(pilihan)}>
          Move
        </Button>
      </Group>
    </div>
  );
}
