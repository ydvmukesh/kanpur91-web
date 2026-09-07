"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { InnerHeader, PrimaryButton } from "@/components/Ui";
import { useStore } from "@/lib/store";
import { formatMoney } from "@/lib/format";

export default function WithdrawPage() {
  const { t, user, withdraw, showToast } = useStore();
  const router = useRouter();
  const [amount, setAmount] = useState(110);
  const [pwd, setPwd] = useState("");
  if (!user) return null;
  const method = user.upi ? `UPI ${user.upi}` : user.bank ? user.bank.bankName : "";

  return (
    <div className="min-h-dvh bg-bg-l1">
      <InnerHeader title={t("withdraw")} />
      <div className="p-3 space-y-3">
        <div className="bg-white rounded-xl p-3">
          <p className="text-xs text-l2">{t("balance")}</p>
          <p className="text-xl font-bold">₹{formatMoney(user.balance)}</p>
        </div>
        <div className="bg-white rounded-xl p-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-l2">{t("bindCard")}</p>
            <Link href="/bind-card" className="text-xs text-main">
              {method ? method : t("bindCard")}
            </Link>
          </div>
          <div className="flex items-center gap-2 h-12 px-3 rounded-lg bg-bg-l3">
            <span className="text-main font-bold">₹</span>
            <input
              inputMode="numeric"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value.replace(/\D/g, "")) || 0)}
              className="flex-1 bg-transparent outline-none font-semibold"
            />
            <button type="button" className="text-xs text-main" onClick={() => setAmount(Math.floor(user.balance))}>
              {t("all")}
            </button>
          </div>
          <p className="text-[11px] text-l3 mt-2">{t("minWithdraw")}</p>
          <input
            type="password"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            placeholder={t("loginPassword")}
            className="mt-3 w-full h-12 px-3 rounded-lg bg-bg-l3 outline-none text-sm"
          />
        </div>
        <PrimaryButton
          onClick={() => {
            if (pwd !== user.password) return showToast(t("loginFailed"));
            const err = withdraw(amount, method || "UPI");
            if (err) return showToast(err);
            showToast(t("withdrawn"));
            router.push("/withdraw-history");
          }}
        >
          {t("withdraw")}
        </PrimaryButton>
      </div>
    </div>
  );
}
