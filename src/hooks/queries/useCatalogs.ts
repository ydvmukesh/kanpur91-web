"use client";

import { useQuery } from "@tanstack/react-query";
import { qk } from "@/lib/api/keys";
import { gamesApi } from "@/lib/api/resources/games";

export function useCatalogs() {
  return useQuery({
    queryKey: qk.catalogs,
    queryFn: () => gamesApi.catalogs(),
  });
}

export function useCatalog(slug: string, type?: string | null) {
  return useQuery({
    queryKey: qk.catalog(slug, type),
    queryFn: () => gamesApi.catalog(slug, type),
    enabled: Boolean(slug),
  });
}
