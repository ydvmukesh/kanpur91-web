"use client";

import { IconCheck } from "@/components/Icons";
import { cn } from "@/lib/cn";

export function Checkbox({
  checked,
  onChange,
  className,
  children,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={cn("flex items-center gap-2 text-[13px] text-muted text-left", className)}>
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className="shrink-0"
      >
        <span
          className={cn(
            "h-[18px] w-[18px] rounded-full border grid place-items-center",
            checked ? "border-main bg-main text-white" : "border-faint bg-white",
          )}
        >
          {checked ? <IconCheck className="h-2.5 w-2.5" /> : null}
        </span>
      </button>
      {children}
    </div>
  );
}
