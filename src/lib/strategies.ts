import type { WinGoBetValue } from "./wingo";

export type StrategyChoice = "follow" | "Big" | "Small" | "red" | "Green" | "violet";

export type FollowStrategy = {
  id: string;
  type: "BigSmall" | "Color";
  author: string;
  followed: number;
  choice: StrategyChoice;
  method: "martingale";
  roi: number;
  profit: number;
  wagered: number;
};

export const FOLLOW_STRATEGIES: FollowStrategy[] = [
  {
    id: "s1",
    type: "BigSmall",
    author: "Micheal",
    followed: 2753,
    choice: "follow",
    method: "martingale",
    roi: 97.55,
    profit: 99899658.71,
    wagered: 1673288714.95,
  },
  {
    id: "s2",
    type: "BigSmall",
    author: "Micheal",
    followed: 414,
    choice: "Big",
    method: "martingale",
    roi: 96,
    profit: 8913207.88,
    wagered: 228523568.66,
  },
  {
    id: "s3",
    type: "Color",
    author: "Micheal",
    followed: 213,
    choice: "red",
    method: "martingale",
    roi: 120.5,
    profit: 1542031.4,
    wagered: 12842190.66,
  },
  {
    id: "s4",
    type: "Color",
    author: "Micheal",
    followed: 386,
    choice: "Green",
    method: "martingale",
    roi: 341,
    profit: 2920792.28,
    wagered: 856537.91,
  },
];

export function strategyBet(s: FollowStrategy): WinGoBetValue {
  if (s.type === "BigSmall") {
    return { kind: "size", value: s.choice === "Small" ? "small" : "big" };
  }
  if (s.choice === "red") return { kind: "color", value: "red" };
  if (s.choice === "violet") return { kind: "color", value: "violet" };
  return { kind: "color", value: "green" };
}

export function choiceTone(choice: StrategyChoice) {
  if (choice === "follow") return "border border-[#2AD4C5] text-[#2AD4C5] bg-white";
  if (choice === "Big") return "bg-[#FFF1E3] text-[#FEAA57]";
  if (choice === "Small") return "bg-[#E8F3FF] text-[#6EA8F4]";
  if (choice === "red") return "bg-[#FFEBEC] text-[#F95959]";
  if (choice === "Green") return "bg-[#E5F8EE] text-[#18B660]";
  return "bg-[#F4E8FF] text-[#9B48DB]";
}
