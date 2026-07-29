import { getTalentIdentificationPoints, getTalentReadinessPoints } from "@/lib/data/talentMapping";
import TalentMappingClient from "./TalentMappingClient";

export default async function TalentMappingPage({
  searchParams,
}: {
  searchParams: Promise<{ box?: string }>;
}) {
  const { box } = await searchParams;
  const initialBox = box ? Number(box) : null;

  const tiPoints = getTalentIdentificationPoints();
  const trPoints = getTalentReadinessPoints();

  return <TalentMappingClient tiPoints={tiPoints} trPoints={trPoints} initialBox={initialBox} />;
}
