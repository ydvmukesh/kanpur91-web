"use client";

import { useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { LocaleHtml } from "@/components/layout/LocaleHtml";
import { useRealtime } from "@/hooks/useRealtime";
import { StoreProvider } from "@/lib/store";
import { createQueryClient } from "@/lib/query/client";
import { PwaBoot } from "./PwaBoot";
import { AuthGuard, Settler, ToastHost } from "./System";

function RealtimeGate() {
  useRealtime();
  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(createQueryClient);
  return (
    <QueryClientProvider client={queryClient}>
      <StoreProvider>
        <LocaleHtml />
        <PwaBoot />
        <div className="h-dvh bg-phone-frame flex justify-center overflow-hidden">
          <div
            id="phone-root"
            className="phone-scroll relative w-full max-w-[25rem] h-dvh flex flex-col bg-page shadow-[0_0_2.5rem_rgba(30,38,55,.12)] overflow-y-auto"
          >
            <AuthGuard>
              <RealtimeGate />
              <Settler />
              {children}
            </AuthGuard>
            <ToastHost />
          </div>
        </div>
      </StoreProvider>
    </QueryClientProvider>
  );
}
