"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { DayPicker, getDefaultClassNames, type DateRange } from "react-day-picker";
import "react-day-picker/style.css";
import { Button } from "@/components/ui/Button";
import { useI18n } from "@/hooks/useI18n";
import { cn } from "@/lib/cn";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
const CAL_START = new Date(2022, 0, 1);
const rdp = getDefaultClassNames();
const RANGE_CLASS_NAMES = {
  months: cn(rdp.months, "flex w-full max-w-none flex-col flex-nowrap"),
  month: cn(rdp.month, "relative w-full max-w-none overflow-hidden"),
  month_grid: cn(rdp.month_grid, "relative z-[1] w-full table-fixed border-collapse"),
  week: cn(rdp.week, "grid w-full grid-cols-7 gap-0"),
  weekdays: cn(rdp.weekdays, "sticky top-0 z-[2] grid w-full grid-cols-7 gap-0 bg-white pb-1"),
  day: cn(rdp.day, "w-auto min-w-0 p-0"),
  weekday: cn(rdp.weekday, "w-auto min-w-0 p-0 text-center text-xs font-medium text-muted"),
  month_caption: cn(rdp.month_caption, "justify-center font-semibold text-ink"),
};

function today() {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function monthsFrom2022() {
  const now = new Date();
  return (now.getFullYear() - 2022) * 12 + now.getMonth() + 1;
}

export function formatDateRange(from: Date, to: Date) {
  return `${from.getFullYear()}-${from.getMonth() + 1}-${from.getDate()}/${to.getFullYear()}-${to.getMonth() + 1}-${to.getDate()}`;
}

export function parseDateRange(value: string): DateRange | undefined {
  const [a, b] = value.split("/");
  if (!a || !b) return undefined;
  const from = parseLoose(a);
  const to = parseLoose(b);
  if (!from || !to) return undefined;
  return { from, to };
}

export function padLooseDate(part: string) {
  const [y, m, d] = part.split("-");
  if (!y || !m || !d) return part;
  return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
}

function parseLoose(part: string) {
  const [y, m, d] = part.split("-").map(Number);
  if (!y || !m || !d) return undefined;
  return new Date(y, m - 1, d);
}

export function RangeCalendarSheet({
  open,
  value,
  onConfirm,
  onClose,
}: {
  open: boolean;
  value: string;
  onConfirm: (range: string) => void;
  onClose: () => void;
}) {
  const { t } = useI18n();
  const [root, setRoot] = useState<HTMLElement | null>(null);
  const [draft, setDraft] = useState<DateRange | undefined>(parseDateRange(value));
  const scroller = useRef<HTMLDivElement>(null);
  const now = today();
  const monthCount = useMemo(() => monthsFrom2022(), []);

  useEffect(() => {
    setRoot(document.getElementById("phone-root") ?? document.body);
  }, []);

  useEffect(() => {
    if (open) setDraft(parseDateRange(value));
  }, [open, value]);

  useEffect(() => {
    if (!open) return;
    const el = scroller.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [open, root]);

  if (!open || !root) return null;

  return createPortal(
    <div className="absolute inset-0 z-[80] flex justify-center">
      <div className="relative h-full w-full">
        <button type="button" className="absolute inset-0 bg-black/55" onClick={onClose} />
        <div className="absolute inset-x-0 bottom-0 rounded-t-2xl bg-white p-4 pb-[max(1rem,env(safe-area-inset-bottom,0px))] animate-[sheet-up_280ms_ease-out]">
          <div className="relative mb-2 flex h-10 items-center justify-center">
            <p className="text-sm font-semibold text-ink">{t("calendar")}</p>
            <button
              type="button"
              className="absolute right-0 grid h-8 w-8 place-items-center text-muted"
              onClick={onClose}
              aria-label={t("cancel")}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div ref={scroller} className="range-cal phone-scroll max-h-[55vh] w-full overflow-x-hidden overflow-y-auto">
            <DayPicker
              mode="range"
              selected={draft}
              onSelect={setDraft}
              numberOfMonths={monthCount}
              startMonth={CAL_START}
              endMonth={now}
              defaultMonth={CAL_START}
              hideNavigation
              disabled={{ before: CAL_START, after: now }}
              className="w-full max-w-none"
              classNames={RANGE_CLASS_NAMES}
              formatters={{
                formatCaption: (date) => `${date.getFullYear()}/${date.getMonth() + 1}`,
                formatWeekdayName: (date) => WEEKDAYS[date.getDay()],
              }}
              components={{
                Month: ({ calendarMonth, displayIndex: _i, className, children, ...rest }) => (
                  <div {...rest} className={className}>
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-x-0 top-[30%] bottom-0 z-0 grid place-items-center text-[8rem] font-bold leading-none text-ink opacity-[0.08]"
                    >
                      {calendarMonth.date.getMonth() + 1}
                    </span>
                    {children}
                  </div>
                ),
                Day: ({ day: _day, modifiers, className, ...rest }) => {
                  const single = Boolean(modifiers.range_start && modifiers.range_end);
                  return (
                    <td
                      {...rest}
                      className={cn(
                        single ? className?.replace(/\brdp-range_end\b/g, "") : className,
                        single && "range-cal-single",
                      )}
                    />
                  );
                },
                DayButton: ({ day, modifiers, className, ...rest }) => (
                  <button
                    {...rest}
                    type="button"
                    className={cn(
                      "relative z-[1] flex flex-col items-center justify-center !text-15 !font-medium",
                      modifiers.disabled && "text-faint",
                      modifiers.today && !modifiers.selected && "!text-main",
                      className,
                    )}
                  >
                    {day.date.getDate()}
                    {modifiers.range_start ? (
                      <span className="text-[0.5rem] font-normal leading-none">{t("start")}</span>
                    ) : null}
                    {modifiers.range_end && !modifiers.range_start ? (
                      <span className="text-[0.5rem] font-normal leading-none">{t("end")}</span>
                    ) : null}
                  </button>
                ),
              }}
            />
          </div>
          <Button
            className="mt-3"
            size="sm"
            disabled={!draft?.from || !draft?.to}
            onClick={() => {
              if (!draft?.from || !draft?.to) return;
              onConfirm(formatDateRange(draft.from, draft.to));
            }}
          >
            {t("confirm")}
          </Button>
        </div>
      </div>
    </div>,
    root,
  );
}
