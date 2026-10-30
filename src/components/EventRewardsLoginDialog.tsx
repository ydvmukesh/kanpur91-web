"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui";
import { useI18n } from "@/hooks/useI18n";
import { loginUrl } from "@/lib/auth/routes";
import { IMG, ImgIcon } from "@/lib/img";

const EVT = "kanpur91-er-login";

export function openEventRewardsLogin(next = "/account") {
  window.dispatchEvent(new CustomEvent(EVT, { detail: next }));
}

export function EventRewardsLoginDialog() {
  const { t } = useI18n();
  const [root, setRoot] = useState<HTMLElement | null>(null);
  const [open, setOpen] = useState(false);
  const [next, setNext] = useState("/account");

  useEffect(() => {
    setRoot(document.getElementById("phone-root") ?? document.body);
  }, []);

  useEffect(() => {
    function onOpen(e: Event) {
      const detail = (e as CustomEvent<string>).detail;
      setNext(typeof detail === "string" && detail ? detail : "/account");
      setOpen(true);
    }
    window.addEventListener(EVT, onOpen);
    return () => window.removeEventListener(EVT, onOpen);
  }, []);

  if (!open || !root) return null;

  return createPortal(
    <div className="absolute inset-0 z-[80] flex justify-center">
      <div className="relative h-full w-full">
        <button type="button" className="absolute inset-0 bg-black/55" onClick={() => setOpen(false)} />
        <div className="absolute inset-x-0 bottom-0 animate-[sheet-up_280ms_ease-out] rounded-t-[1.25rem] bg-white pb-safe-b">
          <div className="relative overflow-visible px-5 pb-7 pt-[6.25rem]">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[7.5rem] rounded-t-[1.25rem] bg-gradient-to-b from-[#ffe4e1] to-white" />
            <ImgIcon
              src={IMG.eventGift}
              className="pointer-events-none absolute left-1/2 top-0 z-10 h-[8.75rem] w-[8.75rem] -translate-x-1/2 -translate-y-[42%] object-contain"
            />
            <div className="relative">
              <div className="flex items-center justify-center gap-2">
                <span className="er-title-decor" aria-hidden />
                <h2 className="text-xl font-bold text-ink">{t("eventRewards")}</h2>
                <span className="er-title-decor er-title-decor--right" aria-hidden />
              </div>
              <p className="mt-4 px-1 text-center text-sm leading-relaxed text-ink">
                {t("eventRewardsLoginP1")}{" "}
                <span className="text-main">{t("eventRewardsLoginHl")}</span>{" "}
                {t("eventRewardsLoginP2")}
              </p>
              <Button href={loginUrl(next)} className="mt-6" size="sm">
                {t("loginNowParticipate")}
              </Button>
              <button
                type="button"
                className="mt-4 w-full text-center text-15 font-medium text-ink"
                onClick={() => setOpen(false)}
              >
                {t("continueBrowsing")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    root,
  );
}
