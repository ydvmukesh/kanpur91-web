"use client";

import { IconRuleHead } from "@/components/Icons";
import { InnerShell } from "@/components/layout/InnerShell";
import { HtmlContent } from "@/components/ui";
import { useI18n } from "@/hooks/useI18n";
import { INVITE_RULES_HTML, INVITE_RULES_TABLE_HTML } from "@/lib/invitation-rules";

export default function InvitationBonusRulePage() {
  const { t } = useI18n();

  return (
    <InnerShell title={t("invitationRewardRules")} variant="light" className="bg-page">
      <div className="px-3 pb-10 pt-3">
        <p className="text-sm leading-relaxed text-muted">{t("inviteFriendsRechargePlatform")}</p>
        <p className="mt-3 text-sm leading-relaxed text-muted">{t("claimedWalletTenMinutes")}</p>

        <div
          className="mt-4 overflow-hidden rounded-lg [&_table]:w-full [&_table]:border-collapse [&_table]:text-center [&_table]:text-sm [&_tbody_tr:nth-child(even)]:bg-[#e9e9e9] [&_tbody_tr:nth-child(odd)]:bg-white [&_td]:py-3.5 [&_td]:text-ink [&_th]:py-3 [&_th]:font-medium [&_thead]:bg-main [&_thead]:text-white"
          dangerouslySetInnerHTML={{ __html: INVITE_RULES_TABLE_HTML }}
        />

        <div className="mt-4 overflow-hidden rounded-lg bg-white pb-4 px-3">
          <div className="relative">
            <IconRuleHead />
            <span className="absolute inset-0 grid place-items-center text-sm font-medium text-white">{t("rules")}</span>
          </div>
          <HtmlContent html={INVITE_RULES_HTML} className="pt-3" />
        </div>
      </div>
    </InnerShell>
  );
}
