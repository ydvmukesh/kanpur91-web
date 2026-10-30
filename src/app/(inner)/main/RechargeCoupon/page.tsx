"use client";

import { useMemo, useState } from "react";
import { InnerShell } from "@/components/layout/InnerShell";
import { EmptyState } from "@/components/ui";
import { useI18n } from "@/hooks/useI18n";
import { cn } from "@/lib/cn";
import { RECHARGE_COUPONS, type CouponTab } from "@/lib/recharge-coupon";
import { CouponCard } from "./CouponCard";

export default function RechargeCouponPage() {
  const { t } = useI18n();
  const [tab, setTab] = useState<CouponTab>("unused");
  const tabs: { id: CouponTab; label: string }[] = [
    { id: "unused", label: t("unused") },
    { id: "used", label: t("used") },
    { id: "expired", label: t("expired") },
  ];
  const rows = useMemo(() => RECHARGE_COUPONS.filter((row) => row.tab === tab), [tab]);

  return (
    <InnerShell
      title={t("myTopUpCoupons")}
      variant="light"
      headerExtra={
        <div className="relative grid grid-cols-3 bg-main">
          {tabs.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={cn(
                "relative h-11 text-sm font-medium",
                tab === item.id ? "text-white" : "text-white/70",
              )}
            >
              {item.label}
            </button>
          ))}
          <span
            className="pointer-events-none absolute bottom-0 h-0 w-0 border-x-[0.4375rem] border-b-[0.5rem] border-x-transparent border-b-white transition-[left] duration-200"
            style={{ left: `calc(${(tabs.findIndex((x) => x.id === tab) + 0.5) * (100 / 3)}% - 0.4375rem)` }}
          />
        </div>
      }
    >
      <div className="space-y-2.5 px-3 pb-8 pt-3">
        {rows.length === 0 ? <EmptyState /> : null}
        {rows.map((row) => (
          <CouponCard key={row.id} row={row} />
        ))}
        {rows.length > 0 ? <p className="pt-1 text-center text-sm text-ink">{t("noMore")}</p> : null}
      </div>
    </InnerShell>
  );
}
