"use client";

import { useState } from "react";
import { InnerShell } from "@/components/layout/InnerShell";
import { Button, TextField } from "@/components/ui";
import { useI18n } from "@/hooks/useI18n";
import { useWallet } from "@/hooks/useWallet";
import { useStore } from "@/lib/store";

export default function GiftPage() {
  const { t } = useI18n();
  const { redeemGift } = useWallet();
  const { showToast } = useStore();
  const [code, setCode] = useState("");
  return (
    <InnerShell title={t("gift")}>
      <div className="p-3 space-y-3">
        <div className="bg-white rounded-xl p-3">
          <TextField
            variant="line"
            value={code}
            onChange={setCode}
            placeholder={t("giftHint")}
            inputClassName="uppercase"
          />
          <Button
            className="mt-3"
            onClick={async () => {
              const err = await redeemGift(code);
              showToast(err ?? t("giftOk"));
              if (!err) setCode("");
            }}
          >
            {t("redeem")}
          </Button>
        </div>
        <p className="text-xs text-faint px-1">Try: KANPUR91 / WELCOME / 91CLUB</p>
      </div>
    </InnerShell>
  );
}
