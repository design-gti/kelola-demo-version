"use client";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AppBreadcrumb, { type BreadcrumbItem } from "@/components/Breadcrumb";
import EmployeeListTable from "./EmployeeListTable";
import type { IProfileEmployee } from "@/data/iprofileEmployees";

const IProfileApp = dynamic(() => import("@/iprofile/imports/Frame45227"), { ssr: false });

function IProfilePageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from");
  const id = searchParams.get("id");

  const fromQuery = from ? `?from=${from}` : "";

  const fromItems: BreadcrumbItem[] = [];
  if (from === "tdp") fromItems.push({ label: "TDP", href: "/tdp-view" });
  if (from === "vismap") fromItems.push({ label: "Vismap", href: "/vismap" });

  const items: BreadcrumbItem[] = id
    ? [...fromItems, { label: "Employee List", onClick: () => router.push(`/iprofile${fromQuery}`) }, { label: "iProfile" }]
    : [...fromItems, { label: "iProfile" }];

  const handleSelect = (employee: IProfileEmployee) => {
    router.push(`/iprofile?id=${employee.id}${from ? `&from=${from}` : ""}`);
  };

  return (
    <div style={{ width: "100%", minHeight: "100vh", background: "#f8f9fa" }}>
      <AppBreadcrumb items={items} />
      <div style={{ padding: "12px 16px 40px" }}>
        {id ? <IProfileApp /> : <EmployeeListTable onSelect={handleSelect} />}
      </div>
    </div>
  );
}

export default function IProfilePage() {
  return (
    <Suspense>
      <IProfilePageInner />
    </Suspense>
  );
}
