"use client";

import { Download, Zap } from "lucide-react";
import { InnerShell } from "@/components/layout/InnerShell";
import { Button } from "@/components/ui";
import { useI18n } from "@/hooks/useI18n";
import { IMG, ImgIcon } from "@/lib/img";
import { promptPwaInstall } from "@/lib/pwa/install";
import { useStore } from "@/lib/store";

export default function DownloadPage() {
  const { t } = useI18n();
  const { showToast } = useStore();

  function install() {
    showToast(t("addToDesktop"));
  }

  async function installPwa() {
    const result = await promptPwaInstall();
    if (result === "accepted") return;
    if (result === "installed") return showToast(t("pwaInstalled"));
    if (result === "ios") return showToast(t("pwaIosHint"));
    if (result === "unavailable") return showToast(t("pwaUnavailable"));
  }

  return (
    <InnerShell title={t("downloadPage")} variant="light" className="bg-page">
      <div className="px-3.5 pt-4 pb-10">
        <ImgIcon src={IMG.downloadBanner} alt={t("downloadBanner")} className="w-full h-auto" />

        <div className="mt-8 space-y-3 mx-4">
          <Button variant="gold" onClick={installPwa}>
            <span className="flex items-center gap-2">
              <Zap className="h-4 w-4 fill-white" />
              {t("quickInstall")}
            </span>
          </Button>
          <Button variant="main" onClick={install}>
            <span className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              {t("completeInstall")}
            </span>
          </Button>
        </div>
      </div>
    </InnerShell>
  );
}
