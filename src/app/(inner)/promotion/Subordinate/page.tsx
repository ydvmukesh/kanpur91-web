"use client";

import { useState } from "react";
import { InnerShell } from "@/components/layout/InnerShell";
import { EmptyState } from "@/components/ui";
import { useI18n } from "@/hooks/useI18n";
import { cn } from "@/lib/cn";

const TABS = ["today", "yesterday", "thisMonth"] as const;

export default function PromotionSubordinatePage() {
  const { t } = useI18n();
  const [tab, setTab] = useState<(typeof TABS)[number]>("today");
  const rows: never[] = [];

  return (
    <InnerShell title={t("newSub")} variant="light">
      <div className="grid grid-cols-3 gap-2 px-3 pt-3">
        {TABS.map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={cn(
              "h-10 rounded-[0.5rem] text-sm font-medium",
              tab === id ? "bg-main-x text-white" : "bg-white text-muted",
            )}
          >
            {t(id)}
          </button>
        ))}
      </div>
      {rows.length === 0 ? <EmptyState /> : null}
    </InnerShell>
  );
}
