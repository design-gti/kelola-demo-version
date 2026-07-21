"use client";
import { candidates } from "@/data/dummyData";

type Urgency = "Critical" | "High" | "Normal";

interface Alert {
  field: string;
  fieldLabel: string;
  urgency: Urgency;
  count: number;
  names: string[];
}

const FIELD_MAP: Record<string, string> = {
  behavioral_score: "Behavioral score",
  technical_score: "Technical score",
  performance_score: "Performance score",
  photo: "Foto profil",
};

export default function DataMissingAlertCard() {
  const alertMap: Map<string, Alert> = new Map();

  candidates.forEach(c => {
    (["behavioral_score", "technical_score", "performance_score", "photo"] as const).forEach(field => {
      if (c[field] === null) {
        const urgency: Urgency = (c.isSuccession || c.isPGS) ? "Critical" : c.isTalentPool ? "High" : "Normal";
        const key = `${field}__${urgency}`;
        const existing = alertMap.get(key);
        if (existing) {
          existing.count++;
          existing.names.push(c.name);
        } else {
          alertMap.set(key, { field, fieldLabel: FIELD_MAP[field], urgency, count: 1, names: [c.name] });
        }
      }
    });
  });

  const alerts = Array.from(alertMap.values()).sort((a, b) => {
    const order: Record<Urgency, number> = { Critical: 0, High: 1, Normal: 2 };
    return order[a.urgency] - order[b.urgency];
  });

  const badgeColor: Record<Urgency, string> = { Critical: "#dc3545", High: "#fd9f28", Normal: "#6c757d" };

  return (
    <div className="bg-white rounded-[12px] p-[16px] w-full" style={{ boxShadow: "2px 4px 10px rgba(0,0,0,0.07)" }}>
      <div style={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 700, fontSize: 14, color: "#495057", marginBottom: 12 }}>
        Data Missing Alert
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {alerts.map((alert, i) => (
          <div key={i} style={{ padding: "8px 10px", borderRadius: 8, background: "#f8f9fa", borderLeft: `3px solid ${badgeColor[alert.urgency]}` }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 12, fontFamily: "'Open Sans', sans-serif", fontWeight: 700, color: "#495057" }}>{alert.fieldLabel}</span>
              <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 10, background: badgeColor[alert.urgency] + "20", color: badgeColor[alert.urgency], fontFamily: "Open Sans, sans-serif" }}>
                {alert.urgency} · {alert.count} org
              </span>
            </div>
            <div style={{ fontSize: 10, color: "#adb5bd", fontFamily: "Open Sans, sans-serif", marginTop: 3 }}>
              {alert.names.slice(0, 3).join(", ")}{alert.names.length > 3 ? ` +${alert.names.length - 3} lainnya` : ""}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
