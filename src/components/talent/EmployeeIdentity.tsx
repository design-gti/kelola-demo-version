"use client";
import { Avatar } from "@mantine/core";

const FONT = "'Open Sans', sans-serif";
const ACCENT = "#016699";

function initials(name: string): string {
  return name.split(" ").slice(0, 2).map(w => w[0] || "").join("").toUpperCase();
}

/**
 * Identitas satu karyawan: foto, nama, jabatan.
 *
 * Pola ini sebelumnya ditulis ulang inline di setiap tempat yang memerlukannya,
 * jadi ukuran foto, tebal huruf, dan warna jabatannya sempat berbeda-beda antar
 * kartu. Disatukan di sini supaya orang yang sama terlihat sama di mana pun ia
 * muncul.
 *
 * Fotonya memakai Avatar Mantine: kalau berkasnya tidak ada, ia jatuh ke
 * inisial nama alih-alih meninggalkan kotak kosong.
 */
export default function EmployeeIdentity({ employeeId, name, position, size = 28, meta }: {
  employeeId?: string;
  name: string;
  position?: string;
  size?: number;
  /** Keterangan tambahan di bawah jabatan — misal tag kategori kotak. */
  meta?: React.ReactNode;
}) {
  return (
    <span style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0, flex: 1 }}>
      <Avatar
        radius="xl"
        size={size}
        src={employeeId ? `/avatars/employee/${employeeId}.png` : null}
        style={{ flexShrink: 0, background: "#e6f3f8" }}
      >
        <span style={{ color: ACCENT, fontFamily: FONT, fontWeight: 700, fontSize: Math.max(9, size * 0.36) }}>
          {initials(name)}
        </span>
      </Avatar>
      {/* Nama dan jabatan dipotong dengan ellipsis, bukan dibungkus: tinggi
          barisnya harus tetap sama supaya daftarnya terbaca sebagai satu kolom. */}
      <span style={{ minWidth: 0 }}>
        <span style={{ display: "block", fontFamily: FONT, fontSize: 12, fontWeight: 600, color: "#495057", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {name}
        </span>
        {position && (
          <span style={{ display: "block", fontFamily: FONT, fontSize: 10, color: "#adb5bd", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {position}
          </span>
        )}
        {meta}
      </span>
    </span>
  );
}
