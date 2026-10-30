"use client";

import { useI18n } from "@/hooks/useI18n";
import { IMG, ImgIcon } from "@/lib/img";

export function Splash() {
  const { t } = useI18n();
  return (
    <div
      className="absolute inset-0 z-[100] flex h-full flex-col"
      style={{
        background: "linear-gradient(180deg, #ff8988, #ffd0ba);",
      }}
    >
      <div className="flex flex-1 flex-col items-center justify-center px-8">
        <ImgIcon src={IMG.splashimg} alt="" className="size-32 object-contain" />
        <p className="mt-5 text-center text-lg font-medium text-white">{t("splashTagline")}</p>
        <div className="flex justify-center py-16">
          <ImgIcon src={IMG.redBrand} alt="91 Club" className="h-14 w-auto object-contain" />
        </div>
      </div>
    </div>
  );
}
