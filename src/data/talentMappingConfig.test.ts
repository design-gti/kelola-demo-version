// @vitest-environment jsdom
//
// Konfigurasi Talent Mapping sengaja hanya hidup di memori sesi: berlaku penuh
// selama demo berjalan, hilang begitu halaman dimuat ulang. Tes ini menjaga
// justru sifat yang mudah "diperbaiki" keliru di kemudian hari — menambahkan
// localStorage atau cookie akan membuat pengaturan selamat dari refresh dan
// diam-diam membatalkan tujuannya.
import { describe, expect, it, beforeEach, vi } from "vitest";
import { getEffectiveConfig, saveConfig, resetConfig } from "./talentMappingConfig";
import { TI_CONFIG } from "./talentMappingShared";

const tweaked = { ...TI_CONFIG, boxes: TI_CONFIG.boxes.map(b => ({ ...b, label: `X-${b.order}` })) };

describe("simpanan konfigurasi Talent Mapping — lingkup sesi", () => {
  beforeEach(() => {
    resetConfig("TI");
    resetConfig("TR");
  });

  it("menyimpan lalu membaca kembali suntingan dalam sesi yang sama", () => {
    saveConfig("TI", tweaked);
    expect(getEffectiveConfig("TI").boxes.map(b => b.label)).toEqual(tweaked.boxes.map(b => b.label));
  });

  it("tidak menyentuh localStorage maupun cookie", () => {
    const setItem = vi.spyOn(Storage.prototype, "setItem");
    const cookieSetter = vi.fn();
    Object.defineProperty(document, "cookie", { configurable: true, get: () => "", set: cookieSetter });

    saveConfig("TI", tweaked);

    expect(setItem).not.toHaveBeenCalled();
    expect(cookieSetter).not.toHaveBeenCalled();

    setItem.mockRestore();
    Reflect.deleteProperty(document, "cookie");
  });

  it("deskripsi box dan deskripsi tag ikut tersimpan", () => {
    // Keduanya opsional, jadi mudah terlewat saat daftar medan tersimpan
    // diperbarui — dan kalau terlewat, keterangan yang sudah diketik user
    // lenyap begitu ia berpindah halaman lalu kembali.
    saveConfig("TI", {
      ...TI_CONFIG,
      boxes: TI_CONFIG.boxes.map((b, i) => (i === 0 ? { ...b, description: "Catatan box pertama" } : b)),
      tagDescriptions: { Talent: "Karyawan berpotensi tinggi" },
    });

    const back = getEffectiveConfig("TI");
    expect(back.boxes[0].description).toBe("Catatan box pertama");
    expect(back.tagDescriptions).toEqual({ Talent: "Karyawan berpotensi tinggi" });
  });
  it("konfigurasi tiap box mapping berdiri sendiri", () => {
    saveConfig("TI", tweaked);
    expect(getEffectiveConfig("TR").boxes.map(b => b.label))
      .not.toEqual(tweaked.boxes.map(b => b.label));
  });

  it("resetConfig mengembalikan ke bawaan layout", () => {
    saveConfig("TI", tweaked);
    resetConfig("TI");
    expect(getEffectiveConfig("TI").boxes.map(b => b.label)).toEqual(TI_CONFIG.boxes.map(b => b.label));
  });
});
