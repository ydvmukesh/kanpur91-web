"use client";

import { cn } from "@/lib/cn";
import { FieldLabel } from "@/components/ui/FieldLabel";
import { fieldInput, fieldSurface, type FieldVariant } from "@/components/ui/styles";

type Props = Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "className"> & {
  label?: string;
  icon?: React.ReactNode;
  variant?: FieldVariant;
  suffix?: React.ReactNode;
  inputClassName?: string;
  className?: string;
  onChange?: (value: string) => void;
};

export function TextField({
  label,
  icon,
  variant = "sheet",
  suffix,
  className,
  inputClassName,
  onChange,
  value,
  ...input
}: Props) {
  const el = (
    <input
      {...input}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      className={cn(
        fieldInput(variant, suffix ? "pr-12" : undefined),
        variant === "line" && "px-0",
        inputClassName,
      )}
    />
  );

  const control =
    variant === "line" ? (
      <div className={fieldSurface("line")}>
        {icon && !label ? <span className="text-main">{icon}</span> : null}
        {el}
        {suffix}
      </div>
    ) : suffix ? (
      <div className="relative">
        {el}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted flex items-center justify-center">{suffix}</div>
      </div>
    ) : (
      el
    );

  if (!label) return <div className={className}>{control}</div>;

  return (
    <div className={className}>
      <FieldLabel icon={icon}>{label}</FieldLabel>
      {control}
    </div>
  );
}
