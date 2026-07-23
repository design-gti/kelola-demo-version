# Panduan Data Demo

Folder ini adalah **sumber data** aplikasi demo. Semua yang tampil di UI berasal
dari sini — tidak ada data yang di-hardcode di komponen.

## Sumber kebenaran (satu-satunya yang diedit manual)

| File | Isi |
|------|-----|
| `participants.csv` | Data orang: nama, jabatan, departemen, tim, DISC, potential, manajer, suksesor, skor (behavioral/technical/performance/leadership/competency/prediction/engagement) |
| `assignments.csv` | Penugasan assessment per peserta |

> Nama peserta memakai pemain bola Piala Dunia 2026 (preferensi demo).

## File turunan (JANGAN diedit manual — akan ditimpa)

| File | Dibuat oleh | Catatan |
|------|-------------|---------|
| `../../src/data/model/generated.ts` | `scripts/seed.mjs` | Dipakai seluruh app React |
| `iprofile-data.json` | `scripts/gen-iprofile.mjs` | Detail iProfile per orang |
| `tdp-employees.csv` | `scripts/gen-tdp-data.mjs` | Data TDP; di-fetch runtime oleh app TDP |
| `idp-data.json` | hand-edit + `scripts/align-idp-data.mjs` | Isi program boleh diedit; **field identitas** (role, dept, email, nik, inisial PIC, participantPool) selalu di-align ulang dari `participants.csv` |

## Cara mengubah data

Setelah mengedit CSV, jalankan:

```bash
npm run seed
```

Ini menjalankan `seed.mjs → gen-iprofile.mjs → align-idp-data.mjs → gen-tdp-data.mjs`
dan otomatis ikut jalan tiap `npm run dev` / `npm run build` (predev/prebuild).

### Per skenario

1. **Ubah data orang / skor / relasi** → edit `participants.csv` → `npm run seed`.
   Merambat ke Home, Team Profile, Talent Mapping, Vismap, iProfile, dan identitas IDP.

2. **Ubah assignment** → edit `assignments.csv` → `npm run seed`.

3. **Ubah konten program IDP** (nama program, vendor, tanggal, komentar, review,
   notifikasi) → edit langsung `idp-data.json`.
   Jangan ubah role/dept/email/nik/pool di sini — ubah lewat `participants.csv`.

4. **Ubah detail iProfile** → ubah lewat `participants.csv`, atau untuk mengubah
   logika turunannya edit `scripts/gen-iprofile.mjs` → `npm run seed`.

5. **Ubah data TDP** → edit `participants.csv` → `npm run seed` → reload TDP.
   Tidak perlu rebuild (lihat bagian **TDP** di bawah).

### Catatan

- `generated.ts` adalah artefak build; kalau dev server sudah jalan, **wajib
  `npm run seed`** (atau restart `npm run dev`) setelah mengedit CSV.
- JSON (`iprofile-data.json`, `idp-data.json`) di-fetch saat runtime → cukup
  reload browser setelah regen, tanpa rebuild.

## TDP

Sejak refactor, TDP **membaca `tdp-employees.csv` dari folder ini saat runtime**
(sama seperti IDP/iProfile). Jadi untuk **ubah data** cukup:

- edit `participants.csv` → `npm run seed` → reload TDP. **Tidak perlu rebuild TDP.**

Rebuild TDP hanya perlu kalau **kode** app TDP berubah (repo `tdp-prototype`, sejajar
dengan `kelola-demo-version`):

```bash
cd ../../../tdp-prototype     # dari public/data
npm run build
rm -rf ../kelola-demo-version/public/tdp && cp -r dist ../kelola-demo-version/public/tdp
```

> TDP menyimpan draft di localStorage browser. Jika data lama masih muncul,
> bersihkan localStorage untuk halaman TDP.
