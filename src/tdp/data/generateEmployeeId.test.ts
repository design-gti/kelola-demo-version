// @vitest-environment node
import { describe, expect, it } from "vitest";
import { generateEmployeeId } from "./tdpEmployees";

/*
  Pagar untuk satu bug yang SENYAP.

  Versi lama fungsi ini membuang setiap karakter non-digit lalu menyusun ulang
  `EMP` + angka. Terhadap CSV demo ia tak apa-apa; terhadap data sungguhan ia
  menciptakan tabrakan dari nilai yang justru dijamin unik oleh UNIQUE constraint
  `employees.employee_number`.

  Gejala yang terlihat cuma peringatan React ("two children with the same key").
  Yang TIDAK terlihat jauh lebih buruk: `EmployeeDetailModal` merender
  `ID: {employee.id}`, jadi orang bernomor `EMPZ001` ditampilkan sebagai `EMP001` —
  nomor milik orang lain.

  Berkas ini tak dijaga `tsc` (pulau TDP bertanda `@ts-nocheck`), jadi uji inilah
  satu-satunya yang menahannya kembali.
*/
describe("generateEmployeeId", () => {
  it("nomor yang hanya beda HURUF tidak boleh jatuh ke id yang sama", () => {
    // Kasus sungguhan di tenant Staging Kelola. Versi lama memulangkan `EMP001` untuk
    // KEDUANYA, karena huruf `Z` ikut dibuang.
    expect(generateEmployeeId("EMPZ001")).not.toBe(generateEmployeeId("EMP001"));
  });

  it("mengembalikan nomor apa adanya", () => {
    expect(generateEmployeeId("EMP001")).toBe("EMP001");
    expect(generateEmployeeId("EMPZ001")).toBe("EMPZ001");
    expect(generateEmployeeId("190701005433")).toBe("190701005433");
  });

  it("tidak lagi memadatkan angka pendek jadi tiga digit", () => {
    // `1` dan `01` dan `001` dulu SEMUANYA jadi `EMP001`.
    const hasil = ["1", "01", "001"].map(generateEmployeeId);
    expect(new Set(hasil).size).toBe(3);
  });

  it("membuang spasi pinggir, karena spasi bukan bagian dari nomor", () => {
    expect(generateEmployeeId("  EMP001  ")).toBe("EMP001");
  });

  it("seluruh nomor tenant tetap unik sesudah dilewatkan", () => {
    // Cerminan constraint di basis data: nomor unik masuk, harus unik pula keluar.
    const nomor = ["EMP001", "EMPZ001", "EMP002", "EMP010", "EMP0010"];
    expect(new Set(nomor.map(generateEmployeeId)).size).toBe(nomor.length);
  });
});
