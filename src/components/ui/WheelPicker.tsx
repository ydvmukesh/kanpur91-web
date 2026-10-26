"use client";

import { useLayoutEffect, useRef } from "react";
import { cn } from "@/lib/cn";

const ITEM_H = 48;
const PAD = ITEM_H * 2;

export function WheelPicker({
  options,
  value,
  onChange,
}: {
  options: { id: string; label: string }[];
  value: string;
  onChange: (id: string) => void;
}) {
  const scroller = useRef<HTMLDivElement>(null);
  const lock = useRef(false);
  const snapTimer = useRef<number>(0);
  const index = Math.max(0, options.findIndex((o) => o.id === value));

  function toIndex(i: number, smooth: boolean) {
    const el = scroller.current;
    if (!el) return;
    lock.current = true;
    el.scrollTo({ top: i * ITEM_H, behavior: smooth ? "smooth" : "instant" });
    window.setTimeout(() => {
      lock.current = false;
    }, smooth ? 320 : 0);
  }

  useLayoutEffect(() => {
    toIndex(index, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only pin when the sheet mounts
  }, []);

  function nearest() {
    const el = scroller.current;
    if (!el) return 0;
    return Math.min(options.length - 1, Math.max(0, Math.round(el.scrollTop / ITEM_H)));
  }

  return (
    <div className="relative h-60 w-full">
      <div
        ref={scroller}
        className="phone-scroll h-full overflow-y-auto overscroll-contain"
        onScroll={() => {
          if (lock.current) return;
          const i = nearest();
          const id = options[i]?.id;
          if (id && id !== value) onChange(id);
          window.clearTimeout(snapTimer.current);
          snapTimer.current = window.setTimeout(() => toIndex(nearest(), true), 80);
        }}
      >
        <div style={{ height: PAD }} />
        {options.map((opt, i) => {
          const dist = Math.abs(i - index);
          return (
            <button
              key={opt.id}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                onChange(opt.id);
                toIndex(i, true);
              }}
              className={cn(
                "w-full h-12 text-center text-base transition-colors duration-200",
                dist === 0 ? "text-ink" : dist === 1 ? "text-faint" : "text-faint/50",
              )}
            >
              {opt.label}
            </button>
          );
        })}
        <div style={{ height: PAD }} />
      </div>
    </div>
  );
}
