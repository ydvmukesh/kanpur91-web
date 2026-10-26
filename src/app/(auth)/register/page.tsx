"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { IconInvite, IconLock, IconPhone } from "@/components/Icons";
import { AuthHeader } from "@/components/layout/AuthHeader";
import { Button, Checkbox, PasswordField, PhoneField, TextField, UnderlineTabs } from "@/components/ui";
import { useAuth } from "@/hooks/useAuth";
import { useI18n } from "@/hooks/useI18n";
import { safeNext } from "@/lib/auth/routes";
import { useStore } from "@/lib/store";
import { isPassword, isPhone } from "@/lib/validation/auth";

export default function RegisterPage() {
  const { register } = useAuth();
  const { t } = useI18n();
  const { showToast } = useStore();
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [invite, setInvite] = useState("");
  const [agree, setAgree] = useState(true);

  const phoneOk = isPhone(phone);
  const canSubmit = phoneOk && isPassword(password) && password === confirm && agree;

  async function submit() {
    if (!phoneOk) return showToast(t("phoneInvalid"));
    if (!isPassword(password)) return showToast(t("passwordShort"));
    if (password !== confirm) return showToast(t("passwordMismatch"));
    if (!agree) return showToast(t("privacyAgreement"));
    const err = await register({ phone, password, invite });
    if (err) return showToast(err);
    showToast(t("registered"));
    const next = new URLSearchParams(window.location.search).get("next");
    router.replace(safeNext(next));
  }

  return (
    <AuthHeader title={t("register")} sub={<p className="text-xs text-white/95 mt-2">{t("registerSub")}</p>}>
      <UnderlineTabs
        value="phone"
        onChange={() => {}}
        items={[
          { id: "phone", label: t("registerPhoneTab"), icon: <IconPhone className="h-[1.375rem] w-[1.375rem]" /> },
        ]}
      />

      <div className="px-5 pt-4 pb-10">
        <PhoneField value={phone} onChange={setPhone} />

        <PasswordField
          className="mt-3.5"
          label={t("setPassword")}
          icon={<IconLock />}
          value={password}
          onChange={setPassword}
          placeholder={t("setPassword")}
        />
        <PasswordField
          className="mt-3.5"
          label={t("confirmPassword")}
          icon={<IconLock />}
          value={confirm}
          onChange={setConfirm}
          placeholder={t("confirmPassword")}
        />
        <TextField
          className="mt-3.5"
          label={t("inviteCode")}
          icon={<IconInvite />}
          value={invite}
          onChange={setInvite}
          placeholder={t("inviteHint")}
        />

        <Checkbox className="mt-4" checked={agree} onChange={setAgree}>
          <span>
            {t("privacyAgree")}{" "}
            <Link href="/privacy" className="text-main" onClick={(e) => e.stopPropagation()}>
              【{t("privacyAgreement")}】
            </Link>
          </span>
        </Checkbox>

        <Button className="mt-5" disabled={!canSubmit} onClick={submit}>
          {t("register")}
        </Button>
        <Button href="/login" variant="outline" className="mt-3 font-normal !flex items-center justify-center gap-1">
          <span className="text-sm text-muted">{t("haveAccountLogin")}</span>
          <span className="text-main font-bold ml-1">{t("login")}</span>
        </Button>
      </div>
    </AuthHeader>
  );
}
