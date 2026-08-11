/**
 * Kerangka halaman Admin Settings.
 *
 * Isinya sengaja kosong — halaman-halaman ini baru rangka supaya menu di
 * sidebar punya tujuan yang benar (bukan link 404), kontennya menyusul.
 * Judulnya tetap ditampilkan sebagai penanda posisi: tanpa itu, halaman
 * kosong tidak bisa dibedakan dari halaman yang gagal dimuat.
 *
 * Saat mengisi konten nanti, ganti `children` — padding, lebar, dan judulnya
 * sudah seragam untuk semua halaman admin dari sini.
 */
export function AdminPageShell({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="p-[24px]">
      {/* 14px Avenir Heavy — ukuran judul kartu/halaman yang dipakai di seluruh
          aplikasi (mis. "Score Aspect", "Profile" di iProfile). */}
      <h1 className="font-['Avenir:Heavy',sans-serif] text-[14px] text-[#495057]">{title}</h1>
      {children}
    </div>
  );
}
