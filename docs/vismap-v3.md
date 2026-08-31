# PRD — Vismap V3 (Sandbox Eksplorasi Desain)

Status: **Draft / dalam pengerjaan** · Modul: Visibility Map (`/vismap`) · Basis: V1

## 1. Latar Belakang

Halaman Visibility Map saat ini punya dua versi yang bisa ditukar lewat pil
switch mengapung di kiri bawah kanvas:

| Versi | Lokasi kode | Sifat |
|---|---|---|
| **V1 (Current)** | `src/vismap/App.tsx` (1591 baris) | Versi produksi. Org chart pan/zoom, tab filter, heatmap, table view, simulate, panel detail, modal-modal. |
| **V2** | `src/vismap/v2/VismapV2.tsx` | Eksplorasi arah lain: kanvas sendiri dengan layer heatmap multi-pilih + Initiatives. Menimpa kanvas V1, tab-nya menggantikan tab V1 di top bar. |

Kebutuhan baru: satu ruang lagi (**V3**) untuk mengeksplorasi desain
**bertolak dari V1**, bukan dari V2. V3 harus bisa diubah bebas —
layout, toolbar, bentuk kartu — tanpa satu pun perilaku V1 bergeser,
karena V1 masih dipakai untuk demo ke klien.

## 2. Tujuan

1. V3 tersedia sebagai opsi ketiga di switch versi, dengan titik awal yang
   **identik secara visual dan fungsional dengan V1** pada hari pertama.
2. Perubahan apa pun di V3 tidak boleh merambat ke V1 atau V2.
3. Eksplorasi bisa langsung dimulai di file V3 tanpa refactor dulu.

### Non-tujuan

- Bukan pembuatan desain baru. PRD ini hanya menyiapkan wadah + salinan V1;
  arah desain V3 diputuskan belakangan oleh product designer.
- Tidak menyentuh V2 sama sekali.
- Tidak mengubah `/api/vismap-initiative` maupun data layer (`dataManager`,
  `canonicalAdapter`) — V3 membaca sumber data yang sama.
- Belum ada rencana promosi V3 → produksi. Kalau nanti V3 menang, migrasinya
  PRD terpisah.

## 3. Keputusan Arsitektur: isolasi "shell + kartu"

Tiga level isolasi ditimbang, dan yang dipilih level tengah:

| Opsi | Konsekuensi | Putusan |
|---|---|---|
| Wrapper tipis (V3 pakai komponen V1, cabang lewat prop `version`) | Duplikasi ~0, tapi setiap eksplorasi jadi `if (version === 'v3')` di dalam file produksi V1 — risiko regresi V1 paling tinggi | Ditolak |
| **Shell + kartu** | Salin lapisan yang paling sering diubah desainer: kanvas/toolbar (`App.tsx`) dan kartu org chart (`OrgChartCard`). Sisanya share dulu | **Dipilih** |
| Isolasi penuh (semua komponen vismap disalin) | Bebas total, tapi ~8k baris duplikat dan drift dari V1 melebar cepat | Ditolak |

### Yang disalin sekarang

| Sumber | Tujuan | Alasan |
|---|---|---|
| `src/vismap/App.tsx` | `src/vismap/v3/VismapV3.tsx` | Shell: pan/zoom, top bar, tab filter, search, zoom control, simulate, susunan `OrgNode` — target utama eksplorasi layout |
| `src/vismap/components/OrgChartCard.tsx` | `src/vismap/v3/components/OrgChartCardV3.tsx` | Kartu karyawan: target utama eksplorasi visual |
| `src/vismap/components/SimulationPanel.tsx` | `src/vismap/v3/components/SimulationPanelV3.tsx` + `src/vismap/v3/simulation.ts` | Panel simulasi: konsepnya berubah dari daftar swap datar jadi langkah bernomor dengan verdict dan Consequences per langkah |

### Yang masih share dengan V1 (copy-on-demand)

`EmployeeDetail`, `EmployeeDetailPanel`, `SuccessionPanel`,
`SuccessorComparison`, `IDPCreation`, `TableView`, `TabFilter`, `DataEditor`,
`HeatmapSettings`, `DataVisibilityModal`,
`SuccessionRiskModal`, `NeedDevelopModal`, dan seluruh `components/ui/*`
(shadcn primitives).

**Aturan copy-on-demand:** begitu eksplorasi V3 perlu mengubah salah satu
komponen share di atas, salin dulu komponen itu ke `src/vismap/v3/components/`
dengan sufiks `V3`, ubah salinannya, jangan pernah edit aslinya. Ini satu-satunya
cara V1 dijamin tidak bergeser, dan menahan biaya duplikasi sampai benar-benar
dibutuhkan.

