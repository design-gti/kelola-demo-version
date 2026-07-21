/**
 * Detail IDP — Admin view.
 *
 * Requires an ancestor provider (app root), e.g.:
 *
 *   import { MantineProvider } from '@mantine/core';
 *   import { kelolaTheme } from 'talentlytica-ds';
 *   import '@mantine/core/styles.css';
 *   import 'talentlytica-ds/styles.css';
 *
 *   <MantineProvider theme={kelolaTheme}><DetailIdpAdmin /></MantineProvider>
 *
 * In production this page is expected to render inside the app's existing
 * shell/layout (e.g. talentlytica-ds's DashboardWrapper) — no sidebar or
 * global chrome is included here, only page content.
 */
import React, { useMemo, useState } from 'react';
import {
  ActionIcon, Anchor, Avatar, Badge, Box, Button, Checkbox, Divider,
  Drawer, FileButton, Group, Menu, Paper, Progress, ScrollArea,
  Stack, Text, TextInput, Textarea, Tooltip, Table,
} from '@mantine/core';
import {
  IconCalendar, IconChevronDown, IconChevronLeft, IconExternalLink, IconEye,
  IconNotes, IconPaperclip, IconPhoto, IconRepeat, IconSend, IconTrash, IconUpload,
} from '@tabler/icons-react';
import { EditableCell, EmptyMessage, ModalFooter, ModalMain, ProfileAvatar, StatusTag, Tab } from 'talentlytica-ds';

const ACCEPT = '.jpg,.jpeg,.png,.gif,.webp,.bmp,.pdf,.ppt,.pptx,.doc,.docx,.xls,.xlsx';

const EMPLOYEE = {
  name: 'Ulfa Irawan',
  position: 'Product Designer',
  department: 'Engineering',
  status: { label: 'In Progress', color: 'secondary' },
  periodStart: '2024-09-12',
  periodEnd: '2024-09-17',
};

const INITIAL_PROGRAMS = [
  {
    id: 'program-1',
    name: 'Root Cause Analysis Training',
    vendor: 'Revou',
    category: 'TRAINING',
    aspect: 'COMMUNICATION',
    goals: 'Mengembangkan kemampuan analytical thinking dan problem-solving',
    startDate: '2024-09-12',
    endDate: '2024-09-12',
    pic: { name: 'Achan', position: 'HR Manager', color: '#0EA5E9', initials: 'AC' },
    employeeCheck: true,
    picCheck: true,
    attachment: null,
    notes: '',
    subPrograms: [
      {
        id: 'program-1-sub-1',
        name: 'Analytical Thinking Workshop',
        vendor: 'Revou',
        category: 'TRAINING',
        aspect: 'PROBLEM SOLVING',
        goals: 'Memahami teknik analisis dan identifikasi masalah secara sistematis',
        startDate: '2024-09-12',
        endDate: '2024-09-13',
        pic: { name: 'Achan', position: 'HR Manager', color: '#0EA5E9', initials: 'AC' },
        employeeCheck: true,
        picCheck: false,
        attachment: null,
        notes: '',
      },
      {
        id: 'program-1-sub-2',
        name: 'Root Cause Practice Session',
        vendor: 'Revou',
        category: 'TRAINING',
        aspect: 'CRITICAL THINKING',
        goals: 'Berlatih mengidentifikasi akar masalah pada studi kasus nyata',
        startDate: '2024-09-14',
        endDate: '2024-09-14',
        pic: { name: 'Achan', position: 'HR Manager', color: '#0EA5E9', initials: 'AC' },
        employeeCheck: false,
        picCheck: false,
        attachment: null,
        notes: '',
      },
      {
        id: 'program-1-sub-3',
        name: 'Group Case Study Discussion',
        vendor: 'Revou',
        category: 'TRAINING',
        aspect: 'TEAMWORK',
        goals: 'Diskusi kasus bersama tim untuk memperkuat pemahaman analisis',
        startDate: '2024-09-15',
        endDate: '2024-09-15',
        pic: { name: 'Achan', position: 'HR Manager', color: '#0EA5E9', initials: 'AC' },
        employeeCheck: false,
        picCheck: false,
        attachment: null,
        notes: '',
      },
    ],
  },
  {
    id: 'program-2',
    name: 'Solution Experiment & Iteration Task',
    vendor: '-',
    category: 'ON JOB ASSIGNMENT',
    aspect: 'PROBLEM SOLVING',
    goals: 'Mengembangkan kemampuan eksperimen dan iterasi dalam problem-solving',
    startDate: '2024-09-15',
    endDate: '2024-09-20',
    pic: { name: 'Imanuel Ibrahim', position: 'HR Specialist', color: '#6366f1', initials: 'IB' },
    employeeCheck: true,
    picCheck: false,
    attachment: null,
    notes: '',
    subPrograms: [],
  },
  {
    id: 'program-3',
    name: 'Leadership Communication Workshop',
    vendor: 'Prasetiya Mulya',
    category: 'WORKSHOP',
    aspect: 'LEADERSHIP',
    goals: 'Mengembangkan kemampuan komunikasi kepemimpinan dan public speaking',
    startDate: '2024-09-20',
    endDate: '2024-09-25',
    pic: { name: 'Imanuel Ibrahim', position: 'HR Specialist', color: '#6366f1', initials: 'IB' },
    employeeCheck: false,
    picCheck: true,
    attachment: null,
    notes: '',
    subPrograms: [],
  },
];

