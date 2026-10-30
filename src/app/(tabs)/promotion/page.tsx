"use client";

import Link from "next/link";
import { Bookmark, CalendarDays, ChartNoAxesColumn, ChevronRight, CircleDollarSign, Funnel, Headset, Paperclip, Wallet } from "lucide-react";
import { IconCopy } from "@/components/Icons";
import { InnerHeader } from "@/components/layout/InnerHeader";
import { Button } from "@/components/ui";
import { useAuth } from "@/hooks/useAuth";
import { useI18n } from "@/hooks/useI18n";
import { copyText, formatMoney } from "@/lib/format";
import { useStore } from "@/lib/store";

const STATS = { register: 0, deposits: 0, depositAmount: 0, firstDeposit: 0 };

function StatCol({ title }: { title: string }) {
  const { t } = useI18n();
  return (
    <div className="flex-1 px-2 py-3 text-center">
      <p className="text-sm font-medium text-ink">{STATS.register}</p>
      <p className="mt-0 text-11 text-muted">{t("numberOfRegister")}</p>
      <p className="mt-2 text-sm font-medium text-green-norm">{STATS.deposits}</p>
      <p className="mt-0 text-11 text-muted">{t("depositNumber")}</p>
      <p className="mt-2 text-sm font-medium text-secondary">{STATS.depositAmount}</p>
      <p className="mt-0 text-11 text-muted">{t("depositAmount")}</p>
      <p className="mt-2 text-sm font-medium text-ink">{STATS.firstDeposit}</p>
      <p className="mt-0 text-11 leading-snug text-muted">{t("firstDepositPeople")}</p>
    </div>
  );
}

export default function PromotionPage() {
  const { t } = useI18n();
  const { user } = useAuth();
  const { showToast } = useStore();
  if (!user) return null;
  const code = user.uid;

  function copyCode() {
    void copyText(code);
    showToast(t("copied"), "copy");
  }

  const menus = [
    { href: "/promotion/TeamReport", icon: CalendarDays, label: t("subordinate") },
    { href: "/promotion/MyCommission", icon: CircleDollarSign, label: t("commissionDetail") },
    { href: "/promotion/PromotionRule", icon: Bookmark, label: t("invitationRules") },
    { href: "/promotion/customerService", icon: Headset, label: t("agentLineCs") },
    { href: "/promotion/RebateRatio", icon: Wallet, label: t("rebateRatio") },
  ];

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="z-30 shrink-0">
        <InnerHeader
          title={t("agency")}
          light
          right={
            <Link
              href="/promotion/TeamReport"
              className="grid h-8 w-8 place-items-center text-main"
              aria-label={t("newSub")}
            >
              <Funnel className="h-5 w-5" />
            </Link>
          }
        />
      </div>

      <div className="phone-scroll flex-1 min-h-0 overflow-y-auto pb-12">
        <div className="promotion-hero pb-26 text-white relative flex flex-col items-center h-auto">
          <p className="text-[1.75rem] font-bold leading-none">0</p>
          <p className="mt-2 rounded-full bg-white px-3 py-1 text-xs font-medium text-main">
            {t("yesterdayTotalCommission")}
          </p>
          <p className="mt-2 px-6 text-center text-11 text-white/90">{t("upgradeLevelCommission")}</p>
        </div>

        <div className="relative z-10 -mt-20 px-3">
          <div className="overflow-hidden rounded-lg bg-white">
            <div className="grid grid-cols-2 bg-main text-center text-sm font-medium text-white">
              <p className="py-2.5">{t("directSubordinates")}</p>
              <p className="py-2.5">{t("teamSubordinates")}</p>
            </div>
            <div className="flex divide-x divide-line">
              <StatCol title="direct" />
              <StatCol title="team" />
            </div>
          </div>

          <Button className="mt-3 uppercase" size="sm" href={`/promotion/PromotionShare?code=${code}`}>
            {t("invitationLink")}
          </Button>

          <button
            type="button"
            onClick={copyCode}
            className="mt-2.5 flex h-[3.375rem] w-full items-center gap-3 rounded-[0.75rem] bg-white px-3 text-left"
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[0.5rem] bg-red-soft text-main">
              <Paperclip className="h-5 w-5" strokeWidth={1.75} />
            </span>
            <span className="min-w-0 flex-1 text-[0.9375rem] leading-none text-ink">{t("copyInvitationCode")}</span>
            <span className="shrink-0 text-sm text-muted">{code}</span>
            <span className="shrink-0 text-faint">
              <IconCopy />
            </span>
          </button>

          <div className="mt-2 space-y-2">
            {menus.map((row) => {
              const Icon = row.icon;
              const inner = (
                <>
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[0.5rem] bg-red-soft text-main">
                    <Icon className="h-5 w-5" strokeWidth={1.75} />
                  </span>
                  <span className="min-w-0 flex-1 text-left text-[0.9375rem] leading-none text-ink">{row.label}</span>
                  <ChevronRight className="h-7 w-7 shrink-0 text-link" strokeWidth={1.25} />
                </>
              );
              const cls = "flex h-[3.375rem] w-full items-center gap-3 rounded-[0.75rem] bg-white px-3";
              return row.href ? (
                <Link key={row.label} href={row.href} className={cls}>
                  {inner}
                </Link>
              ) : (
                <button
                  key={row.label}
                  type="button"
                  className={cls}
                  onClick={() => showToast(t("comingSoon"))}
                >
                  {inner}
                </button>
              );
            })}
          </div>

          <div className="mt-2 rounded-[0.75rem] bg-white px-3.5 pb-4 pt-3.5">
            <div className="mb-3 flex items-center gap-2">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[0.5rem] bg-red-soft text-main">
                <ChartNoAxesColumn className="h-5 w-5" strokeWidth={1.75} />
              </span>
              <p className="text-[0.9375rem] font-medium text-ink">{t("promotionData")}</p>
            </div>
            <div className="grid grid-cols-2">
              <div className="border-r border-line py-2 text-center">
                <p className="text-base font-medium text-ink">0</p>
                <p className="mt-0 text-xs text-muted">{t("thisWeek")}</p>
              </div>
              <div className="py-2 text-center">
                <p className="text-base font-medium text-ink">{formatMoney(49.89)}</p>
                <p className="mt-0 text-xs text-muted">{t("totalCommission")}</p>
              </div>
              <div className="border-r border-line py-2 text-center">
                <p className="text-base font-medium text-ink">5</p>
                <p className="mt-0 text-xs text-muted">{t("directSubordinate")}</p>
              </div>
              <div className="py-2 text-center">
                <p className="text-base font-medium text-ink">1</p>
                <p className="mt-0 px-2 text-xs leading-snug text-muted">{t("teamSubordinatesCount")}</p>
              </div>
            </div>
          </div>
          <div className="h-6" />
        </div>
      </div>
    </div>
  );
}