**Amandemen (satu pengecualian):** menambahkan **prop opsional yang default-nya
mempertahankan render V1 apa adanya** diizinkan tanpa menyalin komponennya. V1
tidak mengirim prop itu, jadi keluarannya identik — sifatnya aditif, bukan
mengubah perilaku yang sudah ada. Contoh yang sudah dipakai: `contextLabel` pada
`SuccessionPanel` dan `EmployeeDetailPanel` (§8.7). Alasannya praktis:
menduplikasi 1.649 baris panel hanya untuk satu baris judul justru memperbesar
risiko drift ketimbang menahannya. Yang **mengubah** render existing tetap wajib
disalin.

### Cara V3 di-mount

Mengikuti pola V2 yang sudah ada, bukan pola baru: `App.tsx` (V1) tetap
ter-mount sebagai host dan memegang state `vismapVersion`; V3 dirender sebagai
overlay layar penuh di atas kanvas V1 saat `vismapVersion === 'v3'`. Top bar V1
disembunyikan di mode V3 karena V3 membawa top bar salinannya sendiri. Pil
switch tetap paling atas (z-index tertinggi) supaya selalu bisa balik ke V1.

Konsekuensi yang diterima sadar: V1 tetap ter-mount di belakang V3 (memuat data,
memegang state-nya). Ini sama dengan perilaku V2 hari ini, dan menghindari
refactor `App.tsx` — file yang justru harus tidak disentuh.

## 4. Lingkup Perubahan

1. **Baru** `src/vismap/v3/VismapV3.tsx` — salinan V1, dengan penyesuaian:
   switch versi dan render V2 dibuang (V3 bukan host), state khusus V2
   (`v2Tab`, `v2Layers`) dibuang, `OrgChartCard` diarahkan ke `OrgChartCardV3`,
   dan seluruh gate `vismapVersion === 'v1'` disederhanakan jadi selalu aktif.
2. **Baru** `src/vismap/v3/components/OrgChartCardV3.tsx` — salinan kartu V1.
3. **Ubah** `src/vismap/App.tsx` — union versi jadi `'v1' | 'v2' | 'v3'`, tombol
   ketiga di switch, render `VismapV3`, dan top bar V1 disembunyikan saat V3.
   Tidak ada perubahan lain: semua handler, state, dan cabang V1 tetap apa adanya.
4. **Baru** dokumen ini.

## 5. User Story & Acceptance Criteria

### US-1 — Membuka V3

> Sebagai product designer, saya ingin memilih V3 dari switch versi di halaman
> Visibility Map, supaya saya punya kanvas eksplorasi yang terpisah dari versi
> yang dipakai demo.

**AC-1.1 — Switch versi menampilkan tiga opsi**

```gherkin
Given saya membuka halaman Visibility Map
When halaman selesai memuat data karyawan
Then switch versi di kiri bawah menampilkan tepat tiga tombol: "V1 (Current)", "V2", dan "V3"
And tombol "V1 (Current)" dalam keadaan terpilih
```

**AC-1.2 — Memilih V3 menampilkan kanvas V3**

```gherkin
Given saya berada di Visibility Map dengan versi V1 aktif
When saya menekan tombol "V3" pada switch versi
Then kanvas V3 tampil menutupi kanvas V1
And tombol "V3" menjadi tombol yang terpilih
```

**AC-1.3 — V3 identik dengan V1 di hari pertama**

> Catatan: AC ini berlaku pada **snapshot awal** V3 (saat baru disalin). Sejak
> arah desain di §8 diterapkan, V3 sengaja berbeda dari V1 — AC-1.3 disimpan
> sebagai catatan baseline, bukan lagi kriteria yang harus lulus.

```gherkin
Given saya menekan tombol "V3" pada switch versi
When kanvas V3 tampil
Then org chart, tab filter, kolom pencarian, kontrol zoom, tombol Simulate, dan bentuk kartu karyawan tampak sama dengan V1
```

**AC-1.4 — Hanya satu top bar yang tampil di mode V3**

```gherkin
Given saya berada di Visibility Map dengan versi V3 aktif
When saya memperhatikan area di bawah header aplikasi
Then hanya satu top bar yang tampil, yaitu top bar milik V3
```

### US-2 — Kembali ke versi lain

> Sebagai product designer, saya ingin berpindah dari V3 ke V1 atau V2 kapan
> saja, supaya saya bisa membandingkan dan tetap bisa demo versi produksi.

**AC-2.1 — Kembali dari V3 ke V1**

```gherkin
Given saya berada di Visibility Map dengan versi V3 aktif
When saya menekan tombol "V1 (Current)" pada switch versi
Then kanvas V1 tampil kembali dengan seluruh kontrolnya
And kanvas V3 tidak lagi tampil
```

**AC-2.2 — Berpindah dari V3 ke V2**

