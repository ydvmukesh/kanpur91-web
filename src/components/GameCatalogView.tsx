"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { GameCard } from "@/components/GameCard";
import { InnerShell } from "@/components/layout/InnerShell";
import { EmptyState } from "@/components/ui";
import { useI18n } from "@/hooks/useI18n";
import { openEventRewardsLogin } from "@/components/EventRewardsLoginDialog";
import { cn } from "@/lib/cn";
import { filterCatalogGames, toSlide, type GameCatalog } from "@/lib/games/catalog";
import { ImgIcon } from "@/lib/img";
import { useAuth } from "@/hooks/useAuth";
import { useStore } from "@/lib/store";

export function GameCatalogView({ catalog }: { catalog: GameCatalog }) {
  const { t } = useI18n();
  const { user } = useAuth();
  const { showToast } = useStore();
  const [q, setQ] = useState("");
  const [vendor, setVendor] = useState(catalog.vendors?.[0]?.id ?? "");
  const [searchOn, setSearchOn] = useState(catalog.layout === "search-grid");
  const [searchLeaving, setSearchLeaving] = useState(false);

  const games = useMemo(
    () => filterCatalogGames(catalog, q, catalog.layout === "vendor-tabs" ? vendor : null),
    [catalog, q, vendor],
  );

  function open() {
    if (!user) openEventRewardsLogin();
    else showToast(t("comingSoon"));
  }

  const vendors = catalog.vendors ?? [];
  const inHeaderSearch = searchOn || searchLeaving;

  return (
    <InnerShell
      title={t(catalog.titleKey)}
      variant="light"
      className="bg-page"
      headerCenterOut={searchLeaving}
      onHeaderCenterAnimEnd={() => {
        if (!searchLeaving) return;
        setSearchLeaving(false);
        setSearchOn(false);
      }}
      headerCenter={
        inHeaderSearch ? (
          <label className="flex h-9 w-full items-center gap-1.5 rounded-full border border-[#E4E6ED] bg-white px-3">
            <Search className="h-5 w-5 text-main shrink-0" strokeWidth={1.75} />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t("searchGame")}
              autoFocus
              className="flex-1 min-w-0 bg-transparent outline-none text-15 text-ink placeholder:text-faint"
            />
          </label>
        ) : null
      }
      right={
        inHeaderSearch ? (
          <button
            type="button"
            className="px-1 text-sm text-ink whitespace-nowrap"
            onClick={() => {
              setQ("");
              setSearchLeaving(true);
            }}
          >
            {t("cancel")}
          </button>
        ) : (
          <button
            type="button"
            className="h-9 w-9 grid place-items-center text-ink"
            onClick={() => setSearchOn(true)}
            aria-label={t("searchGame")}
          >
            <Search className="h-6 w-6 text-main" />
          </button>
        )
      }
      headerExtra={
        vendors.length ? (
          <div className="bg-page px-3.5 py-3">
            <div className="flex items-center gap-2 overflow-x-auto phone-scroll">
              {vendors.map((v) => {
                const on = vendor === v.id;
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={(e) => {
                      setVendor(v.id);
                      const row = e.currentTarget.parentElement;
                      if (!row) return;
                      const gap = Number.parseFloat(getComputedStyle(row).columnGap) || 8;
                      const w = e.currentTarget.offsetWidth + gap;
                      const left = e.currentTarget.offsetLeft;
                      if (left < row.scrollLeft) row.scrollBy({ left: -w, behavior: "smooth" });
                      else if (left + e.currentTarget.offsetWidth > row.scrollLeft + row.clientWidth) {
                        row.scrollBy({ left: w, behavior: "smooth" });
                      }
                    }}
                    className={cn(
                      "shrink-0 h-14 min-w-25 px-3 rounded-md flex flex-col items-center justify-center gap-0.5",
                      on ? "bg-main-x text-white" : "bg-white text-muted",
                    )}
                  >
                    <ImgIcon src={v.logo} alt="" className="h-6 w-6 object-contain" />
                    <span className="text-sm font-semibold uppercase">{v.name}</span>
                  </button>
                );
              })}
            </div>
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
