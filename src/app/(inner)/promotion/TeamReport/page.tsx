"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { IconCopy } from "@/components/Icons";
import { InnerShell } from "@/components/layout/InnerShell";
import { FilterDateRow } from "@/components/ui";
import { useI18n } from "@/hooks/useI18n";
import { copyText } from "@/lib/format";
import { TEAM_REPORT_ROWS } from "@/lib/team-report";
import { useStore } from "@/lib/store";

export default function TeamReportPage() {
  const { t } = useI18n();
  const { showToast } = useStore();
  const [q, setQ] = useState("");
  const [query, setQuery] = useState("");
  const [scope, setScope] = useState("all");
  const [date, setDate] = useState("2026-10-28");

  const rows = useMemo(
    () =>
      TEAM_REPORT_ROWS.filter((row) => {
        if (query && !row.uid.includes(query.trim())) return false;
        if (scope !== "all" && row.level !== Number(scope)) return false;
        if (date && row.time !== date) return false;
        return true;
      }),
    [query, date, scope],
  );

  const stats = [
    { n: 0, label: t("depositNumber") },
    { n: 0, label: t("depositAmount") },
    { n: 0, label: t("numberOfBettors") },
    { n: 0, label: t("totalBet") },
    { n: 0, label: t("firstDepositPeople") },
    { n: 0, label: t("firstDepositAmount") },
  ];

  return (
    <InnerShell
      title={t("subordinate")}
      variant="light"
      headerExtra={
        <div className="bg-page px-3 pt-3">
          <div className="flex h-11 items-center rounded-lg bg-white pl-3 pr-1">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t("searchSubordinateUid")}
              className="min-w-0 flex-1 bg-transparent text-15 text-ink outline-none placeholder:text-faint"
            />
            <button
              type="button"
              className="grid h-9 w-15 shrink-0 place-items-center rounded-lg bg-main text-white"
              onClick={() => setQuery(q)}
              aria-label={t("searchSubordinateUid")}
            >
              <Search className="h-5 w-5" />
            </button>
          </div>
          <FilterDateRow
            className="mt-2.5"
            value={scope}
            onChange={setScope}
            options={[
              { id: "all", label: t("all") },
              ...[1, 2, 3, 4, 5, 6].map((n) => ({ id: String(n), label: t("tier", { n: String(n) }) })),
            ]}
            date={date}
            onDateChange={setDate}
          />
        </div>
      }
    >
      <div className="px-3 pb-8 pt-2.5">
        <div className="grid grid-cols-2 overflow-hidden rounded-lg bg-main text-white">
          {stats.map((item) => (
            <div key={item.label} className="border-white/25 px-2 py-3 text-center odd:border-r [&:nth-child(-n+4)]:border-b">
              <p className="text-base font-semibold">{item.n}</p>
              <p className="mt-1 text-11 leading-snug text-white/90">{item.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-2.5 space-y-2.5">
          {rows.map((row) => (
            <article key={row.uid} className="rounded-lg bg-white px-3 py-3">
              <button
                type="button"
                className="flex items-center gap-1.5 border-b border-line pb-2.5 text-left text-15 font-medium text-ink w-full"
                onClick={() => {
                  void copyText(row.uid);
                  showToast(t("copied"), "copy");
                }}
              >
                {t("uid")}:{row.uid}
                <IconCopy />
              </button>
              <div className="mt-2.5 flex justify-between text-13">
                <span className="text-muted">{t("level")}</span>
                <span className="text-ink">{row.level}</span>
              </div>
              <div className="mt-2 flex justify-between text-13">
                <span className="text-muted">{t("depositAmount")}</span>
                <span className="text-secondary">{row.deposit}</span>
              </div>
              <div className="mt-2 flex justify-between text-13">
                <span className="text-muted">{t("commission")}</span>
                <span className="text-secondary">{row.commission}</span>
              </div>
              <div className="mt-2 flex justify-between text-13">
                <span className="text-muted">{t("timeLabel")}</span>
                <span className="text-faint">{row.time}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </InnerShell>
  );
}
