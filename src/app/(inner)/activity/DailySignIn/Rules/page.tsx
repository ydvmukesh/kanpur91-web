"use client";

import { IconRuleHead } from "@/components/Icons";
import { InnerShell } from "@/components/layout/InnerShell";
import { HtmlContent } from "@/components/ui";
import { useI18n } from "@/hooks/useI18n";
import { SIGNIN_DAYS } from "@/lib/daily-signin";
import { formatMoney } from "@/lib/format";

export default function DailySignInRulesPage() {
  const { t } = useI18n();
  const rows = SIGNIN_DAYS.map(
    (row) =>
      `<tr><td>${row.day}</td><td>₹${formatMoney(row.need)}</td><td>₹${formatMoney(row.amount)}</td></tr>`,
  ).join("");
  const table = `<table><thead><tr><th>${t("continuousAttendance")}</th><th>${t("accumulatedAmount")}</th><th>${t("attendance")}</th></tr></thead><tbody>${rows}</tbody></table>`;
  const rules = `<ul><li>${t("signinRule1")}</li><li>${t("signinRule2")}</li><li>${t("signinRule3")}</li><li>${t("signinRule4")}</li><li>${t("signinRule5")}</li><li>${t("signinRule6")}</li></ul>`;

  return (
    <InnerShell title={t("gameRules")} variant="light">
      <div className="px-3 pb-10 pt-3">
        <div
          className="overflow-hidden rounded-lg [&_table]:w-full [&_table]:border-collapse [&_table]:text-center [&_table]:text-sm [&_tbody_tr:nth-child(even)]:bg-bg-l1 [&_tbody_tr:nth-child(odd)]:bg-white [&_td]:h-[2.75rem] [&_td]:text-ink [&_th]:h-[3.25rem] [&_th]:px-1 [&_th]:font-medium [&_th]:leading-tight [&_thead]:bg-main [&_thead]:text-white table-fixed"
          dangerouslySetInnerHTML={{ __html: table }}
        />

        <div className="mt-3 overflow-hidden rounded-lg bg-white px-3 pb-4">
          <div className="relative">
            <IconRuleHead className="mx-auto h-8 w-75 text-main" />
            <span className="absolute inset-0 grid place-items-center text-sm font-medium text-white">{t("rules")}</span>
          </div>
          <HtmlContent html={rules} className="pt-3" />
        </div>
      </div>
    </InnerShell>
  );
}
