import { describe, expect, it } from 'vitest';
import { BOBOT_BAWAAN, csvKe100, rapikanBobot, skalaCsv, skorAkhir, skorCluster } from './pembobotan';
import { hitungSkor3C } from './skor3C';

describe('konversi ke skala 0–100', () => {
  it('butir aspek 1–5 dikali 20; kolom polos sudah 0–100', () => {
    expect(skalaCsv('[GENERAL] Keandalan')).toBe(5);
    expect(skalaCsv('[TECHNICAL] Pengelolaan Data')).toBe(5);
    expect(skalaCsv('[POTENSI] Logika Berpikir')).toBe(5);
    expect(skalaCsv('Performance')).toBe(100);
    expect(skalaCsv('Engagement')).toBe(100);
    expect(skalaCsv('Potensi')).toBe(100);

    expect(csvKe100('[GENERAL] Keandalan', '4')).toBe(80);
    expect(csvKe100('[POTENSI] Logika Berpikir', '5')).toBe(100);
    expect(csvKe100('Performance', '92')).toBe(92);
  });

  it('persen dan spasi dibaca; kosong dan bukan angka menjadi null; hasil dijepit 0–100', () => {
    expect(csvKe100('Performance', '97%')).toBe(97);
    expect(csvKe100('Performance', ' 88 ')).toBe(88);
    for (const v of ['', undefined, null, '#N/A', 'N/A', 'teks']) expect(csvKe100('Performance', v)).toBeNull();
    expect(csvKe100('[GENERAL] X', '9')).toBe(100); // 9 × 20 = 180 → dijepit
    expect(csvKe100('Performance', '-5')).toBe(0);
  });

  it('adil: butir 1–5 dan Performance 0–100 dengan nilai "sama baiknya" menghasilkan angka sama', () => {
    expect(csvKe100('[GENERAL] X', '4')).toBe(csvKe100('Performance', '80'));
  });
});

describe('bobot variabel', () => {
  it('bawaan 1; kelipatan 0,5; tidak boleh 0; ada batas atas', () => {
    expect(BOBOT_BAWAAN).toBe(1);
    expect(rapikanBobot(1.5)).toBe(1.5);
    expect(rapikanBobot(2)).toBe(2);
    expect(rapikanBobot(1.7)).toBe(1.5);
    expect(rapikanBobot(0)).toBe(0.5);
    expect(rapikanBobot(-3)).toBe(0.5);
    expect(rapikanBobot(99)).toBe(10);
    expect(rapikanBobot(Number.NaN)).toBe(1);
  });
});

describe('skor cluster = rata-rata tertimbang', () => {
  it('bobot semua 1 → rata-rata biasa', () => {
    expect(skorCluster([{ nilai: 80, bobot: 1 }, { nilai: 60, bobot: 1 }])).toBe(70);
  });

  it('bobot 2 membuat variabel itu dua kali lebih berpengaruh, dan skor tetap skala 100', () => {
    // (90×2 + 60×1) / 3 = 80
    expect(skorCluster([{ nilai: 90, bobot: 2 }, { nilai: 60, bobot: 1 }])).toBe(80);
    expect(skorCluster([{ nilai: 100, bobot: 10 }, { nilai: 100, bobot: 0.5 }])).toBeLessThanOrEqual(100);
  });

  it('data kosong dilewati (tidak dianggap nol); semuanya kosong → null', () => {
    expect(skorCluster([{ nilai: 80, bobot: 1 }, { nilai: null, bobot: 2 }])).toBe(80);
    expect(skorCluster([{ nilai: null, bobot: 1 }])).toBeNull();
    expect(skorCluster([])).toBeNull();
  });

  it('cluster berbutir banyak tak otomatis mengalahkan cluster berbutir satu', () => {
    const banyak = skorCluster(Array.from({ length: 40 }, () => ({ nilai: 50, bobot: 1 })));
    expect(banyak).toBe(50);
  });
});

describe('skor akhir = rata-rata skor cluster', () => {
  it('rata-rata cluster yang punya data, skala 100', () => {
    expect(skorAkhir([80, 60, 100])).toBe(80);
  });

  it('cluster tanpa data dilewati, bukan nol', () => {
    expect(skorAkhir([80, null, 60])).toBe(70);
  });

  it('tak ada cluster berdata → 0', () => {
    expect(skorAkhir([])).toBe(0);
    expect(skorAkhir([null])).toBe(0);
  });
});

describe('skor 3C untuk kartu Compare', () => {
  it('Capability: kolom "Capability" dipakai bila ada, selain itu rata-rata General+Technical ×20', () => {
    expect(hitungSkor3C({ Capability: '87' }).capability).toBe(87);
    expect(hitungSkor3C({ Capability: '87' }).adaCapability).toBe(true);
    expect(hitungSkor3C({ '[GENERAL] A': '4', '[TECHNICAL] B': '2' }).capability).toBe(60);
  });
});

describe('bobot cluster', () => {
  it('bobot cluster 2 membuat skor cluster itu dua kali lebih berpengaruh di skor akhir', () => {
    // (90×2 + 60×1) / 3 = 80
    expect(skorAkhir([90, 60], [2, 1])).toBe(80);
    // tanpa bobot = rata-rata biasa
    expect(skorAkhir([90, 60])).toBe(75);
  });

  it('cluster tanpa data dilewati beserta bobotnya', () => {
    expect(skorAkhir([90, null, 60], [2, 5, 1])).toBe(80);
  });
});