```gherkin
Given saya berada di Visibility Map dengan versi V3 aktif
When saya menekan tombol "V2" pada switch versi
Then kanvas V2 tampil beserta tab Default/Heatmap miliknya
And kanvas V3 tidak lagi tampil
```

### US-3 — Mengeksplorasi desain V3 tanpa merusak V1

> Sebagai product designer, saya ingin mengubah desain di V3 dan yakin V1 tetap
> utuh, supaya demo ke klien tidak pernah terganggu oleh eksplorasi saya.

**AC-3.1 — Perubahan kartu V3 tidak mengubah kartu V1**

```gherkin
Given kartu org chart di V3 sudah diubah tampilannya
When saya berpindah ke versi V1
Then kartu org chart V1 tampil dengan desain aslinya, tanpa perubahan dari V3
```

**AC-3.2 — Perilaku V1 tidak berubah setelah V3 ditambahkan**

```gherkin
Given V3 sudah tersedia di switch versi
When saya memakai V1 seperti biasa: berpindah tab, menyalakan heatmap, membuka detail karyawan, dan menjalankan Simulate
Then semua fitur itu berperilaku sama seperti sebelum V3 ada
```

## 6. Risiko & Mitigasi

| Risiko | Mitigasi |
|---|---|
| Duplikasi shell (~2,2k baris) membuat perbaikan bug V1 tidak ikut ke V3 | Diterima sadar — V3 memang sandbox, bukan cabang yang harus sinkron. Kalau V3 dipromosikan, V1 dihapus, bukan di-merge |
| V3 diam-diam mengedit komponen share dan merusak V1 | Aturan copy-on-demand di §3, plus AC-3.1/AC-3.2 sebagai jaring pengaman |
| V1 tetap ter-mount di belakang V3 (dua kanvas hidup, memori & data fetch ganda) | Sama seperti V2 hari ini; belum jadi masalah pada skala data demo (112 karyawan) |
| Nama file/komponen membingungkan setelah eksplorasi melebar | Semua berkas V3 wajib berada di `src/vismap/v3/` dengan sufiks `V3` |

## 7. Verifikasi

- `npm run typecheck` dan `npm run lint` bersih.
- Manual di `/vismap`: switch ke V3, bandingkan dengan V1, lalu balik ke V1
  dan V2 (AC-1.x, AC-2.x).
- Setelah tiap perubahan desain V3: cek ulang AC-3.1 dan AC-3.2 sebelum commit.


---

# §8 Arah Desain V3 — Overlay Indikator di Atas Satu Struktur

Ditambahkan setelah snapshot awal. Bagian ini yang membuat V3 berbeda dari V1.

## 8.1 Masalah pada model V1

V1 memaksa user memilih SATU dari tiga tab view: Default, Succession Risk, atau
Need Develop. Konsekuensinya:

- Indikator tidak bisa dibaca bersamaan. Untuk tahu "posisi ini critical **dan**
  incumbent-nya perlu development", user harus berpindah tab dan mengingat
  keadaan tab sebelumnya.
- Heatmap menempel pada satu kartu utuh, padahal yang dinilai sebenarnya dua hal
  berbeda: **risiko suksesi sebuah posisi** vs **kebutuhan pengembangan orang**
  yang mengisi posisi itu.

## 8.2 Model V3

Satu gambaran struktur organisasi saja. Indikator diatur lewat **toggle**, bisa
menyala sendiri-sendiri atau semuanya sekaligus. Kunci yang memungkinkan ini:
**elemen employee dipisahkan dari card job position**, sehingga masing-masing
punya heatmap sendiri.

```
┌─ frame job position ─────────────┐  ← heatmap Succession Risk
│  NAMA JOB POSITION              │     + ikon Critical Position (samping frame)
│  ┌─ card employee ───────────┐  │  ← heatmap Need Development
│  │  ★ foto + nama karyawan   │  │     + ikon Talent (dalam card employee)
│  └───────────────────────────┘  │
│  Teams · Tenure · data lain     │  ← diatur lewat Filter Card Data
└──────────────────────────────────┘
        ▲ 78% pada garis struktur di atas card  ← overlay %Ready to Promote
```

### Peta toggle → elemen

| Toggle | Elemen yang disentuh | Sumber nilai |
|---|---|---|
| Succession Risk | Heatmap frame **job position** | Kesiapan para calon suksesor posisi (logic & ambang sama dengan tab Succession Risk V1) |
| Need Development | Heatmap **card employee** | Competency score karyawan, range dari Setting Heatmap Condition |
| Critical Position | Badge alert **filled** + gelombang radius, di samping frame position | `criticalPosition` pada data karyawan |
| Talent | Badge bintang **filled** + gelombang radius, pada card employee | Kuadran **Star** pada 9-box Talent Mapping (`nineBoxIndex === 2`) |
| %Ready to Promote | Pil persentase pada garis struktur di atas card position | `readinessScore` (fallback turunan competency), warna dari range readiness |

