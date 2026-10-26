"use client";

import { useMemo, useState } from "react";
import { ChevronDown, Copy, LayoutGrid } from "lucide-react";
import { InnerShell } from "@/components/layout/InnerShell";
import { EmptyState, WheelPicker } from "@/components/ui";
import { useTxns } from "@/hooks/queries/useTxns";
import { useI18n } from "@/hooks/useI18n";
import { IMG, ImgIcon } from "@/lib/img";
import { cn } from "@/lib/cn";
import { copyText, formatMoney } from "@/lib/format";
import { useStore } from "@/lib/store";
import type { Txn } from "@/lib/api/models";

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
  const [draftStatus, setDraftStatus] = useState("all");
  const [openStatus, setOpenStatus] = useState(false);
  const [date, setDate] = useState("");

  const statusLabel =
    status === "pending"
      ? t("pending")
      : status === "completed"
        ? t("completed")
        : status === "rejected"
          ? t("rejected")
          : status === "processing"
            ? t("processing")
            : t("all");
  const statusOptions = [
    { id: "all", label: t("all") },
    { id: "pending", label: t("pending") },
    { id: "completed", label: t("completed") },
    { id: "rejected", label: t("rejected") },
    { id: "processing", label: t("processing") },
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
    { id: "all" as const, label: t("all"), src: null, srcActive: null },
    { id: "arpay" as const, label: t("arpayTitle"), src: IMG.withdrawArb, srcActive: IMG.withdrawArb },
    { id: "bank" as const, label: t("bankCard"), src: IMG.withdrawBank, srcActive: IMG.withdrawBankActive },
    { id: "usdt" as const, label: t("usdt"), src: IMG.withdrawUsdt, srcActive: IMG.withdrawUsdt },
  ];

  return (
    <>
    <InnerShell
      title={t("withdrawHistory")}
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
                  "shrink-0 h-10 min-w-25 px-4 rounded-md flex items-center justify-center gap-1.5 text-xs font-semibold uppercase",
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
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setDraftStatus(status);
                setOpenStatus(true);
              }}
              className="h-11 rounded-lg bg-white px-3 flex items-center justify-between text-sm text-ink"
            >
              <span>{statusLabel}</span>
              <ChevronDown className="h-4 w-4 text-faint shrink-0" />
            </button>
            <label className="relative h-11 rounded-lg bg-white px-3 flex items-center justify-between text-sm text-ink">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={cn("flex-1 min-w-0 bg-transparent outline-none text-sm", !date && "text-transparent")}
              />
              {!date ? <span className="absolute left-3 text-sm text-ink pointer-events-none">{t("chooseDate")}</span> : null}
              <ChevronDown className="h-4 w-4 text-faint shrink-0" />
            </label>
          </div>
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
          />
        ))}
        {filtered.length > 0 ? <p className="pt-3 text-center text-sm text-ink">{t("noMore")}</p> : null}
      </div>
    </InnerShell>

      {openStatus ? (
        <div className="fixed inset-0 z-50 flex justify-center">
          <div className="relative w-full max-w-[400px] h-full">
            <button type="button" className="absolute inset-0 bg-black/55" onClick={() => setOpenStatus(false)} />
            <div className="absolute inset-x-0 bottom-0 bg-white rounded-t-2xl animate-[sheet-up_280ms_ease-out]">
              <div className="flex items-center justify-between px-4 h-12">
                <button type="button" className="text-sm text-muted" onClick={() => setOpenStatus(false)}>
                  {t("cancel")}
                </button>
                <button
                  type="button"
                  className="text-sm text-main font-semibold"
                  onClick={() => {
                    setStatus(draftStatus);
                    setOpenStatus(false);
                  }}
                >
                  {t("confirm")}
                </button>
              </div>
              <div className="flex items-center min-h-50 pb-10">
                <WheelPicker options={statusOptions} value={draftStatus} onChange={setDraftStatus} />
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

function Card({ x, onCopy }: { x: Txn; onCopy: () => void }) {
  const { t } = useI18n();
  return (
    <div className="bg-white rounded-xl px-3 py-3.5">
      <div className="flex items-center justify-between border-b border-line pb-2">
        <span className="h-6.5 px-3 rounded-md bg-main text-white text-13 font-medium grid place-items-center">
          {t("withdrawal")}
        </span>
        <span
          className={cn(
            "text-sm font-bold",
            x.status === "completed" ? "text-green-norm" : x.status === "rejected" ? "text-main" : "text-secondary",
          )}
        >
          {t(x.status === "pending" ? "toBePaid" : x.status === "completed" ? "completed" : "rejected")}
        </span>
      </div>
      <Row k={t("balance")} v={`₹${formatMoney(x.amount)}`} valueClass="text-secondary font-semibold" />
      <Row k={t("typeLabel")} v={x.method} />
      <Row k={t("timeLabel")} v={x.createdAt} />
      <div className="flex items-center justify-between mt-2.5 text-xs">
        <span className="text-muted">{t("orderNumber")}</span>
        <button type="button" className="flex items-center gap-1 text-muted" onClick={onCopy}>
          {x.id}
          <Copy className="h-3.5 w-3.5" />
        </button>
      </div>
      <p className="mt-2.5 text-xs text-muted">{t("remarks")}</p>
      {x.remark ? (
        <p className="mt-2 rounded-lg bg-bg-l1 border border-line px-3 py-2.5 text-xs text-muted leading-relaxed">{x.remark}</p>
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
