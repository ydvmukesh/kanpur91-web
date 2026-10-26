import { apiFetch } from "@/lib/api/client";
import { USE_MOCK } from "@/lib/api/env";
import { CATALOGS, findCatalog, type GameCatalog } from "@/lib/games/catalog";

export const gamesApi = {
  catalogs() {
    if (USE_MOCK) return Promise.resolve(CATALOGS);
    return apiFetch<GameCatalog[]>("/games/catalogs");
  },
  catalog(slug: string, type?: string | null) {
    if (USE_MOCK) return Promise.resolve(findCatalog(slug, type));
    const q = type ? `?type=${encodeURIComponent(type)}` : "";
    return apiFetch<GameCatalog | null>(`/games/catalogs/${encodeURIComponent(slug)}${q}`);
  },
};
