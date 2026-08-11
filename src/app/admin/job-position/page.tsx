import { AdminPageShell } from "../AdminPageShell";
import { JobGrid } from "./JobGrid";

export default function Page() {
  return (
    <AdminPageShell title="Job and Position">
      <div className="mt-[16px]">
        <JobGrid />
      </div>
    </AdminPageShell>
  );
}
