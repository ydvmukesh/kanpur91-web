"use client";

import { useRouter } from "next/navigation";
import { IconBack } from "@/components/Icons";
import { useAuth } from "@/hooks/useAuth";
import { useI18n } from "@/hooks/useI18n";
import { IMG, ImgIcon } from "@/lib/img";
import { vipFromExp } from "@/lib/vip";

const PAYOUT_DAYS = 6;

export default function VipPage() {
  const { t } = useI18n();
  const { user } = useAuth();
  const router = useRouter();
  if (!user) return null;
  const exp = user.vipExp;
  const current = vipFromExp(exp);

  return (
    <div className="flex h-full min-h-0 flex-col bg-page pb-safe-b">
      <div className="flex h-[11rem] w-full flex-col bg-main-x text-white pt-safe-t">
        <div className="relative flex h-12 w-full shrink-0 items-center justify-between px-3">
          <button
            type="button"
            className="relative z-10 h-8 w-8 grid place-items-center"
            onClick={() => router.back()}
            aria-label="Back"
          >
            <IconBack />
          </button>
          <div className="pointer-events-none absolute inset-0 grid place-items-center">
            <div className="text-lg font-medium">{t("vip")}</div>
          </div>
          <span className="h-8 w-8" />
        </div>

        <div className="flex min-h-0  items-center px-3 pt-3">
          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full bg-white">
            <ImgIcon src={IMG.vipAvatar} alt="" className="h-full w-full object-cover" />
          </div>
          <div className="ml-3 min-w-0">
            <ImgIcon src={IMG.vipBadge0} alt={`VIP${current}`} className="h-4 w-auto" />
            <h3 className="mt-2 truncate text-sm font-medium leading-none">{user.nickname}</h3>
          </div>
        </div>
      </div>

      <div className="-mt-10 px-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-md bg-white py-2 text-center">
            <p className="text-sm font-semibold text-main">{exp} EXP</p>
            <p className="mt-1.5 text-11 text-muted">{t("myExperience")}</p>
          </div>
          <div className="rounded-md bg-white py-2 text-center">
            <p className="text-sm font-semibold text-main">{t("days", { n: PAYOUT_DAYS })}</p>
            <p className="mt-1.5 text-11 text-muted">{t("payoutTime")}</p>
          </div>
        </div>
      </div>

      <p className="mx-3 mt-3 rounded-lg bg-white px-3 py-2.5 text-center text-11 leading-snug text-muted">
        {t("vipSettleNote")}
      </p>
    </div>
  );
}
