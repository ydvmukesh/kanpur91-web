"use client";

import { useRouter } from "next/navigation";
import { IconBack } from "@/components/Icons";
import { cn } from "@/lib/cn";

export function InnerHeader({
  title,
  right,
  light,
  center,
  centerOut,
  onCenterAnimEnd,
}: {
  title: string;
  right?: React.ReactNode;
  light?: boolean;
  center?: React.ReactNode;
  centerOut?: boolean;
  onCenterAnimEnd?: () => void;
}) {
  const router = useRouter();
  return (
    <header
      className={cn(
        "sticky top-0 z-30 pt-safe-t",
        light ? "bg-white text-ink" : "bg-main-y text-white",
      )}
    >
      <div className="relative flex items-center h-12 px-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="relative z-10 h-8 w-8 grid place-items-center shrink-0"
          aria-label="Back"
        >
          <IconBack />
        </button>
        {center ? (
          <div
            key={centerOut ? "out" : "in"}
            className={cn("header-search", centerOut && "header-search-out")}
            onAnimationEnd={onCenterAnimEnd}
          >
            {center}
          </div>
        ) : (
          <h1 className="pointer-events-none absolute inset-x-16 text-center text-lg font-medium truncate">{title}</h1>
        )}
        <div className={cn("relative z-10 ml-auto flex items-center justify-end", center ? "" : "max-w-[42%]")}>
          {right}
        </div>
      </div>
    </header>
  );
}
