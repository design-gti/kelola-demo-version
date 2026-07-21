"use client";
import { useState, useEffect } from "react";

export interface CardConfig {
  id: string;
  label: string;
  description: string;
  colSpan: number;
  enabled: boolean;
  col: 0 | 1 | 2;
}

// col assigned round-robin for otherCards (non-banner), index 0..N-1
const DEFAULT_CARDS: CardConfig[] = [
  { id: "banner",                   label: "Banner Insight",                  description: "Ringkasan insight utama succession dan development",  colSpan: 8,  enabled: true,  col: 0 },
  { id: "profile-completion",       label: "Profile Completion",              description: "Kelengkapan profil talent secara keseluruhan",         colSpan: 4,  enabled: true,  col: 0 },
  { id: "performance-chart",        label: "Avg. Performance Score",          description: "Tren skor performa rata-rata karyawan",               colSpan: 4,  enabled: false, col: 1 },
  { id: "engagement-chart",         label: "Avg. Engagement Score",           description: "Tren skor engagement rata-rata karyawan",             colSpan: 4,  enabled: false, col: 2 },
  { id: "committee-readiness",      label: "Committee Readiness",             description: "Status kesiapan dimensi untuk komite talent",         colSpan: 4,  enabled: false, col: 2 },
  { id: "overall-score",            label: "Position Fit Simulator",          description: "Simulasi kecocokan employee terhadap suatu posisi",   colSpan: 12, enabled: true,  col: 0 },
  { id: "critical-position-risk",   label: "Critical Position Risk",          description: "Risiko posisi kritis tanpa suksesor memadai",         colSpan: 4,  enabled: false, col: 0 },
  { id: "profile-completeness",     label: "Profile Completeness Tracker",    description: "Kelengkapan profil kandidat talent pool",             colSpan: 4,  enabled: false, col: 1 },
  { id: "data-health-indicator",    label: "Data Health Indicator",           description: "Kesehatan dan konsistensi data penilaian",            colSpan: 4,  enabled: false, col: 1 },
  { id: "quick-profile-access",     label: "Quick Profile Access",            description: "Akses cepat profil kandidat",                        colSpan: 4,  enabled: true,  col: 2 },
  { id: "sync-status",              label: "Sync Status",                     description: "Status sinkronisasi sistem terintegrasi",            colSpan: 4,  enabled: false, col: 1 },
  { id: "activity-log",             label: "Activity Log",                    description: "Log aktivitas terbaru di sistem",                    colSpan: 4,  enabled: false, col: 2 },
  { id: "employee-mapping",         label: "Employee Mapping",                description: "Pemetaan posisi dan distribusi karyawan",             colSpan: 4,  enabled: false, col: 2 },
  { id: "aspect-score",             label: "Aspect Score",                    description: "Skor per aspek penilaian talent",                     colSpan: 4,  enabled: true,  col: 2 },
  { id: "monitoring-idp",           label: "Monitoring IDP",                  description: "Status dan due date IDP per karyawan",               colSpan: 4,  enabled: true,  col: 1 },
];

const DEFAULT_STORAGE_KEY = "dashboard-card-config-v5";

