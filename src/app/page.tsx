"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogoWhite } from "@/components/Logo";
import { useStore } from "@/lib/store";

export default function SplashPage() {
  const router = useRouter();
  const { hydrated } = useStore();
  const [pct, setPct] = useState(8);

  useEffect(() => {
    const t = setInterval(() => setPct((p) => Math.min(p + 7, 100)), 80);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!hydrated || pct < 100) return;
    router.replace("/home");
  }, [hydrated, pct, router]);

  return (
    <div className="min-h-dvh bg-main-y flex flex-col items-center justify-between py-24 px-10">
      <div />
      <div className="flex flex-col items-center gap-4">
        <LogoWhite className="h-14" />
        <p className="text-white/80 text-sm">Lottery · Win Go · K3 · 5D</p>
      </div>
      <div className="w-full">
        <div className="h-1.5 rounded-full bg-white/25 overflow-hidden">
          <div className="h-full bg-white rounded-full transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>
    </div>
  );
}
