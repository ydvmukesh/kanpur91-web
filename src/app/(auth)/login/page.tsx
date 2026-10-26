"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { IconLock, IconMail, IconPhone } from "@/components/Icons";
import { AuthHeader } from "@/components/layout/AuthHeader";
import { Button, Checkbox, PasswordField, PhoneField, TabContent, TextField, UnderlineTabs } from "@/components/ui";
import { useAuth } from "@/hooks/useAuth";
import { useI18n } from "@/hooks/useI18n";
import { safeNext } from "@/lib/auth/routes";
import { DEMO_LOGIN, useStore } from "@/lib/store";
import { isEmail, isPassword, isPhone } from "@/lib/validation/auth";

export default function LoginPage() {
  const { login } = useAuth();
  const { t } = useI18n();
  const { remember, setRemember, showToast } = useStore();
  const router = useRouter();
  const [tab, setTab] = useState<"phone" | "email">("phone");
  const [phone, setPhone] = useState(DEMO_LOGIN.phone);
  const [email, setEmail] = useState(DEMO_LOGIN.email);
  const [password, setPassword] = useState(DEMO_LOGIN.password);

  const phoneOk = isPhone(phone);
  const emailOk = isEmail(email);
  const passOk = isPassword(password);
  const canSubmit = passOk && (tab === "phone" ? phoneOk : emailOk);

  async function submit() {
    if (tab === "phone") {
      if (!phoneOk) return showToast(t("phoneInvalid"));
    } else if (!emailOk) {
      return showToast(t("emailHint"));
    }
    if (!passOk) return showToast(t("passwordShort"));
    const err = await login(tab === "phone" ? phone : email, password);
    if (err) return showToast(err);
    const next = new URLSearchParams(window.location.search).get("next");
    router.replace(safeNext(next));
  }

  return (
    <AuthHeader
      title={t("login")}
      sub={
        <>
          <p className="text-xs text-white/95 mt-2">{t("loginSub1")}</p>
          <p className="text-xs text-white/95">{t("loginSub2")}</p>
        </>
      }
    >
      <UnderlineTabs
        value={tab}
        onChange={setTab}
        items={[
          { id: "phone", label: t("phoneTab"), icon: <IconPhone className="h-[1.375rem] w-[1.375rem]" /> },
          { id: "email", label: t("emailTab"), icon: <IconMail className="h-[1.375rem] w-[1.375rem]" /> },
        ]}
      />

      <div className="px-5 pt-5 pb-10">
        <TabContent value={tab} when="phone">
          <PhoneField value={phone} onChange={setPhone} />
        </TabContent>
        <TabContent value={tab} when="email">
          <TextField
            label={t("email")}
            icon={<IconMail />}
            type="email"
            value={email}
            onChange={setEmail}
            placeholder={t("emailHint")}
          />
        </TabContent>

        <PasswordField
          className="mt-4"
          label={t("password")}
          icon={<IconLock />}
          value={password}
          onChange={setPassword}
          placeholder={t("passwordHint")}
        />

        <div className="flex items-center justify-between gap-3 mt-4">
          <Checkbox className="shrink-0 whitespace-nowrap" checked={remember} onChange={setRemember}>
            {t("remember")}
          </Checkbox>
          <Link href="/forgot" className="shrink-0 text-13 text-main whitespace-nowrap leading-none">
            {t("forgot")}
          </Link>
        </div>

        <Button className="mt-6" disabled={!canSubmit} onClick={submit}>
          {t("login")}
        </Button>
        <p className="mt-3 text-center text-sm text-faint">{t("demoHint")}</p>
        <Button href="/register" variant="outline" className="mt-3">
          {t("register")}
        </Button>
      </div>
    </AuthHeader>
  );
}
