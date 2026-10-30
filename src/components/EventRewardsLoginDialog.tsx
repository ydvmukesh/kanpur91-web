"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui";
import { useI18n } from "@/hooks/useI18n";
import { isAuthOnly, loginUrl } from "@/lib/auth/routes";
import { cn } from "@/lib/cn";
import { IMG, ImgIcon } from "@/lib/img";

const EVT = "kanpur91-er-login";
const MS = 280;

export function openEventRewardsLogin(next = "/account") {
  window.dispatchEvent(new CustomEvent(EVT, { detail: next }));
}

export function EventRewardsLoginDialog() {
  const { t } = useI18n();
  const router = useRouter();
  const pathname = usePathname();
  const [root, setRoot] = useState<HTMLElement | null>(null);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [next, setNext] = useState("/account");

  useEffect(() => {
    setRoot(document.getElementById("phone-root") ?? document.body);
  }, []);

  useEffect(() => {
    if (isAuthOnly(pathname)) setOpen(false);
  }, [pathname]);

  useEffect(() => {
    function onOpen(e: Event) {
      if (isAuthOnly(pathname)) return;
      const detail = (e as CustomEvent<string>).detail;
      setNext(typeof detail === "string" && detail ? detail : "/account");
      setLeaving(false);
      setOpen(true);
      setMounted(true);
    }
    window.addEventListener(EVT, onOpen);
    return () => window.removeEventListener(EVT, onOpen);
  }, [pathname]);

  useEffect(() => {
    if (open) {
      setLeaving(false);
      setMounted(true);
      return;
    }
    if (!mounted) return;
    setLeaving(true);
    const tmr = window.setTimeout(() => {
      setMounted(false);
      setLeaving(false);
    }, MS);
    return () => window.clearTimeout(tmr);
  }, [open, mounted]);

  function close() {
    setOpen(false);
  }

  if (!mounted || !root) return null;

  return createPortal(
    <div className="absolute inset-0 z-[80] flex justify-center">
      <div className="relative h-full w-full">
        <button
          type="button"
          className={cn(
            "absolute inset-0 bg-black/55 transition-opacity duration-[280ms] ease-out",
            leaving ? "opacity-0" : "opacity-100",
          )}
          onClick={close}
        />
        <div
          className={cn(
            "absolute inset-x-0 bottom-0 rounded-t-[1.25rem] bg-white pb-safe-b",
            leaving ? "animate-[sheet-down_280ms_ease-in]" : "animate-[sheet-up_280ms_ease-out]",
          )}
        >
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
              <Button
                className="mt-6"
                size="sm"
                onClick={() => {
                  close();
                  router.push(loginUrl(next));
                }}
              >
                {t("loginNowParticipate")}
              </Button>
              <button
                type="button"
                className="mt-4 w-full text-center text-15 font-medium text-ink"
                onClick={close}
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
