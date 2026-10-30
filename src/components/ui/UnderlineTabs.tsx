"use client";

import { cn } from "@/lib/cn";

export function TabContent<T extends string>({
  value,
  when,
  children,
  className,
}: {
  value: T;
  when: T;
  children?: React.ReactNode;
  className?: string;
}) {
  if (value !== when) return null;
  if (!className) return children;
  return <div className={className}>{children}</div>;
}

export function UnderlineTabs<T extends string>({
  value,
  onChange,
  items,
  className,
  variant = "auth",
}: {
  value: T;
  onChange: (id: T) => void;
  items: { id: T; label: string; icon?: React.ReactNode }[];
  className?: string;
  variant?: "auth" | "line";
}) {
  const cols = items.length <= 1 ? "grid-cols-1" : items.length === 3 ? "grid-cols-3" : "grid-cols-2";

  if (variant === "line") {
    return (
      <div className={cn("grid", cols, className)}>
        {items.map((item) => {
          const on = value === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange(item.id)}
              className={cn(
                "h-10 text-sm",
                on ? "border-b-2 border-main font-medium text-main" : "text-muted",
              )}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    );
  }

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
              "flex flex-col items-center gap-1 pt-4 pb-2.5 text-15 border-b-2",
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
