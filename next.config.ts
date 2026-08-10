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
 * Salah isi di sini = iframe blank total di Integro tanpa pesan error apa pun,
 * karena kegagalan iframe lintas origin tidak memancarkan event yang bisa
 * ditangkap halaman induk.
 */
const FRAME_ANCESTORS = [
  "https://*.talentlytica.net",
  "https://*.talentlytic.com",
  "https://*.talentlytica.app",
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
