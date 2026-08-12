import type { NextConfig } from "next";

/**
 * Host Integro yang boleh meng-embed demo ini sebagai iframe (sub-menu
 * Visibility Platform). Perhatikan `talentlytic.com` memang TANPA huruf "a" —
 * itu domain staging betulan (stagingintegro.talentlytic.com), bukan salah ketik.
 *
 * Bentuk `*.talentlytic.com` TIDAK mencocokkan `talentlytic.com` telanjang.
 * Kalau kelak ada tenant yang diakses tanpa subdomain, host itu harus ditulis
 * terpisah di daftar ini.
 *
 * http://localhost:* dan http://127.0.0.1:* adalah host pengembangan lokal Integro.
 * Wildcard port disengaja (setup dev bervariasi: port 80 via nginx, 8000 via artisan serve).
 * Risikonya minimal: halaman lintas origin tidak bisa membaca isi frame, jadi yang
 * dilonggarkan hanya proteksi clickjacking (tidak relevan untuk demo).
 *
 * Salah isi di sini = iframe blank total di Integro tanpa pesan error apa pun,
 * karena kegagalan iframe lintas origin tidak memancarkan event yang bisa
 * ditangkap halaman induk.
 */
const FRAME_ANCESTORS = [
  "https://*.talentlytica.net",
  "https://*.talentlytic.com",
  "https://*.talentlytica.app",
  "http://localhost:*",
  "http://127.0.0.1:*",
];

const nextConfig: NextConfig = {
  devIndicators: false,
  async rewrites() {
    return [
      { source: "/tdp", destination: "/tdp/index.html" },
      { source: "/tdp/", destination: "/tdp/index.html" },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: `frame-ancestors 'self' ${FRAME_ANCESTORS.join(" ")};`,
          },
        ],
      },
    ];
  },
};

export default nextConfig;
