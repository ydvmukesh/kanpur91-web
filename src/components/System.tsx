"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { applySettleCache } from "@/hooks/mutations/useBetMutations";
import { isAuthOnly, isPublic, loginUrl, safeNext } from "@/lib/auth/routes";
import { betsApi } from "@/lib/api/resources/bets";
import { USE_MOCK } from "@/lib/api/env";
import { subscribeTokenExpired } from "@/lib/api/token";
import { Check } from "lucide-react";
import { useStore } from "@/lib/store";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, hydrated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const guestOk = isPublic(pathname);
  const authOnly = isAuthOnly(pathname);

  useEffect(() => {
    if (!hydrated) return;
    if (!user && !guestOk) {
      const search = typeof window !== "undefined" ? window.location.search : "";
      router.replace(loginUrl(`${pathname}${search}`));
      return;
    }
    if (user && authOnly) {
      const next = new URLSearchParams(window.location.search).get("next");
      router.replace(safeNext(next));
    }
  }, [hydrated, user, guestOk, authOnly, pathname, router]);

  if (!hydrated) return null;
  if (!user && !guestOk) return null;
  if (user && authOnly) return null;
  return <>{children}</>;
}

export function Settler() {
  const qc = useQueryClient();
  const { user } = useAuth();
  useEffect(() => {
    if (!user || !USE_MOCK) return;
    const tick = () => {
      const result = betsApi.settleDue();
      void Promise.resolve(result).then((res) => applySettleCache(qc, res));
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [qc, user]);
  return null;
}

export function ToastHost() {
  const { toast, t, showToast } = useStore();

  useEffect(() => subscribeTokenExpired(() => showToast(t("tokenExpired"), "warn")), [t, showToast]);

  if (!toast) return null;
  return (
    <div className="pointer-events-none absolute inset-0 z-50 flex items-center justify-center px-10">
      {toast.kind === "copy" || toast.kind === "warn" ? (
        <div className="flex h-[7.5rem] w-[7.5rem] flex-col items-center justify-center rounded-[0.5rem] bg-[rgba(0,0,0,0.7)] px-2 text-white">
          {toast.kind === "copy" ? <Check className="h-8 w-8" /> : <span className="text-[2rem] leading-none font-light">!</span>}
          <p className="mt-3 text-center text-sm leading-snug whitespace-pre-line">{toast.text}</p>
        </div>
      ) : (
        <div className="max-w-[80%] rounded-lg bg-black/75 px-4 py-2.5 text-center text-sm text-white">{toast.text}</div>
      )}
    </div>
  );
}
