"use client";

import { useRouter } from "next/navigation";
import { IconBack } from "@/components/Icons";
import { cn } from "@/lib/cn";

export function InnerHeader({
  title,
  right,
  light,
}: {
  title: string;
  right?: React.ReactNode;
  light?: boolean;
}) {
  const router = useRouter();
  return (
    <header
      className={cn(
        "sticky top-0 z-30 relative flex items-center h-12 px-2",
        light ? "bg-white text-ink" : "bg-main-y text-white",
      )}
    >
      <button
        type="button"
        onClick={() => router.back()}
        className="relative z-10 h-8 w-8 grid place-items-center shrink-0"
        aria-label="Back"
      >
        <IconBack />
      </button>
      <h1 className="pointer-events-none absolute inset-x-16 text-center text-lg font-medium truncate">{title}</h1>
      <div className="relative z-10 ml-auto max-w-[42%] flex items-center justify-end">{right}</div>
    </header>
  );
}
