import type { DictKey, I18nVars } from "@/lib/i18n";

export type VipLevel = {
  n: number;
  need: number;
  upReward: number;
  monthly: number;
  rebate: number;
  tone: string;
  track: string;
  trackShadow: string;
};

const groove = (lit: string, dark: string) =>
  `0 0.03125rem ${lit}, inset 0 0.125rem 0.125rem ${dark}`;

export const VIP_LEVELS: VipLevel[] = [
  { n: 0, need: 0, upReward: 0, monthly: 0, rebate: 0, tone: "#C9D2DE", track: "rgb(116, 138, 170)", trackShadow: groove("#b1c4e1", "#607596") },
  { n: 1, need: 3000, upReward: 60, monthly: 3, rebate: 0.05, tone: "#97A9C0", track: "rgb(116, 138, 170)", trackShadow: groove("#b1c4e1", "#607596") },
  { n: 2, need: 30000, upReward: 180, monthly: 9, rebate: 0.1, tone: "#E09A4A", track: "rgb(214, 125, 38)", trackShadow: groove("#ffc387", "#ad5913") },
  { n: 3, need: 400000, upReward: 400, monthly: 18, rebate: 0.15, tone: "#E86A6A", track: "rgb(240, 92, 92)", trackShadow: groove("#ffada0", "#d62f36") },
  { n: 4, need: 4000000, upReward: 800, monthly: 38, rebate: 0.2, tone: "#4BB8E0", track: "rgb(50, 182, 232)", trackShadow: groove("#7ee9fc", "#2e96d5") },
  { n: 5, need: 20000000, upReward: 1800, monthly: 88, rebate: 0.25, tone: "#E06AC4", track: "rgb(234, 106, 202)", trackShadow: groove("#ffb8e8", "#c4459a") },
  { n: 6, need: 80000000, upReward: 3800, monthly: 188, rebate: 0.3, tone: "#2EB89A", track: "rgb(30, 177, 139)", trackShadow: groove("#7ee8c8", "#1a8a68") },
  { n: 7, need: 300000000, upReward: 6800, monthly: 388, rebate: 0.35, tone: "#2A9C62", track: "rgb(27, 148, 88)", trackShadow: groove("#6ed99a", "#157544") },
  { n: 8, need: 1000000000, upReward: 12800, monthly: 688, rebate: 0.4, tone: "#4A7AE0", track: "rgb(52, 112, 230)", trackShadow: groove("#8ab4ff", "#2d5fc4") },
  { n: 9, need: 5000000000, upReward: 25800, monthly: 1288, rebate: 0.45, tone: "#8A48E8", track: "rgb(128, 56, 245)", trackShadow: groove("#c9a0ff", "#7a28d4") },
  { n: 10, need: 9999999999, upReward: 58800, monthly: 2888, rebate: 0.5, tone: "#EF7C28", track: "rgb(239, 123, 39)", trackShadow: groove("#ffc387", "#ad5913") },
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

export function vipHistoryRows(t: (key: DictKey, vars?: I18nVars) => string) {
  return [
    {
      id: "down",
      tone: "orange" as const,
      title: t("vipDowngrade"),
      body: t("vipDowngradeBody", { n: 0 }),
      time: "2026-09-01 00:22:17",
    },
    {
      id: "maint",
      tone: "red" as const,
      title: t("levelMaintenance"),
      body: t("levelMaintenanceBody", { pct: "1.50" }),
      time: "2026-09-01 00:22:17",
      exp: "-1500 EXP",
    },
    {
      id: "down-2",
      tone: "orange" as const,
      title: t("vipDowngrade"),
      body: t("vipDowngradeBody", { n: 1 }),
      time: "2026-08-01 00:22:17",
    },
    {
      id: "maint-2",
      tone: "red" as const,
      title: t("levelMaintenance"),
      body: t("levelMaintenanceBody", { pct: "42.00" }),
      time: "2026-08-01 00:22:17",
      exp: "-800 EXP",
    },
  ];
}
