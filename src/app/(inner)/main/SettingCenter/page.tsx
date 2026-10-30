"use client";

import Link from "next/link";
import { ChevronRight, Info, Lock, Mail } from "lucide-react";
import { IconCopy } from "@/components/Icons";
import { InnerShell } from "@/components/layout/InnerShell";
import { useAuth } from "@/hooks/useAuth";
import { useI18n } from "@/hooks/useI18n";
import { copyText } from "@/lib/format";
import { IMG, ImgIcon } from "@/lib/img";
import { useStore } from "@/lib/store";

export default function SettingCenterPage() {
  const { t } = useI18n();
  const { user } = useAuth();
  const { showToast } = useStore();
  if (!user) return null;

  return (
    <InnerShell title={t("settingsCenter")} headerClassName="bg-main-x">
      <div className="flex items-center bg-main-x px-4 pb-16 pt-safe pt-10 pb-30 text-white gap-3 rounded-b-3xl" />
      <div className="relative z-10 -mt-35 px-3 pb-8">
        <div className="rounded-lg bg-white px-3">
          <div className="flex items-center gap-3 py-3">
            <div className="h-[4.5rem] w-[4.5rem] shrink-0 overflow-hidden rounded-full bg-bg-l1">
              <ImgIcon src={IMG.vipAvatar} className="h-full w-full object-cover" />
            </div>
            <button
              type="button"
              className="ml-auto flex items-center gap-0.5 text-13 text-muted"
              onClick={() => showToast(t("comingSoon"))}
            >
              {t("changeAvatar")}
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <button
            type="button"
            className="flex w-full items-center gap-2 py-3.5 text-left"
            onClick={() => showToast(t("comingSoon"))}
          >
            <span className="text-sm text-muted">{t("nickname")}</span>
            <span className="ml-auto min-w-0 truncate text-sm font-medium text-ink">{user.nickname}</span>
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
            <span className="text-sm text-muted">{t("uid")}</span>
            <span className="ml-auto text-sm font-medium text-ink">{user.uid}</span>
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
          href="/change-password"
          className="mb-2 flex items-center gap-3 rounded-lg bg-white px-3 py-3.5"
        >
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-red-soft text-main">
            <Lock className="h-5 w-5" />
          </span>
          <span className="min-w-0 flex-1 text-sm text-ink">{t("loginPassword")}</span>
          <span className="text-13 text-muted">{t("edit")}</span>
          <ChevronRight className="h-4 w-4 text-muted" />
        </Link>

        <button
          type="button"
          className="mb-2 flex w-full items-center gap-3 rounded-lg bg-white px-3 py-3.5"
          onClick={() => showToast(t("comingSoon"))}
        >
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-red-soft text-main">
            <Mail className="h-5 w-5" />
          </span>
          <span className="min-w-0 flex-1 text-left text-sm text-ink">{t("bindMailbox")}</span>
          <span className="text-13 text-muted">{t("toBind")}</span>
          <ChevronRight className="h-4 w-4 text-muted" />
        </button>

        <div className="flex items-center gap-3 rounded-lg bg-white px-3 py-3.5">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-red-soft text-main">
            <Info className="h-5 w-5" />
          </span>
          <span className="min-w-0 flex-1 text-sm text-ink">{t("updatedVersion")}</span>
          <span className="text-13 text-muted">1.0.9</span>
          <ChevronRight className="h-4 w-4 text-muted" />
        </div>
      </div>
    </InnerShell>
  );
}
