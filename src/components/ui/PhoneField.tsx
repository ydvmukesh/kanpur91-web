"use client";

import { useState } from "react";
import { IconChevronDown, IconPhone } from "@/components/Icons";
import { FieldIcon, FieldLabel } from "@/components/ui/FieldLabel";
import { FIELD_H, fieldSurface, type FieldVariant } from "@/components/ui/styles";
import { cn } from "@/lib/cn";
import { useStore } from "@/lib/store";

export function PhoneField({
  value,
  onChange,
  variant = "sheet",
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  variant?: Exclude<FieldVariant, "line">;
  className?: string;
}) {
  const { t } = useStore();
  const [open, setOpen] = useState(false);

  return (
    <div className={className}>
      <FieldLabel
        icon={
          <FieldIcon>
            <IconPhone className="h-4 w-4" />
          </FieldIcon>
        }
      >
        {t("phone")}
      </FieldLabel>
      <div className="relative">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className={cn(
              FIELD_H,
              "w-[4.75rem] shrink-0 bg-white shadow-field text-15 text-ink flex items-center justify-center gap-1 px-2 rounded-[0.625rem]",
            )}
          >
            <span className="font-medium">+91</span>
            <IconChevronDown
              className={cn("h-3.5 w-3.5 text-muted transition-transform", open && "rotate-180")}
            />
          </button>
          <input
            inputMode="numeric"
            maxLength={10}
            value={value}
            onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, 10))}
            placeholder={t("phoneHint")}
            className={cn(fieldSurface(variant), "flex-1 min-w-0 px-4 text-15")}
          />
        </div>
        {open ? (
          <>
            <button
              type="button"
              className="fixed inset-0 z-20 cursor-default"
              aria-label="Close"
              onClick={() => setOpen(false)}
            />
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute left-0 top-[calc(100%+0.375rem)] z-30 w-[min(100%,17.5rem)] rounded-[0.625rem] bg-main text-white text-sm px-4 py-3 flex items-center gap-6 text-left shadow-lg"
            >
              <span className="font-medium">+91</span>
              <span>India (भारत)</span>
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
}
