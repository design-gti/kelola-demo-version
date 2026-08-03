"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, MultiSelect, Radio, Select, Textarea, TextInput } from "@talentlytica/prodigy";
import { Group } from "@mantine/core";
import AppBreadcrumb from "@/components/Breadcrumb";

const FONT = "'Open Sans', sans-serif";

export interface PersonOption {
  value: string;
  label: string;
}

/**
 * "Project" is offered by the form but is not part of the canonical TeamType
 * (FUNCTIONAL | STRUCTURAL) yet — see the note in the page's summary.
 */
const TYPE_OPTIONS = [
  { value: "FUNCTIONAL", label: "Functional" },
  { value: "STRUCTURAL", label: "Structural" },
  { value: "PROJECT", label: "Project" },
];

/** Field label with the design system's required-asterisk treatment. */
function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <div style={{ fontFamily: FONT, fontSize: 12, fontWeight: 700, color: "#495057", marginBottom: 6 }}>
      {children}
      {required && <span style={{ color: "#fa5252" }}> *</span>}
    </div>
  );
}

export default function CreateTeamClient({ people }: { people: PersonOption[] }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<string | null>(null);
  const [leadId, setLeadId] = useState<string | null>(null);
  const [memberIds, setMemberIds] = useState<string[]>([]);

  // Mirrors the asterisks in the form: name, type and at least one member.
  const canSave = name.trim().length > 0 && !!type && memberIds.length > 0;

  // A team lead shouldn't also be pickable as a plain member, and vice versa.
  const memberOptions = people.filter(p => p.value !== leadId);
  const leadOptions = people.filter(p => !memberIds.includes(p.value));

  return (
    <div style={{ fontFamily: FONT }}>
      <AppBreadcrumb items={[{ label: "List Team", href: "/team-profile" }, { label: "Create Team" }]} />

      <div style={{ padding: "12px 16px 40px", maxWidth: 840, margin: "0 auto" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#495057", marginBottom: 12 }}>Create Team</div>

        <div style={{
          background: "#fff", borderRadius: 12, padding: 20,
          boxShadow: "2px 4px 10px rgba(0,0,0,0.07)",
          display: "flex", flexDirection: "column", gap: 16,
        }}>
          <div>
            <FieldLabel required>Nama Tim</FieldLabel>
            <TextInput
              value={name}
              onChange={e => setName(e.currentTarget.value)}
              placeholder="Masukan nama tim"
              radius="xl"
              size="xs"
            />
          </div>

          <div>
            <FieldLabel>Deskripsi Tim</FieldLabel>
            <Textarea
              value={description}
              onChange={e => setDescription(e.currentTarget.value)}
              placeholder="Masukan deskripsi tim"
              radius="md"
              size="xs"
              autosize
              minRows={3}
            />
          </div>

          <div>
            <FieldLabel required>Type</FieldLabel>
            <Radio.Group value={type} onChange={setType}>
              <Group gap={0} grow preventGrowOverflow={false}>
                {TYPE_OPTIONS.map(o => (
                  <Radio key={o.value} value={o.value} label={o.label} size="xs" styles={{ label: { fontSize: 12 } }} />
                ))}
              </Group>
            </Radio.Group>
          </div>

          <div>
            <FieldLabel>Pilih Tim Lead</FieldLabel>
            <Select
              value={leadId}
              onChange={setLeadId}
              data={leadOptions}
              placeholder="Pilih Leader"
              radius="xl"
              size="xs"
              searchable
              clearable
            />
          </div>

          <div>
            <FieldLabel required>Pilih Tim Member</FieldLabel>
            <MultiSelect
              value={memberIds}
              onChange={setMemberIds}
              data={memberOptions}
              placeholder={memberIds.length ? undefined : "Pilih Member"}
              radius="xl"
              size="xs"
              searchable
              clearable
            />
          </div>
        </div>

        <Group justify="flex-end" gap={12} mt={20}>
          <Button variant="outline" size="xs" radius="xl" onClick={() => router.push("/team-profile")}>
            Kembali
          </Button>
          <Button variant="subtle" size="xs" radius="xl" disabled>
            Preview
          </Button>
          <Button size="xs" radius="xl" disabled={!canSave}>
            Simpan
          </Button>
        </Group>
      </div>
    </div>
  );
}
