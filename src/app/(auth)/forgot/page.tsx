"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LoginBrand } from "@/components/Logo";
import {
  FlagIN,
  FlagUS,
  IconBack,
  IconEye,
  IconHeadset,
  IconLock,
  IconMail,
  IconPhone,
  IconShield,
} from "@/components/Icons";
import { PhoneNumberField } from "@/components/auth/PhoneNumberField";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/cn";

const FIELD =
  "h-[46px] rounded-[10px] bg-white shadow-[0_2px_8px_rgba(208,208,237,0.45)] text-[13px] text-l1 placeholder:text-l3 outline-none";

export default function ForgotPage() {
  const { t, resetPassword, showToast, lang, setLang } = useStore();
  const router = useRouter();
  const [tab, setTab] = useState<"phone" | "email">("phone");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [hide1, setHide1] = useState(true);
  const [hide2, setHide2] = useState(true);
  const [langOpen, setLangOpen] = useState(false);
  const [wait, setWait] = useState(0);

  useEffect(() => {
    if (wait <= 0) return;
    const id = window.setTimeout(() => setWait((s) => s - 1), 1000);
    return () => window.clearTimeout(id);
  }, [wait]);

  const phoneOk = /^\d{10}$/.test(phone);
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const accountOk = tab === "phone" ? phoneOk : emailOk;
  const canSubmit = accountOk && otp.length >= 4 && password.length >= 6 && password === confirm;

  function sendCode() {
    if (!accountOk) return showToast(tab === "phone" ? t("phoneInvalid") : t("emailHint"));
    if (wait > 0) return;
    setWait(60);
    showToast(t("otpSent"));
  }

  function submit() {
    if (!accountOk) return showToast(tab === "phone" ? t("phoneInvalid") : t("emailHint"));
    if (otp !== "123456") return showToast(t("otpWrong"));
    if (password.length < 6) return showToast(t("passwordShort"));
    if (password !== confirm) return showToast(t("passwordMismatch"));
    const err = resetPassword(tab === "phone" ? phone : email, password);
    if (err) return showToast(err);
    showToast(t("success"));
    router.replace("/login");
  }

  return (
    <div className="min-h-dvh bg-[#f6f7fb] flex flex-col relative">
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
          <h1 className="text-[26px] font-bold leading-tight">{t("forgot")}</h1>
          <p className="text-[13px] text-white/95 mt-2 leading-[1.45]">{t("forgotSub")}</p>
        </div>
      </header>

      <div className="grid grid-cols-2 px-6 bg-white">
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

      <div className="px-5 pt-4 pb-24 flex-1">
        {tab === "phone" ? (
          <PhoneNumberField value={phone} onChange={setPhone} />
        ) : (
          <FieldBlock icon={<IconMail />} label={t("email")}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("emailHint")}
              className={cn(FIELD, "w-full px-4")}
            />
          </FieldBlock>
        )}

        <FieldBlock icon={<IconShield />} label={t("verifyCode")} className="mt-3.5">
          <div className="relative">
            <input
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder={t("verifyHint")}
              className={cn(FIELD, "w-full px-4 pr-[88px]")}
            />
            <button
              type="button"
              onClick={sendCode}
              disabled={wait > 0}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 h-8 min-w-[68px] px-3 rounded-full bg-main-x text-white text-[12px] font-semibold disabled:opacity-70"
            >
              {wait > 0 ? `${wait}s` : t("send")}
            </button>
          </div>
        </FieldBlock>

        <FieldBlock icon={<IconLock />} label={t("newPassword")} className="mt-3.5">
          <div className="relative">
            <input
              type={hide1 ? "password" : "text"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("newPassword")}
              className={cn(FIELD, "w-full px-4 pr-12")}
            />
            <button
              type="button"
              onClick={() => setHide1((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-l2"
            >
              <IconEye off={hide1} />
            </button>
          </div>
        </FieldBlock>

        <FieldBlock icon={<IconLock />} label={t("confirmPassword")} className="mt-3.5">
          <div className="relative">
            <input
              type={hide2 ? "password" : "text"}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder={t("confirmPassword")}
              className={cn(FIELD, "w-full px-4 pr-12")}
            />
            <button
              type="button"
              onClick={() => setHide2((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-l2"
            >
              <IconEye off={hide2} />
            </button>
          </div>
        </FieldBlock>

        <button
          type="button"
          onClick={submit}
          disabled={!canSubmit}
          className={cn(
            "mt-6 w-full h-12 rounded-full text-[16px] font-bold",
            canSubmit
              ? "bg-main-x text-white shadow-[0_8px_16px_rgba(249,89,89,0.28)]"
              : "bg-btn-disabled text-[#8a90a2]",
          )}
        >
          {t("reset")}
        </button>
        <Link
          href="/login"
          className="mt-3 w-full h-12 rounded-full border border-main flex items-center justify-center text-[15px] gap-1"
        >
          <span className="text-l3">{t("haveAccountLogin")}</span>
          <span className="text-main font-bold">{t("login")}</span>
        </Link>
      </div>

      <Link
        href="/customer-service"
        className="absolute right-3 bottom-6 z-20 h-12 w-12 rounded-full bg-main-x shadow-lg grid place-items-center text-white"
        aria-label={t("customerService")}
      >
        <IconHeadset />
      </Link>

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

function FieldBlock({
  icon,
  label,
  children,
  className,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="flex items-center gap-1.5 text-[13px] text-l1 font-medium mb-2">
        <span className="text-main">{icon}</span>
        {label}
      </label>
      {children}
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
