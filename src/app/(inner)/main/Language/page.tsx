"use client";

import { CircleCheck } from "lucide-react";
import { FlagIN, FlagUS } from "@/components/Icons";
import { InnerShell } from "@/components/layout/InnerShell";
import { useI18n } from "@/hooks/useI18n";
import { cn } from "@/lib/cn";
import { LANGUAGES } from "@/lib/languages";

export default function LanguagePage() {
  const { t, lang, setLang } = useI18n();

  return (
    <InnerShell title={t("language")} variant="light">
      <div className="flex flex-col gap-2 px-3 pt-3">
        {LANGUAGES.map((item) => {
          const on = lang === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setLang(item.id)}
              className={cn(
                "flex h-12 w-full shrink-0 items-center gap-3 rounded-lg px-3 text-left text-sm text-ink",
                on ? "bg-white" : "bg-transparent",
              )}
            >
              {item.flag === "us" ? <FlagUS /> : <FlagIN />}
              <span className="min-w-0 flex-1">{item.name}</span>
              <span className="grid size-6 shrink-0 place-items-center">
                {on ? (
                  <CircleCheck className="size-6 fill-main text-inverse" />
                ) : (
                  <span className="size-6 rounded-full border border-line" />
                )}
              </span>
            </button>
          );
        })}
      </div>
    </InnerShell>
  );
}
