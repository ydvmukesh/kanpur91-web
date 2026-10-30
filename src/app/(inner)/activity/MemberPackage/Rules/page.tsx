"use client";

import { InnerShell } from "@/components/layout/InnerShell";
import { useI18n } from "@/hooks/useI18n";
import { formatMoney } from "@/lib/format";
import { MEMBER_PACKAGE } from "@/lib/member-package";

export default function MemberPackageRulesPage() {
  const { t } = useI18n();
  const { startTime, compensationPct, bonusLimit, negativeHours } = MEMBER_PACKAGE;
  const [platBefore, platAfter] = t("platformReturnsBonus", { pct: "\0" }).split("\0");

  return (
    <InnerShell title={t("eventDetails")} variant="light" className="bg-page">
      <div className="px-3 pb-10 pt-3">
        <div className="rounded-[0.625rem] bg-white p-2.5">
          <h2 className="mb-1.5 text-center text-15 font-medium leading-6 text-red-norm">
            {t("newMemberRule1")}
          </h2>
          <p className="text-11 leading-relaxed text-muted">
            {t("eventStartTime")} {startTime}, {t("firstDepositNewUsers")}{" "}
            <span className="text-red-norm">{negativeHours}</span> {t("negativeHourlyProfit")}{" "}
            {platBefore}
            <span className="text-red-norm">{compensationPct}%</span>
            {platAfter}, {t("bonusLimit")}{" "}
            <span className="text-red-norm">₹{formatMoney(bonusLimit)}</span>, {t("autoDistributeBonuses")}.
          </p>
        </div>

        <h2 className="mt-[1.171875rem] text-center text-15 font-medium leading-6 text-red-norm">
          {t("newMembersPlayBonus")}
        </h2>
      </div>
    </InnerShell>
  );
}
