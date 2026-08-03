"use client";
/**
 * Shared renderer for one team archetype's narrative content. Used by both the
 * Team Type page (with the "Teams:" chips passed as `children`) and the
 * "Detail Tipe Team" modal on Team Profile (without them), so the copy and
 * section styling can only ever be defined once.
 */
import { archetypeIconSrc, type TeamArchetype } from "@/data/teamsData";
import { TEAM_TYPE_CONTENT } from "@/data/teamTypeContent";

const ACCENT = "#016699";

/** Tinted section block — one per narrative group, colors mirror the app's status palette. */
function Section({ title, color, bg, children }: {
  title: string; color: string; bg: string; children: React.ReactNode;
}) {
  return (
    <div style={{ background: bg, borderRadius: 8, padding: "12px 16px" }}>
      <div style={{ fontSize: 12, fontWeight: 700, color, marginBottom: 8 }}>{title}</div>
      {children}
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul style={{ margin: 0, paddingLeft: 18, display: "flex", flexDirection: "column", gap: 4 }}>
      {items.map((t, i) => (
        <li key={i} style={{ fontSize: 12, color: "#495057", lineHeight: 1.6 }}>{t}</li>
      ))}
    </ul>
  );
}

export default function TeamTypeDetail({ archetype, children }: {
  archetype: TeamArchetype;
  /** Optional block rendered right under the header — the Team Type page puts its "Teams:" chips here. */
  children?: React.ReactNode;
}) {
  const content = TEAM_TYPE_CONTENT[archetype.code];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Header: icon + name + traits */}
      <div style={{ background: "#f8f9fa", borderRadius: 8, padding: 16, display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{
          width: 44, height: 44, borderRadius: "50%", background: "#fff", flexShrink: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <img src={archetypeIconSrc(archetype.icon)} alt="" width={26} height={26} />
        </div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#212529" }}>{archetype.name}</div>
          <div style={{ fontSize: 12, color: "#6c757d", marginTop: 2 }}>{archetype.traits}</div>
        </div>
      </div>

      {children}

      {!content ? (
        <div style={{ padding: "40px 0", textAlign: "center", fontSize: 12, color: "#adb5bd" }}>
          Konten untuk {archetype.name} belum tersedia.
        </div>
      ) : (
        <>
          <div style={{ background: "#f8f9fa", borderRadius: 8, padding: "12px 16px" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#495057", marginBottom: 6 }}>Karakteristik Tim</div>
            <p style={{ margin: 0, fontSize: 12, color: "#495057", lineHeight: 1.7 }}>{content.characteristics}</p>
          </div>

          <Section title="Kekuatan Tim" color="#00875A" bg="#f2fbf7">
            <BulletList items={content.strengths} />
          </Section>

          <Section title="Area Pengembangan Tim" color="#e8590c" bg="#fff6f2">
            <BulletList items={content.developmentAreas} />
          </Section>

          {/* Several archetypes have no conflict points — hide the block entirely. */}
          {content.conflictPoints && content.conflictPoints.length > 0 && (
            <Section title="Titik Konflik" color="#de350b" bg="#fff5f4">
              <BulletList items={content.conflictPoints} />
            </Section>
          )}

          <Section title="Saran Pengembangan" color={ACCENT} bg="#e7f5ff">
            <ul style={{ margin: 0, paddingLeft: 18, display: "flex", flexDirection: "column", gap: 8 }}>
              {content.developmentTips.map((t, i) => (
                <li key={i} style={{ fontSize: 12, color: "#495057", lineHeight: 1.6 }}>
                  <span style={{ fontWeight: 700 }}>{t.title}</span>
                  <div style={{ color: "#6c757d", marginTop: 2 }}>{t.detail}</div>
                </li>
              ))}
            </ul>
          </Section>
        </>
      )}
    </div>
  );
}
