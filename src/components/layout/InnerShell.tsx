"use client";

import { InnerHeader } from "@/components/layout/InnerHeader";
import { cn } from "@/lib/cn";

export function InnerShell({
  title,
  variant = "main",
  right,
  className,
  headerClassName,
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
  headerClassName?: string;
  headerExtra?: React.ReactNode;
  headerCenter?: React.ReactNode;
  headerCenterOut?: boolean;
  onHeaderCenterAnimEnd?: () => void;
  children?: React.ReactNode;
}) {
  return (
    <div className={cn("phone-scroll h-full min-h-0 overflow-y-auto", className ?? "bg-page")}>
      <div className="sticky top-0 z-30">
        <InnerHeader
          title={title}
          light={variant === "light"}
          bgClassName={headerClassName}
          right={right}
          center={headerCenter}
          centerOut={headerCenterOut}
          onCenterAnimEnd={onHeaderCenterAnimEnd}
        />
        {headerExtra}
      </div>
      {children}
    </div>
  );
}
