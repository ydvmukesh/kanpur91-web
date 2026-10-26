"use client";

import { useEffect, useRef } from "react";
import { GameCard, type GameSlide } from "@/components/GameCard";
import { IMG, ImgIcon } from "@/lib/img";

export type { GameSlide };

export function GameSlider({
  title,
  games,
  icon = IMG.pop,
  detailLabel,
  onOpen,
  onDetail,
}: {
  title: string;
  games: readonly GameSlide[];
  icon?: string;
  detailLabel?: string;
  onOpen: () => void;
  onDetail?: () => void;
}) {
  const scroller = useRef<HTMLDivElement>(null);

  function step() {
    const el = scroller.current;
    const card = el?.firstElementChild as HTMLElement | null;
    if (!el || !card) return 0;
    const gap = Number.parseFloat(getComputedStyle(el).columnGap) || 8;
    return card.getBoundingClientRect().width + gap;
  }

  function prev() {
    scroller.current?.scrollBy({ left: -step(), behavior: "smooth" });
  }

  function next() {
    scroller.current?.scrollBy({ left: step(), behavior: "smooth" });
  }

  useEffect(() => {
    const el = scroller.current;
    if (!el || games.length < 4) return;
    const id = window.setInterval(() => {
      const max = el.scrollWidth - el.clientWidth;
      if (max <= 0) return;
      if (el.scrollLeft >= max - 2) el.scrollTo({ left: 0, behavior: "smooth" });
      else el.scrollBy({ left: step(), behavior: "smooth" });
    }, 3000);
    return () => window.clearInterval(id);
  }, [games.length]);

  return (
    <section>
      <SliderHead
        title={title}
        icon={icon}
        detailLabel={detailLabel}
        onDetail={onDetail ?? onOpen}
        onPrev={games.length > 3 ? prev : undefined}
        onNext={games.length > 3 ? next : undefined}
      />
      <div ref={scroller} className="flex items-center gap-2 overflow-x-auto phone-scroll">
        {games.map((g) => (
          <GameCard key={g.n} game={g} onOpen={onOpen} />
        ))}
      </div>
    </section>
  );
}

function SliderHead({
  title,
  icon,
  detailLabel,
  onDetail,
  onPrev,
  onNext,
}: {
  title: string;
  icon: string;
  detailLabel?: string;
  onDetail?: () => void;
  onPrev?: () => void;
  onNext?: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-2 mb-2">
      <div className="flex items-center gap-1 min-w-0">
        <span className="relative h-6 w-6 shrink-0 overflow-hidden">
          <ImgIcon src={icon} alt="" className="absolute left-0 top-1/2 h-6 w-auto max-w-none -translate-y-1/2" />
        </span>
        <h2 className="text-sm font-semibold font-serif text-ink">{title}</h2>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        {detailLabel ? (
          <button
            type="button"
            onClick={onDetail}
            className="h-7 px-2.5 rounded-md bg-white text-10 font-semibold text-[#1E2637] font-serif shadow-[0_1px_4px_rgba(30,38,55,0.10)]"
          >
            {detailLabel}
          </button>
        ) : null}
        {onPrev && onNext ? (
          <>
            <button type="button" onClick={onPrev} className="shrink-0 leading-none">
              <ImgIcon src={IMG.arrowL} alt="" className="h-6.5 w-auto shadow-[0_1px_4px_rgba(30,38,55,0.10)]" />
            </button>
            <button type="button" onClick={onNext} className="shrink-0 leading-none">
              <ImgIcon src={IMG.arrowR} alt="" className="h-6.5 w-auto shadow-[0_1px_4px_rgba(30,38,55,0.10)]" />
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
}