const INITIAL_COMMENTS = [
  { id: 1, author: 'Muhammad Multazam', initials: 'MM', tinted: false, time: 'Apr 20, 2026, 11:39 AM', text: 'tolong sekali lage cek dokumentasinya dan lampirkan kembali' },
  { id: 2, author: 'Ibrahim', initials: 'IB', tinted: true, time: 'Apr 20, 2026, 11:39 AM', text: 'dokumentasi trainingnya kah Pak?' },
  { id: 3, author: 'Muhammad Multazam', initials: 'MM', tinted: false, time: 'Apr 20, 2026, 11:40 AM', text: 'Iya' },
  { id: 4, author: 'Ibrahim', initials: 'IB', tinted: true, time: 'Apr 20, 2026, 11:40 AM', text: 'Oke akan saya update' },
];

const HISTORY_BY_PROGRAM = {
  'Root Cause Analysis Training': [
    { date: '20 Apr 2026', time: '11:40', by: 'Muhammad Multazam', field: 'End Date', from: '10 Sep 2024', to: '12 Sep 2024' },
    { date: '18 Apr 2026', time: '09:15', by: 'Achan', field: 'PIC Check', from: 'Unchecked', to: 'Checked' },
    { date: '14 Apr 2026', time: '14:30', by: 'Muhammad Multazam', field: 'Attachment', from: '-', to: 'training_doc.pdf' },
  ],
  'Analytical Thinking Workshop': [
    { date: '19 Apr 2026', time: '10:00', by: 'Achan', field: 'PIC Check', from: 'Unchecked', to: 'Checked' },
    { date: '16 Apr 2026', time: '13:20', by: 'Muhammad Multazam', field: 'Notes', from: '-', to: 'Perlu follow-up hasil workshop' },
  ],
  'Root Cause Practice Session': [
    { date: '17 Apr 2026', time: '11:00', by: 'Muhammad Multazam', field: 'End Date', from: '12 Sep 2024', to: '14 Sep 2024' },
  ],
  'Group Case Study Discussion': [],
  'Solution Experiment & Iteration Task': [
    { date: '21 Apr 2026', time: '08:30', by: 'Imanuel Ibrahim', field: 'End Date', from: '18 Sep 2024', to: '20 Sep 2024' },
    { date: '17 Apr 2026', time: '13:00', by: 'Muhammad Multazam', field: 'Notes', from: '-', to: 'Perlu review ulang hasil eksperimen' },
    { date: '15 Apr 2026', time: '10:45', by: 'Imanuel Ibrahim', field: 'Attachment', from: '-', to: 'experiment_results.xlsx' },
  ],
  'Leadership Communication Workshop': [
    { date: '22 Apr 2026', time: '16:00', by: 'Imanuel Ibrahim', field: 'End Date', from: '22 Sep 2024', to: '25 Sep 2024' },
    { date: '22 Apr 2026', time: '16:05', by: 'Imanuel Ibrahim', field: 'PIC Check', from: 'Unchecked', to: 'Checked' },
    { date: '18 Apr 2026', time: '11:00', by: 'Muhammad Multazam', field: 'Attachment', from: '-', to: 'workshop_material.pptx' },
  ],
};

