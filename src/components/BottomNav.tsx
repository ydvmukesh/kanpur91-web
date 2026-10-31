"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { openEventRewardsLogin } from "@/components/EventRewardsLoginDialog";
import { cn } from "@/lib/cn";
import { IMG, ImgIcon, TabMaskIcon } from "@/lib/img";
import { useAuth } from "@/hooks/useAuth";
import { useStore } from "@/lib/store";

export function BottomNav() {
  const pathname = usePathname();
  const { t } = useStore();
  const { user } = useAuth();
  const items = [
    { href: "/", label: t("home"), icon: IMG.tabHome },
    { href: "/activity", label: t("activity"), icon: IMG.tabActivity },
    { href: "/activity", label: t("get500"), icon: null, center: true },
    { href: "/promotion", label: t("promotion"), icon: IMG.tabPromotion },
    { href: "/account", label: t("account"), icon: IMG.tabAccount },
  ];
  return (
    <nav className="shrink-0 z-40 overflow-visible bg-white border-t border-line pb-safe-b">
      <ul className="grid grid-cols-5 h-16">
        {items.map((item, idx) => {
          const active = item.center ? false : pathname === item.href;
          if (item.center) {
            return (
              <li key={`center-${idx}`} className="relative z-10">
                <Link
                  href={item.href}
                  className="absolute inset-x-0 bottom-5 flex items-end justify-center h-[6rem]"
                >
                  <ImgIcon src={IMG.wheel} alt="" className="h-[5.75rem] w-[5.75rem] object-contain" />
                  <span className="absolute bottom-2 text-11 text-main font-semibold leading-none pointer-events-none">
                    {item.label}
                  </span>
                </Link>
              </li>
            );
          }
          const guestGate = !user && item.href === "/account";
          const cls = cn(
            "h-full w-full flex flex-col items-center justify-center gap-0.5 text-11",
            active ? "text-main font-semibold" : "text-muted",
          );
          return (
            <li key={item.href + item.label}>
              {guestGate ? (
                <button type="button" className={cls} onClick={() => openEventRewardsLogin(item.href)}>
                  <TabMaskIcon src={item.icon as string} active={active} />
                  {item.label}
                </button>
              ) : (
                <Link href={item.href} className={cls}>
                  <TabMaskIcon src={item.icon as string} active={active} />
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
