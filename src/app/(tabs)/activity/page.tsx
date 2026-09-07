"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { formatMoney } from "@/lib/format";
import { IconChevron } from "@/components/Icons";
import { IMG, ImgIcon } from "@/lib/img";

const days = [5, 10, 15, 20, 25, 30, 50];

export default function ActivityPage() {
  const { t, user, checkIn, showToast } = useStore();
  if (!user) return null;
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div>
      <header className="bg-main-y text-white px-4 py-4">
        <h1 className="text-lg font-semibold">{t("activity")}</h1>
        <p className="text-xs text-white/80 mt-1">{t("attendance")}</p>
      </header>
      <div className="p-3 space-y-3">
        <Link href="/gift" className="block rounded-xl overflow-hidden">
          <ImgIcon src={IMG.turntable} alt="" className="w-full h-auto" />
        </Link>
        <Link href="/vip" className="block rounded-xl overflow-hidden">
          <ImgIcon src={IMG.vip} alt="" className="w-full h-auto" />
        </Link>
        <section className="bg-white rounded-xl p-3">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">{t("checkIn")}</h2>
            <span className="text-xs text-l2">
              {t("consecutive")} {user.checkStreak}
            </span>
          </div>
          <div className="grid grid-cols-7 gap-1.5">
            {days.map((amt, i) => {
              const done = user.checkStreak > i && user.lastCheckIn === today ? true : user.checkStreak > i;
              return (
                <div key={amt} className="text-center">
                  <div className={`h-10 rounded-lg grid place-items-center text-[11px] font-semibold ${done ? "bg-green-soft text-green-norm" : "bg-bg-l3 text-l2"}`}>
                    ₹{amt}
                  </div>
                  <p className="text-[10px] text-l3 mt-1">
                    {t("day")}
                    {i + 1}
                  </p>
                </div>
              );
            })}
          </div>
          <button
            type="button"
            className="mt-3 w-full h-10 rounded-full bg-main-x text-white text-sm font-semibold"
            onClick={() => {
              const err = checkIn();
              showToast(err ?? t("checked"));
            }}
          >
            {t("checkIn")}
          </button>
        </section>

        {[
          { href: "/deposit", title: t("firstDeposit"), sub: "Up to 20%", c: "from-[#FF6C6B] to-[#FF4A4A]" },
          { href: "/promotion", title: t("invitationBonus"), sub: "Commission", c: "from-[#FD8654] to-[#FBB84D]" },
          { href: "/promotion", title: t("bettingRebate"), sub: "Up to 1.2%", c: "from-[#7B8EFF] to-[#C36FFF]" },
          { href: "/gift", title: t("gift"), sub: "Redeem code", c: "from-[#18B660] to-[#2AD4C5]" },
        ].map((a) => (
          <Link key={a.title} href={a.href} className={`block rounded-xl p-4 text-white bg-gradient-to-r ${a.c}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">{a.title}</p>
                <p className="text-xs text-white/80 mt-1">{a.sub}</p>
              </div>
              <IconChevron />
            </div>
          </Link>
        ))}
        <div className="bg-white rounded-xl p-4 flex items-center gap-3">
          <ImgIcon src={IMG.winner} alt="" className="h-10 w-10" />
          <div className="flex-1">
            <p className="font-semibold">{t("superJackpot")}</p>
            <p className="text-2xl font-extrabold text-main mt-1">₹{formatMoney(1283904, 0)}</p>
          </div>
          <ImgIcon src={IMG.rank} alt="" className="h-9 w-9" />
        </div>
      </div>
    </div>
  );
}
