"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { IconLock } from "@/components/Icons";
import { InnerShell } from "@/components/layout/InnerShell";
import { Button, PasswordField } from "@/components/ui";
import { useUpdateMeMutation } from "@/hooks/mutations/useWalletMutations";
import { useAuth } from "@/hooks/useAuth";
import { useI18n } from "@/hooks/useI18n";
import { useStore } from "@/lib/store";
import { isStrongPassword } from "@/lib/validation/auth";

export default function LoginPasswordPage() {
  const { t } = useI18n();
  const { showToast } = useStore();
  const { user } = useAuth();
  const updateUser = useUpdateMeMutation();
  const router = useRouter();
  const [oldP, setOldP] = useState("");
  const [n1, setN1] = useState("");
  const [n2, setN2] = useState("");
  if (!user) return null;

  function save() {
    if (oldP !== user?.password) return showToast(t("loginFailed"));
    if (!isStrongPassword(n1)) return showToast(t("passwordRule"), "warn");
    if (n1 !== n2) return showToast(t("passwordMismatch"));
    updateUser.mutate({ password: n1 });
    showToast(t("saved"));
    router.back();
  }

  return (
    <InnerShell title={t("changeLoginPassword")} variant="light">
      <div className="px-5 pt-5 pb-10">
        <PasswordField
          label={t("loginPassword")}
          icon={<IconLock />}
          value={oldP}
          onChange={setOldP}
          placeholder={t("loginPassword")}
          autoComplete="current-password"
        />
        <PasswordField
          className="mt-4"
          label={t("newLoginPassword")}
          icon={<IconLock />}
          value={n1}
          onChange={setN1}
          placeholder={t("newLoginPassword")}
          autoComplete="new-password"
        />
        <PasswordField
          className="mt-4"
          label={t("confirmNewPassword")}
          icon={<IconLock />}
          value={n2}
          onChange={setN2}
          placeholder={t("confirmNewPassword")}
          autoComplete="new-password"
        />
        <Link
          href="/forgot"
          className="mx-auto mt-4 flex w-fit items-center gap-0.5 text-13 text-muted"
        >
          {t("forgotOriginalLoginPassword")}
          <ChevronRight className="h-4 w-4" />
        </Link>
        <Button className="mt-6" onClick={save}>
          {t("saveChanges")}
        </Button>
      </div>
    </InnerShell>
  );
}
