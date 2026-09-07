"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { IconChevron } from "@/components/Icons";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/cn";
import {
  chartBallBg,
  chartStats,
  getRound,
  historyFor,
  type WinGoInterval,
} from "@/lib/wingo";

const PAGE_SIZE = 10;
const PAGES = 50;

export function WinGoChart({ interval, now }: { interval: WinGoInterval; now: number }) {
  const { t } = useStore();
  const [page, setPage] = useState(1);
  const gridRef = useRef<HTMLDivElement>(null);
  const [line, setLine] = useState({ w: 1, h: 1, points: "" });

  useEffect(() => {
    setPage(1);
  }, [interval]);

  const { periodStart } = getRound(interval, now);
  const last100 = useMemo(() => historyFor(interval, 100, now), [interval, periodStart]);
  const all = useMemo(() => historyFor(interval, PAGE_SIZE * PAGES, now), [interval, periodStart]);
  const rows = useMemo(
    () => all.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [all, page],
  );
  const stats = useMemo(() => chartStats(last100.map((h) => h.number)), [last100]);
  const statRows = [
    { label: t("missing"), values: stats.missing },
    { label: t("avgMissing"), values: stats.avgMissing },
    { label: t("frequency"), values: stats.frequency },
    { label: t("maxConsecutive"), values: stats.maxConsecutive },
  ];

  useLayoutEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    function measure() {
      if (!grid || !rows.length) return;
      const w = grid.clientWidth;
      const h = grid.clientHeight;
      if (!w || !h) return;
      const colW = w / 10;
      const rowH = h / rows.length;
      const points = rows.map((r, i) => `${(r.number + 0.5) * colW},${(i + 0.5) * rowH}`).join(" ");
      setLine((prev) => {
        if (prev.w === w && prev.h === h && prev.points === points) return prev;
        return { w, h, points };
      });
    }

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(grid);
    return () => ro.disconnect();
  }, [page, periodStart, interval, rows]);

  return (
    <div>
      <div className="overflow-hidden rounded-xl bg-white">
        <div className="grid grid-cols-[118px_minmax(0,1fr)_26px] bg-main text-white text-[13px] font-semibold py-2.5">
          <span className="pl-3">{t("period")}</span>
          <span className="text-center">{t("number")}</span>
          <span />
        </div>

        <div className="px-1.5 pt-2 pb-1">
          <p className="text-[12px] text-l2 mb-2">{t("statisticLast100")}</p>
          <div className="grid grid-cols-[76px_repeat(10,1fr)] gap-y-1.5 items-center">
            <span />
            {Array.from({ length: 10 }, (_, n) => (
              <span
                key={n}
                className="mx-auto h-[18px] w-[18px] rounded-full border border-main text-[10px] text-main font-semibold grid place-items-center"
              >
                {n}
              </span>
            ))}
            {statRows.map((row) => (
              <div key={row.label} className="contents">
                <span className="text-[11px] text-l2 leading-tight pr-1">{row.label}</span>
                {row.values.map((v, n) => (
                  <span key={n} className="text-center text-[11px] text-l1 tabular-nums">
                    {v}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-[118px_minmax(0,1fr)_26px]">
          <div>
            {rows.map((h) => (
              <div
                key={h.period}
                className="flex h-9 items-center border-t border-[#F0F1F5] pl-2 pr-2"
              >
                <span className="text-[10px] text-l1 tabular-nums leading-tight">{h.period}</span>
              </div>
            ))}
          </div>
          <div ref={gridRef} className="relative min-w-0">
            {rows.map((h) => (
              <div key={h.period} className="grid h-9 grid-cols-10 border-t border-[#F0F1F5]">
                {Array.from({ length: 10 }, (_, n) => {
                  const win = h.number === n;
                  return (
                    <span key={n} className="grid place-items-center">
                      <span
                        className={cn(
                          "relative z-[2] h-[18px] w-[18px] rounded-full text-[10px] font-semibold grid place-items-center",
                          win ? "text-white" : "border border-[#E4E7EE] text-[#C5CAD6]",
                        )}
                        style={win ? { background: chartBallBg(n) } : undefined}
                      >
                        {n}
                      </span>
                    </span>
                  );
                })}
              </div>
            ))}
            {line.points ? (
              <svg
                className="pointer-events-none absolute left-0 top-0 z-[1]"
                width={line.w}
                height={line.h}
                viewBox={`0 0 ${line.w} ${line.h}`}
              >
                <polyline
                  fill="none"
                  stroke="#F95959"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  points={line.points}
                />
              </svg>
            ) : null}
          </div>
          <div>
            {rows.map((h) => (
              <div key={h.period} className="grid h-9 place-items-center border-t border-[#F0F1F5]">
                <span
                  className="h-[18px] w-[18px] rounded-full text-[10px] font-bold text-white grid place-items-center"
                  style={{ background: h.big ? "#FEAA57" : "#6EA8F4" }}
                >
                  {h.big ? "B" : "S"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-6 py-4">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className={cn(
            "h-8 w-8 rounded-md grid place-items-center",
            page <= 1 ? "bg-[#E9EDF3] text-[#B6BCC8]" : "bg-main text-white",
          )}
          aria-label="Previous page"
        >
          <span className="rotate-180">
            <IconChevron />
          </span>
        </button>
        <span className="text-[13px] text-l1 tabular-nums">
          {page}/{PAGES}
        </span>
        <button
          type="button"
          disabled={page >= PAGES}
          onClick={() => setPage((p) => Math.min(PAGES, p + 1))}
          className={cn(
            "h-8 w-8 rounded-md grid place-items-center",
            page >= PAGES ? "bg-[#E9EDF3] text-[#B6BCC8]" : "bg-main text-white",
          )}
          aria-label="Next page"
        >
          <IconChevron />
        </button>
      </div>
    </div>
  );
}
