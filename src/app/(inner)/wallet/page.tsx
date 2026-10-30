"use client";

import Link from "next/link";
import { BottomNav } from "@/components/BottomNav";
import { InnerShell } from "@/components/layout/InnerShell";
import { useAuth } from "@/hooks/useAuth";
import { useI18n } from "@/hooks/useI18n";
import { useTxns } from "@/hooks/queries/useTxns";
import { useWallet } from "@/hooks/useWallet";
import { cn } from "@/lib/cn";
import { formatMoney } from "@/lib/format";
import { IMG, ImgIcon } from "@/lib/img";
import { useStore } from "@/lib/store";
import { Wallet } from "lucide-react";
import { Button } from "@/components/ui";

function Ring({ pct }: { pct: number }) {
  const r = 34;
  const c = 2 * Math.PI * r;
  const dash = (Math.max(0, Math.min(100, pct)) / 100) * c;
  return (
    <svg viewBox="0 0 80 80" className="h-[5.75rem] w-[5.75rem] -rotate-90">
      <circle cx="40" cy="40" r={r} fill="none" stroke="var(--main-color)" strokeOpacity="0.45" strokeWidth="8" />
      <circle
        cx="40"
        cy="40"
        r={r}
        fill="none"
        stroke="var(--main-color)"
        strokeWidth="8"
        strokeLinecap={pct > 0 ? "round" : "butt"}
        strokeDasharray={`${dash} ${c}`}
      />
    </svg>
  );
}

export default function WalletPage() {
  const { t } = useI18n();
  const { user } = useAuth();
  const { recycle } = useWallet();
  const { showToast } = useStore();
  const { data: txns = [] } = useTxns();
  if (!user) return null;

  const total = user.balance + user.thirdParty;
  const mainPct = total > 0 ? Math.round((user.balance / total) * 100) : 0;
  const thirdPct = total > 0 ? 100 - mainPct : 0;
  const withdrawn = txns.filter((x) => x.type === "withdraw" && x.status === "completed").reduce((s, x) => s + x.amount, 0);
  const deposited = txns.filter((x) => x.type === "deposit" && x.status === "completed").reduce((s, x) => s + x.amount, 0);

  const actions = [
    { href: "/wallet/deposit", label: t("deposit"), src: IMG.walletDeposit },
    { href: "/wallet/withdraw", label: t("withdraw"), src: IMG.walletWithdraw },
    { href: "/wallet/depositHistory", label: t("depositHistory"), src: IMG.walletDepositHistory },
    { href: "/wallet/withdrawHistory", label: t("withdrawHistory"), src: IMG.walletWithdrawHistory },
  ];

  return (
    <div className="flex h-full min-h-0 flex-col">
      <InnerShell title={t("wallet")} headerClassName="bg-main-x" className="min-h-0 flex-1 bg-page">
        <div className="bg-main-x px-4 pb-7 pt-3 text-center text-white">
          <Wallet className="size-8 text-white text-center mx-auto mb-2" />
          <p className="text-2xl font-semibold leading-none">₹{formatMoney(total)}</p>
          <p className="mt-1.5 text-13 text-white/90">{t("totalBalance")}</p>
          <div className="mt-4 grid grid-cols-2 gap-3 w-full max-w-xs mx-auto">
            <div>
              <p className="text-base font-medium">{withdrawn}</p>
              <p className="mt-1 text-11 leading-tight text-white/85">{t("totalWithdrawalAmount")}</p>
            </div>
            <div>
              <p className="text-base font-medium">{deposited}</p>
              <p className="mt-1 text-11 leading-tight text-white/85">{t("totalDepositAmount")}</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 px-3 pt-5 pb-14">
          <div className="rounded-lg bg-white px-3 pb-5 pt-7">
            <div className="grid grid-cols-2">
              <div className="flex flex-col items-center">
                <div className="relative">
                  <Ring pct={mainPct} />
                  <span className="absolute inset-0 grid place-items-center text-base font-semibold text-ink">
                    {mainPct}%
                  </span>
                </div>
                <p className="mt-2 text-sm font-medium text-ink">₹{formatMoney(user.balance)}</p>
                <p className="text-11 text-muted">{t("mainWallet")}</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="relative">
                  <Ring pct={thirdPct} />
                  <span className="absolute inset-0 grid place-items-center text-base font-semibold text-ink">
                    {thirdPct}%
                  </span>
                </div>
                <p className="mt-2 text-sm font-medium text-ink">₹{formatMoney(user.thirdParty)}</p>
                <p className="text-11 text-muted">{t("thirdWallet")}</p>
              </div>
            </div>

            <Button
              className="mt-5 w-full"
              size="sm"
              onClick={() => {
                recycle();
                  showToast(t("recycled"));
                }}
              >
                {t("mainWalletTransfer")}
              </Button>

            <div className="mt-5 grid grid-cols-4 gap-1">
              {actions.map((item) => (
                <Link key={item.href} href={item.href} className="flex flex-col items-center">
                  <span className="grid size-15 place-items-center">
                    <ImgIcon src={item.src} className="h-full w-full object-contain" />
                  </span>
                  <span className="mt-1.5 text-center text-11 leading-tight text-muted">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-2.5 grid grid-cols-3 gap-2">
            {[
              { id: "ar", label: t("arGame"), amount: 0, on: false },
              { id: "lottery", label: t("lottery"), amount: user.balance, on: true },
              { id: "wickets", label: t("wickets9"), amount: 0, on: false },
            ].map((item) => (
              <div
                key={item.id}
                className={cn(
                  "relative flex h-[5.25rem] flex-col items-center justify-center overflow-hidden rounded-lg",
                  item.on ? "bg-main-y text-white" : "bg-white text-muted",
                )}
              >
                {item.on ? (
                  <ImgIcon src={IMG.ball8} className="pointer-events-none absolute size-16 opacity-25" />
                ) : null}
                <p className={cn("relative text-base font-medium", item.on ? "text-white" : "text-ink")}>
                  {formatMoney(item.amount)}
                </p>
                <p className={cn("relative mt-1 text-13", item.on ? "text-white/90" : "text-muted")}>{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </InnerShell>
      <BottomNav />
    </div>
  );
}
