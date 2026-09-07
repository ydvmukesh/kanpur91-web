"use client";

import { useEffect, useState } from "react";
import { InnerHeader } from "@/components/Ui";
import { IconSpeaker } from "@/components/Icons";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/cn";

const infoItems = [
  {
    id: "i1",
    title: "Protect yourself from Scams!!",
    body: "91club will never ask for your password, OTP or verification code. Do not trust private messages, calls or Telegram/WhatsApp accounts claiming to be customer service. Always use the official app only.",
    time: "2026-09-04 11:38:40",
  },
  {
    id: "i2",
    title: "Kind Reminder",
    body: "If you have not received your withdrawal within 3 days, please contact our self-service center with your bank statement (PDF/VIDEO) and PDF password.",
    time: "2026-09-03 18:12:05",
  },
  {
    id: "i3",
    title: "Official Deposit Channels",
    body: "Please deposit only through the official Deposit page in the app. Third-party payment links shared by others are not supported and may cause loss of funds.",
    time: "2026-09-01 09:20:18",
  },
  {
    id: "i4",
    title: "Play Responsibly",
    body: "Gambling can be addictive. Please play rationally. 91club only accepts customers above the age of 18.",
    time: "2026-08-28 14:05:33",
  },
];

export default function NotificationsPage() {
  const { t, notifications, markRead } = useStore();
  const [tab, setTab] = useState<"notice" | "info">("info");

  useEffect(() => {
    markRead();
  }, [markRead]);

  const items =
    tab === "info"
      ? infoItems
      : notifications.map((n) => ({ id: n.id, title: n.title, body: n.body, time: n.time }));

  return (
    <div className="min-h-full bg-[#F4F5F8]">
      <div className="sticky top-0 z-30">
        <InnerHeader title={t("notification")} light />
        <div className="bg-[#F4F5F8] px-3 pt-2 pb-2">
          <div className="flex h-10 rounded-lg bg-white p-[3px] shadow-[0_1px_4px_rgba(30,38,55,0.06)]">
            <button
              type="button"
              onClick={() => setTab("notice")}
              className={cn(
                "flex-1 rounded-md text-[14px] font-semibold",
                tab === "notice" ? "bg-main text-white" : "text-[#9AA3B5]",
              )}
            >
              {t("notification")}
            </button>
            <button
              type="button"
              onClick={() => setTab("info")}
              className={cn(
                "flex-1 rounded-md text-[14px] font-semibold",
                tab === "info" ? "bg-main text-white" : "text-[#9AA3B5]",
              )}
            >
              {t("information")}
            </button>
          </div>
        </div>
      </div>

      <div className="px-3 pb-8 space-y-3">
        {items.length === 0 ? <p className="text-center text-l3 py-16">{t("noData")}</p> : null}
        {items.map((n) => (
          <article key={n.id} className="bg-white rounded-xl px-3.5 py-3.5">
            <div className="flex items-center gap-1.5">
              <span className="text-main shrink-0">
                <IconSpeaker />
              </span>
              <h2 className="text-[15px] font-semibold text-l1 leading-snug">{n.title}</h2>
            </div>
            <p className="text-[13px] text-[#7E8B9E] leading-relaxed mt-2">{n.body}</p>
            <p className="text-[12px] text-[#B4BCC8] mt-3">{n.time}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
