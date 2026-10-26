"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { GameCard } from "@/components/GameCard";
import { InnerShell } from "@/components/layout/InnerShell";
import { EmptyState } from "@/components/ui";
import { useI18n } from "@/hooks/useI18n";
import { loginUrl } from "@/lib/auth/routes";
import { cn } from "@/lib/cn";
import { filterCatalogGames, toSlide, type GameCatalog } from "@/lib/games/catalog";
import { ImgIcon } from "@/lib/img";
import { useAuth } from "@/hooks/useAuth";
import { useStore } from "@/lib/store";

export function GameCatalogView({ catalog }: { catalog: GameCatalog }) {
  const { t } = useI18n();
  const { user } = useAuth();
  const { showToast } = useStore();
  const router = useRouter();
  const [q, setQ] = useState("");
  const [vendor, setVendor] = useState(catalog.vendors?.[0]?.id ?? "");
  const [searchOn, setSearchOn] = useState(catalog.layout === "search-grid");

  const games = useMemo(
    () => filterCatalogGames(catalog, q, catalog.layout === "vendor-tabs" ? vendor : null),
    [catalog, q, vendor],
  );

  function open() {
    if (!user) router.push(loginUrl());
    else showToast(t("comingSoon"));
  }

  const vendors = catalog.vendors ?? [];

  return (
    <InnerShell
      title={t(catalog.titleKey)}
      variant="light"
      className="bg-page"
      right={
        catalog.layout === "vendor-tabs" ? (
          <button
            type="button"
            className="h-8 w-8 grid place-items-center text-ink"
            onClick={() => setSearchOn((v) => !v)}
            aria-label={t("searchGame")}
          >
            <Search className="h-5 w-5" />
          </button>
        ) : null
      }
      headerExtra={
        searchOn || catalog.layout === "search-grid" || vendors.length ? (
          <div className="bg-page px-3.5 py-3 space-y-2">
            {searchOn || catalog.layout === "search-grid" ? (
              <label className="h-10 rounded-full bg-white px-3 flex items-center gap-2">
                <Search className="h-4 w-4 text-faint shrink-0" />
                <i className="h-4 w-px bg-line shrink-0" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder={t("searchGame")}
                  className="flex-1 min-w-0 bg-transparent outline-none text-sm text-ink placeholder:text-faint"
                />
              </label>
            ) : null}
            {vendors.length ? (
              <div className="phone-scroll flex gap-2 overflow-x-auto">
                {vendors.map((v) => {
                  const on = vendor === v.id;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setVendor(v.id)}
                      className={cn(
                        "shrink-0 h-14 min-w-22 px-3 rounded-md flex flex-col items-center justify-center gap-0.5",
                        on ? "bg-main-x text-white" : "bg-white text-muted",
                      )}
                    >
                      <ImgIcon src={v.logo} alt="" className="h-6 w-6 object-contain" />
                      <span className="text-sm font-semibold uppercase">{v.name}</span>
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>
        ) : null
      }
    >
      <div className="px-3 pb-8">
        {games.length === 0 ? <EmptyState /> : null}
        <div className="grid grid-cols-3 justify-items-center gap-2">
          {games.map((g) => (
            <GameCard key={g.id} game={toSlide(g)} onOpen={open} fill showName={catalog.layout === "vendor-tabs"} />
          ))}
        </div>
      </div>
    </InnerShell>
  );
}
