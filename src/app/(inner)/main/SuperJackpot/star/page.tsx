"use client";

import { InnerShell } from "@/components/layout/InnerShell";
import { EmptyState } from "@/components/ui";
import { useI18n } from "@/hooks/useI18n";
import { formatMoney } from "@/lib/format";
import { ImgIcon } from "@/lib/img";
import { JACKPOT_STARS } from "@/lib/super-jackpot";

export default function SuperJackpotStarPage() {
  const { t } = useI18n();
  const rows = JACKPOT_STARS;

  return (
    <InnerShell title={t("winningStar")} variant="light" className="bg-page">
      <div className="px-3 pb-8">
        {rows.length === 0 ? <EmptyState /> : null}
        {rows.map((row) => (
          <article
            key={row.id}
            className="mt-3 mb-2.5 flex h-[12.9375rem] flex-col rounded-lg bg-white px-2.5 py-[0.9375rem]"
          >
            <div className="flex items-center">
              <ImgIcon src={row.avatar} alt="" className="h-[2.28125rem] w-[2.28125rem] rounded-full object-cover" />
              <p className="ml-2.5  text-sm font-bold text-ink">{row.name}</p>
            </div>
            <div className="mt-auto flex flex-col gap-[0.15625rem]">
              <div className="flex h-[1.85rem] items-center justify-between rounded-[0.2rem] bg-bg-l3 px-2.5 py-1.75">
                <span className="text-xs text-muted">{t("gameName")}</span>
                <span className="text-xs text-ink">{row.gameName}</span>
              </div>
              <div className="flex h-[1.85rem] items-center justify-between rounded-[0.2rem] bg-bg-l3 px-2.5 py-1.75">
                <span className="text-xs text-muted">{t("numberOfWins")}</span>
                <span className="text-sm font-medium text-secondary">{row.multiple}X</span>
              </div>
              <div className="flex h-[1.85rem] items-center justify-between rounded-[0.2rem] bg-bg-l3 px-2.5 py-1.75">
                <span className="text-xs text-muted">{t("bonus")}</span>
                <span className="text-sm font-medium text-red-norm">₹{formatMoney(row.bonus)}</span>
              </div>
              <div className="flex h-[1.85rem] items-center justify-between rounded-[0.2rem] bg-bg-l3 px-2.5 py-1.75">
                <span className="text-xs text-muted">{t("winningTime")}</span>
                <span className="text-xs text-muted">{row.time}</span>
              </div>
            </div>
          </article>
        ))}
        {rows.length > 0 ? <p className="pt-3 text-center text-sm text-ink">{t("noMore")}</p> : null}
      </div>
    </InnerShell>
  );
}
