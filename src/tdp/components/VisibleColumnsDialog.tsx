// @ts-nocheck -- ported from tdp-prototype (Vite, never tsc-checked); not type-maintained here
import { KLASTER_BAWAAN, KLASTER_BAWAAN_TIPE } from '@/lib/klasterVisibilitas';
import { cocokKlaster, klasterAsalKolom } from '../lib/klasterKolom';
import { Fragment, useState, useEffect, useMemo } from 'react';
/*
  Tampilan modal ini SAMA dengan modal Data Visibility di Vismap (`vismap/components/DataVisibilityModal`):
  modal Prodigy, panel kiri pencarian + cluster, panel kanan variabel, footer. Dulu dialog Radix/shadcn
  dengan checkbox, tombol, dan menu yang digambar sendiri — dua modal dengan nama yang sama tapi rupa
  berbeda. Isi dan cluster-nya dibagi lewat `lib/klasterVisibilitas`.
*/
import { Button, Checkbox, Divider, Menu, Modal, Text, TextInput } from '@talentlytica/prodigy';
import { ScrollArea, UnstyledButton } from '@mantine/core';
import {
  IconArrowsMove, IconChevronDown, IconChevronRight, IconPlus, IconSearch, IconTrash, IconX,
} from '@tabler/icons-react';
import { ColumnConfig } from '../data/columnDefinitions';

interface VisibleColumnsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  visibleColumns: Set<string>;
  onApply: (columns: Set<string>) => void;
  columnDefinitions: ColumnConfig[];
  customColumns: ColumnConfig[];
  onDeleteCustomColumn: (key: string) => void;
  onAddColumn: () => void;
}

