"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { DictKey, I18nVars, Lang } from "./i18n";
import { translate } from "./i18n";
import { getDb, hydrateDb, rid, subscribeDb, updateDb } from "@/lib/api/mock/db";
import { getToken, setToken } from "@/lib/api/token";

export type { StoredBet, Txn, User } from "@/lib/api/models";
export { DEMO_LOGIN } from "@/lib/api/mock/db";

export type ToastKind = "default" | "copy" | "warn";

type Toast = { id: string; text: string; kind: ToastKind } | null;

type StoreApi = {
  hydrated: boolean;
  lang: Lang;
  t: (key: DictKey, vars?: I18nVars) => string;
  setLang: (lang: Lang) => void;
  remember: boolean;
  setRemember: (v: boolean) => void;
  toast: Toast;
  showToast: (text: string, kind?: ToastKind) => void;
};

const Ctx = createContext<StoreApi | null>(null);

function bootSession() {
  const db = hydrateDb();
  if (db.currentPhone && !getToken()) {
    setToken(`mock:${db.currentPhone}`, db.remember ? "local" : "session");
  }
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [lang, setLangState] = useState<Lang>("en");
  const [remember, setRememberState] = useState(true);
  const [toast, setToast] = useState<Toast>(null);

  useEffect(() => {
    bootSession();
    const db = getDb();
    setLangState(db.lang);
    setRememberState(db.remember);
    setReady(true);
    return subscribeDb((next) => {
      setLangState(next.lang);
      setRememberState(next.remember);
    });
  }, []);

  const showToast = useCallback((text: string, kind: ToastKind = "default") => {
    const id = rid("t");
    setToast({ id, text, kind });
    window.setTimeout(() => {
      setToast((cur) => (cur?.id === id ? null : cur));
    }, 2200);
  }, []);

  const t = useCallback((key: DictKey, vars?: I18nVars) => translate(lang, key, vars), [lang]);

  const api: StoreApi = {
    hydrated: ready,
    lang,
    t,
    setLang: (next) => updateDb((p) => ({ ...p, lang: next })),
    remember,
    setRemember: (v) => updateDb((p) => ({ ...p, remember: v })),
    toast,
    showToast,
  };

  if (!ready) {
    return (
      <div className="min-h-dvh bg-main-y text-white flex items-center justify-center">
        <div className="h-10 w-10 rounded-full border-2 border-white/30 border-t-white animate-spin" />
      </div>
    );
  }

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useStore outside provider");
  return ctx;
}
