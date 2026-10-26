"use client";

import { Suspense, use } from "react";
import { useSearchParams } from "next/navigation";
import { EmptyState } from "@/components/ui";
import { GameCatalogView } from "@/components/GameCatalogView";
import { InnerShell } from "@/components/layout/InnerShell";
import { useCatalog } from "@/hooks/queries/useCatalogs";
import { useI18n } from "@/hooks/useI18n";

export default function HomeCatalogPage({ params }: { params: Promise<{ catalog: string }> }) {
  return (
    <Suspense>
      <CatalogBody params={params} />
    </Suspense>
  );
}

function CatalogBody({ params }: { params: Promise<{ catalog: string }> }) {
  const { catalog: slug } = use(params);
  const search = useSearchParams();
  const type = search.get("type");
  const { t } = useI18n();
  const { data, isLoading } = useCatalog(slug, type);

  if (isLoading) {
    return <InnerShell title={t("game")} variant="light" className="bg-page" />;
  }
  if (!data) {
    return (
      <InnerShell title={t("game")} variant="light" className="bg-page">
        <EmptyState />
      </InnerShell>
    );
  }
  return <GameCatalogView key={`${data.id}-${type ?? ""}`} catalog={data} />;
}