### Badge indikator: filled + gelombang radius

Critical Position dan Talent memakai `IndicatorBadge`: ikon **filled** (17–18px)
di atas badge berwarna penuh (merah `#E03131` untuk critical, teal `#0F9D8F`
untuk talent) dengan cincin putih 2px sebagai pemisah dari foto di belakangnya —
bukan lagi ikon outline kecil di atas badge putih.

Di atasnya ada **tiga gelombang radius** `animate-ping` yang basisnya melebar
keluar badge (`-inset` 4px, 8px, 12px) dengan jeda 0s / 0,6s / 1,2s. Basis yang
lebih besar itu yang penting: `animate-ping` menskalakan 2× dari ukuran
elemennya, jadi memperbesar basis memperjauh sebaran gelombang, bukan hanya
mempertebal ringnya.

Alasannya: kedua indikator ini menandai **satu-dua kartu di antara 112**, dan
kanvas sering dibaca pada zoom 35–45% di mana ikon kecil hilang sama sekali.
Gerakan yang menyebar luas itulah yang membuat indikator tetap ketemu dari jarak
jauh tanpa harus menyapu seluruh kanvas. Tidak perlu CSS baru: `animate-ping`
sudah ada di Tailwind v4.

### Pembagian dua ukuran kesiapan

Dua indikator berbeda yang mudah tertukar, karena itu sengaja dibedakan bentuknya:

| Yang diukur | Indikator | Letak |
|---|---|---|
| Kesiapan karyawan terhadap posisi **yang diisi sekarang** | Heatmap (warna latar) | Card employee |
| Kesiapan karyawan terhadap **standar posisi di atasnya** (succession readiness) | Pil persentase | Garis struktur di atas card position |

Pil persentase memakai gaya **filled dengan teks selalu putih**, dan latarnya
digelapkan dulu sampai teks putih memenuhi kontras WCAG 4.5:1
(`pillFillColor` di `src/vismap/components/ReadinessPill.tsx`).

| Range readiness | Kontras asli vs putih | Latar pil | Kontras akhir |
|---|---|---|---|
| `#00875A` hijau | 4.55 | `#00875A` (tak berubah) | 4.55 |
| `#DE350B` merah | 4.55 | `#DE350B` (tak berubah) | 4.55 |
| `#FD9F28` oranye | **2.07** — teks putih tak terbaca | `#A7691A` oranye tua | 4.50 |

Penggelapannya generik, bukan hardcode per warna, jadi tetap benar kalau range di
Setting Heatmap Condition diubah. Hanya warna yang terlalu terang yang dikoreksi.

Versi sebelumnya memakai pil outline putih dengan teks 8px yang praktis tak
terbaca pada zoom kanvas normal, lalu sempat memakai teks gelap di atas oranye
terang — keduanya diganti oleh tabel di atas.

**Satu elemen, dua tempat.** `ReadinessPill` dipakai bersama oleh kanvas V3
(`size="md"`, teks 14px) dan panel Succession (`size="sm"`, teks 11px), termasuk
pada baris successor yang **belum di-expand** — yang sebelumnya hanya teks
persentase biasa. Panel memakainya lewat prop opt-in `filledReadinessPill`
(§8.7), sehingga panel V1 tetap memakai chip outline dan teks persentase lamanya.

### Data turunan (tidak ada data baru)

Model `Employee` Vismap tidak punya field Talent, Teams, maupun Tenure. Ketiganya
diturunkan di `src/vismap/v3/employeeFacts.ts` dari sumber yang sudah dipakai
modul lain, supaya angkanya tidak pernah berbeda dari Talent Mapping/iProfile:

- **Talent** — `nineBoxIndex` yang sama dengan modul Talent Mapping.
- **Teams** — `department` karyawan. Store kanonik hanya memodelkan satu
  department per posisi, jadi chip-nya **satu**, bukan dua seperti pada mockup.
- **Tenure** — dihitung dari `joinDate` (iProfile) terhadap `getToday()`, bukan
  `new Date()` langsung, supaya ikut terpaku saat demo dipin.

### Filter Card Data

Tombol `Filter Card Data (n)` menggantikan tombol `+ Variable` milik V1, membuka
modal Data Visibility yang sama. `n` = jumlah field yang sedang tampil di card.

### Menu aksi

Klik satu card position → muncul empat tombol di sampingnya: **Simulation**,
**Succession**, **Development**, **iProfile**. Simulation membuka submenu tahap
kedua (Incumbant: Exchange, Cut & Replace, Promote, Mutation · Job: Change Job
Criteria).

