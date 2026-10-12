// @ts-nocheck -- ported from tdp-prototype (Vite, never tsc-checked); not type-maintained here
/**
 * Membuat URL profil eksternal (Kelola) untuk seorang karyawan.
 *
 * URL dibangun dari kolom CSV `Referance ID` (UUID) yang dipetakan ke
 * `employee.csvFields` saat parsing. Dipakai di tab Table (klik nama)
 * dan tab Compare (klik "Create IDP"). Link membuka profil di aplikasi
 * eksternal Kelola (di-embed sebagai cross-origin iframe dalam Integro,
 * atau diakses langsung sebagai demo standalone).
 */

/**
 * Profil dibuka DI DALAM aplikasi ini, bukan di demox.kelola.app.
 *
 * Di demo, TDP adalah pulau yang ditanam di aplikasi lain, jadi tautan profilnya keluar
 * ke Kelola. Di sini iProfile ada satu klik jauhnya — mengirim pemakai ke domain lain
 * berarti ia kehilangan sesinya dan mendarat di aplikasi yang datanya bisa berbeda.
 *
 * Route-nya `?id=`, bukan segmen path: detail iProfile hidup di route yang sama dengan
 * daftarnya.
 */
const PROFILE_BASE_URL = '/iprofile';

type EmployeeLike = {
  csvFields?: Record<string, string>;
};

function readReferenceId(employee: EmployeeLike): string | undefined {
  const raw = employee.csvFields?.['Referance ID'];
  const trimmed = (raw ?? '').trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export function getProfileUrl(employee: EmployeeLike): string | undefined {
  const referenceId = readReferenceId(employee);
  if (!referenceId) return undefined;
  return `${PROFILE_BASE_URL}?id=${encodeURIComponent(referenceId)}`;
}
