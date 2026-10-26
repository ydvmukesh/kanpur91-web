import {
  CARD_VENDORS,
  CASINO_VENDORS,
  CATEGORIES,
  FISHING_GAMES,
  GAMES,
  MINI_GAMES,
  SLOT_VENDORS,
  SPORTS_VENDORS,
} from "@/lib/img";
import type { DictKey } from "@/lib/i18n";

export type GameCatalogLayout = "search-grid" | "vendor-tabs";

export type GameVendor = { id: string; name: string; logo: string };

export type CatalogGame = { id: string; name: string; img: string; vendorId?: string };

export type GameCatalog = {
  id: string;
  slug: string;
  titleKey: DictKey;
  tabKey: DictKey;
  layout: GameCatalogLayout;
  query?: Record<string, string>;
  icon: string;
  iconActive: string;
  graphic?: boolean;
  vendors?: GameVendor[];
  games: CatalogGame[];
};

export function labelFromPath(src: string) {
  const file = src.split("/").pop() ?? src;
  return file
    .replace(/^\d{3}-/, "")
    .replace(/^\d{2}-/, "")
    .replace(/\.[^.]+$/, "")
    .replace(/_\d{8,}.*$/, "")
    .replace(/vendorlogo_/g, "")
    .replace(/[-_]+/g, " ")
    .trim();
}

export function viewAllHref(cat: Pick<GameCatalog, "slug" | "query">) {
  const q = new URLSearchParams(cat.query ?? {});
  const qs = q.toString();
  return qs ? `/home/${cat.slug}?${qs}` : `/home/${cat.slug}`;
}

export function toSlide(g: CatalogGame) {
  return { n: g.name, img: g.img };
}

function fromImgs(imgs: readonly string[], vendorId?: string, prefix = "g"): CatalogGame[] {
  return imgs.map((img, i) => ({
    id: `${prefix}-${i}`,
    name: labelFromPath(img),
    img,
    vendorId,
  }));
}

function vendorFromFishing(src: string) {
  const m = src.match(/-(JILI|JDB|CQ9)-/i);
  return m ? m[1].toLowerCase() : "other";
}

const miniFeatured: CatalogGame[] = [
  { id: "aviator", name: "Aviator", img: GAMES.aviator },
  { id: "aviator-plus", name: "Aviator", img: GAMES.aviatorPlus },
  { id: "aviator-sky", name: "Aviator", img: GAMES.aviatorSky },
  { id: "chicken-2", name: "Chicken Road 2", img: GAMES.chickenRoad2 },
  { id: "vortex", name: "Vortex", img: GAMES.vortex },
  { id: "dragongems", name: "DragonGems Clash", img: GAMES.dragonGemsClash },
  { id: "chicken", name: "Chicken Road", img: GAMES.chickenRoad },
  { id: "mines", name: "Minesweeper", img: GAMES.minesweeper },
  { id: "cricket", name: "Cricket Road", img: GAMES.cricketRoad },
  { id: "balloon", name: "Balloon", img: GAMES.balloon },
  { id: "kraken", name: "Power Kraken", img: GAMES.powerKraken },
  { id: "pilot", name: "Pilot Chicken", img: GAMES.pilotChicken },
];

const SLOT_VENDOR_META = [
  { id: "jili", name: "JILI" },
  { id: "jdb", name: "JDB" },
  { id: "mg", name: "MG" },
  { id: "inout", name: "INOUT" },
  { id: "bgaming", name: "BGAMING" },
  { id: "ng", name: "NG" },
  { id: "pg", name: "PG" },
  { id: "9g", name: "9G" },
  { id: "cq9", name: "CQ9" },
  { id: "spribe", name: "Spribe" },
] as const;

const slotVendors: GameVendor[] = SLOT_VENDOR_META.map((v, i) => ({
  ...v,
  logo: SLOT_VENDORS[i] ?? SLOT_VENDORS[0],
}));

const slotPool = [
  GAMES.aviator,
  GAMES.chickenRoad2,
  GAMES.vortex,
  GAMES.dragonGemsClash,
  GAMES.minesweeper,
  GAMES.cricketRoad,
  GAMES.balloon,
  GAMES.powerKraken,
  GAMES.pilotChicken,
  GAMES.diceClash,
  GAMES.headsTails,
  GAMES.rocketDice,
  ...MINI_GAMES.slice(0, 24),
];