Sambungan pada tahap ini:

| Aksi | Perilaku sekarang |
|---|---|
| Succession | Membuka SuccessionPanel untuk posisi itu |
| Development | Membuka EmployeeDetailPanel (skor + Create IDP) |
| iProfile | Membuka halaman detail karyawan |
| Simulation → Exchange | Masuk Simulation Mode, panel langsung membuka form langkah dengan posisi itu sebagai target dan jenis aksi Exchange |
| Simulation → Cut & Replace | Sama, dengan jenis aksi Cut & Replace |
| Simulation → 3 aksi lain (Promote, Mutation, Change Job Criteria) | **Placeholder**: toast "belum tersedia di V3" |

Tiga aksi terakhir sengaja belum berfungsi supaya tidak ada aksi yang tampak
berhasil padahal tidak mengubah apa pun.

### Model simulasi V3

Panel simulasi V3 tidak menumpang `SimulationPanel` V1. Alasannya bukan gaya,
tapi model: V1 memodelkan satu swap sebagai sepasang id kursi dan menukar field
personal di antaranya. Itu cukup untuk "dua orang tukar kursi", tapi tidak bisa
mengungkapkan langkah yang MENGOSONGKAN kursi, dan tidak bisa menjawab "siapa
yang tergeser" — padahal itu inti panel V3.

Dua perubahan modelnya (`src/vismap/v3/simulation.ts`):

1. **Penghuni kursi dilacak eksplisit.** Satu baris `Employee` = satu KURSI
   berisi orang: `position`/`managerId` menempel pada kursi, `name`/foto/skor
   pada orangnya. Karena perpindahan dilakukan dengan menukar field personal,
   `id` tetap milik kursi — jadi setelah satu langkah, id kursi bukan lagi id
   orangnya, dan fakta berbasis ORANG (mis. `isTalent`) akan menjawab tentang
   orang yang salah. `occupantOf` memetakan kursi → id kanonik penghuninya.
2. **Langkah dievaluasi progresif.** Tiap langkah dilihat pada keadaan saat ia
   dijalankan, bukan keadaan awal — sehingga kotak langkah #2 menyebut orang
   yang baru duduk di sana karena langkah #1, dan menghapus langkah #1 membuat
   seluruh langkah sesudahnya dihitung ulang.

Verdict sebuah langkah = `at-risk` kalau ada konsekuensi, `good` kalau tidak.
Empat aturan konsekuensinya:

| Aturan | Subjek chip | Kapan muncul |
|---|---|---|
| Suksesor siap berkurang | posisi | Jumlah bawahan langsung yang kesiapannya masuk range READY turun. Dihitung untuk SEMUA atasan, bukan hanya dua kursi yang tersentuh — memindahkan orang keluar dari sebuah tim menurunkan kesiapan suksesi atasannya, dan efek itu tidak terlihat di kanvas |
| Kehilangan talent | orang | Orang yang tergeser keluar dari struktur (`cut-replace`) berstatus Talent (kuadran Star 9-box) |
| Posisi jadi kosong | posisi | Kursi yang tadinya terisi menjadi `(Vacant)` |
| Kesiapan di bawah ambang | orang | Kesiapan orang yang masuk di bawah batas bawah range READY |

Ambang READY diambil dari range tertinggi di Setting Heatmap Condition, bukan
angka sendiri, supaya "suksesor siap" di panel berarti sama dengan yang dibaca
heatmap kanvas.

Tombol **Set as Career/Succession Plan** per langkah belum menyimpan apa pun:
bentuk datanya ("career plan" itu posisi target? suksesor? urutan langkah?)
belum ada di store kanonik, jadi ia mengatakannya apa adanya alih-alih menulis
tafsiran yang bisa salah.

## 8.3 User Story & Acceptance Criteria

### US-4 — Mengatur indikator sendiri

> Sebagai HR, saya ingin menyalakan indikator yang saya butuhkan di atas satu
> struktur organisasi, supaya saya tidak perlu berpindah tab dan kehilangan
> konteks.

**AC-4.1 — Struktur tunggal tanpa tab view**

```gherkin
Given saya membuka Visibility Map versi V3
When kanvas V3 tampil
Then tidak ada tab Default, Succession Risk, maupun Need Develop
And yang tampil adalah lima toggle indikator beserta tombol Filter Card Data
```

**AC-4.2 — Semua indikator bisa menyala bersamaan**

```gherkin
Given saya berada di kanvas V3 tanpa indikator yang menyala
When saya menyalakan kelima toggle indikator
Then struktur organisasi menampilkan kelima indikator sekaligus tanpa saling menggantikan
```

**AC-4.3 — Heatmap posisi terpisah dari heatmap karyawan**

