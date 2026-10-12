// @ts-nocheck -- ported from tdp-prototype (Vite, never tsc-checked); not type-maintained here
import React, { useState, useEffect } from 'react';
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
  /*
    Kotak pencarian dititipkan ke atas oleh masing-masing tampilan, sama seperti
    tombol toolbar di atasnya — dan dipisah per tampilan karena `TableScreener`
    SELALU terpasang (disembunyikan `display:none`, supaya keadaan Filter/Preset-nya
    tidak hilang). Satu slot bersama akan membuat kedua kotak pencarian saling timpa
    tanpa ada yang tahu mana yang menang.
  */
  const [tableSearch, setTableSearch] = useState<React.ReactNode>(null);
  const [compSearch, setCompSearch] = useState<React.ReactNode>(null);

  /**
   * Id karyawan yang LOLOS filter, dipegang di sini supaya KEDUA tampilan memakainya.
   *
   * ── Kenapa lewat state, bukan localStorage ──
   *
   * `TableScreener` sudah menulis `tableVisibleEmployeeIds` ke `localStorage`, dan
   * `Comparison` sudah membacanya — tapi hanya SEKALI saat dipasang, karena menulis
   * localStorage tidak memicu render ulang siapa pun. Akibatnya terukur: memilih dua
   * karyawan di dialog Filter membuat tabel jadi 2 baris sementara Compare tetap
   * memajang 106 kartu.
   *
   * `null` berarti tabelnya BELUM pernah melaporkan apa pun — berbeda dari larik
   * kosong, yang berarti filternya menyisakan nol orang. Tanpa pembedaan itu, Compare
   * akan mengosongkan dirinya sendiri pada render pertama.
   */
  const [visibleIds, setVisibleIds] = useState<string[] | null>(null);

  // Shared pin state — synced between Table and Compare views
  const [pinnedIds, setPinnedIds] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('shared_pinned') || '[]'); } catch { return []; }
  });
  useEffect(() => {
    localStorage.setItem('shared_pinned', JSON.stringify(pinnedIds));
  }, [pinnedIds]);

  return (
    <div className="flex flex-col bg-[#F8F9FA] h-full overflow-hidden">
      {/* Single scroll container — toolbar scrolls with content, not fixed */}
      <div className="flex-1 min-h-0 overflow-y-auto overscroll-y-contain">
        {/* Toolbar row */}
        <div className="bg-white border-b border-[#dee2e6]">
          <div className="flex items-center justify-between px-6 py-3">
            {viewMode === 'table' ? tableSearch : compSearch}
            <div className="flex items-center gap-3">
              {viewMode === 'table' ? tableToolbar : compToolbar}
              {sharedToolbar}
            </div>
          </div>
        </div>

        {/* View mode toggle */}
        <div className="bg-white border-b border-[#dee2e6]">
          <div className="flex items-center justify-center gap-2 px-6 py-3">
            <SegmentedControl
              value={viewMode}
              onChange={(v) => setViewMode(v as ViewMode)}
              data={[
                { label: 'Compare', value: 'review' },
                { label: 'Table', value: 'table' },
              ]}
              color="primary"
              size="sm"
            />
          </div>
        </div>

        {/* Content */}
        <div style={{ display: viewMode === 'table' ? 'block' : 'none' }}>
          <TableScreener
            onToolbarRender={setTableToolbar}
            onSharedToolbarRender={setSharedToolbar}
            onSearchRender={setTableSearch}
            onVisibleIdsChange={setVisibleIds}
            pinnedIds={pinnedIds}
            onPinnedIdsChange={setPinnedIds}
          />
        </div>
        {viewMode === 'box-mapping' && <BoxMapping />}
        {viewMode === 'review' && <Comparison onToolbarRender={setCompToolbar} onSearchRender={setCompSearch} visibleIds={visibleIds} pinnedIds={pinnedIds} onPinnedIdsChange={setPinnedIds} />}
      </div>
    </div>
  );
}