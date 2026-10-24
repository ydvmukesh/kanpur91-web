"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { InnerShell } from "@/components/layout/InnerShell";
import { useI18n } from "@/hooks/useI18n";
import { BANKS } from "@/lib/banks";

export default function ChooseBankPage() {
  const { t } = useI18n();
  const router = useRouter();
  const [q, setQ] = useState("");

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return BANKS;
    return BANKS.filter((name) => name.toLowerCase().includes(s));
  }, [q]);

  return (
    <InnerShell
      title={t("chooseBank")}
      variant="light"
      className="bg-page"
      headerExtra={
        <div className="bg-white px-4 pb-3 pt-2 flex items-center gap-2">
          <Search className="h-5 w-5 text-main shrink-0" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t("searchBank")}
            className="flex-1 min-w-0 bg-transparent outline-none text-sm text-ink placeholder:text-faint"
          />
        </div>
      }
    >
      <div className="mx-3.5 mt-4 mb-8 bg-white rounded-lg overflow-hidden mx-5">
        <p className="px-4 py-3 text-sm text-muted border-b border-line">{t("chooseBank")}</p>
        {list.map((name) => (
          <button
            key={name}
            type="button"
            onClick={() => {
              sessionStorage.setItem("withdraw-bank", name);
              router.back();
            }}
            className="w-full text-left pl-8 pr-4 py-3.5 text-sm text-muted border-b border-line last:border-0"
          >
            {name}
          </button>
        ))}
      </div>
    </InnerShell>
  );
}
