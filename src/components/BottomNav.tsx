"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/cn";
import { IMG, ImgIcon, TabMaskIcon } from "@/lib/img";

export function BottomNav() {
  const pathname = usePathname();
  const { t, user } = useStore();
  const items = [
    { href: "/home", label: t("home"), icon: IMG.tabHome },
    { href: "/activity", label: t("activity"), icon: IMG.tabActivity },
    { href: "/activity", label: t("get500"), icon: null, center: true },
    { href: "/promotion", label: t("promotion"), icon: IMG.tabPromotion },
    { href: "/account", label: t("account"), icon: IMG.tabAccount },
  ];
  const hrefFor = (href: string) => (!user && href !== "/home" ? "/login" : href);

  return (
    <nav className="shrink-0 z-40 overflow-visible bg-white border-t border-line pb-[env(safe-area-inset-bottom)]">
      <ul className="grid grid-cols-5 h-16">
        {items.map((item, idx) => {
          const active = item.center ? false : pathname === item.href;
          if (item.center) {
            return (
              <li key={`center-${idx}`} className="relative z-10">
                <Link
                  href={hrefFor(item.href)}
                  className="absolute inset-x-0 bottom-5 flex items-end justify-center h-[96px]"
                >
                  <ImgIcon src={IMG.wheel} alt="" className="h-[92px] w-[92px] object-contain" />
                  <span className="absolute bottom-2 text-[11px] text-main font-semibold leading-none pointer-events-none">
                    {item.label}
                  </span>
                </Link>
              </li>
            );
          }
          return (
            <li key={item.href + item.label}>
              <Link
                href={hrefFor(item.href)}
                className={cn(
                  "h-full flex flex-col items-center justify-center gap-0.5 text-[11px]",
                  active ? "text-main font-semibold" : "text-l2",
                )}
              >
                <TabMaskIcon src={item.icon as string} active={active} />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
