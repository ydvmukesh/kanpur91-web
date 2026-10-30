"use client";

import { useMemo, useState } from "react";
import { Copy, LayoutGrid, QrCode } from "lucide-react";
import { InnerShell } from "@/components/layout/InnerShell";
import { Button, EmptyState, FilterDateRow } from "@/components/ui";
import { useTxns } from "@/hooks/queries/useTxns";
import { useI18n } from "@/hooks/useI18n";
import { IMG, ImgIcon } from "@/lib/img";
import { cn } from "@/lib/cn";
import { copyText, formatMoney } from "@/lib/format";
import { useStore } from "@/lib/store";
import type { Txn } from "@/lib/api/models";

type Tab = "all" | "arupi" | "innate" | "paytm" | "upi-qr" | "usdt" | "arpay";

function matchesTab(method: string, tab: Tab) {
  const m = method.toLowerCase();
  if (tab === "all") return true;
  if (tab === "arupi") return m.includes("arupi") || m.includes("phonepe") || m.includes("upi");
  if (tab === "innate") return m.includes("innate");
  if (tab === "paytm") return m.includes("paytm");
  if (tab === "upi-qr") return m.includes("upi-qr") || m.includes("upi_qr") || m.includes("phonepe");
  if (tab === "usdt") return m.includes("usdt");
  return m.includes("arpay") || m.includes("arb");
}

export default function DepositHistoryPage() {
  const { t } = useI18n();
  const { showToast } = useStore();
  const { data: list = [] } = useTxns("deposit");
  const [tab, setTab] = useState<Tab>("all");
  const [status, setStatus] = useState("all");
  const [date, setDate] = useState("");

  const statusOptions = [
    { id: "all", label: t("all") },
    { id: "pending", label: t("toBePaid") },
    { id: "completed", label: t("completed") },
    { id: "rejected", label: t("failed") },
  ];

  const filtered = useMemo(
    () =>
      list.filter((x) => {
        if (!matchesTab(x.method, tab)) return false;
        if (status !== "all" && x.status !== status) return false;
        if (date && !x.createdAt.startsWith(date)) return false;
        return true;
      }),
    [list, tab, status, date],
  );

  const tabs = [
    { id: "all" as const, label: t("all"), icon: "grid" as const },
    { id: "arupi" as const, label: t("arUpiPay"), icon: "qr" as const },
    { id: "innate" as const, label: t("innateUpiQr"), icon: "qr" as const },
    { id: "paytm" as const, label: t("expertPaytmQr"), icon: "qr" as const },
    { id: "upi-qr" as const, label: t("upiQr"), icon: "qr" as const },
    { id: "usdt" as const, label: t("usdt"), icon: "usdt" as const },
    { id: "arpay" as const, label: t("arpayTitle"), icon: "arpay" as const },
  ];

  return (
      <InnerShell
        title={t("depositHistory")}
        variant="light"
        className="bg-page"
        headerExtra={
          <div className="bg-page px-3.5 pt-4 pb-3">
            <div className="phone-scroll flex gap-1 overflow-x-auto">
              {tabs.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTab(item.id)}
                  className={cn(
                    "shrink-0 h-10 min-w-25 px-4 rounded-md flex items-center justify-center gap-1.5 text-xs font-semibold",
                    tab === item.id ? "bg-main-x text-white" : "bg-white text-muted",
                  )}
                >
                  {item.icon === "grid" ? (
                    <LayoutGrid className="h-5 w-5" />
                  ) : item.icon === "qr" ? (
                    <QrCode className="h-5 w-5" />
                  ) : item.icon === "usdt" ? (
                    <ImgIcon src={IMG.withdrawUsdt} alt="" className="h-5 w-5 object-contain" />
                  ) : (
                    <ImgIcon src={IMG.withdrawArb} alt="" className="h-5 w-5 object-contain" />
                  )}
                  {item.label}
                </button>
              ))}
            </div>
            <FilterDateRow
              className="mt-3"
              value={status}
              onChange={setStatus}
              options={statusOptions}
              date={date}
              onDateChange={setDate}
            />
          </div>
        }
      >
        <div className="mx-3.5 pb-8 space-y-2.5">
          {filtered.length === 0 ? <EmptyState /> : null}
          {filtered.map((x) => (
            <Card
              key={x.id}
              x={x}
              onCopy={() => {
                void copyText(x.id);
                showToast(t("copied"), "copy");
              }}
              onVoucher={() => showToast(t("comingSoon"))}
            />
          ))}
          {filtered.length > 0 ? <p className="pt-3 text-center text-sm text-ink">{t("noMore")}</p> : null}
        </div>
      </InnerShell>
  );
}

 function Card({ x, onCopy, onVoucher }: { x: Txn; onCopy: () => void; onVoucher: () => void }) {
  const { t } = useI18n();
  const statusKey = x.status === "rejected" ? "failed" : x.status === "completed" ? "completed" : "toBePaid";
  return (
    <div className="bg-white rounded-lg px-3 py-3.5">
      <div className="flex items-center justify-between border-b border-line pb-2">
        <span className="h-6.5 px-3 rounded-md bg-green-norm text-white text-13 font-medium grid place-items-center">
          {t("deposit")}
        </span>
        <span
          className={cn(
            "text-sm font-bold",
            x.status === "completed" ? "text-green-norm" : x.status === "rejected" ? "text-main" : "text-blue-norm",
          )}
        >
          {t(statusKey)}
        </span>
      </div>
      <Row k={t("orderAmount")} v={`₹${formatMoney(x.amount)}`} valueClass="text-secondary font-semibold" />
      <Row k={t("typeLabel")} v={x.method} />
      <Row k={t("timeLabel")} v={x.createdAt} />
      <div className="flex items-center justify-between mt-2.5 text-xs">
        <span className="text-muted">{t("orderNumber")}</span>
        <button type="button" className="flex items-center gap-1 text-muted" onClick={onCopy}>
          {x.id}
          <Copy className="h-3.5 w-3.5" />
        </button>
      </div>
      {x.status === "pending" ? (
        <Button className="mt-3"  size="sm" onClick={onVoucher}>
          {t("submitDepositVoucher")}
        </Button>
      ) : null}
    </div>
  );
}

function Row({ k, v, valueClass }: { k: string; v: string; valueClass?: string }) {
  return (
    <div className="flex items-center justify-between mt-2.5 text-xs">
      <span className="text-muted">{k}</span>
      <span className={valueClass ?? "text-muted font-semibold"}>{v}</span>
    </div>
  );
}
