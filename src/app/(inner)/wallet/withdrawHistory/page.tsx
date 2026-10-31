"use client";

import { useMemo, useState } from "react";
import { LayoutGrid } from "lucide-react";
import { InnerShell } from "@/components/layout/InnerShell";
import { EmptyState, FilterDateRow, padLooseDate } from "@/components/ui";
import { useTxns } from "@/hooks/queries/useTxns";
import { useI18n } from "@/hooks/useI18n";
import { IMG, ImgIcon } from "@/lib/img";
import { cn } from "@/lib/cn";
import { copyText } from "@/lib/format";
import { useStore } from "@/lib/store";
import { WithdrawTxnCard } from "./WithdrawTxnCard";

type Tab = "all" | "arpay" | "bank" | "usdt";

function matchesTab(method: string, tab: Tab) {
  const m = method.toLowerCase();
  if (tab === "all") return true;
  if (tab === "arpay") return m.includes("arpay") || m.includes("arb");
  if (tab === "bank") return m.includes("bank");
  return m.includes("usdt");
}

export default function WithdrawHistoryPage() {
  const { t } = useI18n();
  const { showToast } = useStore();
  const { data: list = [] } = useTxns("withdraw");
  const [tab, setTab] = useState<Tab>("all");
  const [status, setStatus] = useState("all");
  const [date, setDate] = useState("");

  const statusOptions = [
    { id: "all", label: t("all") },
    { id: "pending", label: t("pending") },
    { id: "completed", label: t("completed") },
    { id: "rejected", label: t("rejected") },
    { id: "processing", label: t("processing") },
  ];

  const filtered = useMemo(() => {
    return list.filter((row) => {
      if (!matchesTab(row.method, tab)) return false;
      if (status !== "all" && row.status !== status) return false;
      if (date) {
        const [fromRaw, toRaw] = date.split("/");
        const from = padLooseDate(fromRaw ?? date).slice(0, 10);
        const to = padLooseDate(toRaw ?? fromRaw ?? date).slice(0, 10);
        const day = row.createdAt.slice(0, 10);
        if (day < from || day > to) return false;
      }
      return true;
    });
  }, [list, tab, status, date]);

  const tabs = [
    { id: "all" as const, label: t("all"), src: null, srcActive: null },
    { id: "arpay" as const, label: t("arpayTitle"), src: IMG.withdrawArb, srcActive: IMG.withdrawArb },
    { id: "bank" as const, label: t("bankCard"), src: IMG.withdrawBank, srcActive: IMG.withdrawBankActive },
    { id: "usdt" as const, label: t("usdt"), src: IMG.withdrawUsdt, srcActive: IMG.withdrawUsdt },
  ];

  return (
    <InnerShell
      title={t("withdrawHistory")}
      variant="light"
      className="bg-page"
      headerExtra={
        <div className="bg-page px-3.5 pb-3 pt-4">
          <div className="phone-scroll flex gap-1 overflow-x-auto">
            {tabs.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={cn(
                  "flex h-10 min-w-25 shrink-0 items-center justify-center gap-1.5 rounded-md px-4 text-xs font-semibold uppercase",
                  tab === item.id ? "bg-main-x text-white" : "bg-white text-muted",
                )}
              >
                {item.src ? (
                  <ImgIcon src={tab === item.id ? item.srcActive! : item.src} alt="" className="h-5 w-5 object-contain" />
                ) : (
                  <LayoutGrid className="h-5 w-5" />
                )}
                {item.label}
              </button>
            ))}
          </div>
          <FilterDateRow
            className="mt-3"
            range
            value={status}
            onChange={setStatus}
            options={statusOptions}
            date={date}
            onDateChange={setDate}
          />
        </div>
      }
    >
      <div className="mx-3.5 space-y-2.5 pb-8">
        {filtered.length === 0 ? <EmptyState /> : null}
        {filtered.map((row) => (
          <WithdrawTxnCard
            key={row.id}
            x={row}
            onCopy={() => {
              void copyText(row.id);
              showToast(t("copied"), "copy");
            }}
          />
        ))}
        {filtered.length > 0 ? <p className="pt-3 text-center text-sm text-ink">{t("noMore")}</p> : null}
      </div>
    </InnerShell>
  );
}