export const MANAGER_DEFAULT_CARDS: CardConfig[] = [
  { id: "banner",                   label: "Banner Insight",                  description: "Ringkasan insight utama succession dan development",  colSpan: 8,  enabled: true,  col: 0 },
  { id: "profile-completion",       label: "Profile Completion",              description: "Kelengkapan profil talent secara keseluruhan",         colSpan: 4,  enabled: true,  col: 0 },
  { id: "team-summary",             label: "Ringkasan Tim",                   description: "Gambaran suhu umum tim dalam 4 metrik agregat",        colSpan: 4,  enabled: true,  col: 0 },
  { id: "early-signal-radar",       label: "Radar Sinyal Dini",               description: "Anggota tim yang perlu perhatian berdasarkan deviasi", colSpan: 4,  enabled: true,  col: 1 },
  { id: "workload-map",             label: "Peta Beban Kerja",                description: "Distribusi beban kerja seluruh anggota tim",           colSpan: 4,  enabled: true,  col: 0 },
  { id: "performance-momentum",     label: "Momentum Performa",               description: "Tren performa anggota tim naik atau turun",            colSpan: 4,  enabled: true,  col: 1 },
  { id: "support-needs",            label: "Kebutuhan Support",               description: "Jenis dukungan yang dibutuhkan anggota tim",           colSpan: 4,  enabled: true,  col: 0 },
  { id: "manager-health",           label: "Kesehatan Manager",               description: "Self-reflection kondisi dan jam kerja manager",        colSpan: 4,  enabled: true,  col: 1 },
  { id: "performance-chart",        label: "Team Avg. Performance Score",     description: "Tren skor performa rata-rata tim",                     colSpan: 4,  enabled: true,  col: 1 },
  { id: "engagement-chart",         label: "Team Avg. Engagement Score",      description: "Tren skor engagement rata-rata tim",                   colSpan: 4,  enabled: true,  col: 2 },
  { id: "aspect-score",             label: "Team Aspect Score Percentage",    description: "Skor per aspek penilaian tim",                         colSpan: 4,  enabled: false, col: 0 },
  { id: "employee-mapping",         label: "Team Mapping",                    description: "Pemetaan posisi dan distribusi anggota tim",           colSpan: 4,  enabled: false, col: 1 },
  { id: "profile-completeness",     label: "Team Profile Completeness",       description: "Kelengkapan profil anggota tim",                       colSpan: 4,  enabled: false, col: 1 },
  { id: "data-health-indicator",    label: "Data Health Indicator",           description: "Kesehatan dan konsistensi data penilaian",             colSpan: 4,  enabled: false, col: 1 },
  { id: "quick-profile-access",     label: "Quick Profile Access",            description: "Akses cepat profil anggota tim",                       colSpan: 4,  enabled: false, col: 2 },
  { id: "monitoring-idp",           label: "Monitoring IDP",                  description: "Status dan due date IDP anggota tim",                 colSpan: 4,  enabled: false, col: 1 },
];

function mergeWithDefaults(stored: Partial<CardConfig>[], defaults: CardConfig[]): CardConfig[] {
  const result: CardConfig[] = stored
    .map(s => {
      const def = defaults.find(d => d.id === s.id);
      if (!def) return null;
      return {
        ...def,
        enabled: s.enabled ?? def.enabled,
        col: (s.col === 0 || s.col === 1 || s.col === 2) ? s.col : def.col,
      };
    })
    .filter((c): c is CardConfig => c !== null);
  defaults.forEach(def => {
    if (!result.find(c => c.id === def.id)) result.push(def);
  });
  return result;
}

export function useDashboardConfig(storageKey: string = DEFAULT_STORAGE_KEY, isManager = false) {
  const defaults = isManager ? MANAGER_DEFAULT_CARDS : DEFAULT_CARDS;
  const [cards, setCards] = useState<CardConfig[]>(defaults);

  useEffect(() => {
    const d = isManager ? MANAGER_DEFAULT_CARDS : DEFAULT_CARDS;
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) setCards(mergeWithDefaults(JSON.parse(stored), d));
      else setCards(d);
    } catch {}
  }, [storageKey, isManager]);

  const persist = (next: CardConfig[]) => {
    try { localStorage.setItem(storageKey, JSON.stringify(next)); } catch {}
    return next;
  };

  const toggle = (id: string) =>
    setCards(prev => persist(prev.map(c => c.id === id ? { ...c, enabled: !c.enabled } : c)));

  // Insert fromId into targetCol, before insertBeforeId (or at end of col if null)
  const insertAt = (fromId: string, targetCol: 0 | 1 | 2, insertBeforeId: string | null) => {
    setCards(prev => {
      const fromIdx = prev.findIndex(c => c.id === fromId);
      if (fromIdx === -1) return prev;

      const next = [...prev];
      const removed: CardConfig = { ...next[fromIdx], col: targetCol };
      next.splice(fromIdx, 1);

      if (insertBeforeId === null) {
        // Append after last card currently in targetCol
        let lastIdx = -1;
        next.forEach((c, i) => { if (c.col === targetCol) lastIdx = i; });
        next.splice(lastIdx + 1, 0, removed);
      } else {
        const beforeIdx = next.findIndex(c => c.id === insertBeforeId);
        next.splice(beforeIdx === -1 ? next.length : beforeIdx, 0, removed);
      }

      return persist(next);
    });
  };

  return { cards, toggle, insertAt };
}
