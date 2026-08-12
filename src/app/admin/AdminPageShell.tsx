/**
 * Kerangka halaman Admin Settings.
 *
 * Judul halaman TIDAK dirender di sini — itu tugas header aplikasi, yang
 * mengambil nama menu dari URL. Kalau ditulis lagi di sini, halaman punya dua
 * judul yang bisa saling berbeda.
 *
 * Prop `title` tetap ada karena halaman yang isinya masih kosong perlu
 * menandai dirinya agar tidak tampak seperti halaman yang gagal dimuat.
 */
export function AdminPageShell({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="p-[24px]">
      {children ?? (
        <p className="text-[12px] text-[#adb5bd]">Halaman {title} belum berisi.</p>
      )}
    </div>
  );
}
