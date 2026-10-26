"use client";

import { useMemo, useState } from "react";
import { IconLaundryTab } from "@/components/Icons";
import { InnerShell } from "@/components/layout/InnerShell";
import { EmptyState, ScrollTabs } from "@/components/ui";
import { useI18n } from "@/hooks/useI18n";
import { formatMoney } from "@/lib/format";
import { LAUNDRY_RECORDS, LAUNDRY_TABS, type LaundryTabId } from "@/lib/laundry";

export default function LaundryRecordPage() {
  const { t } = useI18n();
  const [tab, setTab] = useState<LaundryTabId>(LAUNDRY_TABS[0].id);
  const rows = useMemo(
    () => LAUNDRY_RECORDS.filter((row) => tab === "all" || row.tab === tab),
    [tab],
  );

  return (
    <InnerShell title={t("rebateHistory")} variant="light" className="bg-page">
      <div className="px-3 pb-8 pt-3">
        <ScrollTabs
          value={tab}
          onChange={setTab}
          items={LAUNDRY_TABS.map((item) => ({
            id: item.id,
            label: t(item.label),
            icon: <IconLaundryTab name={item.icon} />,
          }))}
        />
        {rows.length === 0 ? <EmptyState /> : null}
        {rows.map((row) => (
          <article key={row.id} className="mt-2.5 rounded-xl bg-white px-3 py-3">
            <p className="text-sm font-medium text-secondary">₹{formatMoney(row.amount)}</p>
            <p className="mt-1 text-11 text-faint">{row.time}</p>
          </article>
        ))}
        {rows.length > 0 ? <p className="pt-3 text-center text-sm text-ink">{t("noMore")}</p> : null}
      </div>
    </InnerShell>
  );
}
