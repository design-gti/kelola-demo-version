// @vitest-environment jsdom
//
// document.cookie di jsdom (via tough-cookie) tidak mereplikasi pengecualian
// "localhost tepercaya" milik Chrome/Firefox untuk atribut Secure, jadi
// menulis lalu membaca balik document.cookie di sini tidak bisa dipakai untuk
// memverifikasi atributnya (assignment akan diam-diam ditolak jar). Sebagai
// gantinya kita spy pada setter document.cookie dan periksa STRING mentah
// yang dikirim saveConfig()/resetConfig() — sama presisinya, tanpa tunduk pada
// kuirk cookie jar jsdom.
import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import { saveConfig, resetConfig } from "./talentMappingConfig";
import { TI_CONFIG } from "./talentMappingShared";

describe("saveConfig / resetConfig — atribut cookie embed", () => {
  let writes: string[];
  let cookieSetter: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    writes = [];
    cookieSetter = vi.fn((v: string) => writes.push(v));
    Object.defineProperty(document, "cookie", {
      configurable: true,
      get: () => writes.join("; "),
      set: cookieSetter,
    });
  });

  afterEach(() => {
    // Pulihkan setter cookie bawaan jsdom supaya tidak membocor ke berkas tes lain.
    Reflect.deleteProperty(document, "cookie");
  });

  it("saveConfig menulis cookie tm-config-ti-v2 dengan atribut yang selamat di iframe lintas situs", () => {
    saveConfig("TI", TI_CONFIG);

    expect(cookieSetter).toHaveBeenCalledTimes(1);
    const written = writes[0];

    // Nama cookie memakai akhiran -v2 (lihat komentar di talentMappingConfig.ts
    // ihwal cookie lama non-partitioned yang bertahan 180 hari di jar terpisah).
    expect(written).toMatch(/^tm-config-ti-v2=/);

    expect(written).toMatch(/SameSite=None/);
    expect(written).toMatch(/Secure/);
    expect(written).toMatch(/Partitioned/);
    expect(written).toMatch(/path=\//);
    expect(written).toMatch(`max-age=${60 * 60 * 24 * 180}`);
  });

  it("saveConfig menulis cookie tm-config-tr-v2 untuk id TR", () => {
    saveConfig("TR", { ...TI_CONFIG, id: "TR" });
    expect(writes[0]).toMatch(/^tm-config-tr-v2=/);
  });

  it("resetConfig menghapus cookie dengan atribut yang SAMA seperti saat ditulis", () => {
    resetConfig("TI");

    expect(cookieSetter).toHaveBeenCalledTimes(1);
    const written = writes[0];

    // Browser mencocokkan atribut cookie saat menghapus. Kalau atribut
    // penghapusan tidak sama dengan atribut penulisan, cookie Partitioned lama
    // tidak benar-benar terhapus.
    expect(written).toMatch(/^tm-config-ti-v2=/);
    expect(written).toMatch(/SameSite=None/);
    expect(written).toMatch(/Secure/);
    expect(written).toMatch(/Partitioned/);
    expect(written).toMatch(/max-age=0/);
  });
});
