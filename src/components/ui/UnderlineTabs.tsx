"use client";

import { cn } from "@/lib/cn";

export function UnderlineTabs<T extends string>({
  value,
  onChange,
  items,
  className,
}: {
  value: T;
  onChange: (id: T) => void;
  items: { id: T; label: string; icon?: React.ReactNode }[];
  className?: string;
}) {
  return (
    <div className={cn("grid px-6", items.length === 1 ? "grid-cols-1 bg-white" : "grid-cols-2", className)}>
      {items.map((item) => {
        const on = value === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange(item.id)}
            className={cn(
              "flex flex-col items-center gap-1 pt-4 pb-2.5 text-[13px] border-b-2",
              on ? "text-main border-main font-medium" : "text-muted border-line",
            )}
          >
            {item.icon}
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
