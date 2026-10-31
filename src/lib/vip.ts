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
  /** itemInfo-bottom span.levelN fill */
  bar: string;
  /** itemInfo.levelN decorative PNG */
  bg: string;
  /** itemInfo.levelN card gradient */
  card: string;
  cardShadow: string;
};

const groove = (lit: string, dark: string) =>
  `0 0.03125rem ${lit}, inset 0 0.125rem 0.125rem ${dark}`;

const bar = (from: string, to: string) => `linear-gradient(90deg,${from},${to} 92.31%)`;

const card = (from: string, to: string) =>
  `linear-gradient(117.29deg, ${from} 21.85%, ${to} 67.02%)`;

/** production 0.02667rem @37.5 → 1px → 0.0625rem here */
const edge = (outer: string, inset: string) =>
  `0 0.0625rem ${outer}, inset 0 0.0625rem ${inset}`;

export const VIP_LEVELS: VipLevel[] = [
  { n: 0, need: 0, upReward: 0, monthly: 0, rebate: 0, tone: "#C9D2DE", track: "rgb(116, 138, 170)", trackShadow: groove("#b1c4e1", "#607596"), bar: bar("#899fbf", "#6f85a5"), bg: "/vip/bg-1.png", card: card("#a6b7d0", "#889ebe"), cardShadow: edge("#7991b6", "#bdcadc") },
  { n: 1, need: 3000, upReward: 60, monthly: 3, rebate: 0.05, tone: "#97A9C0", track: "rgb(116, 138, 170)", trackShadow: groove("#b1c4e1", "#607596"), bar: bar("#899fbf", "#6f85a5"), bg: "/vip/bg-1.png", card: card("#a6b7d0", "#889ebe"), cardShadow: edge("#7991b6", "#bdcadc") },
  { n: 2, need: 30000, upReward: 180, monthly: 9, rebate: 0.1, tone: "#E09A4A", track: "rgb(214, 125, 38)", trackShadow: groove("#ffc387", "#ad5913"), bar: bar("#ef9033", "#c97420"), bg: "/vip/bg-2.png", card: card("#f8bd83", "#e2984e"), cardShadow: edge("#d77d22", "#fcca97") },
  { n: 3, need: 400000, upReward: 400, monthly: 18, rebate: 0.15, tone: "#E86A6A", track: "rgb(240, 92, 92)", trackShadow: groove("#ffada0", "#d62f36"), bar: bar("#ff7878", "#f05c5c"), bg: "/vip/bg-3.png", card: card("#ffa493", "#ff7878"), cardShadow: edge("#fc5a51", "#ffaea0") },
  { n: 4, need: 4000000, upReward: 800, monthly: 38, rebate: 0.2, tone: "#4BB8E0", track: "rgb(50, 182, 232)", trackShadow: groove("#7ee9fc", "#2e96d5"), bar: bar("#40c4ed", "#30b4e9"), bg: "/vip/bg-4.png", card: card("#78dbeb", "#48c7f0"), cardShadow: edge("#25baea", "#89eaff") },
  { n: 5, need: 20000000, upReward: 1800, monthly: 88, rebate: 0.25, tone: "#E06AC4", track: "rgb(234, 106, 202)", trackShadow: groove("#ffb8e8", "#c4459a"), bar: bar("#d669fe", "#f951d6"), bg: "/vip/bg-5.png", card: card("#df91fb", "#ef82d5"), cardShadow: edge("#da62bd", "#fba4f7") },
  { n: 6, need: 80000000, upReward: 3800, monthly: 188, rebate: 0.3, tone: "#2EB89A", track: "rgb(30, 177, 139)", trackShadow: groove("#7ee8c8", "#1a8a68"), bar: bar("#23c89d", "#17af87"), bg: "/vip/bg-6.png", card: card("#61dca6", "#229b5f"), cardShadow: edge("#10b087", "#90ffce") },
  { n: 7, need: 300000000, upReward: 6800, monthly: 388, rebate: 0.35, tone: "#2A9C62", track: "rgb(27, 148, 88)", trackShadow: groove("#6ed99a", "#157544"), bar: bar("#67d145", "#27b770"), bg: "/vip/bg-7.png", card: card("#57b733", "#229b5f"), cardShadow: edge("#1b8e56", "#6dc950") },
  { n: 8, need: 1000000000, upReward: 12800, monthly: 688, rebate: 0.4, tone: "#4A7AE0", track: "rgb(52, 112, 230)", trackShadow: groove("#8ab4ff", "#2d5fc4"), bar: bar("#308fff", "#1277ea"), bg: "/vip/bg-8.png", card: card("#54baf1", "#3d77e8"), cardShadow: edge("#2964d8", "#7ed1ff") },
  { n: 9, need: 5000000000, upReward: 25800, monthly: 1288, rebate: 0.45, tone: "#8A48E8", track: "rgb(128, 56, 245)", trackShadow: groove("#c9a0ff", "#7a28d4"), bar: bar("#b45aff", "#8945fa"), bg: "/vip/bg-9.png", card: card("#d084e2", "#8d49ff"), cardShadow: edge("#8238fa", "#de7cf5") },
  { n: 10, need: 9999999999, upReward: 58800, monthly: 2888, rebate: 0.5, tone: "#EF7C28", track: "rgb(239, 123, 39)", trackShadow: groove("#ffc387", "#ad5913"), bar: bar("#ff940a", "#eb7119"), bg: "/vip/bg-10.png", card: card("#eeaf3a", "#f98b3b"), cardShadow: edge("#ec6d0f", "#ffc456") },
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
