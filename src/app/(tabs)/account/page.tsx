"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { copyText } from "@/lib/format";
import { IconChevron, IconCopy } from "@/components/Icons";
import { IMG, ImgIcon } from "@/lib/img";

export default function AccountPage() {
  const { t, user, logout, showToast, notifications } = useStore();
  const router = useRouter();
  if (!user) return null;
  const unread = notifications.filter((n) => !n.read).length;
  const vip = Math.min(10, Math.floor(user.vipExp / 1000));

  const rows = [
    { href: "/vip", label: t("vip") },
    { href: "/notifications", label: t("notifications"), badge: unread },
    { href: "/gift", label: t("gift") },
    { href: "/language", label: t("language") },
    { href: "/settings", label: t("settings") },
    { href: "/guide", label: t("guide") },
    { href: "/customer-service", label: t("customerService") },
    { href: "/about", label: t("about") },
  ];

  return (
    <div>
      <header className="bg-main-y text-white px-4 pt-5 pb-8">
        <div className="flex items-center gap-3">
          <div className="h-14 w-14 rounded-full bg-white grid place-items-center overflow-hidden p-1">
            <ImgIcon src={IMG.logo} alt="" className="h-full w-full" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-lg">{user.nickname}</p>
            <button
              type="button"
              className="flex items-center gap-1 text-xs text-white/85 mt-0.5"
              onClick={() => {
                copyText(user.uid);
                showToast(t("copied"));
              }}
            >
              {t("uid")}: {user.uid} <IconCopy />
            </button>
          </div>
          <Link href="/vip" className="text-xs bg-white/20 px-2 py-1 rounded-full flex items-center gap-1">
            <ImgIcon src={IMG.point} alt="" className="h-2.5 w-2.5" invert />
            VIP{vip}
          </Link>
        </div>
      </header>
      <div className="mx-3 -mt-4 bg-white rounded-xl overflow-hidden">
        {rows.map((r) => (
          <Link key={r.href} href={r.href} className="flex items-center justify-between px-4 h-12 border-b border-line last:border-0">
            <span className="text-sm">{r.label}</span>
            <span className="flex items-center gap-2 text-l3">
              {r.badge ? (
                <span className="min-w-4 h-4 px-1 rounded-full bg-main text-white text-[10px] grid place-items-center">
                  {r.badge}
                </span>
              ) : null}
              <IconChevron />
            </span>
          </Link>
        ))}
      </div>
      <div className="px-3 mt-4 pb-6">
        <button
          type="button"
          className="w-full h-11 rounded-full border border-main text-main font-semibold"
          onClick={() => {
            logout();
            router.replace("/login");
          }}
        >
          {t("logout")}
        </button>
      </div>
    </div>
  );
}
