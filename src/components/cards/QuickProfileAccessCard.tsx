"use client";
import { useState } from "react";
import Link from "next/link";
import { candidates, recentlyViewed, Candidate } from "@/data/dummyData";

export default function QuickProfileAccessCard({ employees }: { employees?: Candidate[] } = {}) {
  const [searchQuery, setSearchQuery] = useState("");
  const pool = employees ?? candidates;

  const results = searchQuery.trim()
    ? pool.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.position.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : employees
      ? pool.slice(0, 5)
      : recentlyViewed.map(id => candidates.find(c => c.id === id)).filter(Boolean).slice(0, 5) as typeof candidates;

  return (
    <div className="bg-white rounded-[12px] p-[16px] w-full" style={{ boxShadow: "2px 4px 10px rgba(0,0,0,0.07)" }}>
      <div style={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 700, fontSize: 12, color: "#495057", marginBottom: 12 }}>
        Quick Profile Access
      </div>
      <input
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        placeholder="Cari nama atau jabatan..."
        style={{
          width: "100%", padding: "0 12px", borderRadius: 9999, border: "1px solid #dee2e6",
          height: 32, fontSize: 10, fontFamily: "'Open Sans', sans-serif", color: "#495057",
          outline: "none", boxSizing: "border-box", marginBottom: 10,
        }}
      />
      {!searchQuery && (
        <div style={{ fontSize: 10, color: "#adb5bd", fontFamily: "Open Sans, sans-serif", marginBottom: 8 }}>
          Terakhir dilihat
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {results.map(c => (
          <div key={c.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 8px", borderRadius: 6, background: "#f8f9fa" }}>
            <div>
              <div style={{ fontSize: 10, fontFamily: "'Open Sans', sans-serif", fontWeight: 700, color: "#495057" }}>{c.name}</div>
              <div style={{ fontSize: 10, fontFamily: "Open Sans, sans-serif", color: "#adb5bd" }}>{c.position}</div>
            </div>
            <Link href={`/iprofile?id=${c.id}`} style={{ fontSize: 11, color: "#016699", fontFamily: "Open Sans, sans-serif", cursor: "pointer", textDecoration: "none" }}>Lihat</Link>
          </div>
        ))}
        {results.length === 0 && (
          <div style={{ fontSize: 10, color: "#adb5bd", fontFamily: "Open Sans, sans-serif", textAlign: "center", padding: "12px 0" }}>
            Tidak ditemukan
          </div>
        )}
      </div>
    </div>
  );
}
