"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { InnerHeader, PrimaryButton } from "@/components/Ui";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/cn";

const chips = [100, 500, 1000, 5000, 10000, 50000];

export default function DepositPage() {
  const { t, deposit, showToast } = useStore();
  const router = useRouter();
  const [amount, setAmount] = useState(100);
  const [method, setMethod] = useState("UPI");

  return (
    <div className="min-h-dvh bg-bg-l1">
      <InnerHeader title={t("deposit")} />
      <div className="p-3 space-y-3">
        <div className="bg-white rounded-xl p-3">
          <p className="text-xs text-l2 mb-2">{t("amount")}</p>
          <div className="flex items-center gap-2 h-12 px-3 rounded-lg bg-bg-l3">
            <span className="text-main font-bold">₹</span>
            <input
              inputMode="numeric"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value.replace(/\D/g, "")) || 0)}
              className="flex-1 bg-transparent outline-none font-semibold"
            />
          </div>
          <div className="grid grid-cols-3 gap-2 mt-3">
            {chips.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setAmount(c)}
                className={cn(
                  "h-9 rounded-lg text-sm font-semibold",
                  amount === c ? "bg-main-x text-white" : "bg-bg-l3 text-l1",
                )}
              >
                ₹{c}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-l3 mt-2">{t("minDeposit")}</p>
        </div>
        <div className="bg-white rounded-xl p-3">
          <p className="text-xs text-l2 mb-2">{t("upi")} / {t("bank")}</p>
          <div className="grid grid-cols-2 gap-2">
            {["UPI", "Bank", "Paytm", "PhonePe"].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMethod(m)}
                className={cn(
                  "h-10 rounded-lg text-sm",
                  method === m ? "bg-red-soft text-main border border-main" : "bg-bg-l3",
                )}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
        <PrimaryButton
          onClick={() => {
            const err = deposit(amount, method);
            if (err) return showToast(err);
            showToast(t("deposited"));
            router.push("/wallet");
          }}
        >
          {t("deposit")}
        </PrimaryButton>
      </div>
    </div>
  );
}
