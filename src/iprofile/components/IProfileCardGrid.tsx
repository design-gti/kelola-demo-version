"use client";
import { createPortal } from "react-dom";
import { Button } from "@mantine/core";
import { IconSettings } from "@tabler/icons-react";
import { useState } from "react";
import DraggableCardWrapper from "@/components/DraggableCardWrapper";
import SettingsPanel from "@/components/SettingsPanel";
import { useCardDrag } from "@/hooks/useCardDrag";
import { useIProfileConfig, type IProfileCardConfig } from "@/hooks/useIProfileConfig";
import {
  ProfileCard,
  CareerSuccessionCard,
  TeamsCard,
  ExtensionDataCard,
  DevelopmentCard,
  EmployeeDataCard,
  Frame79,
  Frame116,
  Frame153,
} from "../imports/Frame45227";
import { CompetencyScoresCard, PotencyScoresCard, type AspectItem } from "./ScoreAspectWithTabs";

/** Lebar satu kartu iProfile — dipakai juga sebagai lebar pratinjau di panel. */
const CARD_WIDTH = 368;

/**
 * Susunan kartu iProfile: bisa digeser antar kolom dan disembunyikan lewat panel
 * pengaturan, sama seperti Beranda. Mesin gesernya memang mesin yang sama
 * (useCardDrag); yang berbeda cuma daftar kartu dan lebar kolomnya.
 */
export function IProfileCardGrid({
  scoreAspects,
}: {
  scoreAspects: { competency: AspectItem[]; potency: AspectItem[] };
}) {
  const { cards, toggle, insertAt } = useIProfileConfig();
  const [settingsOpen, setSettingsOpen] = useState(false);

  const enabled = cards.filter((c) => c.enabled);
  const {
    dragId, ghostPos, ghostDims, mounted,
    onHandleMouseDown, registerCard, registerColumn, insertLineFor,
  } = useCardDrag({
    columnCount: 3,
    cards: enabled.map((c) => ({ id: c.id, col: c.col as number })),
    onDrop: (id, targetCol, insertBeforeId) =>
      insertAt(id, targetCol as 0 | 1 | 2, insertBeforeId),
  });

  function renderCard(id: string) {
    switch (id) {
      case "profile":           return <ProfileCard />;
      case "competency-scores": return <CompetencyScoresCard Frame79={Frame79} Frame153={Frame153} Frame116={Frame116} />;
      case "potency-scores":    return <PotencyScoresCard Frame79={Frame79} items={scoreAspects.potency} />;
      case "career-succession": return <CareerSuccessionCard />;
      case "teams":             return <TeamsCard />;
      case "extension-data":    return <ExtensionDataCard />;
      case "development":       return <DevelopmentCard />;
      case "employee-data":     return <EmployeeDataCard />;
      default: return null;
    }
  }

  function renderColumn(colIdx: 0 | 1 | 2) {
    const colCards = enabled.filter((c) => c.col === colIdx);
    // Kartu terakhir di kolom — penanda "sisipkan di paling bawah".
    const lastId = dragId ? colCards.filter((c) => c.id !== dragId).slice(-1)[0]?.id : undefined;

    return colCards.map((c: IProfileCardConfig) => (
      <DraggableCardWrapper
        key={c.id}
        ref={registerCard(c.id)}
        id={c.id}
        isDragging={dragId === c.id}
        showInsertLine={insertLineFor(c.id, colIdx, lastId)}
        onHandleMouseDown={onHandleMouseDown}
      >
        {renderCard(c.id)}
      </DraggableCardWrapper>
    ));
  }

  const column = (colIdx: 0 | 1 | 2) => (
    <div
      ref={registerColumn(colIdx)}
      className="flex flex-col gap-[16px] items-start shrink-0"
      // minHeight menjaga kolom yang sedang kosong tetap bisa jadi tujuan geser.
      style={{ width: CARD_WIDTH, minHeight: 60 }}
    >
      {renderColumn(colIdx)}
    </div>
  );

  return (
    <>
      {/* Bayangan kartu yang sedang digeser — dilukis di atas segalanya lewat
          portal supaya tidak terpotong oleh kolom yang punya overflow. */}
      {mounted && dragId && ghostPos && ghostDims && createPortal(
        <div style={{
          position: "fixed",
          left: ghostPos.x,
          top: ghostPos.y,
          width: ghostDims.w,
          height: ghostDims.h,
          overflow: "hidden",
          borderRadius: 8,
          zIndex: 9999,
          pointerEvents: "none",
          transform: "rotate(1.5deg) scale(1.01)",
          transformOrigin: "top center",
          boxShadow: "0 20px 52px rgba(0,0,0,0.2), 0 6px 16px rgba(0,0,0,0.1)",
          opacity: 0.93,
        }}>
          {renderCard(dragId)}
        </div>,
        document.body,
      )}

      <SettingsPanel
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        cards={cards}
        onToggle={toggle}
        renderCard={renderCard}
        pinnedIds={cards.filter((c) => c.locked).map((c) => c.id)}
        title="Konfigurasi iProfile"
        subtitle="Aktifkan card yang ingin ditampilkan di halaman iProfile"
        previewRenderWidth={CARD_WIDTH}
      />

      {/* Tombol pengaturan duduk di atas kolom paling kanan: wadahnya selebar
          ketiga kolom, jadi rata kanan di sini berarti sejajar tepi kanan
          kartu terakhir. */}
      <div className="flex flex-col gap-[8px] relative size-full">
        <div className="flex justify-end" style={{ width: CARD_WIDTH * 3 + 32 }}>
          <Button
            variant="subtle"
            size="compact-sm"
            leftSection={<IconSettings size={16} stroke={1.6} />}
            onClick={() => setSettingsOpen(true)}
          >
            Configuration
          </Button>
        </div>

        <div className="flex gap-[16px] items-start">
          {column(0)}
          {column(1)}
          {column(2)}
        </div>
      </div>
    </>
  );
}
