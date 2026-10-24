"use client";

import { useStore } from "@/lib/store";

export function useI18n() {
  const { t, lang, setLang } = useStore();
  return { t, lang, setLang };
}
