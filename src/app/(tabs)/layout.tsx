"use client";

import { BottomNav } from "@/components/BottomNav";
import { InstallBanner } from "@/components/HomeFabs";
import { cn } from "@/lib/cn";

export default function TabsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 min-h-0 h-full relative flex flex-col">
      <div className={cn("phone-scroll min-h-0 flex-1 overflow-y-auto overscroll-y-contain")}>{children}</div>
      {/* <InstallBanner /> */}
      <BottomNav />
    </div>
  );
}
