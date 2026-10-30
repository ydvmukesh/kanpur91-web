import { IMG } from "@/lib/img";
import type { DictKey } from "@/lib/i18n";

export type StatsPeriod = "today" | "yesterday" | "thisWeek" | "thisMonth";

export const STATS_PERIODS: { id: StatsPeriod; labelKey: DictKey }[] = [
  { id: "today", labelKey: "today" },
  { id: "yesterday", labelKey: "yesterday" },
  { id: "thisWeek", labelKey: "thisWeek" },
  { id: "thisMonth", labelKey: "thisMonth" },
];

export const GAME_STATS_CATS: { id: string; labelKey: DictKey; icon: string }[] = [
  { id: "lottery", labelKey: "lottery", icon: IMG.statsLottery },
  { id: "video", labelKey: "video", icon: IMG.statsVideo },
  { id: "slot", labelKey: "slot", icon: IMG.statsSlots },
  { id: "fish", labelKey: "fish", icon: IMG.statsFish },
  { id: "sport", labelKey: "sport", icon: IMG.statsSport },
  { id: "chess", labelKey: "chessCard", icon: IMG.statsChess },
];
