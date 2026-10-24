"use client";

import { FlagIN, FlagUS } from "@/components/Icons";
import { Sheet } from "@/components/layout/Sheet";
import { cn } from "@/lib/cn";
import { useStore } from "@/lib/store";

export function LanguageSheet({ onClose }: { onClose: () => void }) {
  const { t, lang, setLang } = useStore();

  return (
    <Sheet onClose={onClose}>
      <p className="text-center font-semibold text-ink mb-3">{t("language")}</p>
      {(
        [
          { id: "en" as const, label: t("english"), flag: <FlagUS /> },
          { id: "hd" as const, label: t("hindi"), flag: <FlagIN /> },
        ] as const
      ).map((opt) => (
        <button
          key={opt.id}
          type="button"
          onClick={() => {
            setLang(opt.id);
            onClose();
          }}
          className={cn(
            "w-full h-12 flex items-center gap-3 px-2 rounded-lg text-sm",
            lang === opt.id ? "text-main" : "text-ink",
          )}
        >
          {opt.flag}
          {opt.label}
          <span className="ml-auto text-main">{lang === opt.id ? "✓" : ""}</span>
        </button>
      ))}
    </Sheet>
  );
}
