import { ProfileDetail } from "./ProfileDetail";

/**
 * Detail satu bidang Profile Data. Slug-nya diturunkan dari nama bidang saat
 * didaftarkan (lihat addExtension di ../profiles), jadi tidak perlu tabel
 * pemetaan id tersendiri.
 */
export default async function Page({ params }: { params: Promise<{ profile: string }> }) {
  const { profile } = await params;
  return <ProfileDetail slug={decodeURIComponent(profile)} />;
}
