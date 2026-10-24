"use client";

import { InnerShell } from "@/components/layout/InnerShell";
import { useStore } from "@/lib/store";

export default function GuidePage() {
  const { t } = useStore();
  const steps = [t("guide1"), t("guide2"), t("guide3"), t("guide4")];
  return (
    <InnerShell title={t("guide")}>
      <div className="p-3 space-y-2">
        {steps.map((s, i) => (
          <div key={s} className="bg-white rounded-xl p-4 flex gap-3">
            <span className="h-7 w-7 rounded-full bg-main-x text-white grid place-items-center text-sm font-bold">
              {i + 1}
            </span>
            <p className="text-sm pt-1">{s}</p>
          </div>
        ))}
      </div>
    </InnerShell>
  );
}
