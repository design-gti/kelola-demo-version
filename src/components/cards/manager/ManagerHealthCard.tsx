"use client";
import { useState } from "react";
import { Paper, Badge, Button, Text } from "@mantine/core";

const MOOD_OPTIONS = [
  { value: 5, label: "Sangat baik", emoji: "😊" },
  { value: 4, label: "Baik",        emoji: "🙂" },
  { value: 3, label: "Cukup",       emoji: "😐" },
  { value: 2, label: "Lelah",       emoji: "😔" },
  { value: 1, label: "Burnout",     emoji: "😫" },
];

const CHECKIN_DONE   = ["Budi Santoso", "Siti Rahayu", "Dewi Kusuma", "Nurul Hidayah"];
const CHECKIN_MISSED = ["Rizky Pratama", "Maya Sari"];
const WORK_HOURS     = 52;
const NORMAL_HOURS   = 45;

export default function ManagerHealthCard() {
  const [mood, setMood] = useState<number | null>(null);
  const [open, setOpen] = useState(false);

  const hoursAlert = WORK_HOURS > NORMAL_HOURS;
  const missedAlert = CHECKIN_MISSED.length > 0;

  return (
    <Paper radius={12} p={16} w="100%" style={{ boxShadow: "2px 4px 10px rgba(0,0,0,0.07)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <Text fw={700} size="sm" c="#495057" style={{ fontFamily: "'Open Sans', sans-serif" }}>
          Kesehatan Manager
        </Text>
        <Badge
          variant="light"
          radius="xl"
          style={{ fontSize: 9, background: "#f0f0f0", color: "#6c757d", fontFamily: "Open Sans, sans-serif", textTransform: "none", fontWeight: 400 }}
        >
          Privat · hanya kamu yang lihat
        </Badge>
      </div>

      {/* Mood self-report */}
      <div style={{ background: "#f8f9fa", borderRadius: 10, padding: "12px 14px", marginBottom: 10 }}>
        <div style={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 700, fontSize: 10, color: "#495057", marginBottom: 8 }}>
          Bagaimana kondisimu hari ini?
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {MOOD_OPTIONS.map(m => (
            <Button
              key={m.value}
              onClick={() => setMood(m.value)}
              title={m.label}
              variant={mood === m.value ? "filled" : "subtle"}
              color="primary"
              radius={8}
              style={{
                flex: 1, height: 34, padding: 0, fontSize: 16,
                boxShadow: mood === m.value ? "0 2px 6px rgba(1,102,153,0.3)" : "0 1px 3px rgba(0,0,0,0.08)",
              }}
            >
              {m.emoji}
            </Button>
          ))}
        </div>
        {mood !== null && (
          <p style={{ margin: "8px 0 0", fontSize: 10, fontFamily: "Open Sans, sans-serif", color: "#016699", textAlign: "center" }}>
            {MOOD_OPTIONS.find(m => m.value === mood)?.label} — terima kasih sudah check-in!
          </p>
        )}
      </div>

      {/* Jam kerja */}
      <div style={{
        borderRadius: 10, padding: "10px 14px", marginBottom: 10,
        background: hoursAlert ? "#fff8e6" : "#f8f9fa",
        borderLeft: hoursAlert ? "3px solid #fd9f28" : "3px solid transparent",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 11, color: "#495057" }}>
            Jam kerja minggu ini
          </span>
          <span style={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 700, fontSize: 13, color: hoursAlert ? "#fd9f28" : "#495057" }}>
            {WORK_HOURS} jam
          </span>
        </div>
        {hoursAlert && (
          <p style={{ margin: "4px 0 0", fontSize: 10, fontFamily: "Open Sans, sans-serif", color: "#856404", lineHeight: 1.5 }}>
            {WORK_HOURS - NORMAL_HOURS} jam di atas standar normal. Pastikan ada waktu istirahat yang cukup.
          </p>
        )}
      </div>

      {/* Check-in status */}
      <div style={{
        borderRadius: 10, padding: "10px 14px",
        background: missedAlert ? "#fff0f0" : "#e9f7ef",
        borderLeft: missedAlert ? "3px solid #dc3545" : "3px solid #28a745",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 11, color: "#495057" }}>
            Check-in 1-on-1
          </span>
          <span style={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 700, fontSize: 11, color: missedAlert ? "#dc3545" : "#28a745" }}>
            {CHECKIN_DONE.length} / {CHECKIN_DONE.length + CHECKIN_MISSED.length} anggota
          </span>
        </div>
        {missedAlert && (
          <>
            <p style={{ margin: "0 0 6px", fontSize: 10, fontFamily: "Open Sans, sans-serif", color: "#6c757d" }}>
              Belum check-in dalam 2 minggu terakhir:
            </p>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {CHECKIN_MISSED.map(name => (
                <Badge key={name} variant="light" radius="xl" style={{ fontSize: 10, background: "#dc354520", color: "#dc3545", fontFamily: "Open Sans, sans-serif", textTransform: "none", fontWeight: 400 }}>
                  {name}
                </Badge>
              ))}
            </div>
          </>
        )}
      </div>
    </Paper>
  );
}
