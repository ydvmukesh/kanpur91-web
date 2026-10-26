"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, CircleAlert, CreditCard, KeyRound, Landmark, Smartphone, UserRound } from "lucide-react";
import { InnerShell } from "@/components/layout/InnerShell";
import { Button } from "@/components/ui";
import { useUpdateMeMutation } from "@/hooks/mutations/useWalletMutations";
import { useI18n } from "@/hooks/useI18n";
import { useWallet } from "@/hooks/useWallet";
import { listBanks } from "@/lib/banks";
import { useStore } from "@/lib/store";

function Field({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-5">
      <p className="flex items-center gap-1.5 text-[13px] text-ink mb-2">
        <span className="text-main">{icon}</span>
        {label}
      </p>
      {children}
    </div>
  );
}

const inputCls =
  "w-full h-11 rounded-md bg-white px-4 text-[13px] text-ink placeholder:text-faint outline-none";

export default function AddBankCardPage() {
  const { t } = useI18n();
  const { user } = useWallet();
  const { showToast } = useStore();
  const updateUser = useUpdateMeMutation();
  const router = useRouter();
  const [bankName, setBankName] = useState("");
  const [holder, setHolder] = useState("");
  const [account, setAccount] = useState("");
  const [phone, setPhone] = useState("");
  const [ifsc, setIfsc] = useState("");

  useEffect(() => {
    const bank = sessionStorage.getItem("withdraw-bank");
    if (!bank) return;
    setBankName(bank);
    sessionStorage.removeItem("withdraw-bank");
  }, []);

  if (!user) return null;

  const canSave = Boolean(bankName && holder.trim() && account.trim() && phone.trim() && ifsc.trim());

  function save() {
    if (!canSave || !user) return;
    const next = {
      id: `bk${Date.now()}`,
      holder: holder.trim(),
      account: account.trim(),
      ifsc: ifsc.trim().toUpperCase(),
      bankName,
    };
    updateUser.mutate({
      banks: [...listBanks(user), next],
      selectedBankId: next.id,
      bank: next,
    });
    showToast(t("saved"));
    router.back();
  }

  return (
    <InnerShell title={t("addBankAccount")} variant="light" className="bg-page">
      <div className="mx-3.5 mt-4 pb-8">
        <p className="rounded-full bg-white px-3 py-2 text-xs text-main flex items-start gap-1.5">
          <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" />
          {t("bindBankHint")}
        </p>

        <Field icon={<Landmark className="h-4 w-4" />} label={t("chooseBank")}>
          <button
            type="button"
            onClick={() => router.push("/wallet/withdraw/choosebank")}
            className="w-full h-10 rounded-md bg-main-x px-4 flex items-center justify-between text-[13px] text-white"
          >
            <span className="truncate">{bankName || t("selectBank")}</span>
            <ChevronRight className="h-5 w-5 shrink-0" />
          </button>
        </Field>

        <Field icon={<UserRound className="h-4 w-4" />} label={t("recipientName")}>
          <input value={holder} onChange={(e) => setHolder(e.target.value.toUpperCase())} className={inputCls} placeholder={t("recipientName")} />
        </Field>

        <Field icon={<CreditCard className="h-4 w-4" />} label={t("bankAccountNumber")}>
          <input
            inputMode="numeric"
            value={account}
            onChange={(e) => setAccount(e.target.value.replace(/\D/g, "").slice(0, 18))}
            placeholder={t("enterBankAccount")}
            className={inputCls}
          />
        </Field>

        <Field icon={<Smartphone className="h-4 w-4" />} label={t("phone")}>
          <input
            inputMode="numeric"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
            placeholder={t("enterPhone")}
            className={inputCls}
          />
        </Field>

        <Field icon={<KeyRound className="h-4 w-4" />} label={t("ifscCode")}>
          <input
            value={ifsc}
            onChange={(e) => setIfsc(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 11))}
            placeholder={t("enterIfsc")}
            className={inputCls}
          />
        </Field>

        <Button className="mt-8"  size="sm" disabled={!canSave} onClick={save}>
          {t("save")}
        </Button>
      </div>
    </InnerShell>
  );
}
