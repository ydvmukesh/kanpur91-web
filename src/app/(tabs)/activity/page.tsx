"use client";

import Link from "next/link";
import { LoginBrand } from "@/components/Logo";
import { useAuth } from "@/hooks/useAuth";
import { useI18n } from "@/hooks/useI18n";
import { ACTIVITY_LIST } from "@/lib/activity";
import { IMG, ImgIcon } from "@/lib/img";
import { formatMoney } from "@/lib/format";
import { useStore } from "@/lib/store";
import type { DictKey } from "@/lib/i18n";

const TODAY_BONUS = 0;
const TOTAL_BONUS = 1130.66;

export default function ActivityPage() {
  const { t } = useI18n();
  const { user } = useAuth();
  const { showToast } = useStore();
  if (!user) return null;

  const tiles: { href?: string; src: string; label: DictKey; dot?: boolean }[] = [
    { href: "/promotion", src: IMG.actInvite, label: "invitationBonus" },
    { src: IMG.actRebate, label: "bettingRebate" },
    { src: IMG.actJackpot, label: "superJackpot" },
    { src: IMG.actFirstGift, label: "firstGift" },
    { src: IMG.actWheel, label: "inviteWheel", dot: true },
  ];

  function soon() {
    showToast(t("comingSoon"));
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="z-30 shrink-0 bg-main-x pt-safe-t text-white">
        <div className="flex h-12 items-center justify-center">
          <LoginBrand />
        </div>
      </div>

      <div className="phone-scroll flex-1 min-h-0 overflow-y-auto">
        <div className="bg-main-x px-4 py-5 text-white">
          <div className="grid grid-cols-2 divide-x divide-white/50">
            <div className="text-center">
              <p className="text-xs">{t("todayBonus")}</p>
              <p className="text-lg font-semibold">₹{formatMoney(TODAY_BONUS)}</p>
            </div>
            <div className="text-center">
              <p className="text-xs">{t("totalBonus")}</p>
              <p className="text-lg font-semibold">₹{formatMoney(TOTAL_BONUS)}</p>
            </div>
          </div>
          <Link
            href="/activity/Bonus"
            className="mx-auto mt-5 flex h-10 w-40 items-center justify-center rounded-full bg-white text-sm font-medium text-main"
          >
            {t("bonusDetails")}
          </Link>
        </div>
        <div className="px-4 pb-16 pt-4">
        <div className="grid grid-cols-4 gap-x-2 gap-y-4">
          {tiles.map((item) => {
            const body = (
              <>
                <span className="relative mx-auto block h-12 w-12">
                  <ImgIcon src={item.src} alt="" className="h-14 w-14 object-contain" />
                  {item.dot ? <span className="absolute top-0 -right-1 h-2 w-2 rounded-full bg-main" /> : null}
                </span>
                <span className="mt-2 block text-center text-11 leading-snug text-muted">{t(item.label)}</span>
              </>
            );
            const cls = "flex flex-col items-center";
            return item.href ? (
              <Link key={item.label} href={item.href} className={cls}>
                {body}
              </Link>
            ) : (
              <button key={item.label} type="button" onClick={soon} className={cls}>
                {body}
              </button>
            );
          })}
        </div>

        <div className="mt-5 grid grid-cols-2 items-stretch gap-3">
          <button type="button" onClick={soon} className="flex h-full flex-col overflow-hidden rounded-lg bg-white text-left">
            <ImgIcon src={IMG.actGiftsBanner} alt="" className="h-28 w-full shrink-0 object-cover" />
            <div className="flex flex-1 flex-col px-2.5 py-2.5">
              <p className="text-sm font-bold text-ink">{t("gift")}</p>
              <p className="mt-1 text-11 leading-snug text-muted">{t("giftRedeemBody")}</p>
            </div>
          </button>
          <button type="button" onClick={soon} className="flex h-full flex-col overflow-hidden rounded-lg bg-white text-left">
            <ImgIcon src={IMG.actAttendanceBanner} alt="" className="h-28 w-full shrink-0 object-cover" />
            <div className="flex flex-1 flex-col px-2.5 py-2.5">
              <p className="text-sm font-bold text-ink">{t("attendance")}</p>
              <p className="mt-1 text-11 leading-snug text-muted">{t("attendanceBody")}</p>
            </div>
          </button>
        </div>

        <div className="mt-3 space-y-3">
          {ACTIVITY_LIST.map((event) => (
            <Link
              key={event.slug}
              href={`/activity/ActivityDetail/${event.slug}`}
              className="block w-full overflow-hidden rounded-lg bg-white text-left"
            >
              <ImgIcon src={event.banner} alt="" className="h-auto w-full object-cover" />
              <p className="px-3 py-2.5 text-sm font-bold text-ink">{event.title}</p>
            </Link>
          ))}
        </div>
        <p className="pt-4 text-center text-sm text-muted">{t("noMore")}</p>
      </div>
      </div>
    </div>
  );
}
