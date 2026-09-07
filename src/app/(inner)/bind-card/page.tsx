"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { InnerHeader, Field, PrimaryButton } from "@/components/Ui";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/cn";

export default function BindCardPage() {
  const { t, user, updateUser, showToast } = useStore();
  const router = useRouter();
  const [tab, setTab] = useState<"upi" | "bank">("upi");
  const [upi, setUpi] = useState(user?.upi ?? "");
  const [holder, setHolder] = useState(user?.bank?.holder ?? "");
  const [account, setAccount] = useState(user?.bank?.account ?? "");
  const [ifsc, setIfsc] = useState(user?.bank?.ifsc ?? "");
  const [bankName, setBankName] = useState(user?.bank?.bankName ?? "");
  if (!user) return null;

  return (
    <div className="min-h-dvh bg-bg-l1">
      <InnerHeader title={t("bindCard")} />
      <div className="p-3">
        <div className="grid grid-cols-2 bg-white rounded-xl p-1 mb-3">
          {(["upi", "bank"] as const).map((x) => (
            <button
              key={x}
              type="button"
              onClick={() => setTab(x)}
              className={cn("h-9 rounded-lg text-sm font-semibold", tab === x ? "bg-main-x text-white" : "text-l2")}
            >
              {t(x === "upi" ? "upi" : "bank")}
            </button>
          ))}
        </div>
        {tab === "upi" ? (
          <Field>
            <input value={upi} onChange={(e) => setUpi(e.target.value)} placeholder={t("upiId")} className="flex-1 bg-transparent outline-none text-sm" />
          </Field>
        ) : (
          <div className="space-y-2">
            <Field>
              <input value={holder} onChange={(e) => setHolder(e.target.value)} placeholder={t("holderName")} className="flex-1 bg-transparent outline-none text-sm" />
            </Field>
            <Field>
              <input value={account} onChange={(e) => setAccount(e.target.value)} placeholder={t("accountNo")} className="flex-1 bg-transparent outline-none text-sm" />
            </Field>
            <Field>
              <input value={ifsc} onChange={(e) => setIfsc(e.target.value.toUpperCase())} placeholder={t("ifsc")} className="flex-1 bg-transparent outline-none text-sm" />
            </Field>
            <Field>
              <input value={bankName} onChange={(e) => setBankName(e.target.value)} placeholder={t("bankName")} className="flex-1 bg-transparent outline-none text-sm" />
            </Field>
          </div>
        )}
        <PrimaryButton
          className="mt-4"
          onClick={() => {
            if (tab === "upi") updateUser({ upi });
            else updateUser({ bank: { holder, account, ifsc, bankName } });
            showToast(t("saved"));
            router.back();
          }}
        >
          {t("save")}
        </PrimaryButton>
      </div>
    </div>
  );
}