```gherkin
Given saya menyalakan toggle Succession Risk dan Need Development bersamaan
When saya memperhatikan satu card position yang incumbent-nya perlu development
Then frame job position mewarnai risiko suksesi
And card employee di dalamnya mewarnai kebutuhan pengembangan
```

**AC-4.4 — Toggle Need Development hanya mewarnai elemen karyawan**

```gherkin
Given hanya toggle Need Development yang menyala
When saya memperhatikan sebuah card position
Then hanya card employee di dalamnya yang berwarna heatmap
And frame job position tetap tanpa warna heatmap
```

**AC-4.5 — Toggle Succession Risk hanya mewarnai frame posisi**

```gherkin
Given hanya toggle Succession Risk yang menyala
When saya memperhatikan sebuah card position yang punya calon suksesor
Then hanya frame job position yang berwarna heatmap
And card employee di dalamnya tetap tanpa warna heatmap
```

**AC-4.6 — Indikator Critical Position**

```gherkin
Given toggle Critical Position menyala
When saya memperhatikan posisi yang berstatus critical
Then ikon alert tampil di samping card job position tersebut
```

**AC-4.7 — Indikator Talent**

```gherkin
Given toggle Talent menyala
When saya memperhatikan karyawan yang masuk kuadran Star pada 9-box
Then ikon bintang tampil pada card employee karyawan tersebut
```

**AC-4.8 — Indikator %Ready to Promote**

```gherkin
Given toggle %Ready to Promote menyala
When saya memperhatikan garis struktur di atas sebuah card position
Then persentase kesiapan promosi tampil pada garis tersebut
```

**AC-4.9 — Posisi kosong tanpa data kesiapan**

```gherkin
Given toggle %Ready to Promote menyala
When saya memperhatikan garis struktur di atas posisi yang kosong
Then pil persentase menampilkan tanda "-" alih-alih angka
```

### US-5 — Bertindak dari card position

> Sebagai HR, saya ingin memilih tindakan langsung dari card position yang saya
> klik, supaya saya tidak perlu mencari menunya di tempat lain.

**AC-5.1 — Menu aksi muncul saat card position diklik**

```gherkin
Given saya berada di kanvas V3
When saya mengklik satu card job position
Then muncul tombol Simulation, Succession, Development, dan iProfile di samping card tersebut
```

**AC-5.2 — Menu tertutup saat card yang sama diklik ulang**

```gherkin
Given menu aksi sebuah card position sedang terbuka
When saya mengklik card position yang sama sekali lagi
Then menu aksi tersebut tertutup
```

**AC-5.3 — Submenu Simulation**

```gherkin
Given menu aksi sebuah card position sedang terbuka
When saya menekan tombol Simulation
Then muncul submenu Exchange, Cut & Replace, Promote, Mutation, dan Change Job Criteria
```

**AC-5.4 — Exchange membuka Simulation Mode pada posisi terpilih**

```gherkin
Given submenu Simulation sebuah card position sedang terbuka
When saya menekan Exchange
Then Simulation Mode aktif dengan posisi tersebut sebagai posisi target
```

**AC-5.5 — Aksi simulasi yang belum tersedia memberi tahu apa adanya**

```gherkin
Given submenu Simulation sebuah card position sedang terbuka
When saya menekan Promote
Then muncul pesan bahwa aksi tersebut belum tersedia di V3
And struktur organisasi tidak berubah
```

**AC-5.7 — Langkah simulasi melaporkan konsekuensinya**

```gherkin
Given Simulation Mode aktif
When saya menambah langkah Cut & Replace yang mengisi sebuah posisi dengan
     kandidat dari posisi lain
Then langkah itu muncul bernomor dengan verdict At Risk
And Consequences-nya menyebut posisi yang jadi kosong, atasan yang kehilangan
    suksesor siap, talent yang tergeser keluar, dan kesiapan yang masih di
    bawah ambang — masing-masing dengan chip subjeknya
And kanvas menampilkan posisi asal kandidat sebagai [VACANT]
```

**AC-5.8 — Menghapus satu langkah menghitung ulang langkah sesudahnya**

```gherkin
Given ada dua langkah simulasi, dan langkah #2 memakai kursi yang diubah
      langkah #1
When saya menghapus langkah #1
Then langkah yang tersisa menampilkan keadaan tanpa langkah #1
And Consequences-nya ikut dihitung ulang
```

**AC-5.6 — Succession membuka panel suksesi posisi**

```gherkin
Given menu aksi sebuah card position sedang terbuka
When saya menekan tombol Succession
Then panel suksesi posisi tersebut terbuka beserta daftar calon suksesornya
```

**AC-5.7 — Development membuka panel pengembangan karyawan**

```gherkin
Given menu aksi sebuah card position sedang terbuka
When saya menekan tombol Development
Then panel pengembangan karyawan tersebut terbuka beserta skor dan aksi Create IDP
```

