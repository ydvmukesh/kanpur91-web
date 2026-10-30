"use client";

import { CircleCheck } from "lucide-react";
import { FlagIN, FlagUS } from "@/components/Icons";
import { Sheet } from "@/components/layout/Sheet";
import { cn } from "@/lib/cn";
import { LANGUAGES } from "@/lib/languages";
import { useStore } from "@/lib/store";

export function LanguageSheet({ onClose }: { onClose: () => void }) {
  const { t, lang, setLang } = useStore();

  return (
    <Sheet onClose={onClose}>
      <p className="mb-3 text-center font-semibold text-ink">{t("language")}</p>
      {LANGUAGES.map((opt) => {
        const on = lang === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => {
              setLang(opt.id);
              onClose();
            }}
            className={cn(
              "flex h-12 w-full items-center gap-3 rounded-lg px-2 text-sm",
              on ? "text-main" : "text-ink",
            )}
          >
            {opt.flag === "us" ? <FlagUS /> : <FlagIN />}
            {opt.name}
            <span className="ml-auto grid size-5 place-items-center">
              {on ? <CircleCheck className="size-5 fill-main text-inverse" /> : null}
            </span>
          </button>
        );
      })}
    </Sheet>
  );
}
