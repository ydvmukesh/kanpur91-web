"use client";

import { InnerShell } from "@/components/layout/InnerShell";
import { EmptyState } from "@/components/ui";
import { useTxns } from "@/hooks/queries/useTxns";
import { useStore } from "@/lib/store";
import { formatMoney } from "@/lib/format";
import { cn } from "@/lib/cn";

export default function DepositHistoryPage() {
  const { t } = useStore();
  const { data: list = [] } = useTxns("deposit");
  return (
    <InnerShell title={t("depositHistory")}>
      <div className="p-3 space-y-2">
        {list.length === 0 ? <EmptyState /> : null}
        {list.map((x) => (
          <div key={x.id} className="bg-white rounded-xl p-3 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold">{x.method}</p>
              <p className="text-[11px] text-faint">{x.createdAt}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-green-norm">+₹{formatMoney(x.amount)}</p>
              <p className={cn("text-[11px]", x.status === "completed" ? "text-green-norm" : "text-secondary")}>
                {t(x.status === "completed" ? "completed" : x.status === "pending" ? "toBePaid" : "rejected")}
              </p>
            </div>
          </div>
        ))}
      </div>
    </InnerShell>
  );
}
