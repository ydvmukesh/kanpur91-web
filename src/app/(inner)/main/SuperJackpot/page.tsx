"use client";

import Link from "next/link";
import { ClipboardList, Crown, LayoutGrid } from "lucide-react";
import { InnerShell } from "@/components/layout/InnerShell";
import { Button, EmptyState } from "@/components/ui";
import { useI18n } from "@/hooks/useI18n";
import { IMG } from "@/lib/img";
import { JACKPOT_RECORDS } from "@/lib/super-jackpot";

export default function SuperJackpotPage() {
  const { t } = useI18n();
  const rows = JACKPOT_RECORDS;

  return (
    <InnerShell title={t("superJackpot")} variant="light" className="bg-page">
      <div
        className="flex min-h-[11.5625rem] justify-between bg-cover bg-no-repeat px-3.5"
        style={{ backgroundImage: `url(${IMG.superJackpotBg})` }}
      >
        <div className="max-w-[58%] py-3 text-white">
          <h2 className="text-22 font-semibold mb-4">{t("superJackpot")}</h2>
          <p className="mt-2 text-xs leading-snug">{t("jackpotSlotsBonus", { cat: t("slots") })}</p>
          <p className="mt-2 text-xs leading-snug">{t("jackpotExpireHint")}</p>
        </div>
      </div>

      <div className="px-3 pb-10 pt-3">
        <button
          type="button"
          disabled
          className="flex h-10 w-full items-center justify-center gap-1.5 rounded-full bg-[#CDCFDD] text-sm font-medium text-white"
        >
          <LayoutGrid className="h-5 w-5" />
          {t("receiveInBatches")}
        </button>

        <div className="mt-3 grid grid-cols-2 gap-2.5">
          <Link
            href="/main/SuperJackpot/rule"
            className="flex h-[3rem] items-center justify-center gap-2 rounded-md bg-white text-sm font-medium text-ink"
          >
            <ClipboardList className="h-6 w-6 text-main" />
            {t("jackpotRule")}
          </Link>
          <Link
            href="/main/SuperJackpot/WinningStar"
            className="flex h-[3rem] items-center justify-center gap-2 rounded-md bg-white text-sm font-medium text-ink"
          >
            <span className="grid h-6 w-6 place-items-center rounded-full bg-main text-white">
              <Crown className="h-3.5 w-3.5 fill-white" />
            </span>
            {t("winningStar")}
          </Link>
        </div>

        <div className="mt-3 overflow-hidden rounded-xl bg-white">
          {rows.length === 0 ? <EmptyState label={t("noBigJackpot")} className="py-10" /> : null}
          {rows.map((row) => (
            <article key={row.id} className="border-b border-line px-3 py-3 last:border-0">
              <p className="text-sm font-medium text-secondary">₹{row.amount}</p>
              <p className="mt-1 text-11 text-faint">{row.time}</p>
            </article>
          ))}
        </div>

        <Button className="mt-4" size="sm" href="/home">
          {t("goBet")}
        </Button>
      </div>
    </InnerShell>
  );
}
