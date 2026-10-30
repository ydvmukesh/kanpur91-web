"use client";

import { fieldSurface } from "@/components/ui/styles";
import { cn } from "@/lib/cn";

export function AmountField({
  value,
  onChange,
  suffix,
  className,
}: {
  value: number;
  onChange: (value: number) => void;
  suffix?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn(fieldSurface("line"), className)}>
      <span className="text-main font-bold">₹</span>
      <input
        inputMode="numeric"
        value={value || ""}
        onChange={(e) => onChange(Number(e.target.value.replace(/\D/g, "")) || 0)}
        className="flex-1 min-w-0 bg-transparent outline-none text-15 font-semibold text-ink"
      />
      {suffix}
    </div>
  );
}
