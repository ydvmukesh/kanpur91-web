"use client";

import { IconCoin } from "@/components/Icons";
import { useI18n } from "@/hooks/useI18n";
import type { BonusRow } from "@/lib/activity";
import { formatMoney } from "@/lib/format";

export function BonusCard({ row }: { row: BonusRow }) {
  const { t } = useI18n();
  return (
    <div className="rounded-lg bg-white px-3 py-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 text-15 font-semibold text-secondary">
            <IconCoin />
            ₹{formatMoney(row.amount)}
          </p>
          <p className="mt-1 text-sm text-ink">{t(row.type)}</p>
          <p className="mt-0.5 text-11 text-faint">{row.time}</p>
        </div>
        <span className="shrink-0 rounded-full bg-[#eef1f6] px-3 py-1 text-xs text-muted">
          {t(row.status === "collect" ? "toBeCollected" : row.status)}
        </span>
      </div>
    </div>
  );
}
