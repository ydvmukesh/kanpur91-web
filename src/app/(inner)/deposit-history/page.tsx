"use client";

import { InnerHeader } from "@/components/Ui";
import { useStore } from "@/lib/store";
import { formatMoney } from "@/lib/format";
import { cn } from "@/lib/cn";

export default function DepositHistoryPage() {
  const { t, txns } = useStore();
  const list = txns.filter((x) => x.type === "deposit");
  return (
    <div className="min-h-dvh bg-bg-l1">
      <InnerHeader title={t("depositHistory")} />
      <div className="p-3 space-y-2">
        {list.length === 0 ? <p className="text-center text-l3 py-16">{t("noData")}</p> : null}
        {list.map((x) => (
          <div key={x.id} className="bg-white rounded-xl p-3 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold">{x.method}</p>
              <p className="text-[11px] text-l3">{x.createdAt}</p>
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
    </div>
  );
}
