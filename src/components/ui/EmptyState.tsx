"use client";

import { cn } from "@/lib/cn";
import { useI18n } from "@/hooks/useI18n";

function EmptyArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 130" className={className} aria-hidden>
      <path d="M8 108c28-18 52-10 72 2 22-16 48-18 72-2 10-8 24-6 40 6" fill="#E6E8EE" />
      <path d="M20 104c16-14 36-12 50 2 14-12 34-14 52 0" fill="#EEEFF3" />
      <circle cx="46" cy="86" r="9" fill="#D5D8E0" />
      <rect x="44.5" y="94" width="3" height="14" rx="1.5" fill="#D5D8E0" />
      <circle cx="158" cy="90" r="7" fill="#D5D8E0" />
      <rect x="156.8" y="96" width="2.4" height="12" rx="1.2" fill="#D5D8E0" />
      <rect x="118" y="92" width="22" height="14" rx="2" fill="#D8DBE3" />
      <path
        d="M78 22c18-10 36-4 40 10 1 4-2 8-7 9H72c-4 0-7-4-6-8 2-6 6-9 12-11Z"
        fill="#D8DCE4"
      />
      <path d="M68 38h56c4 0 7 3 7 7v62c0 5-4 8-8 8H70c-5 0-8-4-8-8V45c0-4 3-7 6-7Z" fill="#E8EAEF" />
      <path d="M62 38h68l-4 12H66z" fill="#DDDFE6" />
      <rect x="80" y="62" width="40" height="4" rx="2" fill="#D2D6DE" />
      <rect x="80" y="72" width="28" height="4" rx="2" fill="#D2D6DE" />
      <rect x="80" y="82" width="34" height="4" rx="2" fill="#D2D6DE" />
    </svg>
  );
}

export function EmptyState({
  label,
  compact,
  className,
}: {
  label?: string;
  compact?: boolean;
  className?: string;
}) {
  const { t } = useI18n();
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center",
        compact ? "py-8" : "py-16",
        className,
      )}
    >
      <EmptyArt className={compact ? "h-[88px] w-[136px]" : "h-[120px] w-[184px]"} />
      <p className="mt-3 text-[14px] text-[#C5CAD3]">{label ?? t("noData")}</p>
    </div>
  );
}
