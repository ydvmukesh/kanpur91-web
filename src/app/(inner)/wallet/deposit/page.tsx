"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Book, BookText, CircleX, Clock, Copy, CreditCard, QrCode, RefreshCw, TicketPercent, Wallet } from "lucide-react";
import { InnerShell } from "@/components/layout/InnerShell";
import { Button } from "@/components/ui";
import { IMG, ImgIcon } from "@/lib/img";
import { useI18n } from "@/hooks/useI18n";
import { useWallet } from "@/hooks/useWallet";
import { qk } from "@/lib/api/keys";
import { cn } from "@/lib/cn";
import { useTxns } from "@/hooks/queries/useTxns";
import { copyText, formatMoney } from "@/lib/format";
import type { Txn } from "@/lib/api/models";
import { useStore } from "@/lib/store";
import type { DictKey } from "@/lib/i18n";

type MethodId = "upi-qr" | "innate" | "paytm" | "upi-pay" | "usdt" | "arpay";

const chips = [100, 300, 500, 1000, 2000, 3000, 5000, 10000];
const rechargeTips = ["rechargeTip1", "rechargeTip2", "rechargeTip3", "rechargeTip4"] as const;

function chipLabel(n: number) {
  return n >= 1000 ? `${n / 1000}K` : String(n);
}

const methods: {
  id: MethodId;
  label: DictKey;
  bonus?: string;
  icon: "qr" | "usdt" | "arpay";
}[] = [
  { id: "upi-qr", label: "upiQr", icon: "qr" },
  { id: "innate", label: "innateUpiQr", icon: "qr" },
  { id: "paytm", label: "expertPaytmQr", icon: "qr" },
  { id: "upi-pay", label: "upiQrPay", icon: "qr" },
  { id: "usdt", label: "usdt", icon: "usdt", bonus: "+2%" },
  { id: "arpay", label: "arpayTitle", icon: "arpay", bonus: "+2%" },
];

