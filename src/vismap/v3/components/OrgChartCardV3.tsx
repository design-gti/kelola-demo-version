// Card V3 — memisahkan DUA elemen yang di V1 menyatu dalam satu kartu:
//
//   frame job position  → heatmap Succession Risk + ikon Critical Position
//     └ card employee   → heatmap Need Development + ikon Talent
//
// Pemisahan ini yang membuat beberapa overlay bisa dibaca sekaligus (lihat
// src/vismap/v3/overlays.ts). Kartu ini sengaja "bodoh": semua keputusan overlay
// dihitung di VismapV3/OrgNode lalu diturunkan sebagai warna/boolean, supaya
// logic heatmap tidak tersebar di dua tempat seperti di V1.
import { AlertTriangle, Star, User, UserX, Users } from 'lucide-react';
import { ImageLoader } from '../../components/ImageLoader';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../components/ui/tooltip';

export interface HeatmapRange {
  color: string;
  min: number;
  max: number;
}

export interface VisibleColumns {
  gender: boolean;
  city: boolean;
  maritalStatus: boolean;
  performance: boolean;
  iq: boolean;
  capability: boolean;
  commitment: boolean;
  contribution: boolean;
}

interface OrgChartCardV3Props {
  name: string;
  position: string;
  jobTitle: string;
  competencyScore: number;
  successors: number;
  readySuccessorsCount?: number;
  imageUrl?: string;
  employeeId?: string;
  /** Warna heatmap frame job position (overlay Succession Risk). null = mati. */
  positionHeatmapColor?: string | null;
  /** Skor untuk heatmap card employee (overlay Need Development). null = mati. */
  employeeHeatmapScore?: number | null;
  employeeHeatmapRanges?: HeatmapRange[];
  showCriticalIcon?: boolean;
  showTalentIcon?: boolean;
  teams?: string[];
  tenure?: string;
  visibleColumns?: VisibleColumns;
  gender?: string;
  city?: string;
  maritalStatus?: string;
  performance?: number;
  iq?: number;
  capability?: number;
  commitment?: number;
  contribution?: number;
  /** Card position yang sedang dipilih — anchor untuk menu aksi. */
  selected?: boolean;
  highlighted?: boolean;
  maxCardHeight?: number;
  onClick?: () => void;
}

