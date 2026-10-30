"use client";

import { InnerShell } from "@/components/layout/InnerShell";
import { EmptyState } from "@/components/ui";
import { useI18n } from "@/hooks/useI18n";
import { formatMoney } from "@/lib/format";
import { SIGNIN_RECORDS } from "@/lib/daily-signin";

export default function DailySignInRecordPage() {
  const { t } = useI18n();
  const rows = SIGNIN_RECORDS;

  return (
    <InnerShell title={t("attendanceHistory")} variant="light">
      {rows.length === 0 ? <EmptyState /> : null}
      <div className="space-y-2.5 px-3 pb-8">
        {rows.map((row) => (
          <article key={row.id} className="rounded-lg bg-white px-3 py-3">
            <p className="text-sm font-medium text-secondary">₹{formatMoney(row.amount)}</p>
            <p className="mt-1 text-11 text-faint">{row.time}</p>
          </article>
        ))}
        {rows.length > 0 ? <p className="pt-3 text-center text-sm text-ink">{t("noMore")}</p> : null}
      </div>
    </InnerShell>
  );
}