function formatDMY(iso) {
  if (!iso) return '-';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

function formatCommentTime(date) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  let h = date.getHours();
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  const mm = String(date.getMinutes()).padStart(2, '0');
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}, ${h}:${mm} ${ampm}`;
}

function categoryColor(category) {
  const key = (category || '').toLowerCase();
  if (key.includes('workshop')) return 'secondary';
  if (key.includes('mentor')) return 'tertiary';
  return 'success'; // training, on job assignment, ...
}

function flattenRows(programs) {
  return programs.flatMap((p) => [p, ...(p.subPrograms || [])]);
}

/** Local-only decoration that has no direct Mantine prop equivalent (hover-reveal + tree indent). */
function ScopedStyles() {
  return (
    <style>{`
      .idp-table tbody tr:hover td { background: var(--mantine-color-gray-0); }
      .idp-open-btn { opacity: 0; transition: opacity .15s ease; }
      tr:hover .idp-open-btn { opacity: 1; }
      .idp-sticky-col { position: sticky; left: 0; z-index: 2; background: var(--mantine-color-body); }

      /* ProfileAvatar font override — DS uses 14px/600 for title, 12px/400 for subtitle */
      .idp-avatar .font-title { font-size: 14px; font-weight: 600; line-height: 1.4; word-break: normal; }
      .idp-avatar .font-subtitle { font-size: 12px; font-weight: 400; line-height: 1.4; }

      /* Smaller variant for PIC column cells */
      .idp-avatar-sm .font-title { font-size: 13px; font-weight: 600; line-height: 1.3; word-break: normal; }
      .idp-avatar-sm .font-subtitle { font-size: 11px; font-weight: 400; line-height: 1.3; }
    `}</style>
  );
}

function DetailField({ label, children }) {
  return (
    <Group align="flex-start" gap={16} wrap="nowrap">
      <Text fz={12} c="dimmed" w={106} style={{ flexShrink: 0 }}>{label}</Text>
      <Box style={{ flex: 1, minWidth: 0 }}>
        {typeof children === 'string' ? <Text fz={12}>{children}</Text> : children}
      </Box>
    </Group>
  );
}

function AttachmentControl({ file, onChange }) {
  if (!file) {
    return (
      <FileButton onChange={onChange} accept={ACCEPT}>
        {(props) => (
          <Button {...props} variant="subtle" color="gray" size="compact-xs" leftSection={<IconUpload size={14} />}>
            Upload file
          </Button>
        )}
      </FileButton>
    );
  }
  return (
    <Menu shadow="sm" radius="md" position="bottom-start" width={150}>
      <Menu.Target>
        <Button
          variant="subtle" color="primary" size="compact-xs"
          leftSection={<IconPaperclip size={14} />}
          styles={{ label: { maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis' } }}
        >
          {file.name}
        </Button>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item leftSection={<IconEye size={13} />} onClick={() => window.open(URL.createObjectURL(file), '_blank')}>
          Open file
        </Menu.Item>
        <FileButton onChange={onChange} accept={ACCEPT}>
          {(props) => <Menu.Item {...props} leftSection={<IconRepeat size={13} />}>Change file</Menu.Item>}
        </FileButton>
        <Menu.Item color="error" leftSection={<IconTrash size={13} />} onClick={() => onChange(null)}>
          Delete file
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}

function ProgramNameCell({ row, hasChildren, expanded, onToggleExpand, onOpenDetail, indent }) {
  return (
    <Group gap={8} wrap="nowrap" style={{ paddingLeft: indent, position: 'relative' }}>
      {hasChildren ? (
        <ActionIcon variant="subtle" color="gray" size="sm" onClick={() => onToggleExpand(row.id)}>
          <IconChevronDown size={14} style={{ transform: expanded ? 'none' : 'rotate(-90deg)', transition: 'transform .2s' }} />
        </ActionIcon>
      ) : (
        <Box w={18} style={{ flexShrink: 0 }} />
      )}
      <Text fz={12} truncate style={{ flex: 1, minWidth: 0 }}>{row.name}</Text>
      <Tooltip label="Open in side panel" position="top-end" withArrow>
        <ActionIcon className="idp-open-btn" variant="subtle" color="gray" size="sm" onClick={() => onOpenDetail(row)}>
          <IconExternalLink size={14} />
        </ActionIcon>
      </Tooltip>
    </Group>
  );
}

function CommentItem({ author, initials, tinted, time, text }) {
  return (
    <Group align="flex-start" gap={12} wrap="nowrap">
      <Avatar radius="xl" size={32} color={tinted ? 'gray' : 'primary'}>{initials}</Avatar>
      <Box style={{ flex: 1 }}>
        <Group gap={8} mb={4}>
          <Text fz={12} fw={700}>{author}</Text>
          <Text fz={10} c="dimmed">{time}</Text>
        </Group>
        <Box bg="gray.0" px={12} py={8} style={{ borderRadius: 12 }}>
          <Text fz={12}>{text}</Text>
        </Box>
      </Box>
    </Group>
  );
}

function HistoryList({ entries }) {
  if (!entries.length) {
    return <EmptyMessage title="Belum ada history perubahan" height={180} />;
  }
  return (
    <Table verticalSpacing={8} horizontalSpacing={12}>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Changed by</Table.Th>
          <Table.Th>Field</Table.Th>
          <Table.Th>Change</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {entries.map((e, i) => (
          <Table.Tr key={i}>
            <Table.Td>
              <Stack gap={2}>
                <Text fz={12} fw={600}>{e.by}</Text>
                <Text fz={11} c="dimmed">{e.date}, {e.time}</Text>
              </Stack>
            </Table.Td>
            <Table.Td><Text fz={12} fw={600}>{e.field}</Text></Table.Td>
            <Table.Td>
              <Stack gap={3}>
                <Text fz={11} c="dimmed" td="line-through">{e.from}</Text>
                <Text fz={12} c="primary">{e.to}</Text>
              </Stack>
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
}

function DetailIdpAdmin({ onBack = () => window.history.back() }) {
  const [programs, setPrograms] = useState(INITIAL_PROGRAMS);
  const [editedEndDates, setEditedEndDates] = useState({});
  const [collapsed, setCollapsed] = useState(() => new Set());
  const [comments, setComments] = useState(INITIAL_COMMENTS);
  const [commentDraft, setCommentDraft] = useState('');
  const [notesModal, setNotesModal] = useState(null); // { rowId, draft }
  const [activeDrawerRowId, setActiveDrawerRowId] = useState(null);
  const [drawerTab, setDrawerTab] = useState('detail');

  const allRows = useMemo(() => flattenRows(programs), [programs]);
  const activeDrawerRow = useMemo(
    () => allRows.find((r) => r.id === activeDrawerRowId) || null,
    [allRows, activeDrawerRowId],
  );
  const notesRow = useMemo(
    () => (notesModal ? allRows.find((r) => r.id === notesModal.rowId) : null),
    [allRows, notesModal],
  );

  const doneCount = allRows.filter((r) => r.picCheck).length;
  const totalCount = allRows.length;
  const progressPct = totalCount ? (doneCount / totalCount) * 100 : 0;
  const isDirty = Object.keys(editedEndDates).length > 0;
  const todayISO = new Date().toISOString().slice(0, 10);

  function updateRow(rowId, patch) {
    setPrograms((prev) => prev.map((p) => {
      if (p.id === rowId) return { ...p, ...patch };
      if (p.subPrograms?.some((s) => s.id === rowId)) {
        return { ...p, subPrograms: p.subPrograms.map((s) => (s.id === rowId ? { ...s, ...patch } : s)) };
      }
      return p;
    }));
  }

  function handleEndDateInput(rowId, value) {
    setEditedEndDates((prev) => ({ ...prev, [rowId]: value }));
  }

  function cancelEdits() {
    setEditedEndDates({});
  }

  function saveEdits() {
    Object.entries(editedEndDates).forEach(([rowId, value]) => updateRow(rowId, { endDate: value }));
    setEditedEndDates({});
  }

  function toggleExpand(rowId) {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(rowId)) next.delete(rowId); else next.add(rowId);
      return next;
    });
  }

  function openDrawer(row) {
    setDrawerTab('detail');
    setActiveDrawerRowId(row.id);
  }

  function openNotes(row) {
    setNotesModal({ rowId: row.id, draft: row.notes || '' });
  }

  function saveNotes() {
    if (!notesModal) return;
    updateRow(notesModal.rowId, { notes: notesModal.draft });
    setNotesModal(null);
  }

  function sendComment() {
    const text = commentDraft.trim();
    if (!text) return;
    setComments((prev) => [...prev, {
      id: prev.length + 1, author: 'Muhammad Multazam', initials: 'MM', tinted: false,
      time: formatCommentTime(new Date()), text,
    }]);
    setCommentDraft('');
  }

  const visibleRows = programs.flatMap((p) => {
    const hasChildren = !!p.subPrograms?.length;
    const parentEntry = { row: p, hasChildren, indent: 0 };
    if (!hasChildren || collapsed.has(p.id)) return [parentEntry];
    return [parentEntry, ...p.subPrograms.map((s) => ({ row: s, hasChildren: false, indent: 40 }))];
  });

  return (
    <Box bg="neutral.1" mih="100vh">
      <ScopedStyles />

      <Group justify="space-between" px={32} py={15} mb={24} style={{ borderBottom: '1px solid var(--mantine-color-gray-3)' }}>
        <Group gap={5}>
          <Anchor component="button" type="button" onClick={onBack} c="primary" fw={600} fz={12} underline="never" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <IconChevronLeft size={16} /> Monitoring
          </Anchor>
          <Text c="dimmed" fz={12}>/</Text>
          <Text fz={12} fw={600}>Detail IDP</Text>
        </Group>
      </Group>

      <Box maw={1200} mx="auto" px={24}>
        <Paper radius="md" p="md" mb="md" style={{ '--paper-shadow': 'var(--shadow-card)' }}>
          <Group justify="space-between" align="center" wrap="nowrap">
            <ProfileAvatar
              className="idp-avatar"
              data={{ alt: EMPLOYEE.name, title: EMPLOYEE.name, subtitle: `${EMPLOYEE.position} · ${EMPLOYEE.department}` }}
              variant="default"
              align="row"
              size={40}
              useInitial
              avatarProps={{ variant: 'light', color: 'primary' }}
            />
            <Stack gap={6} align="flex-end" style={{ flexShrink: 0 }}>
              <Group gap={8}>
                <StatusTag label={EMPLOYEE.status.label} color={EMPLOYEE.status.color} />
                <Group gap={6}>
                  <Progress value={progressPct} w={72} color="primary" />
                  <Text fz={11} fw={700} c="primary">{doneCount}/{totalCount}</Text>
                </Group>
              </Group>
              <Text fz={12} c="dimmed">{formatDMY(EMPLOYEE.periodStart)} – {formatDMY(EMPLOYEE.periodEnd)}</Text>
            </Stack>
          </Group>
        </Paper>

        <Paper radius="md" p="md" style={{ '--paper-shadow': 'var(--shadow-card)' }}>
          <Table.ScrollContainer minWidth={1200}>
            <Table className="idp-table" verticalSpacing="xs" horizontalSpacing="md">
              <Table.Thead>
                <Table.Tr>
                  <Table.Th className="idp-sticky-col" miw={260}>Program</Table.Th>
                  <Table.Th miw={150}>Vendor</Table.Th>
                  <Table.Th miw={180}>Category</Table.Th>
                  <Table.Th miw={180}>Aspect</Table.Th>
                  <Table.Th miw={220}>Development Goals</Table.Th>
                  <Table.Th miw={150}>Start Date</Table.Th>
                  <Table.Th miw={150}>End Date</Table.Th>
                  <Table.Th miw={170}>PIC</Table.Th>
                  <Table.Th miw={150}>Attachment</Table.Th>
                  <Table.Th miw={180}>Notes</Table.Th>
                  <Table.Th miw={160}>Employee Check</Table.Th>
                  <Table.Th miw={140}>PIC Check</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {visibleRows.map(({ row, hasChildren, indent }) => (
                  <Table.Tr key={row.id} style={indent ? { background: 'var(--mantine-color-gray-0)' } : undefined}>
                    <Table.Td className="idp-sticky-col" style={indent ? { background: 'var(--mantine-color-gray-0)' } : undefined}>
                      <ProgramNameCell
                        row={row} hasChildren={hasChildren} indent={indent}
                        expanded={!collapsed.has(row.id)}
                        onToggleExpand={toggleExpand}
                        onOpenDetail={openDrawer}
                      />
                    </Table.Td>
                    <Table.Td><Text fz={12}>{row.vendor}</Text></Table.Td>
                    <Table.Td><Badge color={categoryColor(row.category)} variant="light">{row.category}</Badge></Table.Td>
                    <Table.Td><Badge color="primary" variant="light">{row.aspect}</Badge></Table.Td>
                    <Table.Td><Text fz={12} lineClamp={1}>{row.goals}</Text></Table.Td>
                    <Table.Td><Text fz={12} c="dimmed">{formatDMY(row.startDate)}</Text></Table.Td>
                    <Table.Td>
                      <EditableCell display={<Text fz={12}>{formatDMY(editedEndDates[row.id] ?? row.endDate)}</Text>}>
                        <TextInput
                          type="date" size="xs" min={todayISO}
                          value={editedEndDates[row.id] ?? row.endDate}
                          onChange={(e) => handleEndDateInput(row.id, e.currentTarget.value)}
                        />
                      </EditableCell>
                    </Table.Td>
                    <Table.Td>
                      <ProfileAvatar
                        className="idp-avatar-sm"
                        data={{ alt: row.pic.name, title: row.pic.name, subtitle: row.pic.position }}
                        variant="default" align="row" size={26} useInitial
                        avatarProps={{ variant: 'light', color: 'primary' }}
                      />
                    </Table.Td>
                    <Table.Td>
                      <AttachmentControl file={row.attachment} onChange={(file) => updateRow(row.id, { attachment: file })} />
                    </Table.Td>
                    <Table.Td>
                      <Tooltip label="Notes" disabled={!row.notes}>
                        <ActionIcon variant="subtle" color={row.notes ? 'primary' : 'gray'} onClick={() => openNotes(row)}>
                          <IconNotes size={18} />
                        </ActionIcon>
                      </Tooltip>
                    </Table.Td>
                    <Table.Td>
                      <Checkbox checked={row.employeeCheck} disabled readOnly />
                    </Table.Td>
                    <Table.Td>
                      <Checkbox checked={row.picCheck} disabled readOnly />
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>

          {isDirty && (
            <Group justify="flex-end" gap={8} pt={12} mt={12} style={{ borderTop: '1px solid var(--mantine-color-gray-3)' }}>
              <Button variant="outline" color="gray" radius="xl" onClick={cancelEdits}>Cancel</Button>
              <Button color="primary" radius="xl" onClick={saveEdits}>Save Changes</Button>
            </Group>
          )}
        </Paper>
      </Box>

      <Drawer
        opened={!!activeDrawerRow}
        onClose={() => setActiveDrawerRowId(null)}
        position="right"
        size={500}
        title={<Text fz={14} fw={800}>{activeDrawerRow?.name}</Text>}
        padding={0}
        styles={{ body: { display: 'flex', flexDirection: 'column', height: 'calc(100% - 60px)', padding: 0 } }}
      >
        {activeDrawerRow && (
          <>
            <Box px={16} pt={4}>
              <Tab
                tabList={[{ value: 'detail', label: 'Detail' }, { value: 'history', label: 'History' }]}
                activeTab={drawerTab}
                listenActiveTab={setDrawerTab}
              />
            </Box>

            <ScrollArea style={{ flex: 1 }} p={16}>
              {drawerTab === 'detail' ? (
                <Stack gap="md">
                  <DetailField label="Vendor">{activeDrawerRow.vendor}</DetailField>
                  <DetailField label="Category">
                    <Badge color={categoryColor(activeDrawerRow.category)} variant="light">{activeDrawerRow.category}</Badge>
                  </DetailField>
                  <DetailField label="Aspect">
                    <Badge color="primary" variant="light">{activeDrawerRow.aspect}</Badge>
                  </DetailField>
                  <DetailField label="Development Goals">{activeDrawerRow.goals}</DetailField>
                  <DetailField label="Due">
                    <Group justify="space-between" wrap="nowrap">
                      <Text fz={12}>{formatDMY(activeDrawerRow.startDate)} - {formatDMY(activeDrawerRow.endDate)}</Text>
                      <IconCalendar size={18} color="var(--mantine-color-gray-5)" />
                    </Group>
                  </DetailField>
                  <DetailField label="PIC">
                    <ProfileAvatar
                      className="idp-avatar-sm"
                      data={{ alt: activeDrawerRow.pic.name, title: activeDrawerRow.pic.name, subtitle: activeDrawerRow.pic.position }}
                      variant="default" align="row" size={24} useInitial
                      avatarProps={{ variant: 'light', color: 'primary' }}
                    />
                  </DetailField>
                  <DetailField label="Attachment">
                    <AttachmentControl
                      file={activeDrawerRow.attachment}
                      onChange={(file) => updateRow(activeDrawerRow.id, { attachment: file })}
                    />
                  </DetailField>
                  <DetailField label="Notes">
                    <Button
                      variant="subtle" color="primary" size="compact-sm" px={0}
                      leftSection={<IconNotes size={16} />}
                      onClick={() => openNotes(activeDrawerRow)}
                    >
                      Notes
                    </Button>
                  </DetailField>
                  <DetailField label="PIC Check">
                    <Checkbox
                      checked={activeDrawerRow.picCheck}
                      onChange={(e) => updateRow(activeDrawerRow.id, { picCheck: e.currentTarget.checked })}
                    />
                  </DetailField>
                  <DetailField label="Employee Check">
                    <Checkbox
                      checked={activeDrawerRow.employeeCheck}
                      onChange={(e) => updateRow(activeDrawerRow.id, { employeeCheck: e.currentTarget.checked })}
                    />
                  </DetailField>

                  <Divider label="Comment" labelPosition="left" mt="sm" />
                  <Stack gap="sm">
                    {comments.map((c) => <CommentItem key={c.id} {...c} />)}
                  </Stack>
                </Stack>
              ) : (
                <HistoryList entries={HISTORY_BY_PROGRAM[activeDrawerRow.name] || []} />
              )}
            </ScrollArea>

            {drawerTab === 'detail' && (
              <Group
                px={12} py={8} m={12} gap={6} wrap="nowrap"
                style={{ border: '1px solid var(--mantine-color-gray-3)', borderRadius: 999 }}
              >
                <TextInput
                  variant="unstyled" placeholder="Add comment" style={{ flex: 1 }}
                  value={commentDraft}
                  onChange={(e) => setCommentDraft(e.currentTarget.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') sendComment(); }}
                />
                <ActionIcon variant="subtle" color="gray"><IconPhoto size={16} /></ActionIcon>
                <ActionIcon variant="subtle" color="gray"><IconPaperclip size={16} /></ActionIcon>
                <Divider orientation="vertical" />
                <ActionIcon variant="subtle" color="primary" onClick={sendComment}><IconSend size={16} /></ActionIcon>
              </Group>
            )}
          </>
        )}
      </Drawer>

      <ModalMain opened={!!notesModal} onClose={() => setNotesModal(null)} title={notesRow?.name} size="md" centered>
        {notesModal && (
          <Stack gap={12}>
            <Group gap={8}>
              <Text fz={12} c="dimmed">from aspect</Text>
              <Badge color="primary" variant="light">{notesRow?.aspect}</Badge>
            </Group>
            <Box>
              <Text fz={13} fw={700} mb={8}>Monitoring Notes</Text>
              <Textarea
                minRows={5} autosize placeholder="Tulis catatan monitoring..."
                value={notesModal.draft}
                onChange={(e) => setNotesModal((m) => ({ ...m, draft: e.currentTarget.value }))}
              />
            </Box>
            <ModalFooter justify="flex-end" gap={10} mt={8}>
              <Button variant="outline" color="gray" radius="xl" onClick={() => setNotesModal(null)}>Cancel</Button>
              <Button color="primary" radius="xl" onClick={saveNotes}>
                {notesModal.draft !== (notesRow?.notes || '') ? 'Save Changes' : 'Save'}
              </Button>
            </ModalFooter>
          </Stack>
        )}
      </ModalMain>
    </Box>
  );
}

export default DetailIdpAdmin;
