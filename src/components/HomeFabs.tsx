"use client";

import { IMG, ImgIcon } from "@/lib/img";
import { useStore } from "@/lib/store";
import { usePathname } from "next/navigation";

export function InstallBanner() {
  const pathname = usePathname();
  const { t, showToast } = useStore();
  if (pathname !== "/home") return null;

  return (
    <button
      type="button"
      onClick={() => showToast(t("download"))}
      className="absolute left-3 right-3  mx-auto max-w-[220px] bottom-[110px] z-30 h-12 rounded-full bg-main-x shadow-lg shadow-main/25 flex items-center px-2 gap-2"
    >
      <span className="h-9 w-9 rounded-full bg-white grid place-items-center shrink-0 overflow-hidden">
        <ImgIcon src={IMG.redBrand} alt="" className="h-5 w-auto object-contain" />
      </span>
      <span className="flex-1 text-white text-[13px] font-semibold text-left">{t("addToDesktop")}</span>
    </button>
  );
}