## 8.4 Yang belum dikerjakan

- Chip Teams masih satu (batas model data), mockup menampilkan dua.
- Cut & Replace, Promote, Mutation, dan Change Job Criteria masih placeholder.
- Tema mengikuti palet terang Kelola, bukan kanvas gelap pada mockup Whimsical —
  keputusan sadar agar perbandingan V1 vs V3 apple-to-apple.

## 8.5 Berkas

| Berkas | Peran |
|---|---|
| `src/vismap/v3/overlays.ts` | Definisi kelima overlay: id, label, elemen sasaran, teks bantuan |
| `src/vismap/v3/employeeFacts.ts` | Turunan Talent (9-box Star), Teams (department), Tenure (joinDate → `getToday()`) |
| `src/vismap/v3/components/OrgChartCardV3.tsx` | Card position + card employee terpisah, dua heatmap, ikon Critical & Talent |
| `src/vismap/v3/components/PositionActionMenu.tsx` | Empat tombol aksi + submenu Simulation |
| `src/vismap/v3/simulation.ts` | Model langkah simulasi: pelacakan penghuni kursi, Exchange & Cut & Replace, aturan Consequences, verdict |
| `src/vismap/v3/components/SimulationPanelV3.tsx` | Panel langkah bernomor: verdict, Consequences yang bisa dilipat, form tambah langkah |
| `src/vismap/v3/VismapV3.tsx` | Toolbar toggle, state overlay, state langkah simulasi, penyaluran aksi ke panel |

Kartu V3 sengaja dibuat "bodoh": semua keputusan overlay dihitung di
`VismapV3`/`OrgNode` lalu diturunkan sebagai warna/boolean. Ini menghindari
pola V1 yang menyebar logic heatmap di dua tempat (kanvas dan kartu) dan membuat
tiap mode heatmap harus dipahami dua kali.

## 8.6 Focus suksesi (aksi Succession)

Aksi **Succession** tidak hanya membuka panel — ia menyalakan heatmap **setempat**
tanpa menyentuh kelima toggle di toolbar. Ini menyalin perilaku V1: di mode
Succession Risk, mengklik satu posisi memperlihatkan kondisi kesiapan para
suksesornya (ready vs perlu develop).

Saat sebuah posisi di-focus:

| Elemen | Yang terjadi |
|---|---|
| Frame job position posisi itu | Heatmap Succession Risk menyala, walau toggle-nya mati |
| Frame job position posisi **lain** | Heatmap Succession Risk **padam**, walau toggle-nya menyala — selama focus, heatmap itu eksklusif milik posisi yang di-focus |
| Calon suksesornya | **Pil %Ready to Promote** tampil di atas card mereka — inilah indikator succession readiness (kesiapan terhadap posisi yang di-focus). Card employee-nya TIDAK diberi heatmap |
| Pil %Ready to Promote posisi **lain** | **Padam**, walau toggle-nya menyala — sama eksklusifnya dengan heatmap succession risk |
| Frame posisi itu | Diberi outline biru sebagai penanda focus |
| Kelima toggle | **Tidak berubah** |

Kumpulan calon suksesor memakai aturan yang sama dengan V1: `successorIds` dari
data bila ada, kalau tidak bawahan langsung, ditambah suksesor yang ditambahkan
manual.

> **Perubahan dari versi sebelumnya:** mode focus dulu menyalakan heatmap pada
> card employee para suksesor. Sekarang yang tampil adalah pil %Ready to Promote,
> mengikuti pembagian dua ukuran kesiapan di §8.2 — heatmap card employee
> khusus kesiapan terhadap posisi saat ini, pil khusus succession readiness.

Focus berakhir bila: panel suksesi ditutup, card position lain dipilih, atau
aksi lain dijalankan (Development, iProfile, Exchange). Begitu focus lepas,
heatmap seluruh posisi kembali mengikuti toggle seperti semula.

Focus **tidak pernah mengubah posisi toggle** — yang diatur hanya apa yang
digambar. Toggle tetap seperti yang disetel user, dan kembali berlaku penuh
setelah focus dilepas. Alasan heatmap posisi lain dipadamkan: focus berarti user
sedang membaca suksesi SATU posisi, dan warna di posisi lain hanya menambah derau
pada bacaan itu.

### US-6 — Melihat kesiapan suksesor tanpa mengubah toggle

> Sebagai HR, saya ingin melihat kondisi kesiapan para suksesor sebuah posisi
> hanya dengan menekan Succession, supaya susunan indikator yang sudah saya atur
> di toolbar tidak perlu saya bongkar.

**AC-6.1 — Frame posisi menyala saat Succession ditekan**

