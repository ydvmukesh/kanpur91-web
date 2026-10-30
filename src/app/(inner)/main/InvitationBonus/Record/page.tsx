"use client";

import { InnerShell } from "@/components/layout/InnerShell";
import { EmptyState } from "@/components/ui";
import { useI18n } from "@/hooks/useI18n";
import { formatMoney } from "@/lib/format";
import { INVITE_RECORDS } from "@/lib/invitation-record";

export default function InvitationBonusRecordPage() {
  const { t } = useI18n();
  const rows = INVITE_RECORDS;

  return (
    <InnerShell title={t("invitationRecord")} variant="light" className="bg-page">
      <div className="space-y-2.5 px-3 pb-8 pt-3">
        {rows.length === 0 ? <EmptyState /> : null}
        {rows.map((row) => (
          <article key={row.id} className="rounded-lg bg-white px-3 py-3">
            <div className="flex items-start justify-between gap-3">
              <p className="text-15 font-medium text-ink">{row.name}</p>
              <p className="shrink-0 text-15 text-muted">
                {t("uid")}:{row.uid}
              </p>
            </div>
            <div className="mt-3 flex items-center justify-between gap-3 text-13">
              <span className="text-muted">{t("registrationTime")}</span>
              <span className="text-faint">{row.registeredAt}</span>
            </div>
            <div className="mt-2 flex items-center justify-between gap-3 text-15">
              <span className="text-muted">{t("depositAmount")}</span>
              <span className="font-medium text-secondary">₹{formatMoney(row.deposit)}</span>
            </div>
          </article>
        ))}
        {rows.length > 0 ? <p className="pt-3 text-center text-sm text-ink">{t("noMore")}</p> : null}
      </div>
    </InnerShell>
  );
}
