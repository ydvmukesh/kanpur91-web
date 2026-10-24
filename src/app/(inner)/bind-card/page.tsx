"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { InnerShell } from "@/components/layout/InnerShell";
import { Button, TextField } from "@/components/ui";
import { cn } from "@/lib/cn";
import { useUpdateMeMutation } from "@/hooks/mutations/useWalletMutations";
import { useAuth } from "@/hooks/useAuth";
import { useStore } from "@/lib/store";

export default function BindCardPage() {
  const { t, showToast } = useStore();
  const { user } = useAuth();
  const updateUser = useUpdateMeMutation();
  const router = useRouter();
  const [tab, setTab] = useState<"upi" | "bank">("upi");
  const [upi, setUpi] = useState(user?.upi ?? "");
  const [holder, setHolder] = useState(user?.bank?.holder ?? "");
  const [account, setAccount] = useState(user?.bank?.account ?? "");
  const [ifsc, setIfsc] = useState(user?.bank?.ifsc ?? "");
  const [bankName, setBankName] = useState(user?.bank?.bankName ?? "");
  if (!user) return null;

  return (
    <InnerShell title={t("bindCard")}>
      <div className="p-3">
        <div className="grid grid-cols-2 bg-white rounded-xl p-1 mb-3">
          {(["upi", "bank"] as const).map((x) => (
            <button
              key={x}
              type="button"
              onClick={() => setTab(x)}
              className={cn("h-9 rounded-lg text-sm font-semibold", tab === x ? "bg-main-x text-white" : "text-muted")}
            >
              {t(x === "upi" ? "upi" : "bank")}
            </button>
          ))}
        </div>
        {tab === "upi" ? (
          <TextField variant="line" value={upi} onChange={setUpi} placeholder={t("upiId")} />
        ) : (
          <div className="space-y-2">
            <TextField variant="line" value={holder} onChange={setHolder} placeholder={t("holderName")} />
            <TextField variant="line" value={account} onChange={setAccount} placeholder={t("accountNo")} />
            <TextField
              variant="line"
              value={ifsc}
              onChange={(v: string) => setIfsc(v.toUpperCase())}
              placeholder={t("ifsc")}
            />
            <TextField variant="line" value={bankName} onChange={setBankName} placeholder={t("bankName")} />
          </div>
        )}
        <Button
          className="mt-4"
          onClick={() => {
            if (tab === "upi") updateUser.mutate({ upi });
            else {
              const next = { id: `bk${Date.now()}`, holder, account, ifsc, bankName };
              updateUser.mutate({
                banks: [...(user.banks ?? (user.bank ? [user.bank] : [])), next],
                selectedBankId: next.id,
                bank: next,
              });
            }
            showToast(t("saved"));
            router.back();
          }}
        >
          {t("save")}
        </Button>
      </div>
    </InnerShell>
  );
}
