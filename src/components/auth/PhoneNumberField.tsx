"use client";

import { useState } from "react";
import { IconChevronDown, IconPhone } from "@/components/Icons";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/cn";

const PREFIX =
  "h-[46px] w-[76px] shrink-0 rounded-[10px] bg-white shadow-[0_2px_8px_rgba(208,208,237,0.45)] text-[13px] text-l1 flex items-center justify-center gap-1 px-2";

const INPUT =
  "h-[46px] flex-1 min-w-0 rounded-[10px] bg-white shadow-[0_2px_8px_rgba(208,208,237,0.45)] px-4 text-[13px] text-l1 placeholder:text-l3 outline-none";

export function FieldIcon({ children }: { children: React.ReactNode }) {
  return (
    <span className="h-[18px] w-[18px] rounded-[4px] bg-main text-white grid place-items-center shrink-0">
      {children}
    </span>
  );
}

export function PhoneNumberField({
  value,
  onChange,
  inputClassName,
}: {
  value: string;
  onChange: (v: string) => void;
  inputClassName?: string;
}) {
  const { t } = useStore();
  const [open, setOpen] = useState(false);

  return (
    <div>
      <label className="flex items-center gap-1.5 text-[13px] text-l1 font-medium mb-2">
        <FieldIcon>
          <IconPhone className="h-3 w-3" />
        </FieldIcon>
        {t("phone")}
      </label>
      <div className="relative">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className={PREFIX}
          >
            <span className="font-medium">+91</span>
            <IconChevronDown
              className={cn("h-3.5 w-3.5 text-l2 transition-transform", open && "rotate-180")}
            />
          </button>
          <input
            inputMode="numeric"
            maxLength={10}
            value={value}
            onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, 10))}
            placeholder={t("phoneHint")}
            className={cn(INPUT, inputClassName)}
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
              className="absolute left-0 top-[calc(100%+6px)] z-30 w-[min(100%,280px)] rounded-[10px] bg-main text-white text-[14px] px-4 py-3 flex items-center gap-6 text-left shadow-lg"
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
