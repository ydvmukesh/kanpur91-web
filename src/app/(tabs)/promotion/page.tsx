"use client";

import Link from "next/link";
import { Bookmark, CalendarDays, ChartNoAxesColumn, ChevronRight, CircleDollarSign, Funnel, Headset, Paperclip, UserRound, Wallet } from "lucide-react";
import { IconCopy, IconRuleHead } from "@/components/Icons";
import { openEventRewardsLogin } from "@/components/EventRewardsLoginDialog";
import { InnerHeader } from "@/components/layout/InnerHeader";
import { Button, HtmlContent } from "@/components/ui";
import { useAuth } from "@/hooks/useAuth";
import { useI18n } from "@/hooks/useI18n";
import { copyText, formatMoney, pad2 } from "@/lib/format";
import { IMG, ImgIcon } from "@/lib/img";
import { PROMOTION_REBATE_LEVELS, PROMOTION_RULES_HTML } from "@/lib/promotion-rule";
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
  if (!user) {
    return (
      <div className="flex h-full min-h-0 flex-col">
        <div className="z-30 shrink-0 bg-white pt-safe-t">
          <div className="relative flex h-12 items-center px-2">
            <h1 className="pointer-events-none absolute inset-x-16 truncate text-center text-lg font-medium text-ink">
              {t("agency")}
            </h1>
            <button
              type="button"
              className="ml-auto grid h-8 w-8 place-items-center text-main"
              aria-label={t("newSub")}
              onClick={() => openEventRewardsLogin("/promotion/TeamReport")}
            >
              <Funnel className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="phone-scroll min-h-0 flex-1 overflow-y-auto pb-12">
          <div className="relative flex h-auto flex-col items-center bg-[image:url(/activity/promotion-bg.png),var(--main_gradient-color)] bg-center bg-no-repeat [background-size:cover,100%_100%] pb-26 pt-22.5" />
          <div className="relative z-10 -mt-40 px-3">
            <div className="rounded-lg bg-white px-4 pb-6 pt-6 text-center">
              <span className="mx-auto grid h-[3.75rem] w-[3.75rem] place-items-center rounded-full bg-red-soft text-main">
                <span className="relative">
                  <UserRound className="h-8 w-8" strokeWidth={1.75} />
                  {/* <CircleDollarSign className="absolute -bottom-0.5 -right-1 h-4 w-4" strokeWidth={2} /> */}
                </span>
              </span>
              <h2 className="mt-3 text-lg font-bold text-ink">{t("agencyPromotionCenter")}</h2>
              <p className="mt-2 px-2 text-sm leading-relaxed text-muted">{t("agencyGuestHint")}</p>
              <Button
                onClick={() => openEventRewardsLogin("/promotion")}
                className="mx-auto mt-5 !flex items-center gap-1 max-w-40 justify-center align-middle"
                variant="primary"
                size="sm"
              >
                {t("loginToView")}
                <ChevronRight className="h-5 w-5" strokeWidth={2} />
              </Button>
            </div>
          </div>
          <div className="px-3 pb-8 pt-4">
            <h2 className="text-center text-base font-medium text-main">{t("promotionPartnerProgram")}</h2>
            <p className="mt-1 mb-4 text-center text-sm text-muted">{t("promotionValidLong")}</p>
            <div className="space-y-3">
              {PROMOTION_RULES_HTML.map((html, i) => (
                <article key={i} className="overflow-hidden rounded-lg bg-white">
                  <div className="relative">
                    <IconRuleHead />
                    <span className="absolute inset-0 grid place-items-center text-sm font-medium text-white">
                      {pad2(i + 1)}
                    </span>
                  </div>
                  <HtmlContent
                    html={html}
                    className="px-4 py-4 [&_p]:mt-0 [&_p+p]:mt-1 [&_p]:pl-0 [&_p]:text-sm [&_p]:leading-relaxed [&_p]:text-muted [&_p]:before:content-none"
                  />
                  {i === 5 ? (
                    <Link href="/promotion/RebateRatio" className="block px-4 pb-4 text-sm text-main">
                      {t("viewRebateRatio")}
                    </Link>
                  ) : null}
                </article>
              ))}
            </div>
            <div id="rebate-ratio" className="mt-3 overflow-hidden rounded-lg">
              <table className="w-full border-collapse text-center text-13">
                <thead className="bg-main text-white">
                  <tr>
                    <th className="h-[2.75rem] px-1 font-medium leading-tight">{t("rebateLevel")}</th>
                    <th className="h-[2.75rem] px-1 font-medium leading-tight">{t("teamNumber")}</th>
                    <th className="h-[2.75rem] px-1 font-medium leading-tight">{t("teamBetting")}</th>
                    <th className="h-[2.75rem] px-1 font-medium leading-tight">{t("teamDeposit")}</th>
                  </tr>
                </thead>
                <tbody>
                  {PROMOTION_REBATE_LEVELS.map((row, i) => (
                    <tr key={row.lv} className={i % 2 ? "bg-bg-l1" : "bg-white"}>
                      <td className="h-[2.75rem] text-ink">
                        <span className="relative inline-block h-[1.875rem]">
                          <ImgIcon src={IMG.promotionLv} className="block h-[1.7rem] w-auto" />
                          <span className="promo-lv-tag absolute right-0 bottom-0 block h-[1.15rem] w-[1.625rem] bg-clip-text bg-[linear-gradient(180deg,#fffba9,#fff670_56.13%,#ffd180)] text-center text-[0.625rem] font-bold leading-4 text-transparent">
                            L{row.lv}
                          </span>
                        </span>
                      </td>
                      <td className="h-[2.75rem] text-ink">{row.team}</td>
                      <td className="h-[2.75rem] text-ink">{row.bet}</td>
                      <td className="h-[2.75rem] text-ink">{row.deposit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
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
        <div className="relative flex h-auto flex-col items-center bg-[image:url(/activity/promotion-bg.png),var(--main_gradient-color)] bg-center bg-no-repeat [background-size:cover,100%_100%] pb-26 pt-5 text-white">
          <p className="text-[1.75rem] font-bold leading-none">0</p>
          <p className="mt-2 rounded-full bg-white px-3 py-1 text-xs font-medium text-main">
            {t("yesterdayTotalCommission")}
          </p>
          <p className="mt-2 px-6 text-center text-11 text-white/90">{t("upgradeLevelCommission")}</p>
        </div>

        <div className="relative z-10 -mt-22 px-3">
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
                  <ChevronRight className="size-6 shrink-0 text-muted" strokeWidth={1.25} />
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

          <div className="mt-2 rounded-[0.75rem] bg-white p-3">
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
