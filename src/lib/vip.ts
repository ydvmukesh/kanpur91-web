export type VipLevel = {
  n: number;
  need: number;
  upReward: number;
  monthly: number;
  rebate: number;
  tone: string;
};

export const VIP_LEVELS: VipLevel[] = [
  { n: 0, need: 0, upReward: 0, monthly: 0, rebate: 0, tone: "#C9D2DE" },
  { n: 1, need: 30000, upReward: 60, monthly: 3, rebate: 0.05, tone: "#C5CEDB" },
  { n: 2, need: 100000, upReward: 180, monthly: 8, rebate: 0.1, tone: "#F3C39A" },
  { n: 3, need: 300000, upReward: 400, monthly: 18, rebate: 0.15, tone: "#E8C4A0" },
  { n: 4, need: 800000, upReward: 800, monthly: 38, rebate: 0.2, tone: "#C9B8E8" },
  { n: 5, need: 2000000, upReward: 1800, monthly: 88, rebate: 0.25, tone: "#B8D4E8" },
  { n: 6, need: 5000000, upReward: 3800, monthly: 188, rebate: 0.3, tone: "#B8E0D4" },
  { n: 7, need: 10000000, upReward: 6800, monthly: 388, rebate: 0.35, tone: "#E8D4B8" },
  { n: 8, need: 20000000, upReward: 12800, monthly: 688, rebate: 0.4, tone: "#E8B8C4" },
  { n: 9, need: 40000000, upReward: 25800, monthly: 1288, rebate: 0.45, tone: "#D4C4E8" },
  { n: 10, need: 80000000, upReward: 58800, monthly: 2888, rebate: 0.5, tone: "#F0D090" },
];

export function vipFromExp(exp: number) {
  let level = 0;
  for (const row of VIP_LEVELS) {
    if (exp >= row.need) level = row.n;
  }
  return level;
}

export function vipNeed(n: number) {
  return VIP_LEVELS.find((x) => x.n === n)?.need ?? 0;
}
