"use client";
// Panel Development V3 — SALINAN-BARU, bukan `EmployeeDetailPanel` yang dipakai
// V1 (aturan copy-on-demand, docs/vismap-v3.md §3): tampilannya diubah total
// jadi dua tab, sehingga tidak boleh menumpang komponen share.
//
// Dua tab menjawab dua pertanyaan yang di versi lama tercampur jadi
// "Competency Score" dan "Readiness Score" tanpa konteks jabatan:
//
//   Current Position → seberapa cocok orang ini dengan jabatan yang DIISI
//                      sekarang; dropdown-nya terkunci di jabatan itu.
//   Target Position  → seberapa cocok terhadap jabatan yang DITUJU; default
//                      atasan langsungnya, tapi bisa diganti ke jabatan lain.
//
// Di bawah tiap persentase ada breakdown aspek yang masih di bawah standar
// jabatan tersebut beserta Key Behaviour-nya. KB yang dicentang ikut terbawa
// sebagai baris program di form Create IDP.
import { useEffect, useMemo, useState } from 'react';
import { ChevronDown, ChevronUp, Info, Star, TrendingUp, X } from 'lucide-react';
/*
 * Komponen design system Prodigy (re-export tipis Mantine). Ukuran teks lewat
 * PROP "size" — xs 10px / sm 12px / md 14px — bukan class utility, supaya panel
 * ini ikut berubah kalau tokennya berubah.
 */
import {
  ActionIcon,
  Badge,
  Button,
  Checkbox,
  Group,
  Select,
  Stack,
  Tabs,
  Text,
  Title,
  Tooltip,
  UnstyledButton,
} from '@mantine/core';
import { devAspectsFor, hasCompetencyData, matchPercentFor, positionOptions, type DevAspect } from '../competency';

interface DevelopmentPanelV3Props {
  employeeId: string;
  employeeName: string;
  employeePosition: string;
  employeePhoto?: string;
  /** Jabatan atasan langsung — default tab Target Position. */
  managerPosition?: string | null;
  onClose: () => void;
}

type TabId = 'current' | 'target';

const kbKey = (aspect: string, kb: string) => `${aspect}||${kb}`;

function StarRow({ score }: { score: number }) {
  return (
    <span className="flex items-center gap-[1px]">
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          className="w-[12px] h-[12px]"
          style={{ color: i <= score ? '#F59E02' : '#dee2e6' }}
          fill={i <= score ? '#F59E02' : '#dee2e6'}
          strokeWidth={0}
        />
      ))}
    </span>
  );
}

