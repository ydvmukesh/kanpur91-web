"use client";

import { InnerShell } from "@/components/layout/InnerShell";
import { EmptyState } from "@/components/ui";
import { useCmsPage } from "@/hooks/queries/useCmsPage";
import { useI18n } from "@/hooks/useI18n";

export default function PrivacyPage() {
  const { t } = useI18n();
  const { data, isLoading } = useCmsPage("privacy");

  return (
    <InnerShell title={data?.title || t("riskDisclosure")} variant="light" className="bg-page">
      {isLoading ? (
        <EmptyState />
      ) : (
        <div
          className="cms-html px-5 pt-4 pb-10 text-sm text-ink leading-[1.375rem]"
          dangerouslySetInnerHTML={{ __html: data?.html ?? "" }}
        />
      )}
    </InnerShell>
  );
}
