"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { InnerShell } from "@/components/layout/InnerShell";
import { EmptyState } from "@/components/ui";
import { dummyWinGoBets, WinGoBetRows } from "@/components/games/WinGoBetHistory";
import { IconChevron } from "@/components/Icons";
import { cn } from "@/lib/cn";
import { useBets } from "@/hooks/queries/useBets";
import { useStore } from "@/lib/store";
import { WINGO_INTERVALS, type WinGoInterval } from "@/lib/wingo";

const PAGE = 10;

function asInterval(raw: string | null): WinGoInterval {
  const n = Number(raw);
  return (WINGO_INTERVALS.find((x) => x.key === n)?.key ?? 30) as WinGoInterval;
}

export function WinGoHistoryDetail({ trx }: { trx?: boolean }) {
  const { t } = useStore();
  const { data: bets = [] } = useBets(trx ? "trx" : "wingo");
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
    <InnerShell title={trx ? t("trxWin") : t("winGo")} className="bg-[#F6F6F6]">
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
                "relative flex-1 h-11 text-sm font-medium",
                on ? "text-ink" : "text-muted",
              )}
            >
              {trx ? "TrxWin" : x.name} {x.sub}
              {on ? <i className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[3px] w-10 rounded-full bg-main" /> : null}
            </button>
          );
        })}
      </div>

      {rows.length === 0 ? (
        <EmptyState className="pt-16" />
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
                page <= 1 ? "text-[#B6BCC8]" : "text-ink",
              )}
              aria-label="Previous page"
            >
              <span className="rotate-180">
                <IconChevron />
              </span>
            </button>
            <span className="text-13 text-ink tabular-nums">
              {page}/{pages}
            </span>
            <button
              type="button"
              disabled={page >= pages}
              onClick={() => setPage((p) => Math.min(pages, p + 1))}
              className={cn(
                "h-8 w-8 rounded-md grid place-items-center bg-white",
                page >= pages ? "text-[#B6BCC8]" : "text-ink",
              )}
              aria-label="Next page"
            >
              <IconChevron />
            </button>
          </div>
        </>
      )}
    </InnerShell>
  );
}
