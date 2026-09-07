"use client";

import { InnerHeader } from "@/components/Ui";
import { useStore } from "@/lib/store";
import { IMG, ImgIcon } from "@/lib/img";

export default function AboutPage() {
  const { t } = useStore();
  return (
    <div className="min-h-dvh bg-bg-l1">
      <InnerHeader title={t("about")} />
      <div className="flex flex-col items-center pt-6 pb-2">
        <ImgIcon src={IMG.brand} alt="91 Club" className="h-10 w-auto object-contain invert" />
      </div>
      <div className="m-3 bg-white rounded-xl p-4 text-sm text-l2 leading-6">{t("aboutText")}</div>
      <p className="text-center text-xs text-l3">v1.0.0</p>
    </div>
  );
}
