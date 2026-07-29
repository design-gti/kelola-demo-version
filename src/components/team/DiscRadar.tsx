// Ported from kelola-app resources/js/Components/Atom/Chart/DISCRadar.tsx
// Mantine (Box/Avatar/Text/Tooltip/Transition) replaced with plain HTML; the DISC
// avatar position map is kept verbatim so the wheel matches kelola-app exactly.
import React from "react";
import BackgroundDISCRadar, { PropsBackgroundDISCRadarT } from "./BackgroundDISCRadar";
import { mantineColor } from "./mantineColor";

export type DISCTypes =
  | "D" | "DI" | "DC" | "DS" | "DSI" | "DSC" | "DIS" | "DIC" | "DCS" | "DCI"
  | "I" | "ID" | "IDS" | "IDC" | "IS" | "ISC" | "ISD" | "IC" | "ICS" | "ICD"
  | "S" | "SI" | "SID" | "SIC" | "SC" | "SCI" | "SCD" | "SD" | "SDC" | "SDI"
  | "C" | "CS" | "CSI" | "CSD" | "CD" | "CDI" | "CDS" | "CI" | "CIS" | "CID";

export type RadarDataT = { name: string; DISC?: DISCTypes; photo?: string };

type PropsDISCRadarT = {
  datas: RadarDataT[];
  dimmed?: boolean;
  horizontalText?: boolean;
} & PropsBackgroundDISCRadarT;

function getInitial(str: string, length = 2) {
  return str.split(" ").map(w => w[0] || "").join("").slice(0, length).toUpperCase();
}