const slotGames: CatalogGame[] = slotPool.map((img, i) => {
  const vendor = slotVendors[i % slotVendors.length];
  return { id: `slot-${i}`, name: labelFromPath(img), img, vendorId: vendor.id };
});

const fishingVendors: GameVendor[] = [
  { id: "jili", name: "JILI", logo: SLOT_VENDORS[0] },
  { id: "jdb", name: "JDB", logo: SLOT_VENDORS[1] },
  { id: "cq9", name: "CQ9", logo: SLOT_VENDORS[5] },
];

const fishingGames: CatalogGame[] = FISHING_GAMES.map((img, i) => ({
  id: `fish-${i}`,
  name: labelFromPath(img),
  img,
  vendorId: vendorFromFishing(img),
}));

export const CATALOGS: GameCatalog[] = [
  {
    id: "mini",
    slug: "FishGames",
    titleKey: "miniGames",
    tabKey: "miniGame",
    layout: "search-grid",
    query: { type: "flash" },
    icon: CATEGORIES.miniGame,
    iconActive: CATEGORIES.miniGame,
    graphic: true,
    games: [...miniFeatured, ...fromImgs(MINI_GAMES, undefined, "mini")],
  },
  {
    id: "slots",
    slug: "AllOnlineGames",
    titleKey: "game",
    tabKey: "slots",
    layout: "vendor-tabs",
    icon: CATEGORIES.slots,
    iconActive: CATEGORIES.slotsActive,
    vendors: slotVendors,
    games: slotGames,
  },
  {
    id: "card",
    slug: "AllOnlineGames",
    titleKey: "game",
    tabKey: "cardRummy",
    layout: "vendor-tabs",
    query: { type: "card" },
    icon: CATEGORIES.card,
    iconActive: CATEGORIES.cardActive,
    vendors: CARD_VENDORS.map((logo, i) => ({ id: `card-${i}`, name: labelFromPath(logo), logo })),
    games: CARD_VENDORS.map((img, i) => ({ id: `card-g-${i}`, name: labelFromPath(img), img, vendorId: `card-${i}` })),
  },
  {
    id: "fishing",
    slug: "FishGames",
    titleKey: "fishing",
    tabKey: "fishing",
    layout: "vendor-tabs",
    query: { type: "fishing" },
    icon: CATEGORIES.fishing,
    iconActive: CATEGORIES.fishingActive,
    vendors: fishingVendors,
    games: fishingGames,
  },
  {
    id: "casino",
    slug: "AllOnlineGames",
    titleKey: "game",
    tabKey: "casino",
    layout: "vendor-tabs",
    query: { type: "casino" },
    icon: CATEGORIES.casino,
    iconActive: CATEGORIES.casinoActive,
    vendors: CASINO_VENDORS.map((logo, i) => ({ id: `cas-${i}`, name: labelFromPath(logo), logo })),
    games: CASINO_VENDORS.map((img, i) => ({ id: `cas-g-${i}`, name: labelFromPath(img), img, vendorId: `cas-${i}` })),
  },
  {
    id: "sports",
    slug: "AllOnlineGames",
    titleKey: "game",
    tabKey: "sports",
    layout: "vendor-tabs",
    query: { type: "sports" },
    icon: CATEGORIES.sports,
    iconActive: CATEGORIES.sportsActive,
    vendors: SPORTS_VENDORS.map((logo, i) => ({ id: `sp-${i}`, name: labelFromPath(logo), logo })),
    games: SPORTS_VENDORS.map((img, i) => ({ id: `sp-g-${i}`, name: labelFromPath(img), img, vendorId: `sp-${i}` })),
  },
];

export function findCatalog(slug: string, type?: string | null) {
  const s = slug.toLowerCase();
  const list = CATALOGS.filter((c) => c.slug.toLowerCase() === s);
  if (!list.length) return null;
  if (type) return list.find((c) => c.query?.type === type) ?? list[0] ?? null;
  return list.find((c) => !c.query?.type) ?? list[0] ?? null;
}

export function filterCatalogGames(cat: GameCatalog, q?: string | null, vendorId?: string | null) {
  const s = q?.trim().toLowerCase() ?? "";
  return cat.games.filter((g) => {
    if (vendorId && g.vendorId && g.vendorId !== vendorId) return false;
    if (s && !g.name.toLowerCase().includes(s)) return false;
    return true;
  });
}
