"use client";
import dynamic from "next/dynamic";

// next/dynamic's { ssr: false } is only valid from a Client Component call
// site — this file exists solely to host it, since iprofile/page.tsx is now
// a Server Component (it needs to read the role/id server-side).
const IProfileApp = dynamic(() => import("@/iprofile/imports/Frame45227"), { ssr: false });

export default function IProfileDetailClient() {
  return <IProfileApp />;
}
