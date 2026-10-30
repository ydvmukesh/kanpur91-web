"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { openEventRewardsLogin } from "@/components/EventRewardsLoginDialog";
import { useAuth } from "@/hooks/useAuth";
import { applySettleCache } from "@/hooks/mutations/useBetMutations";
import { isAuthOnly, isPublic, safeNext } from "@/lib/auth/routes";
import { betsApi } from "@/lib/api/resources/bets";
import { USE_MOCK } from "@/lib/api/env";
import { subscribeTokenExpired } from "@/lib/api/token";
import { Check } from "lucide-react";
import { Splash } from "@/components/Splash";
import { cn } from "@/lib/cn";
import { useStore } from "@/lib/store";

let splashDone = false;

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, hydrated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const guestOk = isPublic(pathname);
  const authOnly = isAuthOnly(pathname);
  const [showSplash, setShowSplash] = useState(!splashDone);
  const lastPublic = useRef("/home");
  const hadUser = useRef(false);

  useEffect(() => {
    if (guestOk && (pathname === "/home" || pathname === "/activity" || pathname === "/promotion")) {
      lastPublic.current = pathname;
    }
  }, [guestOk, pathname]);

  useEffect(() => {
    if (!hydrated) return;
    splashDone = true;
    setShowSplash(false);
  }, [hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    if (user) {
      hadUser.current = true;
      if (authOnly) {
        const next = new URLSearchParams(window.location.search).get("next");
        router.replace(safeNext(next));
      }
      return;
    }
    if (hadUser.current) {
      hadUser.current = false;
      router.replace("/login");
      return;
    }
    if (!guestOk) {
      const search = typeof window !== "undefined" ? window.location.search : "";
      const intended = `${pathname}${search}`;
      router.replace(lastPublic.current);
      openEventRewardsLogin(intended);
    }
  }, [hydrated, user, guestOk, authOnly, pathname, router]);

  if (showSplash) return <Splash />;
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

const TOAST_FADE_MS = 300;

export function ToastHost() {
  const { toast, t, showToast } = useStore();
  const [view, setView] = useState(toast);
  const [shown, setShown] = useState(false);

  useEffect(() => subscribeTokenExpired(() => showToast(t("tokenExpired"), "warn")), [t, showToast]);

  useEffect(() => {
    if (toast) {
      setView(toast);
      setShown(false);
      let inner = 0;
      const outer = requestAnimationFrame(() => {
        inner = requestAnimationFrame(() => setShown(true));
      });
      return () => {
        cancelAnimationFrame(outer);
        cancelAnimationFrame(inner);
      };
    }
    setShown(false);
    const tmr = window.setTimeout(() => setView(null), TOAST_FADE_MS);
    return () => window.clearTimeout(tmr);
  }, [toast]);

  if (!view) return null;
  return (
    <div className="pointer-events-none absolute inset-0 z-50 flex items-center justify-center px-10">
      {view.kind === "copy" || view.kind === "warn" ? (
        <div
          className={cn(
            "app-toast flex flex-col items-center justify-center rounded-[0.75rem] bg-[rgba(0,0,0,0.7)] text-white",
            view.kind === "copy" ? "h-[7.5rem] w-[7.5rem] rounded-[0.5rem] px-2" : "h-[10.625rem] w-[8.75rem] px-3 py-5",
            shown && "is-in",
          )}
        >
          {view.kind === "copy" ? <Check className="h-8 w-8" /> : <span className="text-[2.5rem] leading-none font-light">!</span>}
          <p className="mt-3 text-center text-sm leading-snug whitespace-pre-line">{view.text}</p>
        </div>
      ) : (
        <div className={cn("app-toast max-w-[80%] rounded-lg bg-black/75 px-4 py-2.5 text-center text-sm text-white", shown && "is-in")}>
          {view.text}
        </div>
      )}
    </div>
  );
}
