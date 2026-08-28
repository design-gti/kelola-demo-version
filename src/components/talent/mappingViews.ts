import { getEffectiveConfig } from "@/data/talentMappingConfig";
import {
  applyFilter,
  pointsFrom,
  usesCompetency,
  type EmployeeMetrics,
  type TMConfig,
  type TMFilter,
  type TMPoint,
} from "@/data/talentMappingShared";

/** Satu mapping beserta orang-orang yang lolos saringan tabnya. */
export interface MappingView {
  id: string;
  label: string;
  cfg: TMConfig;
  points: TMPoint[];
}

/**
 * Menghitung isi setiap mapping sekaligus, untuk tab All Box Mapping.
 *
 * Grafik dan tabel di tab itu HARUS berangkat dari hasil yang sama — kalau
 * masing-masing menghitung sendiri, tabel bisa menyebut orang yang tidak
 * tergambar di grafik tepat di atasnya.
 *
 * Tiap tab memakai konfigurasi DAN saringannya sendiri. Ini yang menentukan
 * gunanya tab itu: keempat mapping bawaan memakai sumbu yang sama persis, dan
 * yang membedakan High-Po dari Mi-Po hanya pita Potency yang tersaring.
 */
export function buildMappingViews(
  tabs: { id: string; label: string }[],
  metrics: EmployeeMetrics[],
  filterFor: (id: string, cfg: TMConfig) => TMFilter,
): MappingView[] {
  return tabs.map(t => {
    const cfg = getEffectiveConfig(t.id);
    const filter = filterFor(t.id, cfg);
    const target = usesCompetency(cfg) ? filter.jobTarget : null;
    return { id: t.id, label: t.label, cfg, points: applyFilter(cfg, pointsFrom(cfg, metrics, target), filter) };
  });
}
