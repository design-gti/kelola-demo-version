import { getTalentIdentificationPoints, getTalentReadinessPoints } from "@/lib/data/talentMapping";
import { getEffectiveTIConfigServer } from "@/lib/data/talentMappingConfig";
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
  const trPoints = getTalentReadinessPoints();

  return (
    <TalentMappingClient
      tiConfig={tiConfig}
      tiPoints={tiPoints}
      trPoints={trPoints}
      initialBox={initialBox}
      initialHighlight={highlight ?? null}
    />
  );
}
