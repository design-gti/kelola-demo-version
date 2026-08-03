import { teams, teamArchetype, teamArchetypeCatalog } from "@/data/teamsData";
import TeamTypeClient from "./TeamTypeClient";

export default async function TeamTypePage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  const { code } = await searchParams;

  // Which real teams currently fall into each archetype — resolved server-side so
  // raw member DISC scores never cross into the client bundle.
  const teamsByCode: Record<string, string[]> = {};
  teams.forEach(t => {
    const arch = teamArchetype(t);
    if (!arch) return;
    (teamsByCode[arch.code] ??= []).push(t.name);
  });

  const initialCode = code && teamArchetypeCatalog.some(a => a.code === code)
    ? code
    : teamArchetypeCatalog[0].code;

  return (
    <TeamTypeClient
      catalog={teamArchetypeCatalog}
      teamsByCode={teamsByCode}
      initialCode={initialCode}
    />
  );
}
