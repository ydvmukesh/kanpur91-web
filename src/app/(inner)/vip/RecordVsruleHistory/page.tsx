"use client";

import { InnerShell } from "@/components/layout/InnerShell";
import { useI18n } from "@/hooks/useI18n";
import { vipHistoryRows } from "@/lib/vip";

export default function VipRecordHistoryPage() {
  const { t } = useI18n();
  const items = vipHistoryRows(t);

  return (
    <InnerShell title={t("history")} variant="light" className="bg-page">
      <div className="mx-3 mt-3 mb-6">
        <div className="rounded-lg bg-white px-3 py-3.5">
          {items.map((item, i) => (
            <div key={item.id} className={i > 0 ? "mt-3 border-t border-line pt-3" : ""}>
              <p className={item.tone === "orange" ? "text-sm font-medium text-secondary" : "text-sm font-medium text-main"}>
                {item.title}
              </p>
              <p className="mt-1 text-xs leading-snug text-muted">{item.body}</p>
              <div className="mt-1.5 flex items-end justify-between gap-2">
                <span className="text-11 text-faint">{item.time}</span>
                {item.exp ? <span className="text-11 text-muted">{item.exp}</span> : null}
              </div>
            </div>
          ))}
        </div>
        <p className="pt-4 text-center text-sm text-ink">{t("noMore")}</p>
      </div>
    </InnerShell>
  );
}
