import events from "@/lib/activity-events.json";
import bonusRows from "@/lib/activity-bonus.json";
import type { DictKey } from "@/lib/i18n";

export type ActivityEvent = {
  slug: string;
  title: string;
  banner: string;
  body?: string;
};

export const ACTIVITY_LIST = events as ActivityEvent[];

export const ACTIVITY_EVENTS: Record<string, ActivityEvent> = Object.fromEntries(
  ACTIVITY_LIST.map((event) => [event.slug, event]),
);

export type BonusStatus = "collect" | "received" | "expired";

export type BonusRow = {
  id: string;
  type: DictKey;
  amount: number;
  status: BonusStatus;
  time: string;
};

export const BONUS_ROWS = bonusRows as BonusRow[];

export const BONUS_FILTERS: DictKey[] = [
  "all",
  "redEnvelope",
  "attendance",
  "depositGift",
  "bonus",
  "invitationBonus",
  "vipLevelUpReward",
  "vipMonthlyReward",
  "washingCodeRebate",
  "superJackpot",
  "weeklyAward",
  "newbieGiftPack",
  "tournamentRewards",
  "returnAwards",
  "newMembersLosingProfits",
  "newMembersPlayBonus",
  "dailyRewards",
  "spinWheelRewards",
  "partnerRewards",
  "withdrawalRewards",
  "inviteWheelReward",
  "downloadBonus",
];
