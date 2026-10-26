"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Book, BookText, ChevronRight, Copy, Landmark, Plus, ReceiptText, RefreshCw, Wallet } from "lucide-react";
import { InnerShell } from "@/components/layout/InnerShell";
import { Button } from "@/components/ui";
import { IMG, ImgIcon } from "@/lib/img";
import { useTxns } from "@/hooks/queries/useTxns";
import { useI18n } from "@/hooks/useI18n";
import { useWallet } from "@/hooks/useWallet";
import { qk } from "@/lib/api/keys";
import { cn } from "@/lib/cn";
import { copyText, formatMoney, maskAccount } from "@/lib/format";
import { useStore } from "@/lib/store";

type Method = "arpay" | "bank" | "upi" | "usdt";

const arbTips = ["withdrawTip1", "withdrawTip2", "withdrawTip3", "withdrawTip4", "withdrawTip5", "withdrawTip6"] as const;
const bankTips = ["withdrawTip3", "withdrawTip4", "withdrawTip5", "withdrawTip6Bank", "withdrawTipBank"] as const;
const upiTips = ["withdrawTip3", "withdrawTip4", "withdrawTip5", "withdrawTip6", "withdrawTipBank", "withdrawTipCs"] as const;

function TipText({ text }: { text: string }) {
  const parts = text.split("||");
  return (
    <span>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <span key={i} className="text-main">
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </span>
  );
}

