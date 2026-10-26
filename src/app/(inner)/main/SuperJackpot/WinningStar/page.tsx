"use client";

import { InnerShell } from "@/components/layout/InnerShell";
import { EmptyState } from "@/components/ui";
import { useI18n } from "@/hooks/useI18n";

export default function SuperJackpotWinningStarPage() {
  const { t } = useI18n();
  return (
    <InnerShell title={t("winningStar")} variant="light" className="bg-page">
      <EmptyState />
    </InnerShell>
  );
}
