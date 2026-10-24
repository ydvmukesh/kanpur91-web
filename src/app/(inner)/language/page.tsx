"use client";

import { InnerShell } from "@/components/layout/InnerShell";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/cn";

export default function LanguagePage() {
  const { t, lang, setLang } = useStore();
  return (
    <InnerShell title={t("language")}>
      <div className="m-3 bg-white rounded-xl overflow-hidden">
        {(["en", "hd"] as const).map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => setLang(l)}
            className="w-full flex items-center justify-between h-12 px-4 border-b border-line last:border-0 text-sm"
          >
            {l === "en" ? t("english") : t("hindi")}
            <span className={cn("h-4 w-4 rounded-full border", lang === l ? "border-main bg-main" : "border-faint")} />
          </button>
        ))}
      </div>
    </InnerShell>
  );
}
