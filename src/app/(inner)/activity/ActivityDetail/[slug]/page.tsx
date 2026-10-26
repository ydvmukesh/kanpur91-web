"use client";

import { Suspense, use } from "react";
import { InnerShell } from "@/components/layout/InnerShell";
import { EmptyState } from "@/components/ui";
import { useI18n } from "@/hooks/useI18n";
import { ACTIVITY_EVENTS } from "@/lib/activity";
import { ImgIcon } from "@/lib/img";

export default function ActivityDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense>
      <ActivityDetailBody params={params} />
    </Suspense>
  );
}

function ActivityDetailBody({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { t } = useI18n();
  const event = ACTIVITY_EVENTS[slug];

  return (
    <InnerShell title={t("activityDetails")} variant="light" className="bg-page">
      {!event ? (
        <EmptyState />
      ) : (
        <div className="pb-8">
          <ImgIcon src={event.banner} alt="" className="h-auto w-full" />
          <h2 className="px-4 py-3 text-center text-[15px] font-bold uppercase text-ink">{event.title}</h2>
          {event.body ? (
            <div className="px-3">
              <ImgIcon src={event.body} alt="" className="h-auto w-full" />
            </div>
          ) : null}
        </div>
      )}
    </InnerShell>
  );
}
