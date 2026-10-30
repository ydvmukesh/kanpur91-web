import { IMG } from "@/lib/img";

export type GameHistoryTab = "lottery" | "casino" | "fishing" | "rummy" | "original";

export type GameHistoryPick = {
  id: string;
  labelKey: "winGo" | "trxWinGo" | "fiveD" | "k3" | "motoRace" | "all" | "koolBet" | "card365";
  img?: string;
  mark?: "all" | "kool" | "365";
};

export const GAME_HISTORY_PICKS: Record<GameHistoryTab, GameHistoryPick[]> = {
  lottery: [
    { id: "wingo", img: IMG.winGo, labelKey: "winGo" },
    { id: "trx", img: IMG.trxWin, labelKey: "trxWinGo" },
    { id: "5d", img: IMG.fiveD, labelKey: "fiveD" },
    { id: "k3", img: IMG.k3, labelKey: "k3" },
    { id: "moto", img: IMG.motoRacing, labelKey: "motoRace" },
  ],
  casino: [{ id: "all", labelKey: "all", mark: "all" }],
  fishing: [{ id: "all", labelKey: "all", mark: "all" }],
  rummy: [
    { id: "all", labelKey: "all", mark: "all" },
    { id: "koolbet", labelKey: "koolBet", mark: "kool" },
    { id: "card365", labelKey: "card365", mark: "365" },
  ],
  original: [{ id: "all", labelKey: "all", mark: "all" }],
};

export function defaultPick(tab: GameHistoryTab) {
  return GAME_HISTORY_PICKS[tab][0].id;
}
