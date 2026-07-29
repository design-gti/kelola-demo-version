import { getIProfileEmployees } from "@/lib/data";
import AppBreadcrumb, { type BreadcrumbItem } from "@/components/Breadcrumb";
import EmployeeListTable from "./EmployeeListTable";
import IProfileDetailClient from "./IProfileDetailClient";

export default async function IProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string; from?: string }>;
}) {
  const { id, from } = await searchParams;
  const fromQuery = from ? `?from=${from}` : "";

  const fromItems: BreadcrumbItem[] = [];
  if (from === "tdp") fromItems.push({ label: "TDP", href: "/tdp-view" });
  if (from === "vismap") fromItems.push({ label: "Vismap", href: "/vismap" });

  if (id) {
    const items: BreadcrumbItem[] = [...fromItems, { label: "Employee List", href: `/iprofile${fromQuery}` }, { label: "iProfile" }];

    return (
      <div style={{ width: "100%", minHeight: "100vh", background: "#f8f9fa" }}>
        <AppBreadcrumb items={items} />
        <div style={{ padding: "12px 16px 40px" }}>
          <IProfileDetailClient />
        </div>
      </div>
    );
  }

  const employees = getIProfileEmployees();
  const items: BreadcrumbItem[] = [...fromItems, { label: "iProfile" }];

  return (
    <div style={{ width: "100%", minHeight: "100vh", background: "#f8f9fa" }}>
      <AppBreadcrumb items={items} />
      <div style={{ padding: "12px 16px 40px" }}>
        <EmployeeListTable employees={employees} from={from} />
      </div>
    </div>
  );
}
