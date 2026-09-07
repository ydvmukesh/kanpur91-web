"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { InnerHeader } from "@/components/Ui";
import { EmptyNoData } from "@/components/games/EmptyNoData";
import { dummyWinGoBets, WinGoBetRows } from "@/components/games/WinGoBetHistory";
import { IconChevron } from "@/components/Icons";
import { cn } from "@/lib/cn";
import { useStore } from "@/lib/store";
import { WINGO_INTERVALS, type WinGoInterval } from "@/lib/wingo";

const PAGE = 10;

function asInterval(raw: string | null): WinGoInterval {
  const n = Number(raw);
  return (WINGO_INTERVALS.find((x) => x.key === n)?.key ?? 30) as WinGoInterval;
}

export function WinGoHistoryDetail({ trx }: { trx?: boolean }) {
  const { t, bets } = useStore();
  const params = useSearchParams();
  const [interval, setInterval] = useState<WinGoInterval>(() => asInterval(params.get("interval")));
  const [page, setPage] = useState(1);

  const all = useMemo(() => {
    const game = trx ? "trx" : "wingo";
    const real = bets.filter((b) => b.game === game && b.interval === interval);
    return [...real, ...dummyWinGoBets(interval, game)];
  }, [bets, interval, trx]);
  const pages = Math.max(1, Math.ceil(all.length / PAGE));
  const rows = all.slice((page - 1) * PAGE, page * PAGE);

  return (
    <div className="min-h-dvh bg-[#F6F6F6]">
      <InnerHeader title={trx ? t("trxWin") : t("winGo")} />
      <div className="bg-white flex">
        {WINGO_INTERVALS.map((x) => {
          const on = interval === x.key;
          return (
            <button
              key={x.key}
              type="button"
              onClick={() => {
                setInterval(x.key);
                setPage(1);
              }}
              className={cn(
                "relative flex-1 h-11 text-[12px] font-medium",
                on ? "text-l1" : "text-l2",
              )}
            >
              {trx ? "TrxWin" : x.name} {x.sub}
              {on ? <i className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[3px] w-10 rounded-full bg-main" /> : null}
            </button>
          );
        })}
      </div>

      {rows.length === 0 ? (
        <div className="pt-16">
          <EmptyNoData />
          <p className="mt-2 text-center text-[14px] text-l1">{t("noData")}</p>
        </div>
      ) : (
        <>
          <WinGoBetRows bets={rows} cards />
          <div className="flex items-center justify-center gap-6 py-5">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className={cn(
                "h-8 w-8 rounded-md grid place-items-center bg-white",
                page <= 1 ? "text-[#B6BCC8]" : "text-l1",
              )}
              aria-label="Previous page"
            >
              <span className="rotate-180">
                <IconChevron />
              </span>
            </button>
            <span className="text-[13px] text-l1 tabular-nums">
              {page}/{pages}
            </span>
            <button
              type="button"
              disabled={page >= pages}
              onClick={() => setPage((p) => Math.min(pages, p + 1))}
              className={cn(
                "h-8 w-8 rounded-md grid place-items-center bg-white",
                page >= pages ? "text-[#B6BCC8]" : "text-l1",
              )}
              aria-label="Next page"
            >
              <IconChevron />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