```gherkin
Given semua toggle indikator dalam keadaan mati
When saya menekan tombol Succession pada sebuah card job position
Then frame job position tersebut menyala dengan heatmap Succession Risk
```

**AC-6.2 — Pil kesiapan tampil di atas card suksesor**

```gherkin
Given semua toggle indikator dalam keadaan mati
When saya menekan tombol Succession pada sebuah card job position
Then pil %Ready to Promote tampil di atas card para calon suksesor posisi tersebut
And card employee para suksesor itu tidak diberi heatmap
```

**AC-6.2b — Pil posisi lain padam selama focus**

```gherkin
Given toggle %Ready to Promote menyala sehingga semua posisi menampilkan pil
When saya menekan tombol Succession pada sebuah card job position
Then hanya calon suksesor posisi itu yang menampilkan pil
And pil pada posisi lain padam selama focus berlangsung
```

**AC-6.3 — Toggle di toolbar tidak berubah**

```gherkin
Given semua toggle indikator dalam keadaan mati
When saya menekan tombol Succession pada sebuah card job position
Then kelima toggle di toolbar tetap dalam keadaan mati
```

**AC-6.4 — Hanya posisi yang di-focus yang menyala**

```gherkin
Given saya menekan tombol Succession pada sebuah card job position
When saya memperhatikan card job position lain yang bukan focus
Then card job position lain itu tetap tanpa heatmap
```

**AC-6.5 — Heatmap posisi lain padam selama focus meski toggle menyala**

```gherkin
Given toggle Succession Risk menyala sehingga banyak card position berwarna
When saya menekan tombol Succession pada salah satu card job position
Then hanya card job position itu yang berwarna heatmap succession risk
And card job position lain padam selama focus berlangsung
```

**AC-6.6 — Toggle kembali berlaku penuh setelah focus dilepas**

```gherkin
Given toggle Succession Risk menyala dan sebuah posisi sedang di-focus
When focus dilepas
Then seluruh card position kembali berwarna sesuai toggle Succession Risk
And posisi toggle tidak pernah berubah sepanjang proses itu
```

**AC-6.7 — Focus berakhir saat panel ditutup**

```gherkin
Given sebuah posisi sedang di-focus lewat aksi Succession
When saya menutup panel suksesi
Then heatmap frame posisi dan card employee suksesornya kembali mati
```

## 8.7 Judul konteks pada panel kanan

Panel kanan dipakai bersama oleh beberapa aksi, sehingga tanpa judul user tidak
tahu panel yang terbuka itu dibuka dari aksi apa. V3 mengirim `contextLabel` —
prop opsional yang ditambahkan pada komponen share (lihat amandemen di §3):

| Aksi | Judul panel | Komponen |
|---|---|---|
| Succession | `SUCCESSION` | `SuccessionPanel` |
| Development | `DEVELOPMENT` | `EmployeeDetailPanel` |
| Simulation → Exchange | `Simulation Mode` (sudah ada sejak V1) | `SimulationPanel` |
| iProfile | Halaman penuh, bukan panel — punya header sendiri | `EmployeeDetail` |

### US-7 — Tahu konteks panel yang terbuka

> Sebagai HR, saya ingin tahu panel kanan yang terbuka itu berasal dari aksi apa,
> supaya saya tidak salah membaca isinya sebagai panel yang lain.

**AC-7.1 — Judul panel Succession**

```gherkin
Given saya berada di kanvas V3
When saya menekan tombol Succession pada sebuah card job position
Then panel kanan menampilkan judul "SUCCESSION" di atas nama karyawan
```

**AC-7.2 — Judul panel Development**

```gherkin
Given saya berada di kanvas V3
When saya menekan tombol Development pada sebuah card job position
Then panel kanan menampilkan judul "DEVELOPMENT" di atas nama karyawan
```

**AC-7.3 — Pil persentase di panel sama dengan di kanvas**

```gherkin
Given panel Succession terbuka di kanvas V3
When saya memperhatikan angka persentase pada baris successor
Then angka itu tampil sebagai pil filled yang sama dengan pil di kanvas
And pil itu tetap tampil sebagai pil ketika baris successor di-expand
```

**AC-7.4 — Panel V1 tidak berubah**

```gherkin
Given saya berada di Visibility Map versi V1
When saya membuka panel suksesi atau panel pengembangan seperti biasa
Then tidak ada judul konteks tambahan pada panel tersebut
```

## 8.8 Berkas tambahan

| Berkas | Peran |
|---|---|
| `src/vismap/components/ReadinessPill.tsx` | Pil kesiapan bersama + `pillFillColor` (penggelapan warna demi kontras teks putih). Diletakkan di `components/` — bukan `v3/` — karena dipakai juga oleh `SuccessionPanel` yang berbagi dengan V1 |
