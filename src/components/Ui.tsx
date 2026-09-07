"use client";

import { useRouter } from "next/navigation";
import { IconBack } from "./Icons";
import { cn } from "@/lib/cn";

export function InnerHeader({
  title,
  right,
  light,
}: {
  title: string;
  right?: React.ReactNode;
  light?: boolean;
}) {
  const router = useRouter();
  return (
    <header
      className={cn(
        "sticky top-0 z-30 relative flex items-center h-12 px-2",
        light ? "bg-white text-l1" : "bg-main-y text-white",
      )}
    >
      <button
        type="button"
        onClick={() => router.back()}
        className="h-10 w-10 grid place-items-center"
        aria-label="Back"
      >
        <IconBack />
      </button>
      <h1 className="flex-1 text-center text-[17px] font-semibold pr-10">{title}</h1>
      {right ? <div className="absolute right-2 top-0 h-12 flex items-center">{right}</div> : null}
    </header>
  );
}

export function PrimaryButton({
  children,
  onClick,
  disabled,
  type = "button",
  className,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
  className?: string;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "w-full h-12 rounded-full text-white text-[16px] font-semibold",
        disabled ? "bg-btn-disabled text-white/80" : "bg-main-x",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function Field({
  icon,
  children,
}: {
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <label className="flex items-center gap-3 h-12 px-3 rounded-lg bg-bg-l3 border border-transparent focus-within:border-main/40">
      {icon ? <span className="text-main">{icon}</span> : null}
      {children}
    </label>
  );
}
