"use client";

import { useMemo, useState } from "react";
import { InnerShell } from "@/components/layout/InnerShell";
import { DateSelect, EmptyState, FilterSelect } from "@/components/ui";
import { useI18n } from "@/hooks/useI18n";
import { cn } from "@/lib/cn";
import { formatMoney } from "@/lib/format";
import type { DictKey } from "@/lib/i18n";
import { TX_FILTERS, WALLET_MOVES } from "@/lib/transaction-history";

export default function TransActionPage() {
  const { t } = useI18n();
  const [scope, setScope] = useState("all");
  const [date, setDate] = useState("");

  const rows = useMemo(
    () =>
      WALLET_MOVES.filter((row) => {
        if (scope !== "all" && row.kind !== scope) return false;
        if (date && !row.time.startsWith(date)) return false;
        return true;
      }),
    [scope, date],
  );

  return (
    <InnerShell
      title={t("transactionHistory")}
      variant="light"
      headerExtra={
        <div className="bg-page px-3 pb-3 pt-2">
          <div className="grid grid-cols-2 gap-2">
            <FilterSelect
              value={scope}
              onChange={setScope}
              options={TX_FILTERS.map((item) => ({ id: item.id, label: t(item.labelKey) }))}
            />
            <DateSelect value={date} onChange={setDate} />
          </div>
        </div>
      }
    >
      <div className="space-y-3 px-3 pb-8">
        {rows.length === 0 ? <EmptyState /> : null}
        {rows.map((row) => {
          const labelKey = (TX_FILTERS.find((x) => x.id === row.kind)?.labelKey ?? "gameMovedOut") as DictKey;
          const out = row.kind === "gameMovedOut";
          const title = t(labelKey);
          return (
            <article key={row.id} className="overflow-hidden rounded-lg bg-white">
              <p className="bg-main-x px-3 py-2.5 text-15 font-semibold text-white">{title}</p>
              <div className="space-y-2 px-3 py-3">
                <Row k={t("detail")} v={title} />
                <Row k={t("timeLabel")} v={row.time} />
                <Row
                  k={t("balance")}
                  v={`₹${formatMoney(row.amount)}`}
                  valueClass={out ? "font-semibold !text-green-norm !text-base" : "font-semibold !text-main !text-base  "}
                />
                {/* <div className="h-12 rounded-lg bg-white ring-1 ring-line" /> */}
              </div>
            </article>
          );
        })}
      </div>
    </InnerShell>
  );
}

function Row({ k, v, valueClass }: { k: string; v: string; valueClass?: string }) {
  return (
    <div className="flex items-center justify-between rounded-md bg-bg-l3 px-3 py-2.5 text-13">
      <span className="text-muted">{k}</span>
      <span className={cn("text-muted ", valueClass)}>{v}</span>
    </div>
  );
}
