"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, CircleUser, Info, Lock, Mail, X } from "lucide-react";
import { IconCopy } from "@/components/Icons";
import { InnerShell } from "@/components/layout/InnerShell";
import { Button, Popup } from "@/components/ui";
import { useAuth } from "@/hooks/useAuth";
import { useI18n } from "@/hooks/useI18n";
import { useUpdateMeMutation } from "@/hooks/mutations/useWalletMutations";
import { copyText } from "@/lib/format";
import { userAvatar } from "@/lib/avatars";
import { ImgIcon } from "@/lib/img";
import { useStore } from "@/lib/store";

export default function SettingCenterPage() {
  const { t } = useI18n();
  const { user } = useAuth();
  const { showToast } = useStore();
  const updateUser = useUpdateMeMutation();
  const [nickOpen, setNickOpen] = useState(false);
  const [nick, setNick] = useState("");
  if (!user) return null;

  return (
    <>
    <InnerShell title={t("settingsCenter")} headerClassName="bg-main-x">
      <div className="flex items-center bg-main-x px-4 pb-16 pt-safe pt-10 pb-30 text-white gap-3 rounded-b-3xl" />
      <div className="relative z-10 -mt-35 px-3 pb-8">
        <div className="rounded-lg bg-white px-3">
          <div className="flex items-center gap-3 py-3">
            <div className="h-[4.5rem] w-[4.5rem] shrink-0 overflow-hidden rounded-full bg-bg-l1">
              <ImgIcon src={userAvatar(user)} className="h-full w-full object-cover" />
            </div>
            <Link
              href="/main/Avatar"
              className="ml-auto flex items-center gap-0.5 text-13 text-muted"
            >
              {t("changeAvatar")}
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <button
            type="button"
            className="flex w-full items-center gap-2 py-3.5 text-left"
            onClick={() => {
              setNick(user.nickname);
              setNickOpen(true);
            }}
          >
            <span className="text-15 text-muted">{t("nickname")}</span>
            <span className="ml-auto min-w-0 truncate text-15 font-medium text-ink">{user.nickname}</span>
            <ChevronRight className="h-4 w-4 shrink-0 text-muted" />
          </button>
          <button
            type="button"
            className="flex w-full items-center gap-2 border-t border-line py-3.5 text-left"
            onClick={() => {
              void copyText(user.uid);
              showToast(t("copied"), "copy");
            }}
          >
            <span className="text-15 text-muted">{t("uid")}</span>
            <span className="ml-auto text-15 font-medium text-ink">{user.uid}</span>
            <span className="shrink-0 text-main">
              <IconCopy />
            </span>
          </button>
        </div>

      

        <p className="mt-4 mb-2.5 flex items-center gap-1.5 text-lg font-semibold text-ink">
          <span className="h-4 w-0.75 rounded-sm bg-main" />
          {t("securityInformation")}
        </p>

        <Link
          href="/main/SettingCenter/LoginPassword"
          className="mb-2 flex items-center gap-3 rounded-lg bg-white px-3 py-3.5"
        >
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-red-soft text-main">
            <Lock className="h-5 w-5" />
          </span>
          <span className="min-w-0 flex-1 text-15 text-ink">{t("loginPassword")}</span>
          <span className="text-sm text-muted">{t("edit")}</span>
          <ChevronRight className="h-4 w-4 text-muted" />
        </Link>

        <Link
          href="/main/SettingCenter/BindEmail"
          className="mb-2 flex w-full items-center gap-3 rounded-lg bg-white px-3 py-3.5"
        >
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-red-soft text-main">
            <Mail className="h-5 w-5" />
          </span>
          <span className="min-w-0 flex-1 text-left text-15 text-ink">{t("bindMailbox")}</span>
          <span className="max-w-[45%] truncate text-sm text-muted">{user.email || t("toBind")}</span>
          <ChevronRight className="h-4 w-4 text-muted" />
        </Link>

        <div className="flex items-center gap-3 rounded-lg bg-white px-3 py-3.5">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-red-soft text-main">
            <Info className="h-5 w-5" />
          </span>
          <span className="min-w-0 flex-1 text-15 text-ink">{t("updatedVersion")}</span>
          <span className="text-sm text-muted">1.0.9</span>
          <ChevronRight className="h-4 w-4 text-muted" />
        </div>
      </div>
    </InnerShell>
    <NicknameModal
      open={nickOpen}
      value={nick}
      onChange={setNick}
      onClose={() => setNickOpen(false)}
      onConfirm={() => {
        const next = nick.trim();
        if (!next) return;
        updateUser.mutate({ nickname: next });
        setNickOpen(false);
      }}
    />
    </>
  );
}

function NicknameModal({
  open,
  value,
  onChange,
  onClose,
  onConfirm,
}: {
  open: boolean;
  value: string;
  onChange: (v: string) => void;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const { t } = useI18n();
  const canSave = Boolean(value.trim());

  return (
    <Popup open={open} onClose={onClose} className="flex w-[min(100%,20.5rem)] flex-col items-center">
      <div className="w-full rounded-lg bg-main-x px-3.5 pb-3.5 pt-3">
        <div className="mb-3 flex items-center gap-2.5">
          <span className="h-px flex-1 bg-white/80" />
          <p className="shrink-0 text-base font-semibold text-white">{t("changeNickname")}</p>
          <span className="h-px flex-1 bg-white/80" />
        </div>
        <div className="rounded-lg bg-white px-3 pb-9 pt-3.5">
          <label className="mb-2 flex items-center gap-1.5 text-13 text-ink">
            <span className="grid size-6 shrink-0 place-items-center rounded-full bg-red-soft text-main">
              <CircleUser className="h-3.5 w-3.5" />
            </span>
            {t("nickname")}
          </label>
          <input
            autoFocus
            value={value}
            maxLength={20}
            onFocus={(e) => e.currentTarget.select()}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && canSave) onConfirm();
            }}
            className="h-11 w-full rounded-full bg-bg-l1 px-4 text-15 text-ink outline-none"
          />
        </div>
        <Button className="-mt-5" size="sm" disabled={!canSave} onClick={onConfirm}>
          {t("confirm")}
        </Button>
      </div>
      <button
        type="button"
        className="mt-3.5 grid size-8 place-items-center rounded-full border-2 border-white text-white"
        onClick={onClose}
        aria-label={t("close")}
      >
        <X className="h-4 w-4" strokeWidth={2.5} />
      </button>
    </Popup>
  );
}
