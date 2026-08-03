import { allParticipants } from "@/data/model/selectors";
import CreateTeamClient from "./CreateTeamClient";

export default async function CreateTeamPage() {
  // Only id + name cross to the client — the rest of each Participant (scores,
  // manager links) has no business in a create form.
  const people = allParticipants().map(p => ({ value: p.id, label: p.name }));

  return <CreateTeamClient people={people} />;
}
