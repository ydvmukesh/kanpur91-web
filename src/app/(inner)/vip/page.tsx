"use client";

import { InnerHeader } from "@/components/Ui";
import { useStore } from "@/lib/store";
import { IMG, ImgIcon } from "@/lib/img";

export default function VipPage() {
  const { t, user } = useStore();
  if (!user) return null;
  const level = Math.min(10, Math.floor(user.vipExp / 1000));
  const into = user.vipExp % 1000;
  return (
    <div className="min-h-dvh bg-bg-l1">
      <InnerHeader title={t("vip")} />
      <div className="mx-3 mt-3 rounded-xl overflow-hidden">
        <ImgIcon src={IMG.vip} alt="" className="w-full h-auto" />
      </div>
      <div className="m-3 bg-pop text-white rounded-xl p-4">
        <p className="text-sm">
          {t("level")} {level}
        </p>
        <p className="text-2xl font-extrabold mt-1">VIP {level}</p>
        <div className="mt-3 h-2 rounded-full bg-white/25 overflow-hidden">
          <div className="h-full bg-white" style={{ width: `${(into / 1000) * 100}%` }} />
        </div>
        <p className="text-xs text-white/80 mt-2">
          {t("exp")} {user.vipExp} / {(level + 1) * 1000}
        </p>
      </div>
      <div className="mx-3 bg-white rounded-xl p-3 text-xs text-l2 space-y-1.5">
        <p>· VIP upgrades from betting EXP</p>
        <p>· Higher VIP = higher rebate</p>
        <p>· Birthday gift from VIP3</p>
      </div>
    </div>
  );
}
