"use client";

import { useState } from "react";
import { InnerHeader, Field, PrimaryButton } from "@/components/Ui";
import { useStore } from "@/lib/store";

export default function GiftPage() {
  const { t, redeemGift, showToast } = useStore();
  const [code, setCode] = useState("");
  return (
    <div className="min-h-dvh bg-bg-l1">
      <InnerHeader title={t("gift")} />
      <div className="p-3 space-y-3">
        <div className="bg-white rounded-xl p-3">
          <Field>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={t("giftHint")}
              className="flex-1 bg-transparent outline-none text-sm uppercase"
            />
          </Field>
          <PrimaryButton
            className="mt-3"
            onClick={() => {
              const err = redeemGift(code);
              showToast(err ?? t("giftOk"));
              if (!err) setCode("");
            }}
          >
            {t("redeem")}
          </PrimaryButton>
        </div>
        <p className="text-xs text-l3 px-1">Try: KANPUR91 / WELCOME / 91CLUB</p>
      </div>
    </div>
  );
}
