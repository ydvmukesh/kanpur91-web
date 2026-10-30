"use client";

import { useState } from "react";
import { CalendarDays, ChevronDown } from "lucide-react";
import { WheelPicker } from "@/components/ui/WheelPicker";
import { WheelPickerSheet, type PickerOption } from "@/components/ui/WheelPickerSheet";
import { useI18n } from "@/hooks/useI18n";
import { cn } from "@/lib/cn";

function FieldShell({
  children,
  className,
  onClick,
  trailing,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  trailing?: React.ReactNode;
}) {
  const cls = cn(
    "relative flex h-11 w-full items-center justify-between gap-2 rounded-lg bg-white px-3 text-left text-sm text-ink",
    className,
  );
  const icons = trailing ?? <ChevronDown className="h-5 w-5 shrink-0 text-muted" />;
  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={cls}>
        {children}
        {icons}
      </button>
    );
  }
  return (
    <div className={cls}>
      {children}
      {icons}
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

function currentYear() {
  return new Date().getFullYear();
}

function splitDate(value: string) {
  const maxY = currentYear();
  const [y, m, d] = (value || "").split("-");
  const year = Math.min(Number(y) || maxY, maxY);
  return {
    y: String(Number.isFinite(year) && year > 0 ? year : maxY),
    m: m || "01",
    d: d || "01",
  };
}

function daysInMonth(year: string, month: string) {
  return new Date(Number(year), Number(month), 0).getDate();
}

export function DateSelect({
  value,
  onChange,
  className,
  calendar = true,
}: {
  value: string;
  onChange: (date: string) => void;
  className?: string;
  calendar?: boolean;
}) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(splitDate(value));
  const maxYear = currentYear();
  const startYear = Math.min(2022, maxYear);
  const years = Array.from({ length: maxYear - startYear + 1 }, (_, i) => {
    const id = String(startYear + i);
    return { id, label: id };
  });
  const months = Array.from({ length: 12 }, (_, i) => {
    const id = String(i + 1).padStart(2, "0");
    return { id, label: id };
  });
  const maxDay = daysInMonth(draft.y, draft.m);
  const days = Array.from({ length: maxDay }, (_, i) => {
    const id = String(i + 1).padStart(2, "0");
    return { id, label: id };
  });
  const day = Number(draft.d) > maxDay ? String(maxDay).padStart(2, "0") : draft.d;

  return (
    <>
      <FieldShell
        className={className}
        onClick={() => {
          setDraft(splitDate(value));
          setOpen(true);
        }}
        trailing={
          calendar ? (
            <div className="flex shrink-0 items-center gap-1.5">
              <CalendarDays className="h-5 w-5 shrink-0 text-muted" />
              <ChevronDown className="h-5 w-5 shrink-0 text-muted" />
            </div>
          ) : undefined
        }
      >
        <span className={cn("min-w-0 truncate", value ? "text-ink" : "text-faint")}>{value || t("chooseDate")}</span>
      </FieldShell>
      <WheelPickerSheet
        open={open}
        title={t("chooseDate")}
        onCancel={() => setOpen(false)}
        onConfirm={() => {
          onChange(`${draft.y}-${draft.m}-${day}`);
          setOpen(false);
        }}
      >
        <div className="grid grid-cols-3">
          <WheelPicker options={years} value={draft.y} onChange={(y) => setDraft((prev) => ({ ...prev, y }))} />
          <WheelPicker options={months} value={draft.m} onChange={(m) => setDraft((prev) => ({ ...prev, m }))} />
          <WheelPicker key={`${draft.y}-${draft.m}`} options={days} value={day} onChange={(d) => setDraft((prev) => ({ ...prev, d }))} />
        </div>
      </WheelPickerSheet>
    </>
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
