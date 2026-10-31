"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FlagIN, FlagUS, IconBack } from "@/components/Icons";
import { LanguageSheet } from "@/components/layout/LanguageSheet";
import { LoginBrand } from "@/components/Logo";
import { useStore } from "@/lib/store";

export function AuthHeader({
  title,
  sub,
  children,
}: {
  title: string;
  sub?: React.ReactNode;
  children?: React.ReactNode;
}) {
  const router = useRouter();
  const { lang } = useStore();
  const [langOpen, setLangOpen] = useState(false);

  return (
    <div className="phone-scroll h-full min-h-0 overflow-y-auto">
      <div className="sticky top-0 z-30 bg-main-x text-white pt-safe-t">
        <div className="h-12 relative flex items-center px-1">
          <button
            type="button"
            onClick={() => router.back()}
            className="h-11 w-9 grid place-items-center z-10"
            aria-label="Back"
          >
            <IconBack />
          </button>
          <div className="absolute inset-0 grid place-items-center pointer-events-none">
            <LoginBrand />
          </div>
          <button
            type="button"
            onClick={() => setLangOpen(true)}
            className="ml-auto mr-2 h-11 flex items-center gap-1 z-10"
          >
            {lang === "en" ? <FlagUS /> : <FlagIN />}
            <span className="text-sm font-semibold">{lang === "en" ? "EN" : "HD"}</span>
          </button>
        </div>
      </div>

      <div className="bg-main-x text-white pb-8">
        <div className="px-5 pt-3">
          <h1 className="text-lg font-bold leading-tight">{title}</h1>
          {sub}
        </div>
      </div>
      {children}

      {langOpen ? <LanguageSheet onClose={() => setLangOpen(false)} /> : null}
    </div>
  );
}
