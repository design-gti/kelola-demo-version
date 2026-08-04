import { getTalentIdentificationPoints, getTalentReadinessByTarget, getJobTargets } from "@/lib/data/talentMapping";
import { getEffectiveTIConfigServer, getEffectiveTRConfigServer } from "@/lib/data/talentMappingConfig";
import TalentMappingClient from "./TalentMappingClient";

export default async function TalentMappingPage({
  searchParams,
}: {
  searchParams: Promise<{ box?: string; highlight?: string }>;
}) {
  const { box, highlight } = await searchParams;
  const initialBox = box ? Number(box) : null;

  const tiConfig = await getEffectiveTIConfigServer();
  const tiPoints = getTalentIdentificationPoints(tiConfig);

  const trConfig = await getEffectiveTRConfigServer();
  const jobTargets = getJobTargets();
  // Precompute readiness per target server-side (raw scores never reach the client).
  const trByTarget = getTalentReadinessByTarget(trConfig);

  return (
    <TalentMappingClient
      tiConfig={tiConfig}
      tiPoints={tiPoints}
      trConfig={trConfig}
      jobTargets={jobTargets}
      trByTarget={trByTarget}
      initialBox={initialBox}
      initialHighlight={highlight ?? null}
    />
  );
}
