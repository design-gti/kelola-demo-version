Foto karyawan, satu berkas per employee: `{id}.png` — id-nya sama dengan kolom
`id` di public/data/participants.csv, yaitu p01 sampai p112.

Perhatikan formatnya: p01 (pakai nol di depan) untuk 1-9, lalu p10-p99, lalu
p100-p112 tanpa nol depan. Semua huruf kecil.

Id yang belum punya berkas di sini jatuh ke ../male.jpg atau ../female.jpg,
dipilih menurut kolom `gender` di participants.csv — jadi tidak akan ada kotak
kosong meski fotonya diunggah bertahap.

Daftar lengkap id → nama → gender ada di public/data/daftar-foto-employee.csv.
