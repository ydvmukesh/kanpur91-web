"use client";

import Link from "next/link";
import { CircleCheck, CircleX } from "lucide-react";
import { InnerShell } from "@/components/layout/InnerShell";
import { useI18n } from "@/hooks/useI18n";
import { IMG, ImgIcon } from "@/lib/img";
import { formatMoney } from "@/lib/format";

const TIERS = [
  {
    n: 1,
    amount: 55,
    invitees: 1,
    recharge: 300,
    inviteHave: 1,
    inviteNeed: 1,
    depositHave: 1,
    depositNeed: 1,
    status: "received" as const,
  },
  {
    n: 2,
    amount: 155,
    invitees: 3,
    recharge: 300,
    inviteHave: 3,
    inviteNeed: 3,
    depositHave: 2,
    depositNeed: 3,
    status: "unfinished" as const,
  },
];

export default function InvitationBonusPage() {
  const { t } = useI18n();

  return (
    <InnerShell title={t("invitationBonus")} variant="light" className="bg-page">
      <div
        className="relative w-full px-3.5 pt-3 pb-14 text-white min-h-[10rem] bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${IMG.invitationBg}), linear-gradient(94deg, #f99937 2.72%, #ff6922 43.54%, #ff8039 98.54%)` }}
      >
        <h2 className="text-xl font-semibold">{t("inviteFriendsAndDeposit")}</h2>
        <p className="mt-2 max-w-[58%] text-[13px] leading-snug text-white/95">{t("bothPartiesRewards")}</p>
        <p className="mt-2 max-w-[58%] text-[13px] leading-snug text-white/95">{t("inviteFriendsRegisterRecharge")}</p>
        <p className="mt-3 text-[13px] text-white/90">{t("activityDate")}</p>
        <p className="mt-1 text-lg font-semibold tracking-wide">{t("invitationActivityRange")}</p>
      </div>

      <div className="relative z-10 -mt-10 px-3">
        <div className="grid grid-cols-2 rounded-xl bg-white py-4 mx-3 shadow-[0_8px_24px_rgba(30,38,55,0.08)] mb-7">
          <Link href="/main/InvitationBonus/Rule" className="flex flex-col items-center gap-1">
            <ImgIcon src={IMG.inviteRule} alt="" className="h-14 w-14" />
            <span className="px-2 text-center text-11 leading-snug text-muted">{t("invitationRewardRules")}</span>
          </Link>
          <Link href="/main/InvitationBonus/Record" className="flex flex-col items-center gap-1">
            <ImgIcon src={IMG.inviteRecord} alt="" className="h-14 w-14" />
            <span className="px-2 text-center text-11 leading-snug text-muted">{t("invitationRecord")}</span>
          </Link>
        </div>

        {TIERS.map((tier) => {
          const inviteDone = tier.inviteHave >= tier.inviteNeed;
          const depositDone = tier.depositHave >= tier.depositNeed;
          const done = tier.status === "received";

          return (
            <div key={tier.n} className="mt-3 flex h-[268px] flex-col overflow-hidden rounded-xl bg-white">
              <div className="flex shrink-0 items-center justify-between border-b border-line">
                <div className="flex h-10.5 items-center gap-1.5 rounded-br-[1.5rem] bg-green-norm pl-3 pr-4 text-white">
                  <span className="text-xs font-medium">{t("bonus")}</span>
                  <span className="grid h-4.5 w-4.5 place-items-center rounded-full bg-white/95 text-11 font-semibold text-green-norm">
                    {tier.n}
                  </span>
                  {done ? (
                    <CircleCheck className="ml-5 h-7 w-7 fill-white text-green-norm" />
                  ) : (
                    <CircleX className="ml-5 h-7 w-7 fill-white text-green-norm" />
                  )}
                </div>
                <p className="pr-4 text-sm font-semibold text-secondary">₹{formatMoney(tier.amount)}</p>
              </div>

              <div className="flex flex-1 flex-col px-3 pt-2.5">
                <div className="flex items-center justify-between rounded-md bg-page px-3 py-2 text-sm">
                  <span className="text-muted">{t("numberOfInvitees")}</span>
                  <span className="font-medium text-ink">{tier.invitees}</span>
                </div>
                <div className="mt-1.5 flex items-center justify-between rounded-md bg-page px-3 py-2 text-sm">
                  <span className="text-muted">{t("rechargePerPeople")}</span>
                  <span className="font-medium text-main">₹{formatMoney(tier.recharge)}</span>
                </div>
                <div className="relative -mx-3 mt-auto grid grid-cols-2 divide-x divide-line border-t border-dashed border-line py-3">
                  <span className="pointer-events-none absolute top-0 left-0 size-4.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-page" />
                  <span className="pointer-events-none absolute top-0 right-0 size-4.5 translate-x-1/2 -translate-y-1/2 rounded-full bg-page" />
                  <div className="text-center">
                    <p className={`text-sm font-semibold ${inviteDone ? "text-secondary" : "text-main"}`}>
                      {tier.inviteHave} / {tier.inviteNeed}
                    </p>
                    <p className="mt-0.5 text-11 text-muted">{t("numberOfInvitees")}</p>
                  </div>
                  <div className="text-center">
                    <p className={`text-sm font-semibold ${depositDone ? "text-secondary" : "text-main"}`}>
                      {tier.depositHave} / {tier.depositNeed}
                    </p>
                    <p className="mt-0.5 text-11 text-muted">{t("depositNumber")}</p>
                  </div>
                </div>
              </div>

              <div className="shrink-0 px-3 pb-3">
                <button
                  type="button"
                  disabled
                  className="h-10 w-full rounded-full bg-[#CDCFDD] text-sm font-semibold text-white"
                >
                  {t(done ? "received" : "unfinished")}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </InnerShell>
  );
}
