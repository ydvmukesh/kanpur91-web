"use client";

import { useStore } from "@/lib/store";
import { copyText } from "@/lib/format";
import { IconCopy } from "@/components/Icons";

export default function PromotionPage() {
  const { t, user, showToast } = useStore();
  if (!user) return null;
  const link = typeof window !== "undefined" ? `${window.location.origin}/register?code=${user.inviteCode}` : "";

  return (
    <div>
      <header className="bg-pop text-white px-4 pt-4 pb-8">
        <h1 className="text-lg font-semibold">{t("promotion")}</h1>
        <p className="text-xs text-white/80 mt-1">{t("invitationBonus")}</p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div>
            <p className="text-[11px] text-white/70">{t("yesterday")}</p>
            <p className="text-xl font-bold">₹0.00</p>
          </div>
          <div>
            <p className="text-[11px] text-white/70">{t("thisWeek")}</p>
            <p className="text-xl font-bold">₹0.00</p>
          </div>
        </div>
      </header>
      <div className="-mt-5 mx-3 bg-white rounded-xl p-3 space-y-3">
        <div>
          <p className="text-xs text-l2">{t("myInvitationCode")}</p>
          <div className="flex items-center justify-between mt-1">
            <p className="text-lg font-bold tracking-widest">{user.inviteCode}</p>
            <button
              type="button"
              className="h-8 px-3 rounded-full bg-red-soft text-main text-xs font-semibold flex items-center gap-1"
              onClick={() => {
                copyText(user.inviteCode);
                showToast(t("copied"));
              }}
            >
              <IconCopy /> {t("copy")}
            </button>
          </div>
        </div>
        <div>
          <p className="text-xs text-l2">{t("invitationLink")}</p>
          <div className="mt-1 flex items-center gap-2">
            <p className="flex-1 text-[11px] text-l1 truncate bg-bg-l3 rounded-lg px-2 py-2">{link}</p>
            <button
              type="button"
              className="h-8 px-3 rounded-full bg-main-x text-white text-xs font-semibold"
              onClick={() => {
                copyText(link);
                showToast(t("copied"));
              }}
            >
              {t("copyLink")}
            </button>
          </div>
        </div>
      </div>
      <div className="mx-3 mt-3 bg-white rounded-xl overflow-hidden">
        <div className="grid grid-cols-4 text-center py-3 text-[11px] text-l2 border-b border-line">
          <span>{t("team")}</span>
          <span>{t("newSub")}</span>
          <span>{t("betAmount")}</span>
          <span>{t("commission")}</span>
        </div>
        {[t("yesterday"), t("thisWeek"), t("thisMonth")].map((row) => (
          <div key={row} className="grid grid-cols-4 text-center py-3 text-xs border-b border-line last:border-0">
            <span className="text-l2">{row}</span>
            <span>0</span>
            <span>0.00</span>
            <span className="text-main">0.00</span>
          </div>
        ))}
      </div>
      <div className="mx-3 mt-3 mb-4 bg-white rounded-xl p-3">
        <p className="font-semibold mb-2">{t("invitationRules")}</p>
        <ul className="text-xs text-l2 space-y-1.5 list-disc pl-4">
          <li>Level 1 rebate 0.6% · Level 2 0.18% · Level 3 0.054%</li>
          <li>Commission settles next day 00:30</li>
          <li>Only valid bets from lottery games count</li>
        </ul>
      </div>
    </div>
  );
}
