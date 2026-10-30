"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IconMail, IconShield } from "@/components/Icons";
import { InnerShell } from "@/components/layout/InnerShell";
import { Button, OtpField, TextField } from "@/components/ui";
import { useAuth } from "@/hooks/useAuth";
import { useI18n } from "@/hooks/useI18n";
import { useUpdateMeMutation } from "@/hooks/mutations/useWalletMutations";
import { useStore } from "@/lib/store";
import { isEmail } from "@/lib/validation/auth";

export default function BindEmailPage() {
  const { t } = useI18n();
  const { user } = useAuth();
  const { showToast } = useStore();
  const updateUser = useUpdateMeMutation();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [wait, setWait] = useState(0);

  useEffect(() => {
    if (wait <= 0) return;
    const id = window.setTimeout(() => setWait((s) => s - 1), 1000);
    return () => window.clearTimeout(id);
  }, [wait]);

  if (!user) return null;

  function sendCode() {
    if (!isEmail(email)) return showToast(t("emailHint"));
    if (wait > 0) return;
    setWait(60);
    showToast(t("otpSent"));
  }

  function bind() {
    if (!isEmail(email)) return showToast(t("emailHint"));
    if (otp !== "123456") return showToast(t("otpWrong"));
    updateUser.mutate({ email });
    showToast(t("saved"));
    router.back();
  }

  return (
    <InnerShell title={t("bindMailbox")} variant="light">
      <div className="flex min-h-full flex-col px-5 pt-5 pb-8">
        <TextField
          label={t("mail")}
          icon={<IconMail />}
          type="email"
          value={email}
          onChange={setEmail}
          placeholder={t("inputEmail")}
        />
        <OtpField
          className="mt-4"
          label={t("verifyCode")}
          icon={<IconShield />}
          value={otp}
          onChange={setOtp}
          placeholder={t("verifyHint")}
          onSend={sendCode}
          sendLabel={t("send")}
          wait={wait}
          sendClassName="rounded-full"
        />
        <Button className="mt-auto" onClick={bind}>
          {t("bind")}
        </Button>
      </div>
    </InnerShell>
  );
}
