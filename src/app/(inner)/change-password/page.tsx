"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { InnerHeader, Field, PrimaryButton } from "@/components/Ui";
import { useStore } from "@/lib/store";

export default function ChangePasswordPage() {
  const { t, user, updateUser, showToast } = useStore();
  const router = useRouter();
  const [oldP, setOldP] = useState("");
  const [n1, setN1] = useState("");
  const [n2, setN2] = useState("");
  if (!user) return null;
  return (
    <div className="min-h-dvh bg-bg-l1">
      <InnerHeader title={t("changePassword")} />
      <div className="p-3 space-y-2">
        <Field>
          <input type="password" value={oldP} onChange={(e) => setOldP(e.target.value)} placeholder={t("oldPassword")} className="flex-1 bg-transparent outline-none text-sm" />
        </Field>
        <Field>
          <input type="password" value={n1} onChange={(e) => setN1(e.target.value)} placeholder={t("newPassword")} className="flex-1 bg-transparent outline-none text-sm" />
        </Field>
        <Field>
          <input type="password" value={n2} onChange={(e) => setN2(e.target.value)} placeholder={t("confirmPassword")} className="flex-1 bg-transparent outline-none text-sm" />
        </Field>
        <PrimaryButton
          className="mt-2"
          onClick={() => {
            if (oldP !== user.password) return showToast(t("loginFailed"));
            if (n1.length < 6) return showToast(t("passwordShort"));
            if (n1 !== n2) return showToast(t("passwordMismatch"));
            updateUser({ password: n1 });
            showToast(t("saved"));
            router.back();
          }}
        >
          {t("save")}
        </PrimaryButton>
      </div>
    </div>
  );
}
