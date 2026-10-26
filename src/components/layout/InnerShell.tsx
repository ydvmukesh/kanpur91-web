"use client";

import { InnerHeader } from "@/components/layout/InnerHeader";
import { cn } from "@/lib/cn";

export function InnerShell({
  title,
  variant = "main",
  right,
  className,
  headerExtra,
  headerCenter,
  headerCenterOut,
  onHeaderCenterAnimEnd,
  children,
}: {
  title: string;
  variant?: "main" | "light";
  right?: React.ReactNode;
  className?: string;
  headerExtra?: React.ReactNode;
  headerCenter?: React.ReactNode;
  headerCenterOut?: boolean;
  onHeaderCenterAnimEnd?: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("h-full min-h-0 flex flex-col", className ?? "bg-bg-l1")}>
      <div className="sticky top-0 z-30 shrink-0">
        <InnerHeader
          title={title}
          light={variant === "light"}
          right={right}
          center={headerCenter}
          centerOut={headerCenterOut}
          onCenterAnimEnd={onHeaderCenterAnimEnd}
        />
        {headerExtra}
      </div>
      <div className="phone-scroll flex-1 min-h-0 overflow-y-auto">{children}</div>
    </div>
  );
}
