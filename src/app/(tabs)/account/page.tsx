"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BarChart3,
  Bookmark,
  BookOpen,
  Box,
  ChevronRight,
  ClipboardList,
  CreditCard,
  Flower2,
  FolderOpen,
  Gem,
  Gift,
  Globe,
  Headphones,
  Mail,
  Megaphone,
  Power,
  ReceiptText,
  ScrollText,
  Settings,
  Ticket,
  Wallet,
} from "lucide-react";
import { IconCopy, IconRefresh } from "@/components/Icons";
import { ConfirmModal } from "@/components/ui";
import { useAuth } from "@/hooks/useAuth";
import { useI18n } from "@/hooks/useI18n";
import { useWallet } from "@/hooks/useWallet";
import { copyText, formatMoney, pad2 } from "@/lib/format";
import { userAvatar } from "@/lib/avatars";
import { IMG, ImgIcon } from "@/lib/img";
import { languageName } from "@/lib/languages";
import { useStore } from "@/lib/store";

function stamp(d: Date) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())} ${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`;
}

export default function AccountPage() {
  const { t, lang } = useI18n();
  const { showToast } = useStore();
  const { user, logout } = useAuth();
  const { recycle } = useWallet();
  const [loginAt, setLoginAt] = useState("");
  const [logoutOpen, setLogoutOpen] = useState(false);

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
      <div className="phone-scroll min-h-0 flex-1 overflow-y-auto pb-14">
        <header className="">
          <div className="flex items-center bg-main-x px-4 pb-16 pt-safe pt-10 pb-30 text-white  gap-3  rounded-b-3xl ">
            <div className="grid h-[4.25rem] w-[4.25rem] shrink-0 place-items-center overflow-hidden rounded-full bg-white">
              <ImgIcon src={userAvatar(user)} className="h-full w-full object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <p className="truncate text-lg font-semibold">{user.nickname}</p>
                <ImgIcon src={IMG.vipBadge0} className="h-5 w-auto" />
              </div>
              <button
                type="button"
                className="mt-1 flex items-center gap-1.5 text-13 text-white/90 bg-[#FEAA57] rounded-full px-1.5 py-0.5"
                onClick={() => {
                  void copyText(user.uid);
                  showToast(t("copied"), "copy");
                }}
              >
                {t("uid")}
                <span className="text-white/70">|</span>
                {user.uid}
                <span className="text-white">
                  <IconCopy />
                </span>
              </button>
              <p className="mt-1 h-4 text-11 leading-4 text-white/90">
                {loginAt ? t("lastLogin", { t: loginAt }) : "\u00a0"}
              </p>
            </div>
          </div>
        </header>

        <div className="relative z-10 mx-3 -mt-20 rounded-xl bg-white p-4">
          <div className="flex items-start justify-between gap-3 border-b border-line pb-3">
            <div>
              <p className="text-13 text-muted">{t("totalBalance")}</p>
              <div className="mt-1 flex items-center gap-2">
                <p className="text-xl font-semibold text-ink">₹{formatMoney(user.balance)}</p>
                <button type="button" className="text-muted" onClick={() => recycle()} aria-label={t("recycle")}>
                  <IconRefresh className="h-4 w-4" />
                </button>
              </div>
            </div>
            <Link
              href="/wallet"
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

        <div className="mx-3 mt-3 grid grid-cols-2 gap-2">
          {[
            {
              href: "/main/gameHistory",
              title: t("gameHistory"),
              sub: t("myGameHistory"),
              icon: <ScrollText className="h-6 w-6 text-blue-norm" />,
            },
            {
              href: "/wallet/TransAction",
              title: t("transaction"),
              sub: t("myTransactionHistory"),
              icon: <ReceiptText className="h-6 w-6 text-green-norm" />,
            },
            {
              href: "/wallet/depositHistory",
              title: t("deposit"),
              sub: t("myDepositHistory"),
              icon: <Bookmark className="h-6 w-6 text-main" />,
            },
            {
              href: "/wallet/withdrawHistory",
              title: t("withdraw"),
              sub: t("myWithdrawHistory"),
              icon: <FolderOpen className="h-6 w-6 text-secondary" />,
            },
          ].map((card) => {
            const inner = (
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 shrink-0 place-items-center">{card.icon}</span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-ink">{card.title}</p>
                  <p className="truncate text-11 text-muted">{card.sub}</p>
                </div>
              </div>
            );
            const cls = "rounded-lg bg-white px-3 py-3";
            return (
              <Link key={card.title} href={card.href} className={cls}>
                {inner}
              </Link>
            );
          })}
        </div>

        <div className="mx-3 mt-3 overflow-hidden rounded-lg bg-white">
          {[
            { href: "/notifications", label: t("notification"), icon: <Mail className="h-5 w-5 text-main" /> },
            { href: "/main/RedeemGift", label: t("gift"), icon: <Gift className="h-5 w-5 text-main" /> },
            { href: "/main/RechargeCoupon", label: t("myTopUpCoupons"), icon: <Ticket className="h-5 w-5 text-main" /> },
            { href: "/main/GameStats", label: t("gameStatistics"), icon: <BarChart3 className="h-5 w-5 text-main" /> },
          ].map((row, i) => {
            const inner = (
              <>
                <span className="grid h-8 w-8 shrink-0 place-items-center">{row.icon}</span>
                <span className="min-w-0 flex-1 text-left text-15 text-ink">{row.label}</span>
                <ChevronRight className="h-5 w-5 text-muted" />
              </>
            );
            const cls = `flex w-full items-center gap-1 px-3 py-3.5 text-left ${i > 0 ? "border-t border-line" : ""}`;
            if (!row.href) {
              return (
                <button
                  key={row.label}
                  type="button"
                  className={cls}
                  onClick={() => showToast(t("comingSoon"))}
                >
                  {inner}
                </button>
              );
            }
            return (
              <Link key={row.label} href={row.href} className={cls}>
                {inner}
              </Link>
            );
          })}
          <Link
            href="/main/Language"
            className="flex w-full items-center gap-2 border-t border-line px-3 py-3.5"
          >
            <span className="grid h-7 w-7 shrink-0 place-items-center">
              <Globe className="h-5 w-5 text-main" />
            </span>
            <span className="min-w-0 flex-1 text-left text-15 text-ink">{t("language")}</span>
            <span className="text-sm text-ink">{languageName(lang)}</span>
            <ChevronRight className="h-5 w-5 text-muted" />
          </Link>
        </div>

        <div className="mx-3 mt-3 rounded-lg bg-white px-3 py-3">
          <p className="mb-3 text-base font-medium text-ink">{t("serviceCenter")}</p>
          <div className="grid grid-cols-3 gap-y-4">
            {[
              { href: "/main/SettingCenter", label: t("settings"), icon: Settings },
              { href: undefined, label: t("feedback"), icon: ClipboardList },
              { href: "/notifications?tab=info", label: t("announcement"), icon: Megaphone },
              { href: "/promotion/customerService", label: t("customerService"), icon: Headphones },
              { href: "/main/Guide", label: t("guide"), icon: BookOpen },
              { href: "/main/About", label: t("about"), icon: Box },
            ].map((item) => {
              const Icon = item.icon;
              const inner = (
                <>
                  <Icon className="h-7 w-7 text-main" strokeWidth={1.6} />
                  <span className="mt-1 text-center text-xs text-muted">{item.label}</span>
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

        <button
          type="button"
          className="mx-3 mt-4 mb-4 flex h-11 w-[calc(100%-1.5rem)] items-center justify-center gap-2 rounded-full border border-main text-sm font-medium text-main"
          onClick={() => setLogoutOpen(true)}
        >
          <Power className="h-5 w-5" />
          {t("logout")}
        </button>
      </div>
      <ConfirmModal
        open={logoutOpen}
        message={t("logoutConfirm")}
        onClose={() => setLogoutOpen(false)}
        onConfirm={() => {
          setLogoutOpen(false);
          logout();
        }}
      />
    </div>
  );
}
