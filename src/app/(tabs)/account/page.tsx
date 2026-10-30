"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CreditCard, FolderOpen, Gem, Wallet } from "lucide-react";
import { IconCopy, IconRefresh } from "@/components/Icons";
import { useAuth } from "@/hooks/useAuth";
import { useI18n } from "@/hooks/useI18n";
import { useWallet } from "@/hooks/useWallet";
import { copyText, formatMoney, pad2 } from "@/lib/format";
import { IMG, ImgIcon } from "@/lib/img";
import { useStore } from "@/lib/store";

function stamp(d: Date) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())} ${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`;
}

export default function AccountPage() {
  const { t } = useI18n();
  const { showToast } = useStore();
  const { user } = useAuth();
  const { recycle } = useWallet();
  const [loginAt, setLoginAt] = useState("");

  useEffect(() => {
    setLoginAt(stamp(new Date()));
  }, []);

  if (!user) return null;

  const shortcuts = [
    { href: undefined, label: t("arWallet"), icon: <Wallet className="h-7 w-7 text-main" /> },
    { href: "/wallet/deposit", label: t("deposit"), icon: <FolderOpen className="h-7 w-7 text-secondary" /> },
    { href: "/wallet/withdraw", label: t("withdraw"), icon: <CreditCard className="h-7 w-7 text-blue-norm" /> },
    { href: "/vip", label: t("vip"), icon: <Gem className="h-7 w-7 text-green-norm" /> },
  ];

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="phone-scroll min-h-0 flex-1 overflow-y-auto pb-8">
        <header className="">
          <div className="flex items-center bg-main-x px-4 pb-16 pt-safe pt-10 pb-30 text-white  gap-3  rounded-b-3xl ">
            <div className="grid h-[4.25rem] w-[4.25rem] shrink-0 place-items-center overflow-hidden rounded-full bg-white">
              <ImgIcon src={IMG.vipAvatar} className="h-full w-full object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <p className="truncate text-lg font-semibold">{user.nickname}</p>
                <ImgIcon src={IMG.vipBadge0} className="h-5 w-auto" />
              </div>
              <button
                type="button"
                className="mt-1 flex items-center gap-1.5 text-13 text-white/90"
                onClick={() => {
                  void copyText(user.uid);
                  showToast(t("copied"), "copy");
                }}
              >
                {t("uid")}
                <span className="text-white/70">|</span>
                {user.uid}
                <span className="text-secondary">
                  <IconCopy />
                </span>
              </button>
              {loginAt ? <p className="mt-1 text-11 text-white/80">{t("lastLogin", { t: loginAt })}</p> : null}
            </div>
          </div>
        </header>

        <div className="relative z-10 mx-3 -mt-20 rounded-xl bg-white p-4">
          <div className="flex items-start justify-between gap-3 border-b border-line pb-3">
            <div>
              <p className="text-13 text-muted">{t("totalBalance")}</p>
              <div className="mt-1 flex items-center gap-2">
                <p className="text-xl font-semibold text-ink">₹{formatMoney(user.balance)}</p>
                <button type="button" className="text-faint" onClick={() => recycle()} aria-label={t("recycle")}>
                  <IconRefresh className="h-4 w-4" />
                </button>
              </div>
            </div>
            <Link
              href="/wallet/deposit"
              className="shrink-0 rounded-full bg-main px-3.5 py-1.5 text-13 font-medium text-white"
            >
              {t("enterWallet")}
            </Link>
          </div>
          <div className="mt-4 grid grid-cols-4 gap-1">
            {shortcuts.map((item) => {
              const inner = (
                <>
                  <span className="grid h-10 w-10 place-items-center">{item.icon}</span>
                  <span className="mt-1 text-center text-sm text-ink">{item.label}</span>
                </>
              );
              const cls = "flex flex-col items-center";
              if (!item.href) {
                return (
                  <button
                    key={item.label}
                    type="button"
                    className={cls}
                    onClick={() => showToast(t("comingSoon"))}
                  >
                    {inner}
                  </button>
                );
              }
              return (
                <Link key={item.label} href={item.href} className={cls}>
                  {inner}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
