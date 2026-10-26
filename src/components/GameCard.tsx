"use client";

import { cn } from "@/lib/cn";
import { ImgIcon } from "@/lib/img";

export type GameSlide = { n: string; img: string };

export const GAME_CARD_W = 118;

export function GameCard({
  game,
  onOpen,
  onClickGuard,
  showName,
  fill,
}: {
  game: GameSlide;
  onOpen: () => void;
  onClickGuard?: () => boolean;
  showName?: boolean;
  fill?: boolean;
}) {
  return (
    <div className={cn("flex flex-col items-center", fill ? "w-full" : "w-[118px] shrink-0")}>
      <button
        type="button"
        onClick={() => {
          if (onClickGuard?.()) return;
          onOpen();
        }}
        className="relative w-full aspect-[118/160] overflow-hidden rounded-md bg-white shadow-sm"
      >
        <ImgIcon src={game.img} alt={game.n} className="absolute inset-0 h-full w-full object-cover" />
      </button>
      {showName ? (
        <p className="mt-1.5 w-full text-center text-xs text-muted leading-tight line-clamp-2">{game.n}</p>
      ) : null}
    </div>
  );
}