export default function VisibleColumnsDialog({
  open,
  onOpenChange,
  visibleColumns,
  onApply,
  columnDefinitions,
  customColumns,
  onDeleteCustomColumn,
  onAddColumn,
}: VisibleColumnsDialogProps) {
  const [tempVisibleColumns, setTempVisibleColumns] = useState<Set<string>>(new Set());
  const [expandedSection, setExpandedSection] = useState<string | null>('basic');
  const [searchTerm, setSearchTerm] = useState('');

  // ── Custom clusters & variable overrides ─────────────────────────────────
  const [userClusters, setUserClusters] = useState<{ key: string; label: string }[]>(() => {
    try { return JSON.parse(localStorage.getItem('userClusters.v1') || '[]'); } catch { return []; }
  });
  const [clusterOverrides, setClusterOverrides] = useState<Record<string, string>>(() => {
    try { return JSON.parse(localStorage.getItem('clusterOverrides.v1') || '{}'); } catch { return {}; }
  });
  const [newClusterLabel, setNewClusterLabel] = useState('');
  const [showNewClusterInput, setShowNewClusterInput] = useState(false);

  // Sync tempVisibleColumns with visibleColumns prop whenever dialog opens
  useEffect(() => {
    if (open) {
      setTempVisibleColumns(new Set(visibleColumns));
      setSearchTerm('');
      setExpandedSection('basic');
    }
  }, [open, visibleColumns]);

  const handleApply = () => {
    // Ensure mandatory columns are always included
    const finalColumns = new Set(tempVisibleColumns);
    finalColumns.add('name');
    finalColumns.add('competencyScore');
    finalColumns.add('commitmentScore');
    finalColumns.add('contributionScore');
    onApply(finalColumns);
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  const toggleTempColumn = (key: string) => {
    // Prevent toggling mandatory columns
    const mandatoryColumns = ['name', 'competencyScore', 'commitmentScore', 'contributionScore'];
    if (mandatoryColumns.includes(key)) return;
    
    setTempVisibleColumns(prev => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const getFilteredColumns = (columns: ColumnConfig[]) => {
    if (!searchTerm.trim()) return columns;
    const searchLower = searchTerm.toLowerCase();
    return columns.filter(col => col.label.toLowerCase().includes(searchLower));
  };

  // Klasifikasi kolom → cluster dipakai bersama kartu Compare: lihat `lib/klasterKolom`.
  const matchesCluster = cocokKlaster;

  // ---- Derive section labels from CSV bracket prefixes in columnDefinitions ----
  // For every csv:<header> column whose header has a [BRACKET] prefix, map the
  // internal cluster key → bracket group name.  Falls back to the friendly label
  // when no CSV bracket column exists for that cluster.
  const csvSectionLabels = useMemo(() => {
    const labels: Record<string, string> = {};
    columnDefinitions.forEach((col) => {
      const k = String(col.key);
      if (!k.startsWith('csv:')) return;
      const header = k.slice(4);
      const m = header.match(/^\[([^\]]+)\]/);
      if (!m) return;
      const bracketGroup = m[1]; // e.g. 'KOMPETENSI', 'HEROES', 'LEADERSHIP PROFILE'
      const cluster = col.cluster as string | undefined;
      if ((cluster === 'aspect' || cluster === 'competency') && !labels['capability'])
        labels['capability'] = bracketGroup;
      if (cluster === 'commitment' && !labels['commitment'])
        labels['commitment'] = bracketGroup;
      if (cluster === 'contribution' && !labels['contribution'])
        labels['contribution'] = bracketGroup;
      if (cluster === 'leadershipStyle' && !labels['leadershipStyle'])
        labels['leadershipStyle'] = bracketGroup;
    });
    return labels;
  }, [columnDefinitions]);

  const sectionLabel = (cluster: string, fallback: string): string => {
    if (cluster === 'capability') return 'Capability';
    return csvSectionLabels[cluster] ?? fallback;
  };

  // Returns the original (built-in) cluster key for a column
  const getOriginalClusterKey = (col: ColumnConfig): string => klasterAsalKolom(col);

  // Returns effective cluster (respects user overrides; basic is always locked)
  const getEffectiveClusterKey = (col: ColumnConfig): string => {
    const orig = getOriginalClusterKey(col);
    if (orig === 'basic') return 'basic'; // locked — cannot be moved
    return clusterOverrides[String(col.key)] ?? orig;
  };

  // Get all columns belonging to a cluster, respecting overrides
  const getClusterColumns = (cluster: string): string[] => {
    const allCols = [...columnDefinitions, ...customColumns];
    return allCols
      .filter(col => getEffectiveClusterKey(col) === cluster)
      .map(col => String(col.key));
  };

  // All available clusters (built-in + user-created)
  // Daftar dan label cluster bawaan datang dari katalog BERSAMA dengan Vismap (`lib/klasterVisibilitas`).
  const BUILT_IN_CLUSTERS = KLASTER_BAWAAN;
  const allClusters = [...BUILT_IN_CLUSTERS, ...userClusters];

  // Move a variable to a different cluster
  const moveVariable = (varKey: string, targetCluster: string) => {
    const newOverrides = { ...clusterOverrides, [varKey]: targetCluster };
    setClusterOverrides(newOverrides);
    localStorage.setItem('clusterOverrides.v1', JSON.stringify(newOverrides));
  };

  // Create a new user cluster
  const createUserCluster = () => {
    const label = newClusterLabel.trim();
    if (!label) return;
    const key = `user_${Date.now()}`;
    const next = [...userClusters, { key, label }];
    setUserClusters(next);
    localStorage.setItem('userClusters.v1', JSON.stringify(next));
    setNewClusterLabel('');
    setShowNewClusterInput(false);
    setExpandedSection(key);
  };

  // Delete a user cluster — move its variables back to original cluster
  const deleteUserCluster = (clusterKey: string) => {
    const next = userClusters.filter(c => c.key !== clusterKey);
    setUserClusters(next);
    localStorage.setItem('userClusters.v1', JSON.stringify(next));
    const newOverrides = { ...clusterOverrides };
    Object.keys(newOverrides).forEach(k => {
      if (newOverrides[k] === clusterKey) delete newOverrides[k];
    });
    setClusterOverrides(newOverrides);
    localStorage.setItem('clusterOverrides.v1', JSON.stringify(newOverrides));
    if (expandedSection === clusterKey) setExpandedSection(null);
  };

  const toggleSelectAllCluster = (cluster: string) => {
    const clusterCols = getClusterColumns(cluster);
    const mandatoryColumns = ['name', 'competencyScore', 'commitmentScore', 'contributionScore'];
    const selectableCols = clusterCols.filter(col => !mandatoryColumns.includes(col));
    const allSelected = selectableCols.every(col => tempVisibleColumns.has(col));

    setTempVisibleColumns(prev => {
      const newSet = new Set(prev);
      selectableCols.forEach(col => {
        if (allSelected) {
          newSet.delete(col);
        } else {
          newSet.add(col);
        }
      });
      return newSet;
    });
  };

  const isClusterAllSelected = (cluster: string): boolean => {
    const clusterCols = getClusterColumns(cluster);
    const mandatoryColumns = ['name', 'competencyScore', 'commitmentScore', 'contributionScore'];
    const selectableCols = clusterCols.filter(col => !mandatoryColumns.includes(col));
    return selectableCols.length > 0 && selectableCols.every(col => tempVisibleColumns.has(col));
  };

  const MANDATORY = new Set(['name', 'competencyScore', 'commitmentScore', 'contributionScore']);

  /** Tinggi badan modal — tetap, supaya kedua panel punya area scroll sendiri (sama dengan Vismap). */
  const TINGGI_BADAN = 360;

  /** Satu baris variabel: checkbox Prodigy + (hapus kolom custom) + (pindahkan ke cluster lain). */
  const renderVariabel = (col: ColumnConfig, bisaPindah: boolean) => {
    const k = String(col.key);
    const wajib = MANDATORY.has(k);
    const dicentang = tempVisibleColumns.has(k) || wajib;
    // Data tambahan dari Profile Data tak bisa dihapus dari sini — sumbernya Profile Data.
    const kolomCustom = customColumns.some((c) => String(c.key) === k && !c.dariProfileData);
    const tujuan = allClusters.filter((c) => c.key !== expandedSection);
    return (
      <div key={k} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Checkbox
          size="xs"
          checked={dicentang}
          disabled={wajib}
          onChange={() => toggleTempColumn(k)}
          px="sm"
          py={8}
          label={
            <Text size="xs" c={wajib ? 'neutral.6' : dicentang ? 'primary' : 'neutral.7'} truncate>
              {col.label}
              {wajib && <Text span size="10px" c="neutral.5"> (Required)</Text>}
            </Text>
          }
        />
        <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          {kolomCustom && (
            <UnstyledButton
              onClick={() => onDeleteCustomColumn(k)}
              aria-label={`Delete column ${col.label}`}
              title="Delete column"
              style={{ display: 'flex', padding: 6, color: 'var(--mantine-color-error-5)' }}
            >
              <IconTrash size={14} />
            </UnstyledButton>
          )}
          {bisaPindah && !wajib && (
            <Menu withinPortal position="bottom-end" shadow="md" zIndex={1200}>
              <Menu.Target>
                <UnstyledButton
                  aria-label={`Move ${col.label} to another cluster`}
                  title="Move to cluster"
                  style={{ display: 'flex', padding: 6 }}
                >
                  <IconArrowsMove size={14} />
                </UnstyledButton>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Label>Move to</Menu.Label>
                {tujuan.map((c) => (
                  <Menu.Item key={c.key} onClick={() => moveVariable(k, c.key)}>
                    {c.label}
                  </Menu.Item>
                ))}
              </Menu.Dropdown>
            </Menu>
          )}
        </div>
      </div>
    );
  };

  /** Tombol cluster di panel kiri — bentuk yang sama dengan Vismap. */
  const renderSectionButton = (section: string, label: string, isUserCluster = false) => {
    const isExpanded = expandedSection === section;
    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <UnstyledButton
          onClick={() => toggleSection(section)}
          style={{
            flex: 1,
            minWidth: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 4,
            height: 36,
            padding: '8px var(--mantine-spacing-xs)',
            borderRadius: 'var(--mantine-radius-sm)',
            background: isExpanded ? 'var(--mantine-color-neutral-1)' : undefined,
          }}
        >
          <Text size="xs" tt="uppercase" c="neutral.7" truncate>
            {label}
          </Text>
          {isExpanded
            ? <IconChevronDown size={14} style={{ flexShrink: 0 }} />
            : <IconChevronRight size={14} style={{ flexShrink: 0 }} />}
        </UnstyledButton>
        {isUserCluster && (
          <UnstyledButton
            onClick={() => deleteUserCluster(section)}
            aria-label={`Delete cluster ${label}`}
            title="Delete cluster"
            style={{ display: 'flex', padding: 6 }}
          >
            <IconTrash size={14} />
          </UnstyledButton>
        )}
      </div>
    );
  };

  /** Isi panel kanan untuk cluster yang sedang dibuka. */
  const renderPanelKanan = () => {
    if (!expandedSection) {
      return <Text size="xs" c="neutral.5">Select a category from the left panel.</Text>;
    }
    const isBasic = expandedSection === 'basic';
    const allColDefs = [...columnDefinitions, ...customColumns];
    const clusterColKeys = new Set(getClusterColumns(expandedSection));
    const colsInCluster = allColDefs.filter((col) => clusterColKeys.has(String(col.key)));
    const filtered = getFilteredColumns(colsInCluster);
    const bisaPindah = !isBasic; // variabel Basic Information terkunci di tempatnya

    /*
      Competency Score dipilah lagi jadi General dan Technical: tanpa sub-judul, kedua kategori
      berbaur jadi satu daftar panjang (awalan kurungnya dibuang dari label). Sub-judul disembunyikan
      saat pencarian dipakai.
    */
    const subGrup =
      expandedSection === 'competencyScore' && !searchTerm.trim()
        ? ([['General', 'competencyGeneral'], ['Technical', 'competencyTechnical']] as const)
        : null;

    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="subtle"
            size="compact-xs"
            onClick={() => toggleSelectAllCluster(expandedSection)}
            disabled={filtered.length === 0}
          >
            {isClusterAllSelected(expandedSection) ? 'Clear All' : 'Select All'}
          </Button>
        </div>
        <Divider />
        {filtered.length === 0 && (
          <Text size="xs" c="neutral.5" ta="center" py="lg">
            No variables in this cluster. Move variables here using the move icon.
          </Text>
        )}
        {subGrup
          ? subGrup.map(([judul, cluster]) => {
              const kolom = filtered.filter((col) => (col.cluster as string) === cluster);
              if (kolom.length === 0) return null;
              return (
                <div key={cluster}>
                  <Text size="xs" fw={600} c="neutral.6" px="sm" py={6} style={{ background: 'var(--mantine-color-neutral-1)' }}>
                    {judul}
                  </Text>
                  {kolom.map((col) => renderVariabel(col, bisaPindah))}
                </div>
              );
            })
          : filtered.map((col) => renderVariabel(col, bisaPindah))}
      </div>
    );
  };

  const jumlahDipilih = [...tempVisibleColumns].filter((k) => !MANDATORY.has(k)).length;

  return (
    <Modal opened={open} onClose={handleCancel} title="Data Visibility" size={723}>
      <div style={{ display: 'flex', gap: 16, height: TINGGI_BADAN, minHeight: 0 }}>
        {/* Panel kiri: pencarian + daftar cluster */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, width: 253, flexShrink: 0, minHeight: 0 }}>
          <TextInput
            size="xs"
            radius="xl"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.currentTarget.value)}
            leftSection={<IconSearch size={14} />}
            rightSection={
              searchTerm ? (
                <UnstyledButton onClick={() => setSearchTerm('')} aria-label="Clear search" style={{ display: 'flex' }}>
                  <IconX size={14} />
                </UnstyledButton>
              ) : null
            }
          />

          <ScrollArea style={{ flex: 1, minHeight: 0 }} type="auto">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {/* Cluster tanpa variabel disembunyikan; tetap bisa jadi tujuan "pindahkan". */}
              {KLASTER_BAWAAN.filter((k) => k.key === 'basic' || getClusterColumns(k.key).length > 0).map((k) => (
                <Fragment key={k.key}>{renderSectionButton(k.key, k.label)}</Fragment>
              ))}
              {customColumns.filter((col) => !col.dariProfileData && (col.cluster === 'custom' || !col.cluster)).length > 0 &&
                renderSectionButton('custom', 'Others')}

              {userClusters.map((uc) => (
                <Fragment key={uc.key}>{renderSectionButton(uc.key, uc.label, true)}</Fragment>
              ))}

              {/* Cluster baru */}
              {showNewClusterInput ? (
                <div style={{ display: 'flex', gap: 4, alignItems: 'center', padding: '4px 0' }}>
                  <TextInput
                    size="xs"
                    radius="xl"
                    autoFocus
                    placeholder="Cluster name..."
                    value={newClusterLabel}
                    onChange={(e) => setNewClusterLabel(e.currentTarget.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') createUserCluster();
                      if (e.key === 'Escape') { setShowNewClusterInput(false); setNewClusterLabel(''); }
                    }}
                    style={{ flex: 1 }}
                  />
                  <Button size="compact-xs" onClick={createUserCluster} disabled={!newClusterLabel.trim()}>
                    Add
                  </Button>
                </div>
              ) : (
                <Button
                  variant="subtle"
                  size="compact-xs"
                  leftSection={<IconPlus size={14} />}
                  onClick={() => setShowNewClusterInput(true)}
                  style={{ alignSelf: 'flex-start' }}
                >
                  New Cluster
                </Button>
              )}
            </div>
          </ScrollArea>
        </div>

        <Divider orientation="vertical" />

        {/* Panel kanan: variabel di cluster yang dipilih */}
        <div style={{ flex: 1, minWidth: 0, minHeight: 0 }}>
          <ScrollArea h="100%" type="auto">{renderPanelKanan()}</ScrollArea>
        </div>
      </div>

      <Divider my="md" />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Tak ada "Add Data": menambah data hanya lewat Profile Data. */}
          <Text size="xs" c="neutral.5">{jumlahDipilih} variables selected</Text>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleApply}>
            Apply
          </Button>
        </div>
      </div>
    </Modal>
  );
}
