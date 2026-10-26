"use client";

import { useQuery } from "@tanstack/react-query";
import { cmsApi } from "@/lib/api/resources/cms";
import { qk } from "@/lib/api/keys";
import { useI18n } from "@/hooks/useI18n";

export function useCmsPage(slug: string) {
  const { lang } = useI18n();
  return useQuery({
    queryKey: qk.cms(slug, lang),
    queryFn: () => cmsApi.page(slug, lang),
  });
}
