"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { applySettleCache } from "@/hooks/mutations/useBetMutations";
import { isAuthOnly, isPublic, loginUrl, safeNext } from "@/lib/auth/routes";
import { betsApi } from "@/lib/api/resources/bets";
import { USE_MOCK } from "@/lib/api/env";
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
  const { toast } = useStore();
  if (!toast) return null;
  return (
    <div className="pointer-events-none absolute inset-0 z-50 flex items-center justify-center px-10">
      {toast.kind === "copy" ? (
        <div className="h-[120px] w-[120px] rounded-[8px] bg-[rgba(0,0,0,0.7)] text-white px-2 flex flex-col items-center justify-center">
            <Check className="h-8 w-8"  />
        
          <p className="mt-3 text-sm leading-snug text-center whitespace-pre-line">{toast.text}</p>
        </div>
      ) : (
        <div className="bg-black/75 text-white text-sm px-4 py-2.5 rounded-lg max-w-[80%] text-center">
          {toast.text}
        </div>
      )}
    </div>
  );
}
