"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { InnerShell } from "@/components/layout/InnerShell";
import { Button, PasswordField } from "@/components/ui";
import { useUpdateMeMutation } from "@/hooks/mutations/useWalletMutations";
import { useAuth } from "@/hooks/useAuth";
import { useStore } from "@/lib/store";

export default function ChangePasswordPage() {
  const { t, showToast } = useStore();
  const { user } = useAuth();
  const updateUser = useUpdateMeMutation();
  const router = useRouter();
  const [oldP, setOldP] = useState("");
  const [n1, setN1] = useState("");
  const [n2, setN2] = useState("");
  if (!user) return null;
  return (
    <InnerShell title={t("changePassword")}>
      <div className="p-3 space-y-2">
        <PasswordField variant="line" value={oldP} onChange={setOldP} placeholder={t("oldPassword")} />
        <PasswordField variant="line" value={n1} onChange={setN1} placeholder={t("newPassword")} />
        <PasswordField variant="line" value={n2} onChange={setN2} placeholder={t("confirmPassword")} />
        <Button
          className="mt-2"
          onClick={() => {
            if (oldP !== user.password) return showToast(t("loginFailed"));
            if (n1.length < 6) return showToast(t("passwordShort"));
            if (n1 !== n2) return showToast(t("passwordMismatch"));
            updateUser.mutate({ password: n1 });
            showToast(t("saved"));
            router.back();
          }}
        >
          {t("save")}
        </Button>
      </div>
    </InnerShell>
  );
}
