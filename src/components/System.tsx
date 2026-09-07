"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useStore } from "@/lib/store";

const PUBLIC = ["/", "/login", "/register", "/forgot", "/customer-service", "/home"];

function isPublic(pathname: string | null) {
  if (!pathname) return true;
  const path = pathname.replace(/\/+$/, "") || "/";
  return PUBLIC.includes(path);
}

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, hydrated } = useStore();
  const router = useRouter();
  const pathname = usePathname();
  const guestOk = isPublic(pathname);

  useEffect(() => {
    if (!hydrated) return;
    if (!user && !guestOk) router.replace("/login");
  }, [hydrated, user, guestOk, router]);

  if (!hydrated) return null;
  if (!user && !guestOk) return null;
  return <>{children}</>;
}

export function Settler() {
  const { settleDue } = useStore();
  useEffect(() => {
    settleDue();
    const t = setInterval(settleDue, 1000);
    return () => clearInterval(t);
  }, [settleDue]);
  return null;
}

export function ToastHost() {
  const { toast } = useStore();
  if (!toast) return null;
  return (
    <div className="pointer-events-none absolute inset-0 z-50 flex items-center justify-center px-10">
      <div className="bg-black/75 text-white text-sm px-4 py-2.5 rounded-lg max-w-[80%] text-center">
        {toast.text}
      </div>
    </div>
  );
}
