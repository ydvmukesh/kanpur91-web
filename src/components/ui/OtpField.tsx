"use client";

import { FieldLabel } from "@/components/ui/FieldLabel";
import { fieldInput } from "@/components/ui/styles";
import { cn } from "@/lib/cn";

export function OtpField({
  label,
  icon,
  value,
  onChange,
  placeholder,
  onSend,
  sendLabel,
  wait = 0,
  className,
}: {
  label?: string;
  icon?: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onSend?: () => void;
  sendLabel: string;
  wait?: number;
  className?: string;
}) {
  return (
    <div className={className}>
      {label ? <FieldLabel icon={icon}>{label}</FieldLabel> : null}
      <div className="relative">
        <input
          inputMode="numeric"
          maxLength={6}
          value={value}
          onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, 6))}
          placeholder={placeholder}
          className={cn(fieldInput("sheet"), "pr-[88px]")}
        />
        <button
          type="button"
          onClick={onSend}
          disabled={wait > 0}
          className="absolute right-1.5 top-1/2 -translate-y-1/2 h-8 min-w-[68px] px-3 rounded-[6px] bg-main-x text-white text-sm font-semibold disabled:opacity-70"
        >
          {wait > 0 ? `${wait}s` : sendLabel}
        </button>
      </div>
    </div>
  );
}
