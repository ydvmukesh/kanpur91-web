"use client";

import { useEffect, useMemo, useRef, useState, type PointerEvent } from "react";
import { IMG, ImgIcon } from "@/lib/img";

export type GameSlide = { n: string; img: string };

const CARD = 118;
const GAP = 8;
const STEP = CARD + GAP;
const TRACK_W = 40;
const MIN_THUMB = 14;
const SLIDE_MIN = 4;

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
  if (games.length < SLIDE_MIN) {
    return (
      <section>
        <SliderHead title={title} icon={icon} detailLabel={detailLabel} onDetail={onDetail ?? onOpen} />
        <div className="flex gap-2">
          {games.map((g) => (
            <GameCard key={g.n} game={g} onOpen={onOpen} />
          ))}
        </div>
      </section>
    );
  }

  return (
    <GameCarousel
      title={title}
      games={games}
      icon={icon}
      detailLabel={detailLabel}
      onOpen={onOpen}
      onDetail={onDetail}
    />
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
        <h2 className="text-[14px] font-semibold font-serif text-l1">{title}</h2>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        {detailLabel ? (
          <button
            type="button"
            onClick={onDetail}
            className="h-7 px-2.5 rounded-md bg-white text-[10px] font-semibold text-[#1E2637] font-serif shadow-[0_1px_4px_rgba(30,38,55,0.10)]"
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

function GameCard({ game, onOpen, onClickGuard }: { game: GameSlide; onOpen: () => void; onClickGuard?: () => boolean }) {
  return (
    <button
      type="button"
      onClick={() => {
        if (onClickGuard?.()) return;
        onOpen();
      }}
      className="relative h-[160px] w-[118px] shrink-0 overflow-hidden rounded-md bg-white shadow-sm"
    >
      <ImgIcon src={game.img} alt={game.n} className="h-full w-full object-cover" />
    </button>
  );
}

function GameCarousel({
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
  const n = games.length;
  const cycle = Math.max(n, 1) * STEP;
  const slides = useMemo(() => [...games, ...games, ...games], [games]);
  const [x, setX] = useState(cycle);
  const [anim, setAnim] = useState(true);
  const [vw, setVw] = useState(0);
  const viewRef = useRef<HTMLDivElement>(null);
  const xRef = useRef(cycle);
  const hold = useRef(false);
  const pressed = useRef(false);
  const dragging = useRef(false);
  const skipClick = useRef(false);
  const startPx = useRef(0);
  const startOff = useRef(0);
  const pauseTimer = useRef(0);

  xRef.current = x;

  useEffect(() => {
    const el = viewRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setVw(el.clientWidth));
    ro.observe(el);
    setVw(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => {
      if (hold.current || dragging.current) return;
      setAnim(true);
      setX((v) => v + STEP);
    }, 3000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (anim) return;
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setAnim(true));
    });
    return () => cancelAnimationFrame(id);
  }, [anim]);

  useEffect(() => () => window.clearTimeout(pauseTimer.current), []);

  function pause() {
    hold.current = true;
    window.clearTimeout(pauseTimer.current);
    pauseTimer.current = window.setTimeout(() => {
      hold.current = false;
    }, 4500);
  }

  function wrap(px: number) {
    let v = px;
    if (v >= cycle * 2) v -= cycle;
    else if (v < cycle) v += cycle;
    return v;
  }

  function snap(px: number) {
    return Math.round(px / STEP) * STEP;
  }

  function prev() {
    pause();
    setAnim(true);
    setX((v) => v - STEP);
  }

  function next() {
    pause();
    setAnim(true);
    setX((v) => v + STEP);
  }

  function onTrackEnd() {
    const w = wrap(xRef.current);
    if (w === xRef.current) return;
    setAnim(false);
    setX(w);
  }

  function onPointerDown(e: PointerEvent<HTMLDivElement>) {
    if (e.button !== 0 && e.pointerType === "mouse") return;
    pressed.current = true;
    hold.current = true;
    dragging.current = false;
    startPx.current = e.clientX;
    startOff.current = xRef.current;
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: PointerEvent<HTMLDivElement>) {
    if (!pressed.current) return;
    const dx = e.clientX - startPx.current;
    if (!dragging.current && Math.abs(dx) > 8) dragging.current = true;
    if (!dragging.current) return;
    setAnim(false);
    setX(startOff.current - dx);
  }

  function onPointerUp() {
    if (!pressed.current) return;
    pressed.current = false;
    if (dragging.current) {
      skipClick.current = true;
      setAnim(true);
      setX(wrap(snap(xRef.current)));
    }
    dragging.current = false;
    pause();
  }

  function scrubBar(el: HTMLDivElement, clientX: number) {
    const rect = el.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    setAnim(false);
    setX(cycle + p * cycle);
  }

  function onBarPointerDown(e: PointerEvent<HTMLDivElement>) {
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    hold.current = true;
    dragging.current = true;
    scrubBar(e.currentTarget, e.clientX);
  }

  function onBarPointerMove(e: PointerEvent<HTMLDivElement>) {
    if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;
    scrubBar(e.currentTarget, e.clientX);
  }

  function onBarPointerUp(e: PointerEvent<HTMLDivElement>) {
    if (!dragging.current) return;
    dragging.current = false;
    setAnim(true);
    setX(wrap(snap(xRef.current)));
    pause();
    e.currentTarget.releasePointerCapture(e.pointerId);
  }

  const logical = ((x % cycle) + cycle) % cycle;
  const thumbW = Math.max(
    MIN_THUMB,
    Math.min(TRACK_W, TRACK_W * (Math.max(vw, STEP) / Math.max(cycle, STEP))),
  );
  const thumbX = (logical / cycle) * (TRACK_W - thumbW);

  return (
    <section>
      <SliderHead
        title={title}
        icon={icon}
        detailLabel={detailLabel}
        onDetail={onDetail ?? onOpen}
        onPrev={prev}
        onNext={next}
      />
      <div
        ref={viewRef}
        className="overflow-hidden touch-pan-y"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div
          className="flex gap-2"
          onTransitionEnd={(e) => {
            if (e.target !== e.currentTarget) return;
            onTrackEnd();
          }}
          style={{
            transform: `translate3d(${-x}px,0,0)`,
            transition: anim ? "transform 420ms ease" : "none",
          }}
        >
          {slides.map((g, idx) => (
            <GameCard
              key={`${g.n}-${idx}`}
              game={g}
              onOpen={onOpen}
              onClickGuard={() => {
                if (!skipClick.current) return false;
                skipClick.current = false;
                return true;
              }}
            />
          ))}
        </div>
      </div>
      <div
        className="mx-auto mt-0.5 flex h-4 w-10 cursor-pointer items-center touch-none"
        onPointerDown={onBarPointerDown}
        onPointerMove={onBarPointerMove}
        onPointerUp={onBarPointerUp}
        onPointerCancel={onBarPointerUp}
      >
        <div className="relative h-[3px] w-full overflow-hidden rounded-full bg-[#D5D8E2]">
          <span
            className="absolute inset-y-0 left-0 rounded-full bg-main"
            style={{
              width: thumbW,
              transform: `translateX(${thumbX}px)`,
              transition: dragging.current || !anim ? "none" : "transform 300ms ease, width 300ms ease",
            }}
          />
        </div>
      </div>
    </section>
  );
}
