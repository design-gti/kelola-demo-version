/**
 * Penghubung tipis antara header dan tur onboarding.
 *
 * Keduanya tidak saling mengimpor komponen: header hanya menyiarkan kapan modal
 * penjelasan menu dibuka/ditutup, dan menandai tombolnya dengan atribut data
 * supaya tur bisa menemukannya tanpa tahu struktur DOM header. Dengan begitu
 * header tetap berdiri sendiri kalau turnya dicabut, dan sebaliknya.
 */

/** Atribut penanda tombol ikon "i" di header. */
export const MENU_INFO_BUTTON_ATTR = "data-menu-info-button";

/** Event window: detail { open: boolean, pathname: string }. */
export const MENU_INFO_EVENT = "kelola:menu-info";

/** Dipancarkan kalau user ingin mengulang tur dari mana pun. */
export const TOUR_RESTART_EVENT = "kelola:restart-tour";

export type MenuInfoEventDetail = { open: boolean; pathname: string };

/** Cari tombol ikon "i" yang sedang terpasang di header. */
export const findMenuInfoButton = (): HTMLElement | null =>
  document.querySelector<HTMLElement>(`[${MENU_INFO_BUTTON_ATTR}]`);

/** Panggil dari mana saja untuk memutar ulang tur. */
export const restartTour = () => window.dispatchEvent(new CustomEvent(TOUR_RESTART_EVENT));
