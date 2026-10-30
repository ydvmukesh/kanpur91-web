"use client";

import { useState } from "react";
import { Volleyball } from "lucide-react";
import { IconLaundryTab, IconRound } from "@/components/Icons";
import { InnerShell } from "@/components/layout/InnerShell";
import { ScrollTabs } from "@/components/ui";
import { useI18n } from "@/hooks/useI18n";
import { REBATE_RATIO_LEVELS, REBATE_RATIO_RATES, type RebateRatioTab } from "@/lib/rebate-ratio";

export default function RebateRatioPage() {
  const { t } = useI18n();
  const [tab, setTab] = useState<RebateRatioTab>("lottery");

  return (
    <InnerShell
      title={t("rebateRatio")}
      variant="light"
      headerExtra={
        <div className="bg-page px-3 pt-3">
          <ScrollTabs
            value={tab}
            onChange={setTab}
            items={[
              { id: "lottery", label: t("lottery"), icon: <IconLaundryTab name="lottery" /> },
              { id: "casino", label: t("casino"), icon: <IconLaundryTab name="video" /> },
              { id: "sports", label: t("sports"), icon: <Volleyball className="h-6 w-6 shrink-0" /> },
              { id: "rummy", label: t("rummy"), icon: <IconLaundryTab name="chess" /> },
            ]}
          />
        </div>
      }
    >
      <div className="space-y-2.5 px-3 pb-8 pt-3">
        {REBATE_RATIO_LEVELS.map((lv) => (
          <article key={`${tab}-${lv}`} className="rounded-lg bg-white px-3 py-3">
            <p className="text-15 font-medium text-ink flex items-center gap-1">
              {t("rebateLevel")} <span className="italic font-semibold text-main text-22">L{lv}</span>
            </p>
            <ul className="mt-2">
              {REBATE_RATIO_RATES[lv].map((pct, i) => {
                const last = i === REBATE_RATIO_RATES[lv].length - 1;
                return (
                  <li key={i} className="relative flex items-center justify-between py-1.25 pl-6 text-13">
                    <span className="absolute left-0 top-1/2 z-10 grid h-3.5 w-3.5 min-w-3.5 min-h-3.5 max-w-3.5 max-h bg-white-3.5 shrink-0 -translate-y-1/2 place-items-center rounded-full border-2 border-main bg-white">
                      <span className="h-1.5 w-1.5 min-h-1.5 min-w-1.5 max-h-1.5 max-w-1.5 rounded-full bg-main shrink-0" />
                    </span>
                    {last ? null : (
                      <span className="absolute left-[0.4rem] top-1/2 h-full border-l border-dashed border-main min-h-full min-w-full image.pngshrink-0" />
                    )}
                    <span className="text-muted">{t("nLevelLowerCommission", { n: String(i + 1) })}</span>
                    <span className="shrink-0 text-ink">{pct}</span>
                  </li>
                );
              })}
            </ul>
          </article>
        ))}
      </div>
    </InnerShell>
  );
}
