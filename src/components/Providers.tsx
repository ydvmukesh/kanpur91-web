"use client";

import { StoreProvider } from "@/lib/store";
import { AuthGuard, Settler, ToastHost } from "./System";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      <div className="h-dvh bg-[#9195a3] flex justify-center overflow-hidden">
        <div className="phone-scroll relative w-full max-w-[400px] h-dvh flex flex-col bg-bg-l1 shadow-[0_0_40px_rgba(30,38,55,.12)] overflow-y-auto">
          <AuthGuard>
            <Settler />
            {children}
          </AuthGuard>
          <ToastHost />
        </div>
      </div>
    </StoreProvider>
  );
}
