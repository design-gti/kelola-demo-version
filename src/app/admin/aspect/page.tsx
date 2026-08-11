import { AdminPageShell } from "../AdminPageShell";
import { AspectLibrary } from "./AspectLibrary";

export default function Page() {
  return (
    <AdminPageShell title="Aspect">
      <div className="mt-[16px]">
        <AspectLibrary />
      </div>
    </AdminPageShell>
  );
}
