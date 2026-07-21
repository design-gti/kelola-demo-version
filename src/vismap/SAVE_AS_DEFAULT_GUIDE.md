# 📝 Panduan: Menjadikan Data Saat Ini Sebagai Default

## Tentang Fitur Ini

Fitur **"Save as Default"** memungkinkan Anda menyimpan data karyawan yang sekarang (termasuk nama dan foto) sebagai **data default utama** untuk aplikasi org chart ini.

## Mengapa Fitur Ini Diperlukan?

Secara default, aplikasi menggunakan data dari file `/data/orgChartData.ts`. Ketika Anda mengedit data melalui Data Editor, perubahan tersebut tersimpan di **browser localStorage**, bukan di file source code.

Dengan fitur ini, Anda bisa:
- ✅ Menjadikan data yang sudah diedit sebagai data default permanen
- ✅ Mengganti sample data dengan data perusahaan Anda yang sebenarnya
- ✅ Memastikan ketika reset, data yang muncul adalah data perusahaan Anda

## Cara Menggunakan

### Langkah 1: Buka Data Editor
1. Klik tombol **"Edit Data"** (icon ⚙️ Settings) di pojok kiri bawah aplikasi
2. Data Editor akan terbuka dengan semua data karyawan saat ini

### Langkah 2: Klik "Save as Default"
1. Di header Data Editor, klik tombol **"⭐ Save as Default"** (warna kuning/amber)
2. Dialog instruksi akan muncul

### Langkah 3: Pilih Metode

#### Metode A: Copy Code (Recommended)
1. Klik tombol **"Copy Code"**
2. Code TypeScript akan tersalin ke clipboard
3. Buka file `/data/orgChartData.ts` di editor Anda
4. Cari array `export const employees: Employee[] = [...]`
5. **Replace** isi array tersebut dengan code yang baru dicopy
6. **Save** file `orgChartData.ts`
7. **Refresh** browser untuk melihat perubahan

#### Metode B: Download File
1. Klik tombol **"Download File"**
2. File `orgChartData-default.ts` akan terdownload
3. Buka file tersebut dan copy isinya
4. Paste ke `/data/orgChartData.ts` (replace array `employees`)
5. **Save** file dan **refresh** browser

### Langkah 4: Verifikasi
1. Setelah save file dan refresh browser
2. Klik tombol **"Reset"** di Data Editor
3. Jika berhasil, data yang muncul akan sesuai dengan data yang Anda simpan sebagai default

## ⚠️ Catatan Penting

### Tentang Foto/Image:

- **Foto dari URL** (Unsplash, Imgur, dll) → ✅ **AKAN** disertakan dalam default data
- **Foto yang di-upload ke IndexedDB** → ❌ **TIDAK AKAN** disertakan dalam default data

**Kenapa?** Foto yang di-upload tersimpan di browser IndexedDB, bukan di source code. Untuk menjadikan foto sebagai default, Anda harus:
1. Upload foto ke hosting (Unsplash, Imgur, Cloudinary, dll)
2. Gunakan URL foto tersebut, bukan upload file

### Data Yang Disertakan:
✅ ID karyawan  
✅ Nama  
✅ Position  
✅ Job Title  
✅ Competency Score  
✅ Manager ID  
✅ Performance Rating  
✅ Image URL (bukan base64 atau IndexedDB reference)  

## Struktur Code Yang Di-generate

```typescript
export const employees: Employee[] = [
  {
    id: "1",
    name: "Sarah Chen",
    position: "Chief Executive Officer",
    jobTitle: "Executive",
    competencyScore: 98,
    successors: 4,
    imageUrl: "https://images.unsplash.com/photo-...",
    performanceRating: 5
  },
  {
    id: "2",
    name: "Michael Rodriguez",
    position: "VP of Engineering",
    jobTitle: "Executive",
    competencyScore: 96,
    successors: 3,
    managerId: "1",
    imageUrl: "https://images.unsplash.com/photo-...",
    performanceRating: 5
  },
  // ... dst
];
```

## Tips & Best Practices

### 1. Backup Data Lama
Sebelum mengganti default data, **backup** file `orgChartData.ts` yang lama:
```bash
cp data/orgChartData.ts data/orgChartData.backup.ts
```

### 2. Validasi Data
Pastikan data sudah benar sebelum save as default:
- Cek nama karyawan
- Cek hierarki (Manager ID)
- Cek competency score
- Cek performance rating

### 3. Image URLs
Untuk best practice:
- Gunakan Unsplash untuk placeholder: `https://images.unsplash.com/photo-...`
- Gunakan Cloudinary/Imgur untuk custom photos
- **Jangan** gunakan foto yang di-upload ke IndexedDB sebagai default

### 4. Testing
Setelah update default data:
1. Clear localStorage: `localStorage.clear()`
2. Refresh browser
3. Verify data yang muncul adalah data default baru

## Troubleshooting

### Data tidak berubah setelah update file?
- Pastikan sudah **save** file `orgChartData.ts`
- **Refresh** browser (Ctrl/Cmd + R)
- Jika masih sama, clear localStorage dan refresh lagi

### Foto tidak muncul?
- Pastikan menggunakan **image URL**, bukan base64 atau IndexedDB reference
- Cek apakah URL foto masih valid (buka di browser)

### Error saat paste code?
- Pastikan paste di tempat yang benar (dalam array `employees`)
- Pastikan syntax TypeScript valid
- Pastikan tidak ada koma yang hilang

## Workflow Lengkap

```
1. Edit data via Data Editor
   ↓
2. Upload/paste foto via image URL
   ↓
3. Save changes
   ↓
4. Klik "Save as Default"
   ↓
5. Copy code / Download file
   ↓
6. Paste ke /data/orgChartData.ts
   ↓
7. Save file
   ↓
8. Refresh browser
   ↓
9. Verify dengan Reset
```

## Kapan Menggunakan Fitur Ini?

✅ **Gunakan** ketika:
- Anda sudah selesai setup data perusahaan
- Data karyawan sudah final dan valid
- Ingin data ini menjadi default permanen
- Ingin share codebase dengan team

❌ **Jangan gunakan** ketika:
- Masih testing/eksperimen
- Data sering berubah
- Hanya temporary changes

---

**🎯 Tujuan Akhir**: Data perusahaan Anda yang sebenarnya menjadi default data, sehingga ketika reset atau fresh install, data yang muncul adalah data perusahaan Anda, bukan sample data.
