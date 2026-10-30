"use client";

import Link from "next/link";
import { InnerShell } from "@/components/layout/InnerShell";
import { Button } from "@/components/ui";
import { useAuth } from "@/hooks/useAuth";
import { useI18n } from "@/hooks/useI18n";
import { useCheckInMutation } from "@/hooks/mutations/useWalletMutations";
import { SIGNIN_DAYS, signinAccumulated } from "@/lib/daily-signin";
import { formatMoney } from "@/lib/format";
import { IMG, ImgIcon } from "@/lib/img";
import { errMsg } from "@/lib/query/sync";
import { useStore } from "@/lib/store";

export default function DailySignInPage() {
  const { t } = useI18n();
  const { user } = useAuth();
  const { showToast } = useStore();
  const checkIn = useCheckInMutation();
  if (!user) return null;

  const today = new Date().toISOString().slice(0, 10);
  const doneToday = user.lastCheckIn === today;
  const streak = user.checkStreak;
  const week = SIGNIN_DAYS.slice(0, 6);
  const day7 = SIGNIN_DAYS[6];

  async function onAttend() {
    try {
      await checkIn.mutateAsync();
      showToast(t("checked"));
    } catch (e) {
      showToast(errMsg(e), "warn");
    }
  }

  return (
    <InnerShell title={t("attendanceTitle")} variant="light">
      <div
        className="mb-4 flex  flex-col justify-end px-[0.9375rem] py-6 text-white"
        style={{
          background: `url(${IMG.signinHeaderBg}) no-repeat center / cover, #f54545 no-repeat center / cover`,
        }}
      >
        <h2 className="text-lg font-medium leading-tight">{t("attendance")}</h2>
        <p className="mt-1 text-xs leading-snug text-white/90">{t("attendanceBonusLead")}</p>
        <p className="daily-signin-chip mt-2.5">
          {t("attendedConsecutively")}{" "}
          <span className="font-semibold text-red-norm">{streak}</span> {t("dayUnit")}
        </p>
        <p className="text-xs text-white/90">{t("accumulated")}</p>
        <p className="text-lg font-bold">₹{formatMoney(signinAccumulated(streak))}</p>
        <div className="mt-3 flex gap-5">
          <Link href="/activity/DailySignIn/Rules" className="daily-signin-btn grid place-items-center no-underline">
            {t("gameRules")}
          </Link>
          <Link href="/activity/DailySignIn/Record" className="daily-signin-btn grid place-items-center no-underline">
            {t("attendanceHistory")}
          </Link>
        </div>
      </div>

      <div className="px-3 pb-8">
        <div className="grid grid-cols-3 gap-2.5">
          {week.map((row) => (
            <div key={row.day} className="rounded-lg bg-white px-1 py-3 text-center">
              <p className="text-sm font-bold text-ink">₹{formatMoney(row.amount)}</p>
              <ImgIcon src={IMG.signinCoin} alt="" className="mx-auto mt-2 h-10 w-10 object-contain" />
              <p className="mt-2 text-11 text-muted">
                {row.day} {t("dayUnit")}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-2.5 flex items-center rounded-lg bg-white px-4 py-3">
          <ImgIcon src={IMG.signinDay7} alt="" className="h-[4.5rem] w-[6.5rem] object-contain" />
          <div className="min-w-0 flex-1 text-center">
            <p className="text-sm font-bold text-ink">— ₹{formatMoney(day7.amount)} —</p>
            <p className="mt-1 text-11 text-muted">
              {day7.day} {t("dayUnit")}
            </p>
          </div>
        </div>

        <Button className="mt-6" disabled={doneToday || checkIn.isPending} onClick={() => void onAttend()}>
          {t("attendanceTitle")}
        </Button>
      </div>
    </InnerShell>
  );
}
