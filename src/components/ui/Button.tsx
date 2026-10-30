"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { isAuthOnly } from "@/lib/auth/routes";

const variants = {
  primary: "bg-main-x text-white shadow-[0_8px_16px_rgba(249,89,89,0.1)]",
  main: "bg-main text-white",
  gold: "bg-[#f6af0b] text-white",
  outline: "border border-main bg-transparent text-main",
  ghost: "border-0 bg-transparent shadow-none text-main",
} as const;

const sizes = {
  md: "h-11 text-lg",
  sm: "h-11 text-base",
  xs: "h-[2.1875rem] text-sm",
} as const;

type Props = {
  children: React.ReactNode;
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  href?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  href,
  type = "button",
  disabled,
  onClick,
  className,
}: Props) {
  const pathname = usePathname();
  const cls = cn(
    "w-full rounded-full font-semibold grid place-items-center",
    sizes[size],
    variants[variant],
    disabled && !isAuthOnly(pathname) && "bg-btn-disabled text-white shadow-none border-transparent",
    className,
  );

  if (href && !disabled) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={cls}>
      {children}
    </button>
  );
}
