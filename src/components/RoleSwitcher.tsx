"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { SegmentedControl } from "@mantine/core";
import { setRole } from "@/app/actions/setRole";
import type { UserRole } from "@/lib/role";

export default function RoleSwitcher({ initialRole }: { initialRole: UserRole }) {
  const [role, setLocalRole] = useState<UserRole>(initialRole);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleChange = (v: string) => {
    const next = v as UserRole;
    setLocalRole(next);
    startTransition(async () => {
      await setRole(next);
      router.refresh();
    });
  };

  return (
    <SegmentedControl
      value={role}
      onChange={handleChange}
      disabled={isPending}
      color="primary"
      radius="xl"
      size="xs"
      data={[
        { label: "HR", value: "hr" },
        { label: "Manager", value: "manager" },
      ]}
      style={{
        position: "fixed", left: 20, bottom: 20, zIndex: 50,
        boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
        border: "1px solid #e9ecef",
        opacity: isPending ? 0.6 : 1,
      }}
    />
  );
}
