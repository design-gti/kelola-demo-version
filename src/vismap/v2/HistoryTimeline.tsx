import { Play, Pause, SkipBack, History } from "lucide-react";
import type { Checkpoint } from "./orgHistory";

/**
 * Panel timeline riwayat struktur.
 *
 * Titik checkpoint diletakkan menurut TANGGAL aslinya, bukan dibagi rata. Karena
 * peristiwanya memang tidak beraturan (resign tidak menunggu akhir kuartal), jarak
 * antar-titik ikut memperlihatkan mana masa yang tenang dan mana yang bergejolak —
 * informasi yang hilang kalau titiknya dijejer rata.
 */

const ACCENT = "#016699";
const PANEL_W = 640;

interface Props {
  checkpoints: Checkpoint[];
  index: number;
  playing: boolean;
  onSelect: (index: number) => void;
  onTogglePlay: () => void;
  onRestart: () => void;
}

const dayOf = (iso: string) => new Date(`${iso}T00:00:00Z`).getTime() / 86_400_000;

export default function HistoryTimeline({ checkpoints, index, playing, onSelect, onTogglePlay, onRestart }: Props) {
  const first = dayOf(checkpoints[0].date);
  const last = dayOf(checkpoints[checkpoints.length - 1].date);
  const span = Math.max(1, last - first);
  const pctOf = (cp: Checkpoint) => ((dayOf(cp.date) - first) / span) * 100;

  const active = checkpoints[index];
  const isToday = index === checkpoints.length - 1;

  return (
    <div
      data-no-drag="true"
      style={{
        position: "absolute",
        bottom: 16,
        left: "50%",
        transform: "translateX(-50%)",
        width: PANEL_W,
        maxWidth: "calc(100% - 120px)",
        background: "white",
        border: "1px solid #dee2e6",
        borderRadius: 12,
        boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
        padding: "10px 16px 14px",
        zIndex: 20,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
        <button
          onClick={onTogglePlay}
          title={playing ? "Jeda" : "Putar riwayat"}
          style={{
            width: 30,
            height: 30,
            borderRadius: "50%",
            border: "none",
            background: ACCENT,
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          {playing ? <Pause size={14} fill="white" /> : <Play size={14} fill="white" style={{ marginLeft: 2 }} />}
        </button>
        <button
          onClick={onRestart}
          title="Kembali ke awal riwayat"
          style={{
            width: 26,
            height: 26,
            borderRadius: "50%",
            border: "1px solid #dee2e6",
            background: "white",
            color: "#495057",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          <SkipBack size={12} />
        </button>

        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: isToday ? "#212529" : ACCENT }}>{active.label}</span>
            <span
              style={{
                fontSize: 11,
                color: "#6c757d",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
              title={active.title}
            >
              {active.title}
            </span>
          </div>
          {/* Rincian domino peristiwanya — inilah yang menjelaskan kenapa beberapa
              kartu bergerak sekaligus dalam satu langkah. */}
          {active.events.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "2px 10px", marginTop: 2 }}>
              {active.events.map((ev, i) => (
                <span key={i} style={{ fontSize: 10, color: "#868e96" }}>
                  <span style={{ color: EVENT_COLOR[ev.kind], fontWeight: 800 }}>•</span> {ev.text}
                </span>
              ))}
            </div>
          )}
        </div>

        <span style={{ fontSize: 10, color: "#adb5bd", flexShrink: 0, display: "flex", alignItems: "center", gap: 4 }}>
          <History size={11} />
          {index + 1}/{checkpoints.length}
        </span>
      </div>

      {/* Track */}
      <div style={{ position: "relative", height: 24 }}>
        <div style={{ position: "absolute", top: 8, left: 0, right: 0, height: 3, borderRadius: 2, background: "#e9ecef" }} />
        <div
          style={{
            position: "absolute",
            top: 8,
            left: 0,
            width: `${pctOf(active)}%`,
            height: 3,
            borderRadius: 2,
            background: ACCENT,
            transition: "width 0.35s ease",
          }}
        />
        {checkpoints.map((cp, i) => {
          const done = i <= index;
          const here = i === index;
          return (
            <button
              key={cp.id}
              onClick={() => onSelect(i)}
              title={`${cp.label} — ${cp.title}`}
              style={{
                position: "absolute",
                top: here ? 3 : 5,
                left: `${pctOf(cp)}%`,
                transform: "translateX(-50%)",
                width: here ? 13 : 9,
                height: here ? 13 : 9,
                borderRadius: "50%",
                border: `2px solid ${done ? ACCENT : "#ced4da"}`,
                background: here ? ACCENT : "white",
                padding: 0,
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

const EVENT_COLOR: Record<string, string> = {
  resign: "#e03131",
  move: "#016699",
  hire: "#2f9e44",
  vacant: "#adb5bd",
  "team-formed": "#7048e8",
};
