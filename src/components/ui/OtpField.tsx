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
  sendClassName,
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
  sendClassName?: string;
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
          className={cn(fieldInput("sheet"), "pr-[5.5rem]")}
        />
        <button
          type="button"
          onClick={onSend}
          disabled={wait > 0}
          className={cn(
            "absolute right-1.5 top-1/2 h-8 min-w-[4.25rem] -translate-y-1/2 rounded-[0.375rem] bg-main-x px-3 text-sm font-semibold text-white disabled:opacity-70",
            sendClassName,
          )}
        >
          {wait > 0 ? `${wait}s` : sendLabel}
        </button>
      </div>
    </div>
  );
}
