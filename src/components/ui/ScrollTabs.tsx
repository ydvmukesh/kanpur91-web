"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

export function ScrollTabs<T extends string>({
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
  const [tx, setTx] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    const list = listRef.current;
    const active = list?.querySelector<HTMLElement>(`[data-tab="${value}"]`);
    if (!wrap || !list || !active) return;
    const max = Math.max(0, list.scrollWidth - wrap.clientWidth);
    const next = Math.min(max, Math.max(0, active.offsetLeft - (wrap.clientWidth - active.offsetWidth) / 2));
    setTx(next);
  }, [value]);

  return (
    <div ref={wrapRef} className={cn("overflow-hidden", className)}>
      <div
        ref={listRef}
        className="flex w-max gap-2"
        style={{
          transform: `translate3d(${-tx}px, 0px, 0px)`,
          transitionProperty: "transform",
          transitionDuration: "360ms",
          transitionTimingFunction: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        }}
      >
        {items.map((item) => {
          const on = value === item.id;
          return (
            <button
              key={item.id}
              type="button"
              data-tab={item.id}
              onClick={() => onChange(item.id)}
              className={cn(
                "flex h-[3.375rem] w-[6.25rem] shrink-0 flex-col items-center justify-center rounded-[0.375rem]",
                on ? "bg-main-x text-white" : "bg-white text-muted",
              )}
            >
              {item.icon}
              <span className="mt-1 text-11 font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
