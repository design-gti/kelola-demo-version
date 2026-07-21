"use client";

export default function TopHeading() {
  return (
    <div className="h-[54px] bg-[#f8f9fa] flex items-center justify-between w-full">
      <span
        className="text-[12px] text-[#58595b]"
        style={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 700 }}
      >
        Home
      </span>
      <div className="relative w-[24px] h-[24px]">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6V11c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"
            fill="#58595b"
          />
        </svg>
        <span className="absolute top-0 right-0 w-[8px] h-[8px] bg-red-500 rounded-full border-2 border-white" />
      </div>
    </div>
  );
}
