"use client";
import { useState } from "react";
import AppBreadcrumb from "@/components/Breadcrumb";
import { archetypeIconSrc, type TeamArchetype } from "@/data/teamsData";
import TeamTypeDetail from "@/components/team/TeamTypeDetail";

const FONT = "'Open Sans', sans-serif";
const ACCENT = "#016699";

export default function TeamTypeClient({ catalog, teamsByCode, initialCode }: {
  catalog: TeamArchetype[];
  teamsByCode: Record<string, string[]>;
  initialCode: string;
}) {
  const [code, setCode] = useState(initialCode);
  const active = catalog.find(a => a.code === code) ?? catalog[0];
  const ownerTeams = teamsByCode[active.code] ?? [];

  return (
    <div style={{ fontFamily: FONT }}>
      <AppBreadcrumb items={[{ label: "Team Profile", href: "/team-profile" }, { label: "Team Type" }]} />

      <div style={{ display: "flex", gap: 16, alignItems: "flex-start", padding: "12px 16px 40px", flexWrap: "wrap" }}>
        {/* Left: archetype list */}
        <div style={{
          flex: "0 0 250px", background: "#fff", borderRadius: 12, padding: 8,
          boxShadow: "2px 4px 10px rgba(0,0,0,0.07)",
        }}>
          {catalog.map(a => {
            const selected = a.code === active.code;
            return (
              <button
                key={a.code}
                onClick={() => setCode(a.code)}
                style={{
                  width: "100%", display: "flex", alignItems: "center", gap: 10, cursor: "pointer",
                  background: selected ? "#f1f3f5" : "none", border: "none", borderRadius: 8,
                  padding: "10px 12px", textAlign: "left", fontFamily: FONT,
                  fontSize: 13, fontWeight: selected ? 700 : 600,
                  color: selected ? "#212529" : "#495057",
                }}
              >
                <img src={archetypeIconSrc(a.icon)} alt="" width={24} height={24} style={{ flexShrink: 0 }} />
                {a.name}
              </button>
            );
          })}
        </div>

        {/* Right: selected archetype detail */}
        <div style={{
          flex: "1 1 520px", minWidth: 0, background: "#fff", borderRadius: 12, padding: 20,
          boxShadow: "2px 4px 10px rgba(0,0,0,0.07)", display: "flex", flexDirection: "column", gap: 16,
        }}>
          <TeamTypeDetail archetype={active}>
            {/* Teams currently matching this archetype */}
            <div>
              <div style={{ fontSize: 11, color: "#adb5bd", marginBottom: 6 }}>Teams:</div>
              {ownerTeams.length === 0 ? (
                <span style={{ fontSize: 12, color: "#ced4da" }}>Belum ada tim dengan tipe ini.</span>
              ) : (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {ownerTeams.map(name => (
                    <span key={name} style={{
                      background: "#e7f5ff", color: ACCENT, fontSize: 10, fontWeight: 700,
                      textTransform: "uppercase", padding: "3px 10px", borderRadius: 9999, whiteSpace: "nowrap",
                    }}>
                      {name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </TeamTypeDetail>
        </div>
      </div>
    </div>
  );
}
