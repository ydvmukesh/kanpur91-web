"use client";

import Link from "next/link";
import { Gift, Play, TriangleAlert } from "lucide-react";
import { IconHeadset } from "@/components/Icons";
import { InnerShell } from "@/components/layout/InnerShell";
import { useI18n } from "@/hooks/useI18n";
import { IMG } from "@/lib/img";
import { JACKPOT_RULES_TABLE_HTML } from "@/lib/super-jackpot";

export default function SuperJackpotRulePage() {
  const { t } = useI18n();

  return (
    <InnerShell title={t("jackpotRule")} variant="light" className="bg-page">
      <div
        className="w-full"
        style={{
          background: "linear-gradient(180deg,#f55d4d,#f59571 33.39%,#f5a181 61.81%,#ef5334)",
        }}
      >
        <div
          className="min-h-[14.0625rem] w-full bg-contain bg-no-repeat px-4 py-5 text-white"
          style={{ backgroundImage: `url(${IMG.superJackpotRuleBg})` }}
        >
          <div className="max-w-[13rem]">
            <h3 className="mb-[0.3125rem] text-lg font-bold">{t("superJackpot")}</h3>
            <p className="text-xs font-normal ">{t("jackpotRuleIntro")}</p>
          </div>
          <div className="mt-[1.875rem] flex items-start rounded-lg bg-[#d45b3480] px-4 py-3">
            <TriangleAlert className="mt-0.5 h-4.5 w-4.5 shrink-0" />
            <p className="flex-1 pl-1.5 text-11 font-light">{t("jackpotRuleWarning")}</p>
          </div>
        </div>
      </div>

      <div className="px-3 pb-10 pt-4.5">
        <h2 className="mb-2.5 flex items-center gap-1 text-base font-bold text-ink">
          <Gift className="h-6 w-6 text-main" />
          {t("bonus")}
        </h2>

        <div
          className="overflow-hidden rounded-lg [&_table]:w-full [&_table]:border-collapse [&_table]:text-center [&_table]:text-xs [&_tbody_tr:nth-child(odd)]:bg-white [&_tbody_tr:nth-child(even)]:bg-bg-l1 [&_td]:h-[2.1875rem] [&_td:nth-child(1)]:text-secondary [&_td:nth-child(2)]:text-ink [&_td:nth-child(3)]:text-red-norm [&_th]:h-10 [&_th]:font-medium [&_thead]:bg-main [&_thead]:text-white [&_table]:table-fixed"
          dangerouslySetInnerHTML={{ __html: JACKPOT_RULES_TABLE_HTML }}
        />

        <div className="mt-2.5 mb-6 rounded-[0.625rem] bg-white px-3 py-5 text-xs font-medium text-muted flex items-start">
          <Play className="mr-2 inline h-4 w-4 shrink-0 fill-main text-main align-middle" />
          {t("jackpotRuleOwner")}
        </div>

        <Link
          href="/customer-service"
          className="flex h-10 items-center justify-center gap-1.5 rounded-full bg-main-x text-base font-bold text-white"
        >
          <IconHeadset />
          {t("contactCustomerService")}
        </Link>
      </div>
    </InnerShell>
  );
}
