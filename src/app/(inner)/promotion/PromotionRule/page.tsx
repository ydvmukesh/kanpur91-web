"use client";

import Link from "next/link";
import { IconRuleHead } from "@/components/Icons";
import { InnerShell } from "@/components/layout/InnerShell";
import { HtmlContent } from "@/components/ui";
import { useI18n } from "@/hooks/useI18n";
import { pad2 } from "@/lib/format";
import { IMG, ImgIcon } from "@/lib/img";
import { PROMOTION_REBATE_LEVELS, PROMOTION_RULES_HTML } from "@/lib/promotion-rule";

export default function PromotionRulePage() {
  const { t } = useI18n();

  return (
    <InnerShell title={t("rules")} variant="light">
      <div className="px-3 pb-10 pt-3">
        <h2 className="text-center text-base font-medium text-main">{t("promotionPartnerProgram")}</h2>
        <p className="mt-1 mb-7 text-center text-sm text-muted">{t("promotionValidLong")}</p>

        <div className="mt-3 space-y-3">
          {PROMOTION_RULES_HTML.map((html, i) => (
            <article key={i} className="overflow-hidden rounded-lg bg-white">
              <div className="relative">
                <IconRuleHead className="mx-auto h-8 w-full max-w-70 text-main" />
                <span className="absolute inset-0 grid place-items-center text-sm font-medium text-white">{pad2(i + 1)}</span>
              </div>
              <HtmlContent
                html={html}
                className="px-4 py-4 [&_p]:mt-0 [&_p+p]:mt-1 [&_p]:pl-0 [&_p]:text-sm [&_p]:leading-relaxed [&_p]:text-muted [&_p]:before:content-none"
              />
              {i === 5 ? (
                <Link href="/promotion/RebateRatio" className="block px-4 pb-4 text-sm text-main">
                  {t("viewRebateRatio")}
                </Link>
              ) : null}
            </article>
          ))}
        </div>
        <div id="rebate-ratio" className="mt-3 overflow-hidden rounded-lg">
          <table className="w-full border-collapse text-center text-13">
            <thead className="bg-main text-white">
              <tr>
                <th className="h-[2.75rem] px-1 font-medium leading-tight">{t("rebateLevel")}</th>
                <th className="h-[2.75rem] px-1 font-medium leading-tight">{t("teamNumber")}</th>
                <th className="h-[2.75rem] px-1 font-medium leading-tight">{t("teamBetting")}</th>
                <th className="h-[2.75rem] px-1 font-medium leading-tight">{t("teamDeposit")}</th>
              </tr>
            </thead>
            <tbody>
              {PROMOTION_REBATE_LEVELS.map((row, i) => (
                <tr key={row.lv} className={i % 2 ? "bg-bg-l1" : "bg-white"}>
                  <td className="h-[2.75rem] text-ink">
                    <span className="relative inline-block h-[1.875rem]">
                      <ImgIcon src={IMG.promotionLv} className="block h-[1.7rem] w-auto" />
                      <span className="promo-lv-tag absolute right-0 bottom-0 block h-[1.15rem] w-[1.625rem] bg-clip-text bg-[linear-gradient(180deg,#fffba9,#fff670_56.13%,#ffd180)] text-center text-[0.625rem] font-bold leading-4 text-transparent">
                        L{row.lv}
                      </span>
                    </span>
                  </td>
                  <td className="h-[2.75rem] text-ink">{row.team}</td>
                  <td className="h-[2.75rem] text-ink">{row.bet}</td>
                  <td className="h-[2.75rem] text-ink">{row.deposit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </InnerShell>
  );
}
