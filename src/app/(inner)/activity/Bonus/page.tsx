"use client";

import { useMemo, useState } from "react";
import { BonusCard } from "@/components/activity/BonusCard";
import { InnerShell } from "@/components/layout/InnerShell";
import { EmptyState, FilterDateRow, TabContent, UnderlineTabs } from "@/components/ui";
import { useI18n } from "@/hooks/useI18n";
import { BONUS_FILTERS, BONUS_ROWS, type BonusRow, type BonusStatus } from "@/lib/activity";

function BonusList({ rows }: { rows: BonusRow[] }) {
  const { t } = useI18n();
  if (rows.length === 0) return <EmptyState />;
  return (
    <>
      {rows.map((row) => (
        <BonusCard key={row.id} row={row} />
      ))}
      <p className="pt-4 text-center text-sm text-ink">{t("noMore")}</p>
    </>
  );
}

export default function BonusPage() {
  const { t } = useI18n();
  const [tab, setTab] = useState<BonusStatus>("collect");
  const [filter, setFilter] = useState("all");
  const [date, setDate] = useState("");

  const filterOptions = BONUS_FILTERS.map((id) => ({ id, label: t(id) }));
  const visible = useMemo(
    () =>
      BONUS_ROWS.filter((row) => {
        if (filter !== "all" && row.type !== filter) return false;
        if (date && !row.time.startsWith(date)) return false;
        return true;
      }),
    [filter, date],
  );

  return (
    <InnerShell
      title={t("bonusDetails")}
      variant="light"
      headerExtra={
        <div className="px-3 pb-0 pt-4">
          <FilterDateRow value={filter} onChange={setFilter} options={filterOptions} date={date} onDateChange={setDate} />
          <UnderlineTabs
            className="mt-3"
            variant="line"
            value={tab}
            onChange={setTab}
            items={[
              { id: "collect", label: t("toBeCollected") },
              { id: "received", label: t("received") },
              { id: "expired", label: t("expired") },
            ]}
          />
        </div>
      }
    >
      <div className="px-3 pb-8 pt-3">
        <TabContent value={tab} when="collect">
          <BonusList rows={visible.filter((row) => row.status === "collect")} />
        </TabContent>
        <TabContent value={tab} when="received">
          <BonusList rows={visible.filter((row) => row.status === "received")} />
        </TabContent>
        <TabContent value={tab} when="expired">
          <BonusList rows={visible.filter((row) => row.status === "expired")} />
        </TabContent>
      </div>
    </InnerShell>
  );
}
