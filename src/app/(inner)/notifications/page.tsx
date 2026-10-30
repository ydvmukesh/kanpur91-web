"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { InnerShell } from "@/components/layout/InnerShell";
import { EmptyState } from "@/components/ui";
import { IconSpeaker } from "@/components/Icons";
import { useMarkReadMutation } from "@/hooks/mutations/useNotifMutations";
import { useNotifs } from "@/hooks/queries/useNotifs";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/cn";
import { Megaphone, MegaphoneIcon, Volume2 } from "lucide-react";

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
  const { t } = useStore();
  const { data: notifications = [] } = useNotifs();
  const markRead = useMarkReadMutation();
  const params = useSearchParams();
  const [tab, setTab] = useState<"notice" | "info">(params.get("tab") === "info" ? "info" : "notice");

  useEffect(() => {
    markRead.mutate();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mark-read once on open
  }, []);

  useEffect(() => {
    setTab(params.get("tab") === "info" ? "info" : "notice");
  }, [params]);

  const items =
    tab === "info"
      ? infoItems
      : notifications.map((n) => ({ id: n.id, title: n.title, body: n.body, time: n.time }));

  return (
    <InnerShell
      title={t("notification")}
      variant="light"
      className="bg-[#F4F5F8]"
      headerExtra={
        <div className="bg-[#F4F5F8] px-3 pt-2 pb-2">
          <div className="flex h-10 rounded-lg bg-white p-[0.1875rem] shadow-[0_0.0625rem_0.25rem_rgba(30,38,55,0.06)]">
            <button
              type="button"
              onClick={() => setTab("notice")}
              className={cn(
                "flex-1 rounded-md text-sm font-semibold",
                tab === "notice" ? "bg-main text-white" : "text-[#9AA3B5]",
              )}
            >
              {t("notification")}
            </button>
            <button
              type="button"
              onClick={() => setTab("info")}
              className={cn(
                "flex-1 rounded-md text-sm font-semibold",
                tab === "info" ? "bg-main text-white" : "text-[#9AA3B5]",
              )}
            >
              {t("information")}
            </button>
          </div>
        </div>
      }
    >
      <div className="px-3 pb-8 space-y-3">
        {items.length === 0 ? <EmptyState /> : null}
        {items.map((n) => (
          <article key={n.id} className="bg-white rounded-lg px-3.5 py-3.5">
            <div className="flex items-center gap-1.5">
              <span className="text-main shrink-0">
              <MegaphoneIcon className="h-4 w-4" />
              </span>
              <h2 className="text-15 font-medium text-ink leading-snug">{n.title}</h2>
            </div>
            <p className="text-xs text-muted leading-relaxed mt-2">{n.body}</p>
            <p className="text-xs text-faint mt-3">{n.time}</p>
          </article>
        ))}
      </div>
    </InnerShell>
  );
}
