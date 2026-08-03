import { teams, teamMember, teamMembers, teamAverages, teamArchetype, structuralTeamRecommendations } from "@/data/teamsData";
import TeamProfileClient from "./TeamProfileClient";

export default async function TeamProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ team?: string; tab?: string; highlight?: string }>;
}) {
  const { team: teamParam, tab: tabParam, highlight } = await searchParams;

  const resolvedTeams = teams.map(team => ({
    team,
    members: teamMembers(team),
    leader: team.leaderId ? teamMember(team.leaderId) : null,
    avg: teamAverages(team),
    archetype: teamArchetype(team),
  }));

  const initialTab: "overview" | "interaction" = tabParam === "interaction" ? "interaction" : "overview";

  return (
    <TeamProfileClient
      resolvedTeams={resolvedTeams}
      initialSelectedTeamId={teamParam ?? null}
      initialTab={initialTab}
      initialHighlight={highlight ?? null}
      recommendations={structuralTeamRecommendations()}
    />
  );
}
