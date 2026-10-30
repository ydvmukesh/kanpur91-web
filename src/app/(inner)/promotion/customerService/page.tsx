"use client";

import { ChevronRight } from "lucide-react";
import { InnerShell } from "@/components/layout/InnerShell";
import { useI18n } from "@/hooks/useI18n";
import { IMG, ImgIcon } from "@/lib/img";
import Link from "next/link";

export default function PromotionCustomerServicePage() {
  const { t } = useI18n();

  return (
    <InnerShell title={t("agentLineCs")} variant="main" headerClassName="bg-main-x">
      <div className="bg-main-x">
        <ImgIcon src={IMG.serverBg} className="mx-auto block w-full  !max-w-75" />
      </div>
      <div className="relative z-10  px-3 pb-8 pt-3">
        <Link
          href="https://t.me/"
          target="_blank"
          rel="noreferrer"
          className="flex h-[3.375rem] items-center gap-3 rounded-lg bg-white px-3"
        >
          <ImgIcon src={IMG.shareTelegram} className="h-8 w-8 shrink-0" />
          <span className="min-w-0 flex-1 text-15 text-ink">{t("telegram")}</span>
          <ChevronRight className="h-5 w-5 shrink-0 text-faint" strokeWidth={1.5} />
        </Link>
      </div>
    </InnerShell>
  );
}
