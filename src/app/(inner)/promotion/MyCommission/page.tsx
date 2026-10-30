"use client";

import { useState } from "react";
import { InnerShell } from "@/components/layout/InnerShell";
import { DateSelect } from "@/components/ui";
import { useI18n } from "@/hooks/useI18n";

export default function MyCommissionPage() {
  const { t } = useI18n();
  const [date, setDate] = useState("2026-10-28");

  return (
    <InnerShell
      title={t("commissionDetails")}
      variant="light"
      headerExtra={
        <div className="bg-page px-3 pt-3">
          <DateSelect value={date} onChange={setDate} calendar={false} />
        </div>
      }
    />
  );
}
