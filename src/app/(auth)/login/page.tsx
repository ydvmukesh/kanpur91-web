"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LoginBrand } from "@/components/Logo";
import {
  FlagIN,
  FlagUS,
  IconBack,
  IconEye,
  IconLock,
  IconMail,
  IconPhone,
} from "@/components/Icons";
import { PhoneNumberField } from "@/components/auth/PhoneNumberField";
import { DEMO_LOGIN, useStore } from "@/lib/store";
import { cn } from "@/lib/cn";

const PILL =
  "h-[46px] rounded-full bg-white shadow-[0_2px_8px_rgba(208,208,237,0.45)] px-4 text-[13px] text-l1 placeholder:text-l3 outline-none";

export default function LoginPage() {
  const { t, login, remember, setRemember, showToast, lang, setLang } = useStore();
  const router = useRouter();
  const [tab, setTab] = useState<"phone" | "email">("phone");
  const [phone, setPhone] = useState(DEMO_LOGIN.phone);
  const [email, setEmail] = useState(DEMO_LOGIN.email);
  const [password, setPassword] = useState(DEMO_LOGIN.password);
  const [hide, setHide] = useState(true);
  const [langOpen, setLangOpen] = useState(false);

  const phoneOk = /^\d{10}$/.test(phone);
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const passOk = password.length >= 6;
  const canSubmit = passOk && (tab === "phone" ? phoneOk : emailOk);

  function submit() {
    if (tab === "phone") {
      if (!phoneOk) return showToast(t("phoneInvalid"));
    } else if (!emailOk) {
      return showToast(t("emailHint"));
    }
    if (!passOk) return showToast(t("passwordShort"));
    const err = login(tab === "phone" ? phone : email, password);
    if (err) return showToast(err);
    router.replace("/home");
  }

  return (
    <div className="min-h-dvh bg-white flex flex-col">
      <header className="bg-main-x text-white pb-5">
        <div className="h-12 relative flex items-center px-1">
          <button
            type="button"
            onClick={() => router.back()}
            className="h-11 w-11 grid place-items-center z-10"
            aria-label="Back"
          >
            <IconBack />
          </button>
          <div className="absolute inset-0 grid place-items-center pointer-events-none">
            <LoginBrand />
          </div>
          <button
            type="button"
            onClick={() => setLangOpen(true)}
            className="ml-auto mr-2 h-11 flex items-center gap-1 z-10"
          >
            {lang === "en" ? <FlagUS /> : <FlagIN />}
            <span className="text-[13px] font-semibold">{lang === "en" ? "EN" : "HD"}</span>
          </button>
        </div>
        <div className="px-5 pt-1">
          <h1 className="text-[26px] font-bold leading-tight">{t("login")}</h1>
          <p className="text-[13px] text-white/95 mt-2 leading-[1.45]">{t("loginSub1")}</p>
          <p className="text-[13px] text-white/95 leading-[1.45]">{t("loginSub2")}</p>
        </div>
      </header>

      <div className="grid grid-cols-2 px-6">
        <button
          type="button"
          onClick={() => setTab("phone")}
          className={cn(
            "flex flex-col items-center gap-1 pt-4 pb-2.5 text-[13px] border-b-2",
            tab === "phone" ? "text-main border-main font-medium" : "text-l2 border-transparent",
          )}
        >
          <IconPhone className="h-[22px] w-[22px]" />
          {t("phoneTab")}
        </button>
        <button
          type="button"
          onClick={() => setTab("email")}
          className={cn(
            "flex flex-col items-center gap-1 pt-4 pb-2.5 text-[13px] border-b-2",
            tab === "email" ? "text-main border-main font-medium" : "text-l2 border-transparent",
          )}
        >
          <IconMail className="h-[22px] w-[22px]" />
          {t("emailTab")}
        </button>
      </div>

      <div className="px-5 pt-5 flex-1">
        {tab === "phone" ? (
          <PhoneNumberField
            value={phone}
            onChange={setPhone}
            inputClassName="rounded-full"
          />
        ) : (
          <div>
            <label className="flex items-center gap-1.5 text-[13px] text-l1 font-medium mb-2">
              <span className="text-main">
                <IconMail />
              </span>
              {t("email")}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("emailHint")}
              className={cn(PILL, "w-full")}
            />
          </div>
        )}

        <div className="mt-4">
          <label className="flex items-center gap-1.5 text-[13px] text-l1 font-medium mb-2">
            <span className="text-main">
              <IconLock />
            </span>
            {t("password")}
          </label>
          <div className="relative">
            <input
              type={hide ? "password" : "text"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("passwordHint")}
              className={cn(PILL, "w-full pr-12")}
            />
            <button
              type="button"
              onClick={() => setHide((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-l2"
              aria-label="Toggle password"
            >
              <IconEye off={hide} />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4">
          <label className="flex items-center gap-2 text-[13px] text-l2 cursor-pointer" onClick={() => setRemember(!remember)}>
            <span
              className={cn(
                "h-[18px] w-[18px] rounded-full border grid place-items-center shrink-0",
                remember ? "border-main bg-main" : "border-l3 bg-white",
              )}
            >
              {remember ? <span className="h-1.5 w-1.5 rounded-full bg-white" /> : null}
            </span>
            {t("remember")}
          </label>
          <Link href="/forgot" className="text-[13px] text-main">
            {t("forgot")}
          </Link>
        </div>

        <button
          type="button"
          onClick={submit}
          disabled={!canSubmit}
          className={cn(
            "mt-6 w-full h-12 rounded-full text-[16px] font-bold",
            canSubmit ? "bg-main-x text-white" : "bg-btn-disabled text-[#8a90a2]",
          )}
        >
          {t("login")}
        </button>
        <p className="mt-3 text-center text-[12px] text-l3">{t("demoHint")}</p>
        <Link
          href="/register"
          className="mt-3 w-full h-12 rounded-full border border-main text-main text-[16px] font-bold grid place-items-center"
        >
          {t("register")}
        </Link>
      </div>

      {langOpen ? (
        <Sheet onClose={() => setLangOpen(false)}>
          <p className="text-center font-semibold text-l1 mb-3">{t("language")}</p>
          {[
            { id: "en" as const, label: t("english"), flag: <FlagUS /> },
            { id: "hd" as const, label: t("hindi"), flag: <FlagIN /> },
          ].map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => {
                setLang(opt.id);
                setLangOpen(false);
              }}
              className={cn(
                "w-full h-12 flex items-center gap-3 px-2 rounded-lg text-sm",
                lang === opt.id ? "text-main" : "text-l1",
              )}
            >
              {opt.flag}
              {opt.label}
              <span className="ml-auto text-main">{lang === opt.id ? "✓" : ""}</span>
            </button>
          ))}
        </Sheet>
      ) : null}
    </div>
  );
}

function Sheet({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="absolute inset-0 z-50 flex items-end">
      <button type="button" className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full bg-white rounded-t-2xl p-4 pb-[max(16px,env(safe-area-inset-bottom))]">
        {children}
      </div>
    </div>
  );
}