function hexToRgba(hex: string, opacity = 1): string {
  const clean = hex.replace('#', '');
  const full = clean.length === 3 ? clean.split('').map(c => c + c).join('') : clean;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

/** Warna diskrit dari range heatmap yang berlaku (config Setting Heatmap Condition). */
function colorForScore(score: number, ranges: HeatmapRange[]): string | null {
  const hit = ranges.find(r => score >= r.min && score <= r.max);
  return hit ? hit.color : null;
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-[#dee2e6] px-[5px] py-[1px] font-['Open_Sans',_sans-serif] text-[6px] text-[#495057] leading-none whitespace-nowrap">
      {children}
    </span>
  );
}

function ChipRow({ label, values }: { label: string; values: string[] }) {
  if (values.length === 0) return null;
  return (
    <div className="flex flex-col gap-[3px] w-full">
      <p className="font-['Open_Sans',_sans-serif] text-[6px] text-[#58595b] leading-none">{label}</p>
      <div className="flex flex-wrap gap-[3px]">
        {values.map(v => <Chip key={v}>{v}</Chip>)}
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-center justify-between w-full text-[#58595b]">
      <p className="font-['Open_Sans',_sans-serif] text-[6px] leading-none">{label}</p>
      <p className="font-['Open_Sans',_sans-serif] text-[6px] font-bold leading-none text-right">{value}</p>
    </div>
  );
}

/**
 * Badge indikator (Critical Position / Talent). Ikonnya FILLED di atas badge
 * berwarna penuh, ditambah dua gelombang radius yang menyebar (`animate-ping`
 * dengan delay berbeda) supaya mata user tertarik ke posisi/karyawan yang
 * ditandai tanpa harus menyapu seluruh kanvas.
 */
function IndicatorBadge({ color, tooltip, side, children }: {
  color: string;
  tooltip: React.ReactNode;
  side: 'left' | 'right' | 'top' | 'bottom';
  children: React.ReactNode;
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="relative">
            {/* Gelombang radius — TIGA lapis dengan basis melebar keluar badge
                (-inset), karena `animate-ping` menskalakan 2x dari ukuran
                elemennya: basis yang lebih besar berarti sebaran gelombang yang
                lebih jauh, dan itulah yang membuat indikator masih terbaca saat
                kanvas di-zoom out. Jeda antar lapis membuatnya menyebar
                bergelombang, bukan berkedip serempak. */}
            <span
              className="absolute -inset-[4px] rounded-full animate-ping pointer-events-none"
              style={{ backgroundColor: color, opacity: 0.5 }}
            />
            <span
              className="absolute -inset-[8px] rounded-full animate-ping pointer-events-none"
              style={{ backgroundColor: color, opacity: 0.3, animationDelay: '0.6s' }}
            />
            <span
              className="absolute -inset-[12px] rounded-full animate-ping pointer-events-none"
              style={{ backgroundColor: color, opacity: 0.18, animationDelay: '1.2s' }}
            />
            <div
              className="relative rounded-full p-[5px] shadow-md ring-2 ring-white"
              style={{ backgroundColor: color }}
            >
              {children}
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent side={side}>
          <p className="font-['Open_Sans',_sans-serif] text-xs">{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

/**
 * Card employee: kotak berisi foto + nama, DI DALAM frame job position. Punya
 * overlay heatmap sendiri (Need Development) dan ikon Talent sendiri.
 */
function EmployeeCard({ name, imageUrl, heatmapColor, showTalentIcon }: {
  name: string;
  imageUrl?: string;
  heatmapColor: string | null;
  showTalentIcon?: boolean;
}) {
  const isVacant = name === '(Vacant)' || !name?.trim();
  const displayName = isVacant ? '[VACANT]' : name;

  return (
    <div
      className="relative mx-[6px] h-[96px] rounded-[4px] overflow-clip"
      style={{ backgroundColor: isVacant ? '#9e9e9e' : '#d6e6ff' }}
      data-name="Employee Card"
    >
      {isVacant ? (
        <div className="absolute inset-0 flex items-center justify-center -translate-y-2">
          <UserX className="w-[46px] h-[46px] text-white" strokeWidth={1.5} />
        </div>
      ) : imageUrl ? (
        <ImageLoader imageUrl={imageUrl} alt={name} className="absolute size-full object-cover" />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center -translate-y-2">
          <User className="w-[46px] h-[46px] text-[#016699]" strokeWidth={1.5} />
        </div>
      )}

      {/* Heatmap Need Development — hanya menutupi elemen employee, bukan frame position */}
      {heatmapColor && (
        <div
          className="absolute inset-0 z-20 pointer-events-none transition-colors duration-300"
          style={{
            backgroundColor: hexToRgba(heatmapColor, 0.55),
            boxShadow: `inset 0 0 0 2px ${hexToRgba(heatmapColor, 0.9)}`,
          }}
        />
      )}

      {/* Nama karyawan */}
      <div className="absolute inset-x-0 bottom-0 z-30">
        <div className="h-[26px] bg-gradient-to-t from-black/80 to-transparent" />
        <p className="absolute inset-x-0 bottom-[4px] px-[4px] text-center font-['Open_Sans',_sans-serif] font-bold text-[7px] leading-[normal] text-white [text-shadow:rgba(0,0,0,0.6)_1px_1px_6px]">
          {displayName.toUpperCase()}
        </p>
      </div>

      {/* Indikator Talent (9-box Star) */}
      {showTalentIcon && !isVacant && (
        <div className="absolute top-[5px] left-[5px] z-40">
          <IndicatorBadge
            color="#0F9D8F"
            side="left"
            tooltip={<>Talent — kuadran <strong>Star</strong> pada 9-box</>}
          >
            <Star className="w-[17px] h-[17px] text-white" fill="#ffffff" stroke="#ffffff" strokeWidth={2} />
          </IndicatorBadge>
        </div>
      )}
    </div>
  );
}

export default function OrgChartCardV3({
  name, position, jobTitle, competencyScore, successors, readySuccessorsCount = 0,
  imageUrl, employeeId,
  positionHeatmapColor = null, employeeHeatmapScore = null, employeeHeatmapRanges = [],
  showCriticalIcon = false, showTalentIcon = false,
  teams = [], tenure,
  visibleColumns, gender, city, maritalStatus, performance, iq, capability, commitment, contribution,
  selected = false, highlighted = false, maxCardHeight, onClick,
}: OrgChartCardV3Props) {
  const employeeHeatmapColor = employeeHeatmapScore != null
    ? colorForScore(employeeHeatmapScore, employeeHeatmapRanges)
    : null;

  const additionalFields: { label: string; value: string | number }[] = [];
  if (visibleColumns?.gender) additionalFields.push({ label: 'Gender', value: gender ?? '-' });
  if (visibleColumns?.city) additionalFields.push({ label: 'City', value: city ?? '-' });
  if (visibleColumns?.maritalStatus) additionalFields.push({ label: 'Marital Status', value: maritalStatus ?? '-' });
  if (visibleColumns?.performance) additionalFields.push({ label: 'Performance', value: performance ?? '-' });
  if (visibleColumns?.iq) additionalFields.push({ label: 'IQ', value: iq ?? '-' });
  if (visibleColumns?.capability) additionalFields.push({ label: 'Capability', value: capability ?? '-' });
  if (visibleColumns?.commitment) additionalFields.push({ label: 'Commitment', value: commitment ?? '-' });
  if (visibleColumns?.contribution) additionalFields.push({ label: 'Contribution', value: contribution ?? '-' });

  return (
    <div
      className="relative w-[135px] cursor-pointer group"
      style={{ minHeight: maxCardHeight ? `${maxCardHeight}px` : undefined }}
      data-name="Position Card Wrapper"
      data-employee-id={employeeId}
      onClick={onClick}
    >
      {/* Ring highlight saat karyawan dicari lewat search */}
      {highlighted && (
        <div className="absolute -inset-[6px] z-50 pointer-events-none animate-pulse">
          <div
            className="absolute inset-0 rounded-[10px] border-[4px] border-[#016699]"
            style={{ boxShadow: '0 0 20px rgba(1, 102, 153, 0.8), 0 0 40px rgba(1, 102, 153, 0.5)' }}
          />
        </div>
      )}

      {/* Glow heatmap Succession Risk — menyebar di luar frame position */}
      {positionHeatmapColor && (
        <div
          className="absolute -inset-[24px] z-0 pointer-events-none transition-all duration-500"
          style={{ backgroundColor: hexToRgba(positionHeatmapColor, 0.5), filter: 'blur(26px)', opacity: 0.6 }}
        />
      )}

      {/* Frame job position */}
      <div
        className="relative z-10 flex flex-col rounded-[8px] bg-white transition-all duration-300 group-hover:scale-105"
        style={{
          minHeight: maxCardHeight ? `${maxCardHeight}px` : undefined,
          boxShadow: 'var(--shadow-card)',
          border: positionHeatmapColor
            ? `2px solid ${hexToRgba(positionHeatmapColor, 0.9)}`
            : selected ? '2px solid #016699' : '1px solid #dee2e6',
          backgroundColor: positionHeatmapColor ? hexToRgba(positionHeatmapColor, 0.12) : '#ffffff',
          outline: selected && positionHeatmapColor ? '2px solid #016699' : undefined,
          outlineOffset: selected && positionHeatmapColor ? 2 : undefined,
        }}
        data-name="Job Position Card"
      >
        {/* Header: nama job position */}
        <div className="px-[6px] pt-[7px] pb-[6px]">
          <p className="text-center font-['Open_Sans',_sans-serif] font-bold text-[8px] leading-[normal] text-[#212529]">
            {position || jobTitle}
          </p>
        </div>

        <EmployeeCard
          name={name}
          imageUrl={imageUrl}
          heatmapColor={employeeHeatmapColor}
          showTalentIcon={showTalentIcon}
        />

        {/* Footer: data job position */}
        <div className="flex flex-col gap-[6px] px-[7px] pt-[8px] pb-[9px]">
          <ChipRow label="Teams" values={teams} />
          {tenure && <ChipRow label="Tenure" values={[tenure]} />}
          <InfoRow label="Competency Score" value={`${competencyScore}%`} />
          <div className="flex items-center justify-between w-full text-[#58595b]">
            <p className="font-['Open_Sans',_sans-serif] text-[6px] leading-none">Successors</p>
            <span className="inline-flex items-center gap-[3px] rounded-full bg-[#f1f3f5] px-[5px] py-[1px]">
              <Users className="w-[7px] h-[7px] text-[#016699]" strokeWidth={2.5} />
              <span className="font-['Open_Sans',_sans-serif] text-[6px] font-bold leading-none text-[#016699]">
                {readySuccessorsCount}/{successors}
              </span>
            </span>
          </div>
          {additionalFields.length > 0 && (
            <div className="flex flex-col gap-[4px] w-full">
              {additionalFields.map(f => <InfoRow key={f.label} label={f.label} value={f.value} />)}
            </div>
          )}
        </div>
      </div>

      {/* Indikator Critical Position — di samping frame position, sesuai rancangan V3 */}
      {showCriticalIcon && (
        <div className="absolute -top-[10px] -right-[10px] z-40">
          <IndicatorBadge color="#E03131" side="right" tooltip="Critical Position">
            <AlertTriangle
              className="w-[18px] h-[18px]"
              fill="#ffffff"
              stroke="#E03131"
              strokeWidth={2.5}
            />
          </IndicatorBadge>
        </div>
      )}
    </div>
  );
}
