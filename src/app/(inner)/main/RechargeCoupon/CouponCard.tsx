"use client";

import { useI18n } from "@/hooks/useI18n";
import { formatMoney } from "@/lib/format";
import type { RechargeCoupon } from "@/lib/recharge-coupon";

export function CouponCard({ row }: { row: RechargeCoupon }) {
  const { t } = useI18n();
  return (
    <article className="relative flex h-[7.9375rem] rounded-lg bg-white">
      <span className="pointer-events-none absolute top-1/2 left-0 z-10 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-page" />
      <span className="pointer-events-none absolute top-1/2 left-[6.75rem] z-10 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-bg-l1" />
      <div className="relative flex h-full w-[6.75rem] shrink-0 flex-col items-center justify-center rounded-l-lg bg-faint px-1 text-white">
        <p className="text-[1.75rem] font-bold leading-none">{row.percent}%</p>
        <p className="mt-1.5 text-center text-11 leading-snug text-white/90">
          {t("upToAmount", { n: formatMoney(row.cap) })}
        </p>
      </div>
      <div className="relative flex h-full min-w-0 flex-1 flex-col justify-center rounded-r-lg bg-bg-l1 px-3 py-2.5">
        <p className="text-sm font-bold leading-tight text-ink">{t("myTopUpCoupons")}</p>
        <p className="mt-1 text-xs leading-snug text-faint">{t("couponCode", { c: row.code })}</p>
        <p className="mt-0.5 text-11 leading-snug text-muted">{t("channelsOnly", { n: row.channels })}</p>
        <p className="mt-0.5 text-11 leading-snug text-muted">{t("validUntil", { d: row.validUntil })}</p>
        <span className="mt-1.5 inline-flex h-6 w-fit items-center rounded-md bg-faint px-4 text-11 font-medium text-white">
          {t(row.tab)}
        </span>
      </div>
    </article>
  );
}
