import { AdminPageShell } from "../AdminPageShell";
import { DataSource } from "./DataSource";

export default function Page() {
  return (
    <AdminPageShell title="Profile Data">
      <p className="mb-[12px] text-[13px] font-bold text-[#495057]">Data Source</p>
      <DataSource />
    </AdminPageShell>
  );
}
