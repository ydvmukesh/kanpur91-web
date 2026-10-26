"use client";

import { useState } from "react";
import { CalendarDays, ChevronDown } from "lucide-react";
import { WheelPickerSheet, type PickerOption } from "@/components/ui/WheelPickerSheet";
import { useI18n } from "@/hooks/useI18n";
import { cn } from "@/lib/cn";

function FieldShell({
  children,
  className,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  const cls = cn(
    "relative flex h-11 w-full items-center justify-between gap-2 rounded-lg bg-white px-3 text-left text-sm text-ink",
    className,
  );
  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={cls}>
        {children}
        <ChevronDown className="h-4 w-4 shrink-0 text-faint" />
      </button>
    );
  }
  return (
    <div className={cls}>
      {children}
      <ChevronDown className="h-4 w-4 shrink-0 text-faint" />
    </div>
  );
}

export function FilterSelect({
  value,
  onChange,
  options,
  className,
}: {
  value: string;
  onChange: (id: string) => void;
  options: PickerOption[];
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(value);
  const label = options.find((x) => x.id === value)?.label ?? value;

  return (
    <>
      <FieldShell
        className={className}
        onClick={() => {
          setDraft(value);
          setOpen(true);
        }}
      >
        <span className="min-w-0 truncate">{label}</span>
      </FieldShell>
      <WheelPickerSheet
        open={open}
        options={options}
        value={draft}
        onChange={setDraft}
        onCancel={() => setOpen(false)}
        onConfirm={() => {
          onChange(draft);
          setOpen(false);
        }}
      />
    </>
  );
}

export function DateSelect({
  value,
  onChange,
  className,
}: {
  value: string;
  onChange: (date: string) => void;
  className?: string;
}) {
  const { t } = useI18n();
  return (
    <label className={cn("relative block", className)}>
      <FieldShell>
        <input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn("min-w-0 flex-1 bg-transparent text-sm outline-none", !value && "text-transparent")}
        />
        {!value ? (
          <span className="pointer-events-none absolute left-3 text-sm text-faint">{t("chooseDate")}</span>
        ) : null}
        <CalendarDays className="pointer-events-none absolute right-8 h-4 w-4 text-faint" />
      </FieldShell>
    </label>
  );
}

export function FilterDateRow({
  value,
  onChange,
  options,
  date,
  onDateChange,
  className,
}: {
  value: string;
  onChange: (id: string) => void;
  options: PickerOption[];
  date: string;
  onDateChange: (date: string) => void;
  className?: string;
}) {
  return (
    <div className={cn("grid grid-cols-2 gap-2", className)}>
      <FilterSelect value={value} onChange={onChange} options={options} />
      <DateSelect value={date} onChange={onDateChange} />
    </div>
  );
}
