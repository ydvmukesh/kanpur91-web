"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Swiper from "swiper";
import "swiper/css";
import Link from "next/link";
import { InnerShell } from "@/components/layout/InnerShell";
import { Button } from "@/components/ui";
import { useAuth } from "@/hooks/useAuth";
import { useI18n } from "@/hooks/useI18n";
import { copyText } from "@/lib/format";
import { IMG, ImgIcon } from "@/lib/img";
import { useStore } from "@/lib/store";

const POSTERS = [0, 1, 2];

function inviteUrl(code: string) {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  return `${origin}/register?invite=${encodeURIComponent(code)}`;
}

function qrSrc(data: string) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(data)}`;
}

function PosterCard({ code }: { code: string }) {
  const { t } = useI18n();
  const url = inviteUrl(code);
  return (
    <div
      className="relative h-[22.5rem] w-[16.25rem] overflow-hidden rounded-[0.75rem] bg-cover bg-center px-3 pt-3 text-center text-white"
      style={{ backgroundImage: `url(${IMG.invitePoster})` }}
    >
      <div className="flex gap-[0.1875rem]">
        <p
          className="flex h-[2.375rem] flex-1 items-center justify-center bg-[length:100%_100%] bg-center bg-no-repeat px-2 text-center font-semibold text-[#f24544] text-13 leading-tight"
          style={{ backgroundImage: `url(${IMG.inviteTab})` }}
        >
          {t("fairAndJustice")}
        </p>
        <p
          className="flex h-[2.375rem] flex-1 items-center justify-center bg-[length:100%_100%] bg-center bg-no-repeat px-2 text-center font-semibold  text-[#f24544] text-13 leading-tight"
          style={{ backgroundImage: `url(${IMG.inviteTab})` }}
        >
          {t("openAndTransparent")}
        </p>
      </div>
      <p className="mt-3 text-[0.9375rem] font-bold italic leading-tight drop-shadow">{t("fullOddsBonusRate")}</p>
      <div className="mt-2.5 grid grid-cols-2 gap-2 px-1">
        <div className="rounded-md border border-white/70 bg-black/10 px-1 py-2">
          <ImgIcon src={IMG.inviteBank} alt="" className="mx-auto h-7 w-7 object-contain" />
          <p className="mt-1 text-[0.625rem] leading-tight">{t("financialSecurity")}</p>
        </div>
        <div className="rounded-md border border-white/70 bg-black/10 px-1 py-2">
          <ImgIcon src={IMG.inviteTruck} alt="" className="mx-auto h-7 w-7 object-contain" />
          <p className="mt-1 text-[0.625rem] leading-tight">{t("quickWithdrawal")}</p>
        </div>
      </div>
      <p className="mt-2.5 text-sm font-semibold leading-snug">
        {t("permanentCommission")}
        <br />
        <span className="text-lg text-[#ffe46c]">85%</span>
      </p>
      <div className="mx-auto mt-2 grid h-[6.5rem] w-[6.5rem] place-items-center rounded-sm bg-white p-1">
        <ImgIcon src={qrSrc(url)} className="h-full w-full object-contain" />
      </div>
    </div>
  );
}

export default function PromotionSharePage() {
  const { t } = useI18n();
  const { user } = useAuth();
  const { showToast } = useStore();
  const params = useSearchParams();
  const code = params.get("code") || user?.uid || "";
  const root = useRef<HTMLDivElement>(null);
  const [link, setLink] = useState("");

  useEffect(() => {
    setLink(inviteUrl(code));
  }, [code]);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const swiper = new Swiper(el, {
      slidesPerView: "auto",
      centeredSlides: true,
      spaceBetween: 12,
      grabCursor: true,
    });
    return () => {
      swiper.destroy(true, true);
    };
  }, []);

  function copyLink() {
    void copyText(link);
    showToast(t("copied"), "copy");
  }

  function downloadQr() {
    const a = document.createElement("a");
    a.href = qrSrc(link);
    a.download = "invite-qr.png";
    a.target = "_blank";
    a.rel = "noreferrer";
    a.click();
  }

  const shares = [
    { id: "wa", label: t("whatsapp"), href: `https://wa.me/?text=${encodeURIComponent(link)}`, icon: IMG.shareWhatsapp },
    { id: "tg", label: t("telegram"), href: `https://t.me/share/url?url=${encodeURIComponent(link)}`, icon: IMG.shareTelegram },
    { id: "fb", label: t("facebook"), href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`, icon: IMG.shareFacebook },
    { id: "x", label: t("shareX"), href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(link)}`, icon: IMG.shareX },
  ];

  const [incomeBefore, incomeAfter] = t("incomeBillionCommission", { n: "\0" }).split("\0");

  return (
    <InnerShell title={t("invitePage")} variant="light">
      <p className="px-4 pt-3 text-center text-sm text-muted">{t("swipePosterHint")}</p>
      <div ref={root} className="swiper mt-3 w-full overflow-hidden">
        <div className="swiper-wrapper">
          {POSTERS.map((id) => (
            <div key={id} className="swiper-slide !w-[16.25rem]">
              <PosterCard code={code} />
            </div>
          ))}
        </div>
      </div>

      <p className="mt-4 px-3 text-center text-base text-ink">
        {t("inviteFriends")}
        <span className="ml-4">{incomeBefore}</span>
        <span className="font-bold text-main">10 billion</span>{" "}
        <span> {incomeAfter}</span>
      </p>

      <div className="px-4 pb-8 pt-4">
        <Button size="sm" className="uppercase" onClick={downloadQr}>
          {t("downloadQrCode")}
        </Button>
        <Button variant="outline" size="sm" className="mt-3 font-medium" onClick={copyLink}>
          {t("copyInvitationLink")}
        </Button>
        <p className="mt-5 text-center text-11 text-muted">{t("shareToOtherApps")}</p>
        <div className="mt-3 grid grid-cols-4 gap-2 max-w-75 mx-auto">
          {shares.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className="flex flex-col items-center gap-1.5"
            >
              <ImgIcon src={item.icon} alt="" className="h-10 w-10 object-contain" />
              <span className="text-11 text-muted">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </InnerShell>
  );
}
