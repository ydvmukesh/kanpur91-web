"use client";

import { InnerShell } from "@/components/layout/InnerShell";
import { EmptyState } from "@/components/ui";
import { useCmsPage } from "@/hooks/queries/useCmsPage";
import { useI18n } from "@/hooks/useI18n";

export default function RiskDisclosureAgreementPage() {
  const { t } = useI18n();
  const { data, isLoading } = useCmsPage("privacy");

  return (
    <InnerShell title={data?.title || t("riskDisclosure")} variant="light">
      {isLoading ? (
        <EmptyState />
      ) : (
        <div
          className="cms-html mx-3 mt-3 mb-8 rounded-lg bg-white px-4 py-5 text-xs leading-relaxed text-ink"
          dangerouslySetInnerHTML={{ __html: data?.html ?? "" }}
        />
      )}
    </InnerShell>
  );
}
