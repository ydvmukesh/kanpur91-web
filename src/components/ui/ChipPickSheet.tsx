"use client";

import { Sheet } from "@/components/layout/Sheet";
import { cn } from "@/lib/cn";

export type ChipPickItem = {
  id: string;
  label: string;
  leading?: React.ReactNode;
};

export function ChipPickSheet({
  open,
  value,
  items,
  onChange,
  onClose,
}: {
  open: boolean;
  value: string;
  items: ChipPickItem[];
  onChange: (id: string) => void;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <Sheet onClose={onClose}>
      <div className="grid grid-cols-2 gap-2.5">
        {items.map((item) => {
          const on = item.id === value;
          return (
            <button
              key={item.id}
              type="button"
              className={cn(
                "flex h-12 min-w-0 items-center gap-2 rounded-lg px-3 text-left text-sm font-medium",
                on ? "bg-main-x text-white" : "bg-bg-l3 text-ink",
              )}
              onClick={() => {
                onChange(item.id);
                onClose();
              }}
            >
              {item.leading}
              <span className="min-w-0 truncate">{item.label}</span>
            </button>
          );
        })}
      </div>
    </Sheet>
  );
}
