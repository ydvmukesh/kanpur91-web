"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IconLock, IconMail, IconPhone, IconShield } from "@/components/Icons";
import { AuthHeader } from "@/components/layout/AuthHeader";
import { Button, OtpField, PasswordField, PhoneField, TextField, UnderlineTabs } from "@/components/ui";
import { useAuth } from "@/hooks/useAuth";
import { useI18n } from "@/hooks/useI18n";
import { useStore } from "@/lib/store";
import { isEmail, isPassword, isPhone } from "@/lib/validation/auth";

export default function ForgotPage() {
  const { resetPassword } = useAuth();
  const { t } = useI18n();
  const { showToast } = useStore();
  const router = useRouter();
  const [tab, setTab] = useState<"phone" | "email">("phone");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [wait, setWait] = useState(0);

  useEffect(() => {
    if (wait <= 0) return;
    const id = window.setTimeout(() => setWait((s) => s - 1), 1000);
    return () => window.clearTimeout(id);
  }, [wait]);

  const phoneOk = isPhone(phone);
  const emailOk = isEmail(email);
  const accountOk = tab === "phone" ? phoneOk : emailOk;
  const canSubmit = accountOk && otp.length >= 4 && isPassword(password) && password === confirm;

  function sendCode() {
    if (!accountOk) return showToast(tab === "phone" ? t("phoneInvalid") : t("emailHint"));
    if (wait > 0) return;
    setWait(60);
    showToast(t("otpSent"));
  }

  async function submit() {
    if (!accountOk) return showToast(tab === "phone" ? t("phoneInvalid") : t("emailHint"));
    if (otp !== "123456") return showToast(t("otpWrong"));
    if (!isPassword(password)) return showToast(t("passwordShort"));
    if (password !== confirm) return showToast(t("passwordMismatch"));
    const err = await resetPassword(tab === "phone" ? phone : email, password);
    if (err) return showToast(err);
    showToast(t("success"));
    router.replace("/login");
  }

  return (
    <AuthHeader title={t("forgot")} sub={<p className="text-xs text-white/95 mt-2">{t("forgotSub")}</p>}>
      <UnderlineTabs
        value={tab}
        onChange={setTab}
        items={[
          { id: "phone", label: t("phoneTab"), icon: <IconPhone className="h-[22px] w-[22px]" /> },
          { id: "email", label: t("emailTab"), icon: <IconMail className="h-[22px] w-[22px]" /> },
        ]}
      />

      <div className="px-5 pt-4 pb-10 flex-1">
        {tab === "phone" ? (
          <PhoneField value={phone} onChange={setPhone} />
        ) : (
          <TextField
            label={t("email")}
            icon={<IconMail />}
            type="email"
            value={email}
            onChange={setEmail}
            placeholder={t("emailHint")}
          />
        )}

      
        <PasswordField
          className="mt-3.5"
          label={t("newPassword")}
          icon={<IconLock />}
          value={password}
          onChange={setPassword}
          placeholder={t("newPassword")}
        />
        <PasswordField
          className="mt-3.5"
          label={t("confirmPassword")}
          icon={<IconLock />}
          value={confirm}
          onChange={setConfirm}
          placeholder={t("confirmPassword")}
        />
          <OtpField
          className="mt-3.5"
          label={t("verifyCode")}
          icon={<IconShield />}
          value={otp}
          onChange={setOtp}
          placeholder={t("verifyHint")}
          onSend={sendCode}
          sendLabel={t("send")}
          wait={wait}
        />

        <Button className="mt-6" disabled={!canSubmit} onClick={submit}>
          {t("reset")}
        </Button>
      </div>
    </AuthHeader>
  );
}
