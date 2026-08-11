"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { Button, TextInput } from "@mantine/core";
import { IconArmchair, IconAward, IconDatabase, IconPlus, IconSearch } from "@tabler/icons-react";
import { allJobs, type Job } from "./jobs";

const ACCENT = "var(--mantine-color-primary-5)";

/** Satu kartu Job: nama + tingkat jabatan tertinggi + jumlah posisi di dalamnya. */
function JobCard({ job }: { job: Job }) {
  return (
    // Gaya kartu disamakan dengan kartu di menu utama: bayangan, tanpa garis tepi.
    <Link
      href={`/admin/job-position/${encodeURIComponent(job.name)}`}
      className="block rounded-[8px] bg-white px-[16px] py-[14px] shadow-[2px_2px_15px_0px_rgba(0,0,0,0.1)] transition-shadow hover:shadow-[2px_2px_20px_0px_rgba(0,0,0,0.16)]"
    >
      <p className="font-['Open_Sans:Bold',sans-serif] font-bold text-[14px] leading-[normal]" style={{ color: ACCENT }}>
        {job.name}
      </p>
      <div className="mt-[8px] flex items-center gap-[14px]">
        <span className="flex items-center gap-[5px] text-[12px] text-[#6c757d]" title="Job level tertinggi di dalamnya">
          <IconAward size={16} stroke={1.6} color="#adb5bd" />
          {job.level}
        </span>
        <span className="flex items-center gap-[5px] text-[12px] text-[#6c757d]" title="Jumlah posisi">
          <IconArmchair size={16} stroke={1.6} color="#adb5bd" />
          {job.positions}
        </span>
      </div>
    </Link>
  );
}

export function JobGrid() {
  const jobs = useMemo(() => allJobs(), []);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? jobs.filter((j) => j.name.toLowerCase().includes(q)) : jobs;
  }, [jobs, query]);

  return (
    <div className="flex flex-col gap-[16px]">
      <div className="flex flex-wrap items-center justify-between gap-[12px]">
        <TextInput
          value={query}
          onChange={(e) => setQuery(e.currentTarget.value)}
          placeholder="Search Job"
          radius="xl"
          w={280}
          rightSection={<IconSearch size={16} stroke={1.6} color="#adb5bd" />}
        />
        <div className="flex items-center gap-[8px]">
          {/* Dua tombol ini belum punya alur — halaman admin masih rangka.
              Dibiarkan tampil supaya susunan toolbar-nya sesuai rancangan. */}
          <Button variant="outline" radius="xl" leftSection={<IconDatabase size={16} stroke={1.6} />}>
            Import
          </Button>
          <Button variant="outline" radius="xl" leftSection={<IconPlus size={16} stroke={1.6} />}>
            Add Job
          </Button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="py-[24px] text-center text-[12px] text-[#adb5bd]">Tidak ada Job yang cocok.</p>
      ) : (
        <div className="grid grid-cols-1 gap-[12px] sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {filtered.map((job) => (
            <JobCard key={job.name} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}
