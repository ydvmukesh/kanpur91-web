"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { InnerShell } from "@/components/layout/InnerShell";
import { AmountField, Button } from "@/components/ui";
import { cn } from "@/lib/cn";
import { useI18n } from "@/hooks/useI18n";
import { useWallet } from "@/hooks/useWallet";
import { useStore } from "@/lib/store";

const chips = [100, 500, 1000, 5000, 10000, 50000];

export default function DepositPage() {
  const { t } = useI18n();
  const { deposit } = useWallet();
  const { showToast } = useStore();
  const router = useRouter();
  const [amount, setAmount] = useState(100);
  const [method, setMethod] = useState("UPI");

  return (
    <InnerShell title={t("deposit")}>
      <div className="p-3 space-y-3">
        <div className="bg-white rounded-xl p-3">
          <p className="text-xs text-muted mb-2">{t("amount")}</p>
          <AmountField value={amount} onChange={setAmount} />
          <div className="grid grid-cols-3 gap-2 mt-3">
            {chips.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setAmount(c)}
                className={cn(
                  "h-9 rounded-lg text-sm font-semibold",
                  amount === c ? "bg-main-x text-white" : "bg-bg-l3 text-ink",
                )}
              >
                ₹{c}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-faint mt-2">{t("minDeposit")}</p>
        </div>
        <div className="bg-white rounded-xl p-3">
          <p className="text-xs text-muted mb-2">{t("upi")} / {t("bank")}</p>
          <div className="grid grid-cols-2 gap-2">
            {["UPI", "Bank", "Paytm", "PhonePe"].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMethod(m)}
                className={cn(
                  "h-10 rounded-lg text-sm",
                  method === m ? "bg-main-x text-main border border-main" : "bg-bg-l3",
                )}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
        <Button
          onClick={async () => {
            const err = await deposit(amount, method);
            if (err) return showToast(err);
            showToast(t("deposited"));
            router.push("/wallet");
          }}
        >
          {t("deposit")}
        </Button>
      </div>
    </InnerShell>
  );
}
