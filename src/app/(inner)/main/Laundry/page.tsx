"use client";

import { useState } from "react";
import {  ShieldCheck, Wallet } from "lucide-react";
import { IconLaundryTab } from "@/components/Icons";
import { InnerShell } from "@/components/layout/InnerShell";
import { Button, ScrollTabs } from "@/components/ui";
import { useI18n } from "@/hooks/useI18n";
import { formatMoney } from "@/lib/format";
import { LAUNDRY_TABS, LAUNDRY_TODAY, LAUNDRY_TOTAL, type LaundryTabId } from "@/lib/laundry";

export default function LaundryPage() {
  const { t } = useI18n();
  const [tab, setTab] = useState<LaundryTabId>(LAUNDRY_TABS[0].id);
  const current = LAUNDRY_TABS.find((item) => item.id === tab) ?? LAUNDRY_TABS[0];

  return (
    <InnerShell title={t("rebate")} variant="light" className="bg-page">
      <div className="px-3 pb-10 pt-3">
        <ScrollTabs
          value={tab}
          onChange={setTab}
          items={LAUNDRY_TABS.map((item) => ({
            id: item.id,
            label: t(item.label),
            icon: <IconLaundryTab name={item.icon} />,
          }))}
        />

        <div className="mt-3 rounded-xl bg-white px-3 py-3">
          <p className="text-sm font-medium text-ink">{t("totalBettingRebate", { cat: t(current.label) })}</p>
          <div className="mt-2 inline-flex items-center gap-1 rounded-md border border-main px-2 py-0.5 text-11 text-main">
            <ShieldCheck className="h-4.5 w-4.5 fill-main text-white" />
            {t("realTimeCount")}
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-lg font-semibold text-ink">
            <Wallet className="h-5 w-5 text-main" />
            {formatMoney(current.pending)}
          </div>
          <p className="mt-3 rounded-md bg-bg-l3 px-3 py-2.5 text-13 text-muted">{t("upgradeVipRebate")}</p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <div className="rounded-md bg-bg-l3 px-3 py-2.5">
              <p className="text-13 text-muted">{t("todayRebate")}</p>
              <p className="mt-1 text-base font-semibold text-main">{LAUNDRY_TODAY} %</p>
            </div>
            <div className="rounded-md bg-bg-l3 px-3 py-2.5">
              <p className="text-13 text-muted">{t("totalRebate")}</p>
              <p className="mt-1 text-sm font-semibold text-secondary">{LAUNDRY_TOTAL}</p>
            </div>
          </div>
          <p className="mt-3 text-11 leading-snug text-faint">{t("autoCodeWashing")}</p>
          <Button className="mt-3" size="sm" disabled>
            {t("oneClickRebate")}
          </Button>
        </div>

        <h2 className="mt-4 flex items-center gap-1.5 text-lg font-semibold text-ink">
          <span className="h-4 w-1 rounded-sm bg-main" />
          {t("rebateHistory")}
        </h2>
        <Button variant="outline" size="sm" className="mt-3 font-medium" href="/main/Laundry/LaundryRecord">
          {t("allHistory")}
        </Button>
      </div>
    </InnerShell>
  );
}
