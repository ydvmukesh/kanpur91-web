"use client";

import { useState } from "react";
import { BookText, CalendarDays } from "lucide-react";
import { InnerShell } from "@/components/layout/InnerShell";
import { AlertModal, Button, EmptyState, HtmlContent } from "@/components/ui";
import { useI18n } from "@/hooks/useI18n";
import { useWallet } from "@/hooks/useWallet";
import { useStore } from "@/lib/store";
import { IMG, ImgIcon } from "@/lib/img";
import { formatMoney } from "@/lib/format";
import { GIFT_RECORDS } from "@/lib/redeem-gift";

export default function RedeemGiftPage() {
  const { t } = useI18n();
  const { showToast } = useStore();
  const { redeemGift } = useWallet();
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [alert, setAlert] = useState("");
  const rows = GIFT_RECORDS;

  async function onReceive() {
    const value = code.trim();
    if (!value) {
      showToast(t("enterGiftCode"));
      return;
    }
    setBusy(true);
    const err = await redeemGift(value);
    setBusy(false);
    if (err) {
      setAlert(err);
      return;
    }
    setCode("");
    showToast(t("successfullyRedeemed"));
  }

  return (
    <InnerShell title="" variant="main" headerClassName="bg-main-x">
      <div className="relative flex min-h-[calc(12rem-3rem)] w-full bg-main-x px-4 pb-18 pt-3 text-white">
        <div className="min-w-0 pr-[10.5rem]">
          <h3 className="text-[1.3125rem] font-bold leading-7">{t("hi")}</h3>
          <p className="mt-1.5 text-15 leading-snug text-white/90">{t("weHaveGift")}</p>
        </div>
        <ImgIcon
          src={IMG.redeemCrown}
          alt=""
          className="absolute -top-4 right-[1.375rem] h-[9.21875rem] w-[9.21875rem] object-contain"
        />
      </div>

      <div className="relative z-10 -mt-10 px-3 pb-8">
        <div className="rounded-lg bg-white p-4">
          <h4 className="text-base font-bold text-ink">{t("enterGiftCodeBelow")}</h4>
          <input
            type="text"
            autoComplete="off"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder={t("enterGiftCode")}
            className="mt-3.5 h-[2.125rem] w-full rounded-lg bg-bg-l1 px-3.5 text-sm text-ink outline-none placeholder:text-faint"
          />
          <Button className="mt-5" size="xs" disabled={busy} onClick={() => void onReceive()}>
            {t("redeem")}
          </Button>
        </div>

        <div className="mt-2.5 rounded-lg bg-white p-2.5">
          <h3 className="flex items-center gap-1.5 text-base font-bold text-ink">
            <CalendarDays className="h-6 w-6 text-main" />
            {t("history")}
          </h3>
          {rows.length === 0 ? <EmptyState compact className="py-6" /> : null}
          {rows.map((row) => (
            <div key={row.id} className="flex items-center justify-between py-3">
              <div>
                <p className="text-base font-bold text-green-norm">{t("successfullyRedeemed")}</p>
                <p className="mt-1.5 text-sm text-faint">{row.time}</p>
              </div>
              <p className="text-base font-bold text-secondary">₹{formatMoney(row.amount)}</p>
            </div>
          ))}
        </div>

        <div className="mt-2.5 rounded-lg bg-white p-2.5">
          <h3 className="flex items-center gap-1.5 text-base font-bold text-ink">
            <BookText className="h-6 w-6 text-main" />
            {t("redemptionNotes")}
          </h3>
          <HtmlContent
            html={`<ul><li>${t("redeemNote1")}</li><li>${t("redeemNote2")}</li></ul>`}
            className="mt-2.5 rounded-lg border border-line p-3"
          />
        </div>
      </div>
      <AlertModal open={Boolean(alert)} message={alert} onConfirm={() => setAlert("")} />
    </InnerShell>
  );
}
