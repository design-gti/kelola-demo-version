import { JobProfile } from "./JobProfile";

/**
 * Detail satu Job. Slug-nya adalah nama Job yang di-encode, jadi tidak perlu
 * tabel pemetaan id — daftar Job sendiri dirakit dari participants.csv.
 */
export default async function Page({ params }: { params: Promise<{ job: string }> }) {
  const { job } = await params;
  return <JobProfile name={decodeURIComponent(job)} />;
}
