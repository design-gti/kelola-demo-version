// @ts-nocheck -- ported from tdp-prototype (Vite, never tsc-checked); not type-maintained here
import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
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
  const [activePresetLabel, setActivePresetLabel] = useState<string | null>(null);

  // Shared pin state — synced between Table and Compare views
  const [pinnedIds, setPinnedIds] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('shared_pinned') || '[]'); } catch { return []; }
  });
  useEffect(() => {
    localStorage.setItem('shared_pinned', JSON.stringify(pinnedIds));
  }, [pinnedIds]);

  const pageTitle = activePresetLabel ? `${activePresetLabel} Criteria` : 'General';

  return (
    <div className="flex flex-col bg-[#F8F9FA]">
      {/* Heading Section */}
      <div className="bg-white px-6 py-4 border-b border-[#dee2e6] shrink-0">
        <h2 className="text-lg font-bold text-[#016699]" style={{ fontFamily: 'Avenir, sans-serif' }}>
          {pageTitle}
        </h2>
      </div>

      {/* View Mode Selector with Toolbar Buttons */}
      <div className="bg-white border-b border-[#dee2e6] shrink-0">
        <div className="flex items-center justify-between px-6 py-3">
          {/* Tabs */}
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setViewMode('review')}
              variant={viewMode === 'review' ? 'default' : 'outline'}
              size="sm"
              className={viewMode === 'review' ? '' : 'text-[#016699] border-[#016699]'}
            >
              Compare
            </Button>
            <Button
              onClick={() => setViewMode('table')}
              variant={viewMode === 'table' ? 'default' : 'outline'}
              size="sm"
              className={viewMode === 'table' ? '' : 'text-[#016699] border-[#016699]'}
            >
              Table
            </Button>
          </div>

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
            onPresetChange={setActivePresetLabel}
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