const DISCRadar = ({ datas, colors = ["error", "primary", "success", "secondary"], dimmed = false, horizontalText = false, size = 250, acsentShade = 5, ...rest }: PropsDISCRadarT) => {
  const validColors = Object.keys(mantineColor);
  const invalidColors = colors.filter(color => !validColors.includes(color));

  const defaultRadar: PropsBackgroundDISCRadarT = {
    ...rest,
    size,
    colors: (colors.length === 4 && invalidColors.length === 0) ? colors : ["error", "primary", "success", "secondary"],
    dimmed,
    horizontalText,
    ...(dimmed ? { bgShades: [1, 1, 1, 1] as [number, number, number, number], borderColor: "#CED4DADA", acsentShade: 7 } : {}),
  };
  const uniqueDiscValues = Array.from(new Set(datas.map(d => d.DISC)));

  const resolve = (token: string, shade: number) => mantineColor[token]?.[shade] ?? token;

  const renderAvatar = (data: RadarDataT[]) => {
    const DISCvalue = data[0].DISC;
    const categoryDISC = DISCvalue ? DISCvalue.charAt(0) : "";
    let colorToken = colors[0];

    if (categoryDISC === "") return <div />;

    switch (categoryDISC) {
      case "D": colorToken = colors[0]; break;
      case "I": colorToken = colors[1]; break;
      case "S": colorToken = colors[2]; break;
      case "C": colorToken = colors[3]; break;
    }
    const avatarColor = resolve(colorToken, acsentShade);
    const mappedPosition: React.CSSProperties = { position: "absolute" };

    switch (DISCvalue) {
      case "D": mappedPosition.top = size * .1625; mappedPosition.left = size * .155; break;
      case "DS": mappedPosition.top = size * .385; mappedPosition.left = size * .4125; break;
      case "DSC": mappedPosition.top = size * .34; mappedPosition.left = size * .3475; break;
      case "DSI": mappedPosition.top = size * .245; mappedPosition.left = size * .245; break;
      case "DI": mappedPosition.top = size * .045; mappedPosition.left = size * .3675; break;
      case "DIS": mappedPosition.top = size * .16; mappedPosition.left = size * .395; break;
      case "DIC": mappedPosition.top = size * .29; mappedPosition.left = size * .4225; break;
      case "DC": mappedPosition.top = size * .3575; mappedPosition.left = size * .05; break;
      case "DCS": mappedPosition.top = size * .3875; mappedPosition.left = size * .17; break;
      case "DCI": mappedPosition.top = size * .4225; mappedPosition.left = size * .2975; break;
      case "I": mappedPosition.top = size * .1625; mappedPosition.right = size * .155; break;
      case "IC": mappedPosition.top = size * .385; mappedPosition.right = size * .4125; break;
      case "ICS": mappedPosition.top = size * .34; mappedPosition.right = size * .3475; break;
      case "ICD": mappedPosition.top = size * .245; mappedPosition.right = size * .245; break;
      case "ID": mappedPosition.top = size * .045; mappedPosition.right = size * .3675; break;
      case "IDC": mappedPosition.top = size * .16; mappedPosition.right = size * .395; break;
      case "IDS": mappedPosition.top = size * .29; mappedPosition.right = size * .4225; break;
      case "IS": mappedPosition.top = size * .3575; mappedPosition.right = size * .05; break;
      case "ISD": mappedPosition.top = size * .3875; mappedPosition.right = size * .17; break;
      case "ISC": mappedPosition.top = size * .4225; mappedPosition.right = size * .2975; break;
      case "S": mappedPosition.bottom = size * .1625; mappedPosition.right = size * .155; break;
      case "SD": mappedPosition.bottom = size * .385; mappedPosition.right = size * .4125; break;
      case "SDC": mappedPosition.bottom = size * .305; mappedPosition.right = size * .325; break;
      case "SDI": mappedPosition.bottom = size * .245; mappedPosition.right = size * .245; break;
      case "SC": mappedPosition.bottom = size * .04; mappedPosition.right = size * .375; break;
      case "SCI": mappedPosition.bottom = size * .16; mappedPosition.right = size * .405; break;
      case "SCD": mappedPosition.bottom = size * .295; mappedPosition.right = size * .435; break;
      case "SI": mappedPosition.bottom = size * .3475; mappedPosition.right = size * .05; break;
      case "SID": mappedPosition.bottom = size * .3775; mappedPosition.right = size * .17; break;
      case "SIC": mappedPosition.bottom = size * .4225; mappedPosition.right = size * .3025; break;
      case "C": mappedPosition.bottom = size * .1625; mappedPosition.left = size * .155; break;
      case "CI": mappedPosition.bottom = size * .385; mappedPosition.left = size * .4125; break;
      case "CIS": mappedPosition.bottom = size * .34; mappedPosition.left = size * .3475; break;
      case "CID": mappedPosition.bottom = size * .245; mappedPosition.left = size * .245; break;
      case "CS": mappedPosition.bottom = size * .04; mappedPosition.left = size * .375; break;
      case "CSI": mappedPosition.bottom = size * .16; mappedPosition.left = size * .405; break;
      case "CSD": mappedPosition.bottom = size * .295; mappedPosition.left = size * .435; break;
      case "CD": mappedPosition.bottom = size * .3575; mappedPosition.left = size * .05; break;
      case "CDI": mappedPosition.bottom = size * .3875; mappedPosition.left = size * .17; break;
      case "CDS": mappedPosition.bottom = size * .4275; mappedPosition.left = size * .2985; break;
    }

    const av = size * 0.12;
    const single = data.length === 1 ? data[0] : null;
    return (
      <div
        key={DISCvalue}
        title={data.map(d => d.name).join(", ")}
        style={{
          ...mappedPosition, width: av, height: av, borderRadius: "50%",
          background: avatarColor, color: "#fff", opacity: 0.8, zIndex: 2,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "'Open Sans', sans-serif", fontWeight: 700, fontSize: av * 0.42,
          overflow: "hidden",
        }}
      >
        {/* Initials/count fallback rendered underneath; the photo (if any) covers it
            and is hidden on load failure via plain DOM manipulation (no state needed
            since this is a plain function called during render, not a component). */}
        <span>{data.length > 1 ? data.length : getInitial(data[0].name)}</span>
        {single?.photo && (
          <img
            src={single.photo}
            alt=""
            onError={(e) => { e.currentTarget.style.display = "none"; }}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }}
          />
        )}
      </div>
    );
  };

  const cornerShade = 5;
  const cornerColor = (i: number) => dimmed ? mantineColor.neutral[cornerShade] : (mantineColor[colors[i]]?.[cornerShade] ?? mantineColor.neutral[cornerShade]);
  const cornerStyle: React.CSSProperties = { position: "absolute", fontSize: 0.036 * size, fontFamily: "'Open Sans', sans-serif", fontWeight: 700, textTransform: "uppercase" };

  return (
    <div style={{ position: "relative", width: size, height: size }}>
      {uniqueDiscValues.map((ud, i) => (
        <React.Fragment key={ud || `unique-${i}`}>{renderAvatar(datas.filter(d => d.DISC === ud))}</React.Fragment>
      ))}
      <BackgroundDISCRadar {...defaultRadar} />
      {horizontalText && <span style={{ ...cornerStyle, top: 0, left: 0, color: cornerColor(0) }}>Driver</span>}
      {horizontalText && <span style={{ ...cornerStyle, top: 0, right: 0, color: cornerColor(1) }}>Persuader</span>}
      {horizontalText && <span style={{ ...cornerStyle, bottom: 0, right: 0, color: cornerColor(2) }}>Mediator</span>}
      {horizontalText && <span style={{ ...cornerStyle, bottom: 0, left: 0, color: cornerColor(3) }}>Analyzer</span>}
    </div>
  );
};

export default DISCRadar;
