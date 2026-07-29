"use client";
import { useState } from "react";
import Link from "next/link";
import { Paper, TextInput, Button, Text } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import type { Candidate } from "@/data/dummyData";

export default function QuickProfileAccessCard({ employees, defaultResults }: { employees: Candidate[]; defaultResults: Candidate[] }) {
  const [searchQuery, setSearchQuery] = useState("");

  const results = searchQuery.trim()
    ? employees.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.position.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : defaultResults.slice(0, 5);

  return (
    <Paper radius={12} p={16} w="100%" style={{ boxShadow: "2px 4px 10px rgba(0,0,0,0.07)" }}>
      <Text fw={700} size="sm" c="#495057" mb={12} style={{ fontFamily: "'Open Sans', sans-serif" }}>
        Quick Profile Access
      </Text>
      <TextInput
        value={searchQuery}
        onChange={e => setSearchQuery(e.currentTarget.value)}
        placeholder="Cari nama atau jabatan..."
        radius="xl"
        size="xs"
        leftSection={<IconSearch size={14} />}
        mb={10}
      />
      {!searchQuery && (
        <Text size="xs" c="#adb5bd" mb={8} style={{ fontFamily: "Open Sans, sans-serif" }}>
          Terakhir dilihat
        </Text>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {results.map(c => (
          <div key={c.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 8px", borderRadius: 6, background: "#f8f9fa" }}>
            <div>
              <div style={{ fontSize: 10, fontFamily: "'Open Sans', sans-serif", fontWeight: 700, color: "#495057" }}>{c.name}</div>
              <div style={{ fontSize: 10, fontFamily: "Open Sans, sans-serif", color: "#adb5bd" }}>{c.position}</div>
            </div>
            <Button
              component={Link}
              href={`/iprofile?id=${c.id}`}
              variant="subtle"
              color="primary"
              size="compact-xs"
              styles={{ label: { fontSize: 11, fontFamily: "Open Sans, sans-serif" } }}
            >
              Lihat
            </Button>
          </div>
        ))}
        {results.length === 0 && (
          <Text size="xs" c="#adb5bd" ta="center" py={12} style={{ fontFamily: "Open Sans, sans-serif" }}>
            Tidak ditemukan
          </Text>
        )}
      </div>
    </Paper>
  );
}
