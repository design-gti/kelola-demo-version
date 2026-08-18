import { getJobTargets, getEmployeeMetrics } from "@/lib/data/talentMapping";
import TalentMappingClient from "./TalentMappingClient";

/**
 * Konfigurasi box mapping hidup di memori klien selama satu sesi (lihat catatan
 * di src/data/talentMappingConfig.ts), jadi server tidak punya cara — dan tidak
 * perlu — mengetahuinya. Yang dikirim dari sini cuma bahan mentahnya: tabel
 * metrik per karyawan dan daftar target jabatan. Titik 9-box untuk konfigurasi
 * apa pun dihitung di klien, sehingga setiap perubahan pengaturan langsung
 * terlihat tanpa memuat ulang halaman.
 */
export default async function TalentMappingPage({
  searchParams,
}: {
  searchParams: Promise<{ box?: string; highlight?: string }>;
}) {
  const { box, highlight } = await searchParams;
  const initialBox = box ? Number(box) : null;

  return (
    <TalentMappingClient
      jobTargets={getJobTargets()}
      metrics={getEmployeeMetrics()}
      initialBox={initialBox}
      initialHighlight={highlight ?? null}
    />
  );
}
