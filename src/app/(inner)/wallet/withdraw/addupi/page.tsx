"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CircleAlert, CreditCard } from "lucide-react";
import { InnerShell } from "@/components/layout/InnerShell";
import { Button } from "@/components/ui";
import { useUpdateMeMutation } from "@/hooks/mutations/useWalletMutations";
import { useI18n } from "@/hooks/useI18n";
import { useWallet } from "@/hooks/useWallet";
import { useStore } from "@/lib/store";

export default function AddUpiPage() {
  const { t } = useI18n();
  const { user } = useWallet();
  const { showToast } = useStore();
  const updateUser = useUpdateMeMutation();
  const router = useRouter();
  const [upi, setUpi] = useState("");
  if (!user) return null;

  const canSave = Boolean(upi.trim());

  function save() {
    if (!canSave) return;
    updateUser.mutate({ upi: upi.trim() });
    showToast(t("saved"));
    router.back();
  }

  return (
    <InnerShell title={t("addUpi")} variant="light" className="bg-page">
      <div className="mx-3.5 mt-4 pb-8">
        <p className="rounded-full bg-white px-3 py-2 text-xs text-main flex items-start gap-1.5">
          <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" />
          {t("bindBankHint")}
        </p>
        <p className="mt-5 flex items-center gap-1.5 text-13 text-ink mb-2">
          <CreditCard className="h-4 w-4 text-main" />
          {t("upiId")}
        </p>
        <input
          value={upi}
          onChange={(e) => setUpi(e.target.value)}
          placeholder={t("enterUpi")}
          className="w-full h-11 rounded-md bg-white px-4 text-15 text-ink placeholder:text-faint outline-none"
        />
        <Button className="mt-8"  size="sm" disabled={!canSave} onClick={save}>
          {t("save")}
        </Button>
      </div>
    </InnerShell>
  );
}
