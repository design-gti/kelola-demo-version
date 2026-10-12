/**
 * Jalan masuk dari kartu Succession Plan iProfile DAN panel Succession Vismap V2 ke
 * layar TDP.
 *
 * Tombol "Compare"/"Compare Successors" membawa DUA hal lewat query URL:
 *
 *   /tdp-view?tab=compare&from=iprofile&successors=<id,id,…>&position=<Position Title>
 *
 *   * `successors` — para calon penerus pada kartu/panel itu, dipakai men-PIN
 *     mereka di TDP (naik ke atas, ditandai, tetap muncul di Table maupun Compare).
 *     Pemilik kartunya TIDAK ikut: yang disandingkan calon terhadap calon.
 *   * `position` — jabatan pemilik kartu, dipakai memasang "Target Position" di TDP,
 *     supaya skor kesiapan dihitung terhadap kursi yang memang sedang diperebutkan,
 *     bukan terhadap jabatan masing-masing calon sekarang.
 *
 * ⚠️ Dulu `successors` dipakai MENYARING (kondisi filter "Employees" diisi otomatis),
 * bukan men-PIN. Diminta langsung untuk dibalik: menyaring menyembunyikan semua
 * karyawan lain, padahal yang diinginkan adalah menyorot calon-calon itu SAMBIL tetap
 * bisa melihat/membandingkan siapa pun yang lain di TDP. Mekanismenya persis kontrak
 * `shared_pinned` yang sudah ada (lihat `TableScreener`/`Comparison`/`Screener`) —
 * pin memang dirancang untuk bertahan sebagai keadaan pemakai, jadi menuliskannya ke
 * sana sesuai maksud kontrak itu, bukan penyalahgunaan seperti filter permanen akan
 * jadi kalau ditulis ke sana.
 *
 * ── Kenapa perlu dipetakan, bukan dipakai langsung ──
 *
 * ⚠️ iProfile dan TDP memakai DUA ruang id yang berbeda untuk orang yang sama.
 * iProfile memakai id karyawan kelola (`00000000-0000-4000-9000-tq0001`); TDP memakai
 * id barisnya sendiri (`TQ-0001`). Jembatannya kolom `Referance ID` di CSV TDP — kolom
 * yang sama yang dipakai `getProfileUrl` untuk arah sebaliknya.
 */

/** Satu karyawan TDP, sebatas yang dibutuhkan berkas ini. */
type KaryawanTdp = { id: string; csvFields?: Record<string, string> };

/** Kolom CSV TDP yang berisi id karyawan versi kelola — jembatan ke iProfile. */
const KOLOM_REF = 'Referance ID';
/** Kolom CSV TDP yang berisi nama jabatan (position_label), sama dengan Target Position. */
const KOLOM_JABATAN = 'Position Title';

export type PermintaanPenerus = {
  /** Id karyawan versi kelola, dari kartu Succession Plan. */
  refIds: string[];
  /** Jabatan pemilik kartu, atau `null` kalau tidak dikirim. */
  posisi: string | null;
};

/** Permintaan dari URL, atau `null` kalau halaman ini dibuka dengan cara biasa. */
export function bacaPermintaanPenerus(): PermintaanPenerus | null {
  if (typeof window === 'undefined') return null;
  const q = new URLSearchParams(window.location.search);
  const mentah = q.get('successors');
  if (!mentah) return null;
  const refIds = mentah.split(',').map((s) => s.trim()).filter(Boolean);
  if (refIds.length === 0) return null;
  const posisi = (q.get('position') ?? '').trim();
  return { refIds, posisi: posisi === '' ? null : posisi };
}

/**
 * Id karyawan TDP untuk para penerus yang diminta — dipakai untuk men-PIN mereka,
 * bukan menyaring (lihat catatan di kepala berkas).
 *
 * Larik KOSONG berarti "jangan pin siapa pun" — bukan "sembunyikan semua orang". Itu
 * terjadi kalau tak satu pun id ketemu (misalnya kartu iProfile-nya berisi orang yang
 * tidak tampil di TDP). Karena ini pin, bukan filter, kegagalan pemetaan di sini tidak
 * pernah membuat layarnya tampak kosong — paling buruk, tidak ada yang tersorot.
 */
export function idKaryawanPenerus(employees: KaryawanTdp[]): string[] {
  const p = bacaPermintaanPenerus();
  if (!p) return [];
  const diminta = new Set(p.refIds);
  return employees
    .filter((e) => {
      const ref = (e.csvFields?.[KOLOM_REF] ?? '').trim();
      return ref !== '' && diminta.has(ref);
    })
    .map((e) => e.id);
}

/**
 * Nama Target Position yang diminta, kalau jabatan itu MEMANG ada di data TDP.
 *
 * Divalidasi, bukan dipercaya: dropdown-nya hanya berisi jabatan yang benar-benar ada,
 * jadi nilai yang tak dikenal akan membuatnya tampil kosong — pemakai melihat kotak
 * tanpa isi dan tak tahu konteks skor yang sedang berlaku.
 */
export function posisiTargetPenerus(employees: KaryawanTdp[]): string | null {
  const p = bacaPermintaanPenerus();
  if (!p?.posisi) return null;
  const ada = employees.some((e) => (e.csvFields?.[KOLOM_JABATAN] ?? '').trim() === p.posisi);
  return ada ? p.posisi : null;
}
