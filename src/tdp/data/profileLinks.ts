// @ts-nocheck -- ported from tdp-prototype (Vite, never tsc-checked); not type-maintained here
/**
 * Membuat URL profil eksternal (Kelola) untuk seorang karyawan.
 *
 * URL dibangun dari kolom CSV `Referance ID` (UUID) yang dipetakan ke
 * `employee.csvFields` saat parsing. Dipakai di tab Table (klik nama)
 * dan tab Compare (klik "Create IDP"). Karena aplikasi ini di-embed via
 * iframe, link harus dibuka di parent window (target="_top") supaya yang
 * berpindah halaman adalah browser host, bukan iframe.
 */

const PROFILE_BASE_URL = 'https://demox.kelola.app/company/employee/profile';

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
  return `${PROFILE_BASE_URL}/${encodeURIComponent(referenceId)}`;
}
