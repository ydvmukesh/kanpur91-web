"use client";

import { useState } from "react";
import { InnerShell } from "@/components/layout/InnerShell";
import { useI18n } from "@/hooks/useI18n";
import { cn } from "@/lib/cn";
import { formatMoney } from "@/lib/format";
import { GAME_STATS_CATS, STATS_PERIODS, type StatsPeriod } from "@/lib/game-stats";
import { IMG, TabMaskIcon } from "@/lib/img";

export default function GameStatsPage() {
  const { t } = useI18n();
  const [period, setPeriod] = useState<StatsPeriod>("today");
  const zero = formatMoney(0);

  return (
    <InnerShell title={t("gameStatistics")} variant="light">
      <div className="px-3 pb-8 pt-3">
        <div className="phone-scroll flex gap-1 overflow-x-auto">
          {STATS_PERIODS.map((item) => {
            const on = period === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setPeriod(item.id)}
                className={cn(
                  "h-8 shrink-0 rounded-full px-4 text-13 font-medium",
                  on ? "bg-main-x text-white" : "bg-white text-muted",
                )}
              >
                {t(item.labelKey)}
              </button>
            );
          })}
        </div>

        <div className="mt-3 rounded-lg bg-white py-7 text-center">
          <p className="text-lg font-semibold text-secondary">₹{zero}</p>
          <p className="mt-2 text-sm text-muted">{t("totalBet")}</p>
        </div>

        <div className="mt-2.5 rounded-lg bg-white px-3 py-3">
          {GAME_STATS_CATS.map((cat) => (
            <section key={cat.id} className="py-2.5 first:pt-0 last:pb-0">
              <div className="flex items-center gap-2">
                <TabMaskIcon src={cat.icon} active className="!size-7" />
                <p className="text-base font-bold text-ink">{t(cat.labelKey)}</p>
              </div>
              <div className="mt-3 ml-1 flex items-center gap-2">
                <TabMaskIcon src={IMG.statsSteps} active className="h-20 w-4 shrink-0" />
                <div className="flex min-h-20 min-w-0 flex-1 flex-col justify-between py-0.5">
                  {(
                    [
                      { label: t("totalBet"), value: `₹${zero}`, tone: "ink" as const },
                      { label: t("numberOfBets"), value: "0", tone: "ink" as const },
                      { label: t("winningAmount"), value: `₹${zero}`, tone: "main" as const },
                    ] as const
                  ).map((row) => (
                    <div key={row.label} className="flex items-center justify-between text-sm">
                      <span className="text-muted">{row.label}</span>
                      <span className={row.tone === "main" ? "font-medium text-main" : "text-ink"}>
                        {row.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          ))}
        </div>
      </div>
    </InnerShell>
  );
}
