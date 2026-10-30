"use client";

import { InnerShell } from "@/components/layout/InnerShell";
import { useI18n } from "@/hooks/useI18n";
import { BEGINNER_GUIDE_HTML } from "@/lib/beginner-guide";

export default function GuidePage() {
  const { t } = useI18n();

  return (
    <InnerShell title={t("guide")} variant="light">
      <div
        className="cms-html px-3 pb-8 pt-3 text-sm leading-relaxed text-ink [&_.guide-h]:mb-1 [&_.guide-h]:block [&_.guide-h]:text-lg [&_.guide-h]:font-bold [&_.guide-h]:text-ink [&_img]:my-2 [&_img]:h-auto [&_img]:w-full"
        dangerouslySetInnerHTML={{ __html: BEGINNER_GUIDE_HTML }}
      />
    </InnerShell>
  );
}