export default function WithdrawPage() {
  const { t } = useI18n();
  const { user, withdraw } = useWallet();
  const { data: txns = [] } = useTxns("withdraw");
  const { showToast } = useStore();
  const router = useRouter();
  const qc = useQueryClient();
  const [amount, setAmount] = useState(0);
  const [method, setMethod] = useState<Method>("arpay");
  if (!user) return null;

  const recent = txns.slice(0, 2);
  const received = amount;
  const methodLabel =
    method === "bank" ? t("bankCard") : method === "upi" ? t("upi") : method === "usdt" ? t("usdt") : t("arpayTitle");
  const isArpay = method === "arpay";
  const isBank = method === "bank";
  const isUpi = method === "upi";

  async function submit() {
    if (!user) return;
    if (method === "bank" && !user.bank) return showToast(t("needBind"));
    if (method === "upi" && !user.upi) return showToast(t("needBind"));
    if (method === "arpay" && !user.upi) return showToast(t("needBind"));
    if (method === "usdt") return showToast(t("comingSoon"));
    const err = await withdraw(amount, methodLabel);
    if (err) return showToast(err);
    showToast(t("withdrawn"));
    void qc.invalidateQueries({ queryKey: qk.txns("withdraw") });
  }

  return (
    <InnerShell
      title={t("withdrawal")}
      variant="light"
      className="bg-page"
      right={
        <Link href="/wallet/withdrawhistory" className="pr-2 text-xs leading-tight text-ink text-right">
          {t("withdrawHistory")}
        </Link>
      }
    >
      <div className="pb-8">
        <div className="mx-3.5 mt-4 relative min-h-[132px] text-white px-4 pt-4 pb-8">
          <img src={IMG.totalAssetsBg} alt="" className="absolute inset-0 h-full w-full object-fill" />
          <p className="relative z-10 flex items-center gap-1.5 text-[13px] text-white/95">
            <Wallet className="h-5 w-5" />
            {t("availableBalance")}
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

        <button
          type="button"
          onClick={() => setMethod("arpay")}
          className={cn(
            "mx-3.5 mt-4 rounded-lg px-4 py-3 flex items-center gap-3 w-[calc(100%-1.75rem)] text-left",
            isArpay ? "bg-main-x" : "bg-white",
          )}
        >
          <ImgIcon src={IMG.withdrawArb} alt="" className="h-8 w-8 object-contain" />
          <div>
            <p className={cn("text-base font-semibold leading-tight", isArpay ? "text-white" : "text-ink")}>
              {t("arpayTitle")}
            </p>
            <p className={cn("text-xs", isArpay ? "text-white/95" : "text-muted")}>{t("arpaySub")}</p>
          </div>
        </button>

        <div className="mx-3.5 mt-4 grid grid-cols-3 gap-2">
          {(
            [
              { id: "bank" as const, label: t("bankCard"), src: IMG.withdrawBank, srcActive: IMG.withdrawBankActive },
              { id: "upi" as const, label: t("upi"), src: IMG.withdrawUpi, srcActive: IMG.withdrawUpi },
              { id: "usdt" as const, label: t("usdt"), src: IMG.withdrawUsdt, srcActive: IMG.withdrawUsdt },
            ] as const
          ).map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setMethod(m.id)}
              className={cn(
                "rounded-lg py-4 flex flex-col items-center gap-2.5",
                method === m.id ? "bg-main-x" : "bg-white",
              )}
            >
              <ImgIcon src={method === m.id ? m.srcActive : m.src} alt="" className="h-8 w-8 object-contain" />
              <span className={cn("text-xs font-semibold uppercase", method === m.id ? "text-white" : "text-muted")}>
                {m.label}
              </span>
            </button>
          ))}
        </div>

        {isBank ? (
          <Link
            href="/wallet/withdraw/bankcard"
            className="mx-3.5 mt-3 bg-white rounded-lg px-3 py-3.5 flex items-center gap-2 text-[13px]"
          >
            <Landmark className="h-5 w-5 text-main shrink-0" />
            {user.bank ? (
              <>
                <span className="max-w-[88px] truncate text-ink">{user.bank.bankName}</span>
                <i className="h-4 w-px bg-line shrink-0" />
                <span className="flex-1 text-ink">{maskAccount(user.bank.account)}</span>
              </>
            ) : (
              <span className="flex-1 text-muted">{t("needBind")}</span>
            )}
            <ChevronRight className="h-5 w-5 text-faint shrink-0" />
          </Link>
        ) : null}

        {isUpi ? (
          user.upi ? (
            <Link
              href="/wallet/withdraw/addupi"
              className="mx-3.5 mt-3 bg-white rounded-lg px-3 py-3.5 flex items-center gap-2 text-[13px]"
            >
              <ImgIcon src={IMG.withdrawUpi} alt="" className="h-6 w-6 object-contain shrink-0" />
              <span className="flex-1 text-ink truncate">{user.upi}</span>
              <ChevronRight className="h-5 w-5 text-faint shrink-0" />
            </Link>
          ) : (
            <Link
              href="/wallet/withdraw/addupi"
              className="mx-3.5 mt-3 bg-white rounded-lg min-h-[120px] grid place-items-center text-center px-4"
            >
              <span>
                <span className="mx-auto h-11 w-11 rounded-md border border-dashed border-disabled grid place-items-center">
                  <Plus className="h-5 w-5 text-disabled" />
                </span>
                <span className="mt-3 block text-[13px] text-faint">{t("addUpi")}</span>
              </span>
            </Link>
          )
        ) : null}

        {isArpay ? (
          <>
            <div className="mx-3.5 mt-3 bg-white rounded-lg px-3 py-3.5 flex items-center justify-between text-[13px]">
              <span className="flex items-center gap-1.5 text-ink">
                <ReceiptText className="h-5 w-5 text-main" />
                {t("arpayRules")}
              </span>
              <Link href="/guide" className="flex items-center text-main font-medium">
                {t("check")}
                <ChevronRight className="h-5 w-5" />
              </Link>
            </div>
            <div className="mx-3.5 mt-3 bg-white rounded-lg px-3 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ImgIcon src={IMG.withdrawArb} alt="" className="h-7 w-7 object-contain" />
                <div>
                  <p className="text-[13px] text-ink">{t("myArb")}</p>
                  <p className="text-[13px] font-semibold">0 ARB</p>
                </div>
              </div>
              <Link href="/bind-card" className="h-8 px-3 rounded-md bg-main text-white text-xs font-semibold grid place-items-center">
                {t("enterWallet")}
              </Link>
            </div>
          </>
        ) : null}

        <div className="mx-3.5 mt-4 bg-white rounded-xl px-3.5 py-4">
          {isArpay ? (
            <p className="flex items-center gap-1.5 text-[15px] font-semibold text-ink">
              <Wallet className="h-5 w-5 text-main" />
              {t("withdrawAsArb")}
            </p>
          ) : null}
          <div className={cn("flex items-center h-11 rounded-full bg-bg-l3 px-4", isArpay && "mt-3")}>
            <span className="text-main font-semibold">₹</span>
            <i className="mx-2.5 h-4 w-px bg-line" />
            <input
              inputMode="numeric"
              value={amount || ""}
              placeholder={t("enterAmount")}
              onChange={(e) => setAmount(Number(e.target.value.replace(/\D/g, "").slice(0, 11)) || 0)}
              maxLength={11}
              className="flex-1 min-w-0 bg-transparent outline-none text-[15px] text-ink placeholder:text-faint"
            />
            {isArpay ? (
              <button type="button" className="text-sm text-main font-medium" onClick={() => setAmount(Math.min(Math.floor(user.balance), 99_999_999_999))}>
                {t("all")}
              </button>
            ) : null}
          </div>
          <div className="mt-3 flex items-center justify-between">
            <p className="text-[13px] text-main ">
              {t("withdrawableBalance")} ₹{formatMoney(user.balance)}
            </p>
            {!isArpay ? (
              <button
                type="button"
                className="h-7 px-3.5 rounded-full border border-main text-main text-xs font-medium"
                onClick={() => setAmount(Math.min(Math.floor(user.balance), 99_999_999_999))}
              >
                {t("all")}
              </button>
            ) : null}
          </div>
          <div className="mt-2 flex items-center justify-between text-[13px]">
            <span className="text-muted">{t("withdrawReceived")}</span>
            <span className="text-secondary font-semibold">₹{formatMoney(received)}</span>
          </div>
          <Button className="mt-5"  size="sm" disabled={!amount} onClick={submit}>
            {t("withdrawal")}
          </Button>
        </div>

        <div className="mx-3.5 mt-4 bg-white rounded-xl px-3.5 py-4">
          {isArpay ? (
            <p className="flex items-center gap-1.5 text-[15px] font-semibold text-ink">
              <Book className="h-5 w-5 text-main" />
              {t("withdrawInstructions")}
            </p>
          ) : null}
          <ul className={cn("rounded-lg px-3 py-3 space-y-2.5", isArpay && "mt-3 border border-line")}>
            {(isArpay ? arbTips : isUpi ? upiTips : bankTips).map((key) => (
              <li key={key} className="flex gap-2 text-xs text-muted leading-relaxed">
                <i className="mt-1.5 h-1.5 w-1.5 rotate-45 bg-main shrink-0" />
                <TipText text={t(key)} />
              </li>
            ))}
          </ul>
        </div>

        <div className="mx-3.5 mt-4  rounded-lg px-3 ">
          <p className="flex items-center gap-1.5 text-md font-semibold text-ink">
            <BookText className="h-5 w-5 text-main" />
            {t("withdrawHistory")}
          </p>
        </div>
        {recent.map((x) => (
          <div key={x.id} className="mx-3.5 mt-2.5 bg-white rounded-xl px-3 py-3.5">
            <div className="flex items-center justify-between border-b border-line pb-2">
              <span className="h-[26px] px-3 rounded-md bg-main text-white text-[13px] font-medium grid place-items-center">
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
              <button
                type="button"
                className="flex items-center gap-1 text-muted"
                onClick={() => {
                  void copyText(x.id);
                  showToast(t("copied"), "copy");
                }}
              >
                {x.id}
                <Copy className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
        <div className="mx-3.5 mt-2 rounded-lg px-3 py-3">
          <Button variant="outline" size="sm" className="font-medium" onClick={() => router.push("/wallet/withdrawhistory")}>
            {t("allHistory")}
          </Button>
        </div>
      </div>
    </InnerShell>
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