export default function RechargePage() {
  const { t } = useI18n();
  const { user, deposit } = useWallet();
  const { data: txns = [] } = useTxns("deposit");
  const { showToast } = useStore();
  const router = useRouter();
  const qc = useQueryClient();
  const [method, setMethod] = useState<MethodId>("upi-qr");
  const [amount, setAmount] = useState(0);
  const [couponOn, setCouponOn] = useState(true);
  if (!user) return null;

  const current = methods.find((m) => m.id === method)!;
  const isUpi = current.icon === "qr";
  const canPay = isUpi && amount >= 100;
  const recent = txns.slice(0, 2);

  const methodLabel = useMemo(() => t(current.label), [current.label, t]);

  async function submit() {
    if (!isUpi) return showToast(t("comingSoon"));
    const err = await deposit(amount, methodLabel);
    if (err) return showToast(err);
    showToast(t("deposited"));
    void qc.invalidateQueries({ queryKey: qk.txns("deposit") });
    router.push("/wallet/depositHistory");
  }

  return (
    <>
      <InnerShell
        title={t("deposit")}
        variant="light"
        className="bg-page"
        right={
          <Link href="/wallet/depositHistory" className="pr-2 text-xs leading-tight text-ink text-right">
            {t("depositHistory")}
          </Link>
        }
      >
        <div className="pb-28">
          <div className="mx-3.5 mt-4 relative min-h-[132px] text-white px-4 pt-4 pb-8">
            <img src={IMG.totalAssetsBg} alt="" className="absolute inset-0 h-full w-full object-fill" />
            <p className="relative z-10 flex items-center gap-1.5 text-13 text-white/95">
              <Wallet className="h-5 w-5" />
              {t("balance")}
            </p>
            <div className="relative z-10 flex items-center gap-2 mt-2">
              <p className="text-2xl font-bold leading-none">₹{formatMoney(user.balance)}</p>
              <button
                type="button"
                className="h-7 w-7 grid place-items-center"
                onClick={() => void qc.invalidateQueries({ queryKey: qk.me })}
                aria-label="Refresh"
              >
                <RefreshCw className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="mx-3.5 mt-4 grid grid-cols-4 gap-2">
            {methods.map((m) => {
              const on = method === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMethod(m.id)}
                  className={cn(
                    "relative rounded-lg min-h-22 px-1 py-3 flex flex-col items-center justify-center gap-1.5",
                    on ? "bg-main-x text-white" : "bg-white text-muted",
                  )}
                >
                  {m.bonus ? (
                    <span className="absolute -top-1 right-1 h-4 min-w-7 px-1 rounded-b-sm bg-main text-10 font-semibold text-white grid place-items-center">
                      {m.bonus}
                    </span>
                  ) : null}
                  {m.icon === "qr" ? (
                    <QrCode className={cn("h-7 w-7", on ? "text-white" : "text-ink")} />
                  ) : m.icon === "usdt" ? (
                    <ImgIcon src={IMG.withdrawUsdt} alt="" className="h-7 w-7 object-contain" />
                  ) : (
                    <ImgIcon src={IMG.withdrawArb} alt="" className="h-7 w-7 object-contain" />
                  )}
                  <span className={cn("text-10 font-semibold leading-tight text-center uppercase", on ? "text-white" : "text-muted")}>
                    {t(m.label)}
                  </span>
                </button>
              );
            })}
          
          </div>

          {isUpi ? (
            <div className="mx-3.5 mt-3 bg-white rounded-xl px-3.5 py-4">
              <p className="flex items-center gap-1.5 text-15 font-semibold text-ink">
                <CreditCard className="h-5 w-5 text-main" />
                {t("selectChannel")}
              </p>
              <button
                type="button"
                className="mt-3 w-fit rounded-2xl bg-main-y px-4 py-2.5 text-left text-sm font-medium leading-tight text-white"
              >
                <span className="block">{t("phonepeQr")}</span>
                <span className="block font-normal text-white/95">
                  {t("channelRange", { min: "100", max: "50K" })}
                </span>
              </button>
            </div>
          ) : null}

          <div className="mx-3.5 mt-3 bg-white rounded-xl px-3.5 py-4">
            <p className="flex items-center gap-1.5 text-15 font-semibold text-muted">
              <TicketPercent className="h-5 w-5 text-main" />
              {t("topUpCoupons")}(1)
            </p>
            <button
              type="button"
              onClick={() => setCouponOn((v) => !v)}
              className="mt-3 w-fit flex overflow-hidden rounded-xl"
            >
              <div className="w-14 shrink-0 bg-main text-white flex flex-col items-center justify-center place-items-center py-2.5">
                <p className="text-base font-bold leading-none">2%</p>
                <p className="mt-1 text-8 font-semibold leading-none">{t("cashback")}</p>
              </div>
              <div className="bg-page px-3 py-2 text-left">
                <p className="text-xs text-muted leading-none">{t("upTo")}</p>
                <p className="mt-0.5 text-sm font-semibold text-ink">₹2,000</p>
                <p className="mt-0.5 text-9 text-[#96424a]">
                  {t("couponMin")} ₹100
                </p>
                <p className="mt-1 flex items-center gap-1 text-9 text-[#96424a]">
                  <Clock className="h-2.5 w-2.5" />
                  {t("expire")} 27-10-2026
                </p>
              </div>
            </button>
          </div>

          <div className="mx-3.5 mt-3 bg-white rounded-xl px-3.5 py-4">
            <p className="flex items-center gap-1.5 text-lg font-semibold text-ink">
              <Wallet className="h-5 w-5 text-main" />
              {t("depositAmount")}
            </p>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {chips.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setAmount(c)}
                  className={cn(
                    "h-10 rounded-lg px-2.5 flex items-center text-sm font-medium shadow-field",
                    amount === c ? "bg-main-y text-white" : "bg-white text-main",
                  )}
                >
                  <span>₹</span>
                  <span className="flex-1 text-center">{chipLabel(c)}</span>
                </button>
              ))}
            </div>
            <div className="mt-3 h-11 rounded-full bg-page px-3 flex items-center gap-2">
              <span className="text-main text-sm font-semibold">₹</span>
              <i className="h-4 w-px bg-line shrink-0" />
              <input
                inputMode="numeric"
                value={amount || ""}
                onChange={(e) => setAmount(Math.min(50_000, Number(e.target.value.replace(/\D/g, "").slice(0, 5)) || 0))}
                placeholder={t("depositAmountRange")}
                className="flex-1 min-w-0 bg-transparent outline-none text-sm text-main placeholder:text-faint"
              />
              {amount ? (
                <button type="button" className="text-faint" onClick={() => setAmount(0)} aria-label="Clear">
                  <CircleX className="h-5 w-5" />
                </button>
              ) : null}
            </div>
          </div>

          <div className="mx-3.5 mt-3 bg-white rounded-xl px-3.5 py-4">
            <p className="flex items-center gap-1.5 text-15 font-semibold text-ink">
              <BookText className="h-5 w-5 text-main" />
              {t("rechargeInstructions")}
            </p>
            <ul className="mt-3 rounded-xl border border-line px-3 py-3 space-y-2.5">
              {rechargeTips.map((key) => (
                <li key={key} className="flex gap-2 text-xs text-muted leading-relaxed">
                  <i className="mt-1.5 h-1.5 w-1.5 rotate-45 bg-main shrink-0" />
                  {t(key)}
                </li>
              ))}
            </ul>
          </div>

          <div className="mx-3.5 mt-4 px-3">
            <p className="flex items-center gap-1.5 text-15 font-semibold text-ink">
              <BookText className="h-5 w-5 text-main" />
              {t("depositHistory")}
            </p>
          </div>
          {recent.map((x) => (
            <DepositCard
              key={x.id}
              x={x}
              onCopy={() => {
                void copyText(x.id);
                showToast(t("copied"), "copy");
              }}
            />
          ))}
          {recent.length > 0 ? (
            <div className="mx-3.5 mt-2 rounded-lg px-3 py-3">
              <Button variant="outline" size="sm" className="font-medium" onClick={() => router.push("/wallet/depositHistory")}>
                {t("allHistory")}
              </Button>
            </div>
          ) : null}
        </div>
      </InnerShell>

      <div className="fixed inset-0 z-20 flex justify-center pointer-events-none">
        <div className="relative w-full max-w-[400px] h-full">
          <div className="pointer-events-auto absolute inset-x-0 bottom-0 bg-white px-3.5 py-3 flex items-center gap-3">
            <p className="flex-1 text-xs text-muted leading-tight">
              {t("rechargeMethod")}: <span className="text-ink font-medium">{methodLabel}</span>
            </p>
            <Button className="!w-auto min-w-36 px-6 shrink-0 rounded-lg"  size="sm" disabled={!canPay} onClick={submit}>
              {amount ? `${t("deposit")} ₹${formatMoney(amount)}` : t("deposit")}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

function DepositCard({ x, onCopy }: { x: Txn; onCopy: () => void }) {
  const { t } = useI18n();
  const statusKey = x.status === "rejected" ? "failed" : x.status === "completed" ? "completed" : "pending";
  return (
    <div className="mx-3.5 mt-2.5 bg-white rounded-xl px-3 py-3.5">
      <div className="flex items-center justify-between border-b border-line pb-2">
        <span className="h-6.5 px-3 rounded-md bg-green-norm text-white text-13 font-medium grid place-items-center">
          {t("deposit")}
        </span>
        <span
          className={cn(
            "text-sm font-bold",
            x.status === "completed" ? "text-green-norm" : x.status === "rejected" ? "text-main" : "text-secondary",
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
