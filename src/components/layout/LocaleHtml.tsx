"use client";

import { useEffect } from "react";
import { htmlLang } from "@/lib/i18n";
import { useStore } from "@/lib/store";

export function LocaleHtml() {
  const { lang } = useStore();
  useEffect(() => {
    document.documentElement.lang = htmlLang(lang);
  }, [lang]);
  return null;
}