function AspectRow({ aspect, checked, onToggleKb }: {
  aspect: DevAspect;
  checked: Set<string>;
  onToggleKb: (aspectLabel: string, kb: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const hasKb = aspect.keyBehaviours.length > 0;
  const checkedCount = aspect.keyBehaviours.filter(kb => checked.has(kbKey(aspect.label, kb.label))).length;

  return (
    <div className="rounded-[8px] border border-[#dee2e6] overflow-hidden">
      <UnstyledButton
        onClick={() => hasKb && setExpanded(v => !v)}
        w="100%"
        px={12}
        py={10}
        bg="white"
        style={{ textAlign: 'left' }}
      >
        <Group gap={8} wrap="nowrap">
          <Group gap={5} wrap="nowrap" style={{ flex: 1, minWidth: 0 }}>
            <Text size="sm" fw={600} c="neutral.9" truncate>{aspect.label}</Text>
            {aspect.description && (
              <Tooltip label={aspect.description} position="left" multiline w={260}>
                <span style={{ display: 'flex', flexShrink: 0, cursor: 'help' }}>
                  <Info className="w-[12px] h-[12px] text-[#adb5bd]" />
                </span>
              </Tooltip>
            )}
          </Group>

          {/* Selisih yang harus ditutup untuk mencapai standar jabatan */}
          <Badge size="sm" radius="xl" variant="outline" color="warning" styles={{ root: { flexShrink: 0 } }}>
            +{aspect.gap}
          </Badge>
          <StarRow score={aspect.score} />
          <Badge size="sm" radius="sm" variant="light" color="neutral" styles={{ root: { flexShrink: 0 } }}>
            {aspect.score}
          </Badge>
          {hasKb && (
            expanded
              ? <ChevronUp className="w-[14px] h-[14px] text-[#016699] shrink-0" />
              : <ChevronDown className="w-[14px] h-[14px] text-[#016699] shrink-0" />
          )}
        </Group>
      </UnstyledButton>

      {expanded && hasKb && (
        <div className="flex flex-col border-t border-[#dee2e6]">
          {aspect.keyBehaviours.map(kb => {
            const key = kbKey(aspect.label, kb.label);
            const isChecked = checked.has(key);
            return (
              <Group
                key={key}
                align="flex-start"
                gap={8}
                wrap="nowrap"
                px={12}
                py={8}
                className="bg-[#f8f9fa] border-b border-[#e9ecef] last:border-b-0"
              >
                <Checkbox
                  size="xs"
                  checked={isChecked}
                  onChange={() => onToggleKb(aspect.label, kb.label)}
                  label={<Text size="xs" c="neutral.7">{kb.label}</Text>}
                  styles={{ body: { alignItems: 'flex-start' }, root: { flex: 1, minWidth: 0 } }}
                />
                <Text size="xs" fw={700} c="neutral.6" style={{ flexShrink: 0 }}>Taraf {kb.level}</Text>
              </Group>
            );
          })}
        </div>
      )}

      {expanded && checkedCount > 0 && (
        <div className="px-[12px] py-[6px] bg-white border-t border-[#e9ecef]">
          <Text size="xs" c="primary.5">{checkedCount} key behaviour dipilih untuk IDP</Text>
        </div>
      )}
    </div>
  );
}

export default function DevelopmentPanelV3({
  employeeId, employeeName, employeePosition, managerPosition, onClose,
}: DevelopmentPanelV3Props) {
  const [tab, setTab] = useState<TabId>('current');
  const allPositions = useMemo(() => positionOptions(), []);

  // Target default: jabatan atasan langsung. Kalau atasannya tidak punya data
  // aspek (atau orang ini sudah di puncak), jatuh ke jabatan pertama yang ada
  // datanya supaya tab Target tidak pernah kosong tanpa sebab.
  const defaultTarget = useMemo(() => {
    if (managerPosition && hasCompetencyData(managerPosition)) return managerPosition;
    return allPositions.find(p => p !== employeePosition) ?? employeePosition;
  }, [managerPosition, allPositions, employeePosition]);

  const [targetPosition, setTargetPosition] = useState(defaultTarget);
  useEffect(() => { setTargetPosition(defaultTarget); }, [defaultTarget]);

  // Centangan KB dipegang per jabatan yang dibandingkan: pindah tab atau ganti
  // target berarti aspek yang dibahas berbeda, jadi centangan lama tidak boleh
  // ikut terbawa diam-diam ke form IDP.
  const comparedPosition = tab === 'current' ? employeePosition : targetPosition;
  const [checkedByPosition, setCheckedByPosition] = useState<Record<string, Set<string>>>({});
  const checked = checkedByPosition[comparedPosition] ?? new Set<string>();

  const toggleKb = (aspectLabel: string, kb: string) => {
    setCheckedByPosition(prev => {
      const next = new Set(prev[comparedPosition] ?? []);
      const key = kbKey(aspectLabel, kb);
      if (next.has(key)) next.delete(key); else next.add(key);
      return { ...prev, [comparedPosition]: next };
    });
  };

  const match = matchPercentFor(employeeId, comparedPosition);
  const devAspects = useMemo(
    () => (hasCompetencyData(comparedPosition) ? devAspectsFor(employeeId, comparedPosition) : []),
    [employeeId, comparedPosition],
  );

  const handleCreateIDP = () => {
    // Kelompokkan KB tercentang per aspek → satu baris program per aspek di
    // form Create IDP, dengan Development Goals terisi KB-nya.
    const grouped = new Map<string, string[]>();
    for (const key of checked) {
      const [aspect, kb] = key.split('||');
      if (!grouped.has(aspect)) grouped.set(aspect, []);
      grouped.get(aspect)!.push(kb);
    }

    const params = new URLSearchParams({
      page: 'create-idp-admin.html',
      participants: employeeName,
      from: 'vismap-v3',
    });

    if (grouped.size > 0) {
      const payload = [...grouped.entries()].map(([aspect, goals]) => ({ aspect, goals }));
      // base64 supaya label KB yang panjang & berisi tanda baca tidak merusak
      // query string; halaman create-idp membacanya lewat param `prefill`.
      params.set('prefill', btoa(unescape(encodeURIComponent(JSON.stringify(payload)))));
    }

    window.location.href = `/idp?${params.toString()}`;
  };

  const checkedTotal = checked.size;

  return (
    <div
      className="fixed right-0 top-0 h-full w-[420px] bg-white shadow-[-4px_0px_30px_0px_rgba(0,0,0,0.1)] z-[100] flex flex-col animate-in slide-in-from-right duration-300"
      data-name="Development Panel V3"
    >
      {/* Header — label konteks, nama, dan jabatan disusun bertumpuk supaya
          tidak saling tertimpa seperti pada panel versi sebelumnya. */}
      <div className="shrink-0 px-[17px] pt-[18px] pb-[12px] border-b border-[#e9ecef]">
        <div className="flex items-start justify-between gap-[12px]">
          <Stack gap={0} style={{ minWidth: 0 }}>
            <Text size="xs" fw={700} c="primary.5" tt="uppercase" style={{ letterSpacing: '0.08em' }}>
              Development
            </Text>
            <Title order={5} mt={4} c="neutral.9" style={{ minWidth: 0 }}>
              <Text size="md" fw={700} truncate>{employeeName}</Text>
            </Title>
            <Text size="xs" c="neutral.6" truncate>{employeePosition}</Text>
          </Stack>
          <ActionIcon variant="subtle" onClick={onClose} aria-label="Tutup panel Development" style={{ flexShrink: 0 }}>
            <X className="size-5" />
          </ActionIcon>
        </div>

        {/* Tab — komponen Tabs design system, bukan deretan tombol bergaris bawah
            buatan sendiri. */}
        <Tabs value={tab} onChange={(v) => v && setTab(v as TabId)} mt={14} styles={{ list: { borderBottom: 'none' } }}>
          <Tabs.List>
            <Tabs.Tab value="current">Current Position</Tabs.Tab>
            <Tabs.Tab value="target">Target Position</Tabs.Tab>
          </Tabs.List>
        </Tabs>
      </div>

      {/* Isi */}
      <div className="flex-1 overflow-y-auto px-[17px] py-[14px] flex flex-col gap-[14px]">
        {/* Competency Match */}
        <div className="rounded-[8px] border border-[#dee2e6] p-[12px]">
          <Group justify="space-between" gap={10} wrap="nowrap">
            <Text size="sm" fw={600} c="neutral.7">Competency Match</Text>
            <Title order={2} c="primary.5" style={{ lineHeight: 1 }}>
              {match == null ? '-' : `${match}%`}
            </Title>
          </Group>

          {/* Tab Current mengunci pilihannya: yang dibandingkan memang jabatan
              yang sedang diduduki, bukan pilihan bebas. */}
          <Select
            mt={10}
            size="xs"
            data={tab === 'current' ? [employeePosition] : allPositions}
            value={tab === 'current' ? employeePosition : targetPosition}
            onChange={(v) => v && setTargetPosition(v)}
            disabled={tab === 'current'}
            allowDeselect={false}
            searchable={tab === 'target'}
            comboboxProps={{ zIndex: 200 }}
          />

          <Text size="xs" c="neutral.5" mt={6}>
            {tab === 'current'
              ? 'Kecocokan terhadap standar jabatan yang diisi saat ini.'
              : 'Kecocokan terhadap standar jabatan yang dituju.'}
          </Text>
        </div>

        {/* Need Development */}
        <div className="flex flex-col gap-[8px]">
          <Text size="sm" fw={600} c="neutral.7">Need Development</Text>

          {!hasCompetencyData(comparedPosition) ? (
            <div className="rounded-[8px] bg-[#f8f9fa] px-[12px] py-[18px] text-center">
              <Text size="sm" c="neutral.6">Data aspek jabatan ini belum tersedia</Text>
            </div>
          ) : devAspects.length === 0 ? (
            <div className="rounded-[8px] bg-[#f8f9fa] px-[12px] py-[18px] text-center">
              <Text size="sm" fw={600} c="neutral.7">Tidak ada aspek yang perlu dikembangkan</Text>
              <Text size="xs" c="neutral.5" mt={2}>Semua aspek sudah memenuhi standar jabatan</Text>
            </div>
          ) : (
            devAspects.map(a => (
              <AspectRow key={a.label} aspect={a} checked={checked} onToggleKb={toggleKb} />
            ))
          )}
        </div>
      </div>

      {/* Create IDP */}
      <div className="shrink-0 border-t border-[#e9ecef] p-[14px]">
        <Button
          fullWidth
          variant="outline"
          onClick={handleCreateIDP}
          leftSection={<TrendingUp className="w-[15px] h-[15px]" />}
          rightSection={checkedTotal > 0 ? <Badge size="sm" radius="xl" color="primary">{checkedTotal} KB</Badge> : undefined}
        >
          Create IDP
        </Button>
      </div>
    </div>
  );
}
