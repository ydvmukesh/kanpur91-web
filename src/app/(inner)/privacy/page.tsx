"use client";

import { InnerShell } from "@/components/layout/InnerShell";
import { useI18n } from "@/hooks/useI18n";

export default function PrivacyPage() {
  const { t } = useI18n();
  return (
    <InnerShell title={t("riskDisclosure")} variant="light" className="bg-page">
      <div className="px-5 pt-4 pb-10 text-[14px] text-ink leading-[22px]">
        <p className="mb-3">{t("userAgreement")}</p>
        <p className="mb-3">{t("riskP1")}</p>
        <p className="mb-3">{t("riskP2")}</p>
        <p className="mb-3">{t("riskP3")}</p>
        <p className="mb-3">{t("riskP4")}</p>
        <p>{t("riskP5")}</p>
      </div>
    </InnerShell>
  );
}
