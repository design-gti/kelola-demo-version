// @ts-nocheck -- ported from tdp-prototype (Vite, never tsc-checked); not type-maintained here
import React, { useState, useEffect } from 'react';
/*
 * Kendali di bilah ini memakai komponen design system Prodigy (re-export tipis
 * Mantine). Dua pilihan yang saling meniadakan = SegmentedControl, bukan dua
 * tombol yang saling menyalakan/mematikan sendiri — itu yang dipakai design
 * system untuk kasus ini (lihat dist/components/SegmentedControl).
 */
import { SegmentedControl } from '@talentlytica/prodigy';
import TableScreener from './TableScreener';
import BoxMapping from './BoxMapping';
import SwipeReview from './SwipeReview';
import Comparison from './Comparison';

type ViewMode = 'table' | 'box-mapping' | 'review';

export default function Screener() {
  const [viewMode, setViewMode] = useState<ViewMode>('review');
  const [tableToolbar, setTableToolbar] = useState<React.ReactNode>(null);   // Columns (table-only)
  const [compToolbar, setCompToolbar] = useState<React.ReactNode>(null);     // Columns (compare-only)
  const [sharedToolbar, setSharedToolbar] = useState<React.ReactNode>(null); // Filter + Preset (always)

  // Shared pin state — synced between Table and Compare views
  const [pinnedIds, setPinnedIds] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('shared_pinned') || '[]'); } catch { return []; }
  });
  useEffect(() => {
    localStorage.setItem('shared_pinned', JSON.stringify(pinnedIds));
  }, [pinnedIds]);

  return (
    <div className="flex flex-col bg-[#F8F9FA]">
      {/* Judul halaman dihapus: nama preset yang aktif sekarang tampil di tombol
          Presets itu sendiri, jadi baris ini hanya mengulang informasi yang sama
          sambil memakan tinggi layar. */}
      {/* View Mode Selector with Toolbar Buttons */}
      <div className="bg-white border-b border-[#dee2e6] shrink-0">
        <div className="flex items-center justify-between px-6 py-3">
          {/* Tabs */}
          <SegmentedControl
            value={viewMode === 'table' ? 'table' : 'review'}
            onChange={(v) => setViewMode(v as ViewMode)}
            radius="xl"
            size="sm"
            data={[
              { value: 'review', label: 'Compare' },
              { value: 'table', label: 'Table' },
            ]}
          />

          {/* Toolbar: view-specific Columns button + shared Filter + Preset */}
          <div className="flex items-center gap-3">
            {viewMode === 'table' ? tableToolbar : compToolbar}
            {sharedToolbar}
          </div>
        </div>
      </div>

      {/* Content Area — TableScreener always mounted to preserve Filter/Preset state */}
      <div>
        <div style={{ display: viewMode === 'table' ? 'block' : 'none' }}>
          <TableScreener
            onToolbarRender={setTableToolbar}
            onSharedToolbarRender={setSharedToolbar}
            pinnedIds={pinnedIds}
            onPinnedIdsChange={setPinnedIds}
          />
        </div>
        {viewMode === 'box-mapping' && <BoxMapping />}
        {viewMode === 'review' && <Comparison onToolbarRender={setCompToolbar} pinnedIds={pinnedIds} onPinnedIdsChange={setPinnedIds} />}
      </div>
    </div>
  );
}