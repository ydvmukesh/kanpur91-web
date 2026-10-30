"use client";

import Link from "next/link";
import { CircleAlert } from "lucide-react";
import { IconRuleHead } from "@/components/Icons";
import { InnerShell } from "@/components/layout/InnerShell";
import { useI18n } from "@/hooks/useI18n";
import { formatMoney } from "@/lib/format";
import { IMG } from "@/lib/img";
import { MEMBER_PACKAGE } from "@/lib/member-package";

export default function MemberPackagePage() {
  const { t } = useI18n();
  const { startTime, compensationPct, bonusLimit } = MEMBER_PACKAGE;
  const [compBefore, compAfter] = t("firstDepositComp", { pct: "\0" }).split("\0");

  return (
    <InnerShell title={t("activityDetails")} variant="light" className="bg-page">
      <div
        className="mb-2.5 flex min-h-[9.0625rem] items-center py-[0.8125rem]"
        style={{
          backgroundImage: `url(${IMG.memberPackageBg}), linear-gradient(103deg, #faac48 4.77%, #f7602b 96.1%)`,
          backgroundSize: "100% 11.0625rem",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="w-full pl-[1.0625rem] pr-3 text-white">
          <h3 className="mb-4 text-[1.125rem] font-bold leading-[1.125rem]">{t("firstGift")}</h3>
          <h4 className="mb-3 text-13 font-medium leading-tight">{t("newMemberTip")}:</h4>
          <p className="mb-1.5 flex items-start text-11 leading-4">
            <span className="mr-1.5 grid h-3.5 w-3.5 shrink-0 place-items-center rounded-full bg-white text-11 font-medium text-secondary">
              1
            </span>
            {t("newMemberRule1")}
          </p>
          <p className="mb-1.5 flex items-start text-11 leading-4">
            <span className="mr-1.5 grid h-3.5 w-3.5 shrink-0 place-items-center rounded-full bg-white text-11 font-medium text-secondary">
              2
            </span>
            {t("newMemberRule2")}
          </p>
          <Link
            href="/activity/MemberPackage/Rules"
            className="mt-1 inline-flex h-[1.5625rem] min-w-[6rem] max-w-[10rem] items-center justify-center rounded-[1.25rem] border border-white px-1.5 text-xs text-white"
          >
            {t("activityDetails")}
          </Link>
        </div>
      </div>

      <div className="relative mx-3 overflow-hidden rounded-[0.625rem] bg-white pb-4 pt-8">
        <div className="absolute top-0 left-1/2 w-[12.5rem] -translate-x-1/2">
          <IconRuleHead className="h-8 w-full text-main" />
          <span className="absolute inset-0 grid place-items-center text-sm font-medium text-white">
            {t("eventStartTime")}
          </span>
        </div>
        <p className="pt-1 text-center text-base font-bold text-red-norm">{startTime}</p>
      </div>

      <div className="mx-3 mt-2.5 overflow-hidden rounded-[0.625rem] bg-white">
        <div className="grid grid-cols-[6.25rem_1fr_6.25rem] bg-main text-center text-sm leading-4 text-white">
          <div className="px-1 py-3.5">{t("conditionsOfParticipation")}</div>
          <div className="px-1 py-3.5">{t("getCompensationBonus")}</div>
          <div className="px-1 py-3.5">{t("bonusLimit")}</div>
        </div>
        <div className="grid grid-cols-[6.25rem_1fr_6.25rem] text-center text-sm text-ink">
          <div className="flex min-h-[3.75rem] items-center justify-center border-r border-line px-1 py-2.5">
            {t("firstDepositNewUsers")}
          </div>
          <div className="flex min-h-[3.75rem] items-center justify-center border-r border-line px-1 py-2.5">
            <p>
              {compBefore}
              <span className="text-red-norm">{compensationPct}%</span>
              {compAfter}
            </p>
          </div>
          <div className="flex min-h-[3.75rem] items-center justify-center px-1 py-2.5 text-red-norm">
            ₹{formatMoney(bonusLimit)}
          </div>
        </div>
      </div>

      <div className="mx-2.5 mt-2.5 flex items-start gap-1 rounded-[1.5625rem] bg-white px-2.5 py-2.5 text-xs font-medium leading-5 text-red-norm">
        <CircleAlert className="mt-0.5 h-4.5 w-4.5 shrink-0" />
        {t("autoDistributeBonuses")}
      </div>
    </InnerShell>
  );
}
