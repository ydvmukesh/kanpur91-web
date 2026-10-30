"use client";

import { useMemo, useState } from "react";
import { Copy, LayoutGrid, QrCode } from "lucide-react";
import { InnerShell } from "@/components/layout/InnerShell";
import { Sheet } from "@/components/layout/Sheet";
import { Button, EmptyState, FilterDateRow, padLooseDate } from "@/components/ui";
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
  const [utrTxn, setUtrTxn] = useState<Txn | null>(null);
  const [utr, setUtr] = useState("");

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
        if (date) {
          const [fromRaw, toRaw] = date.split("/");
          const from = padLooseDate(fromRaw ?? date).slice(0, 10);
          const to = padLooseDate(toRaw ?? fromRaw ?? date).slice(0, 10);
          const day = x.createdAt.slice(0, 10);
          if (day < from || day > to) return false;
        }
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
    <>
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
              onVoucher={() => {
                setUtr("");
                setUtrTxn(x);
              }}
            />
          ))}
          {filtered.length > 0 ? <p className="pt-3 text-center text-sm text-ink">{t("noMore")}</p> : null}
        </div>
      </InnerShell>
      {utrTxn ? (
        <UtrSheet
          x={utrTxn}
          utr={utr}
          onUtr={setUtr}
          onClose={() => setUtrTxn(null)}
          onSubmit={() => {
            if (utr.replace(/\D/g, "").length !== 12) {
              showToast(t("utrPlaceholder"));
              return;
            }
            showToast(t("copied"), "success");
            setUtrTxn(null);
          }}
        />
      ) : null}
    </>
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
      {x.status === "pending" || x.status === "rejected" ? (
        <Button className="mt-3" size="xs" onClick={onVoucher}>
          {t("submitUtr")}
        </Button>
      ) : null}
    </div>
  );
}

function UtrSheet({
  x,
  utr,
  onUtr,
  onClose,
  onSubmit,
}: {
  x: Txn;
  utr: string;
  onUtr: (v: string) => void;
  onClose: () => void;
  onSubmit: () => void;
}) {
  const { t } = useI18n();
  return (
    <Sheet onClose={onClose}>
      <div className="phone-scroll max-h-[70vh] overflow-y-auto">
        <div className="relative mb-4 flex h-10 items-center justify-between">
          <button
            type="button"
            className="rounded-full border border-line px-4 py-1.5 text-13 text-ink"
            onClick={onClose}
          >
            {t("cancel")}
          </button>
          <p className="pointer-events-none absolute inset-x-20 text-center text-sm font-semibold text-ink">
            {t("submitUtr")}
          </p>
          <button
            type="button"
            className="rounded-full bg-main-x px-4 py-1.5 text-13 font-medium text-white"
            onClick={onSubmit}
          >
            {t("submit")}
          </button>
        </div>
        <div className="flex items-center gap-3">
          <span className="shrink-0 text-sm text-ink">{t("utr")}</span>
          <input
            value={utr}
            inputMode="numeric"
            maxLength={12}
            placeholder={t("utrPlaceholder")}
            onChange={(e) => onUtr(e.target.value.replace(/\D/g, "").slice(0, 12))}
            className="h-10 min-w-0 flex-1 rounded-full bg-bg-l3 px-4 text-sm text-ink outline-none placeholder:text-faint"
          />
        </div>
        <Row k={t("balance")} v={`₹${formatMoney(x.amount)}`} valueClass="text-secondary font-semibold" />
        <Row k={t("typeLabel")} v={x.method} />
        <Row k={t("timeLabel")} v={x.createdAt} />
        <Row k={t("orderNumber")} v={x.id} />
      </div>
    </Sheet>
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
