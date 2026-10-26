"use client";

import { Copy } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";
import { cn } from "@/lib/cn";
import { formatMoney } from "@/lib/format";
import type { Txn } from "@/lib/api/models";

function statusKey(status: Txn["status"]) {
  if (status === "pending") return "toBePaid" as const;
  if (status === "completed") return "completed" as const;
  return "rejected" as const;
}

export function WithdrawTxnCard({ x, onCopy }: { x: Txn; onCopy: () => void }) {
  const { t } = useI18n();
  const tone =
    x.status === "completed" ? "text-green-norm" : x.status === "rejected" ? "text-main" : "text-secondary";

  return (
    <div className="rounded-xl bg-white px-3 py-3.5">
      <div className="flex items-center justify-between border-b border-line pb-2">
        <span className="grid h-7 place-items-center rounded-md bg-main px-3 text-13 font-medium text-white">
          {t("withdrawal")}
        </span>
        <span className={cn("text-sm font-bold", tone)}>{t(statusKey(x.status))}</span>
      </div>
      <Row k={t("balance")} v={`₹${formatMoney(x.amount)}`} valueClass="font-semibold text-secondary" />
      <Row k={t("typeLabel")} v={x.method} />
      <Row k={t("timeLabel")} v={x.createdAt} />
      <div className="mt-2.5 flex items-center justify-between text-xs">
        <span className="text-muted">{t("orderNumber")}</span>
        <button type="button" className="flex items-center gap-1 text-muted" onClick={onCopy}>
          {x.id}
          <Copy className="h-3.5 w-3.5" />
        </button>
      </div>
      <p className="mt-2.5 text-xs text-muted">{t("remarks")}</p>
      {x.remark ? (
        <p className="mt-2 rounded-lg border border-line bg-page px-3 py-2.5 text-xs leading-relaxed text-muted">
          {x.remark}
        </p>
      ) : null}
    </div>
  );
}

function Row({ k, v, valueClass }: { k: string; v: string; valueClass?: string }) {
  return (
    <div className="mt-2.5 flex items-center justify-between text-xs">
      <span className="text-muted">{k}</span>
      <span className={valueClass ?? "font-semibold text-muted"}>{v}</span>
    </div>
  );
}
