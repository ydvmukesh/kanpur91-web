import { apiFetch } from "@/lib/api/client";
import { USE_MOCK } from "@/lib/api/env";
import type { CmsPage } from "@/lib/api/models";
import { mockCmsPage } from "@/lib/api/mock/ops";

export const cmsApi = {
  page(slug: string, lang: string) {
    if (USE_MOCK) return Promise.resolve(mockCmsPage(slug));
    return apiFetch<CmsPage>(`/cms/${encodeURIComponent(slug)}?lang=${encodeURIComponent(lang)}`);
  },
};
