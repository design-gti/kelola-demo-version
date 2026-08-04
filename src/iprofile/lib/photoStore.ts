/**
 * Foto profil yang di-apply lewat "Change profile photo" disimpan di sini, bukan
 * localStorage — kebutuhan demo: begitu browser di-refresh, module ini re-init dan
 * foto kembali ke default, tidak ikut ter-persist.
 */
const store = new Map<string, string>();

export function getEditedPhoto(employeeId: string): string | undefined {
  return store.get(employeeId);
}

export function setEditedPhoto(employeeId: string, dataUrl: string): void {
  store.set(employeeId, dataUrl);
}
