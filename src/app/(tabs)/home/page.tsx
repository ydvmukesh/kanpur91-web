"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { HomeLogo } from "@/components/Logo";
import { IconCoin, IconDownload, IconRefresh } from "@/components/Icons";
import { GameCard, type GameSlide } from "@/components/GameCard";
import { GameSlider } from "@/components/GameSlider";
import { useCatalogs } from "@/hooks/queries/useCatalogs";
import { VendorPicker } from "@/components/VendorPicker";
import { toSlide, viewAllHref, type GameCatalog } from "@/lib/games/catalog";
import { BANNERS, CATEGORIES, GAMES, IMG, ImgIcon } from "@/lib/img";
import { loginUrl } from "@/lib/auth/routes";
import { cn } from "@/lib/cn";
import { formatMoney } from "@/lib/format";
import { useWallet } from "@/hooks/useWallet";
import { useAuth } from "@/hooks/useAuth";
import { HtmlContent } from "@/components/ui";
import { HOME_FOOTER_HTML } from "@/lib/home-footer";
import { useStore } from "@/lib/store";
import { ArrowDown, ArrowUp } from "lucide-react";

const heroes = BANNERS;

const recGames: GameSlide[] = [
  { n: "Chicken Road 2", img: GAMES.chickenRoad2 },
  { n: "Vortex", img: GAMES.vortex },
  { n: "DragonGems Clash", img: GAMES.dragonGemsClash },
  { n: "Aviator", img: GAMES.aviatorPlus },
  { n: "Chicken Road", img: GAMES.chickenRoad },
  { n: "Power Kraken", img: GAMES.powerKraken },
  { n: "Cricket Road", img: GAMES.cricketRoad },
  { n: "Balloon", img: GAMES.balloon },
];

const wins = [
  { name: "Mem***EXU", game: "TB Chess", amt: 13.8 },
  { name: "Mem***QXC", game: "JILI", amt: 35 },
  { name: "Mem***DKH", game: "JILI", amt: 12 },
  { name: "Mem***OOQ", game: "JILI", amt: 1080 },
  { name: "Mem***TAX", game: "JILI", amt: 250 },
];

const ranks = [
  { name: "BAD***VIL", amt: 8982190, avatar: "/rank/1.svg" },
  { name: "Mem***FHS", amt: 8118320, avatar: "/rank/2.svg" },
  { name: "Mem***BDT", amt: 3377223.2, avatar: "/rank/3.svg" },
  { name: "Ri*** 💵", amt: 2654617.1, avatar: "/rank/4.svg" },
  { name: "Mem***NDW", amt: 2564216.04, avatar: "/rank/5.svg" },
  { name: "Mem***CJB", amt: 1833830.88, avatar: "/rank/6.svg" },
  { name: "Mem***HMN", amt: 1540100.5, avatar: "/rank/7.svg" },
  { name: "Mem***K9A", amt: 1218800, avatar: "/rank/8.svg" },
  { name: "Mem***PL2", amt: 933640.2, avatar: "/rank/9.svg" },
  { name: "Mem***88Q", amt: 791100, avatar: "/rank/10.svg" },
];

const podiumSlots = [
  { place: 2, rank: ranks[1], left: "15.41%", colTop: "24.46%", color: "#FF772A", crown: false },
  { place: 1, rank: ranks[0], left: "50.08%", colTop: "0.3%", color: "#FF2D5F", crown: true },
  { place: 3, rank: ranks[2], left: "84.66%", colTop: "24.46%", color: "#ffb628", crown: false },
] as const;

function formatRankAmt(n: number) {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function HomePage() {
  const { t, showToast } = useStore();
  const { user } = useAuth();
  const { recycle } = useWallet();
  const router = useRouter();
  const [bi, setBi] = useState(0);
  const { data: catalogs = [] } = useCatalogs();
  const [cat, setCat] = useState("lobby");
  const tabBarRef = useRef<HTMLDivElement>(null);

  function openTab(next: typeof cat) {
    setCat(next);
    window.requestAnimationFrame(() => {
      tabBarRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      tabBarRef.current
        ?.querySelector<HTMLElement>(`[data-cat="${next}"]`)
        ?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    });
  }

  useEffect(() => {
    const id = setInterval(() => setBi((i) => (i + 1) % heroes.length), 3800);
    return () => clearInterval(id);
  }, []);

  function go(href: string) {
    if (!user) router.push(loginUrl(href));
    else router.push(href);
  }

  function soon() {
    if (!user) router.push(loginUrl());
    else showToast(t("comingSoon"));
  }

  const cats = [
    { key: "lobby", label: t("lobby"), src: CATEGORIES.lobby, activeSrc: CATEGORIES.lobbyActive, graphic: false },
    ...catalogs.map((c) => ({
      key: c.id,
      label: t(c.tabKey),
      src: c.icon,
      activeSrc: c.iconActive,
      graphic: Boolean(c.graphic),
    })),
  ];

  return (
    <div className="flex h-full min-h-0 flex-col">
      <header className="z-30 shrink-0 bg-white pt-safe-t">
        <div className="px-3 h-12 flex items-center justify-between">
        <HomeLogo className="h-11" />
        {user ? (
          <Link
            href="/download"
            className="h-9 w-9 grid place-items-center text-main"
          >
            <IconDownload />
          </Link>  
        ) : (
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="h-[1.875rem] px-3.5 rounded-md border border-[#D8DCE6] bg-white text-ink text-13 font-medium grid place-items-center"
            >
              {t("login")}
            </Link>
            <Link
              href="/register"
              className="h-[1.875rem] px-3.5 rounded-md bg-main text-white text-13 font-medium grid place-items-center"
            >
              {t("register")}
            </Link>
          </div>
        )}
        </div>
      </header>

      <div className="phone-scroll flex-1 min-h-0 overflow-y-auto pb-8">
      <div className="h-9 bg-[#F3F4F8] px-3 flex items-center gap-2">
        <ImgIcon src={IMG.notice} alt="" className="h-4 w-4 shrink-0" />
        <div className="flex-1 overflow-hidden">
          <div className="marquee text-11 text-ink">
            <span className="pr-8">{t("withdrawNotice")}</span>
            <span className="pr-8">{t("withdrawNotice")}</span>
          </div>
        </div>
        <Link href="/notifications" className="relative shrink-0 h-8 w-8 grid place-items-center">
          <ImgIcon src={IMG.message} alt="" className="h-6.5 w-6.5" />
        </Link>
      </div>

      <div className="px-3 pt-2 space-y-3">
        <div className="relative aspect-[702/320] rounded-xl overflow-hidden bg-[#f3f4f8]">
          {heroes.map((src, i) => (
            <div
              key={src}
              className={cn(
                "absolute inset-0 transition-opacity duration-500",
                i === bi ? "opacity-100" : "opacity-0",
              )}
            >
              <ImgIcon src={src} alt="" className="h-full w-full object-cover" />
            </div>
          ))}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-[0.1875rem] z-10">
            {heroes.map((src, i) => (
              <button
                key={src}
                type="button"
                aria-label={`Banner ${i + 1}`}
                onClick={() => setBi(i)}
                className={cn("h-1.5 rounded-full", i === bi ? "w-4 bg-white" : "w-1.5 bg-white/50")}
              />
            ))}
          </div>
        </div>

        {user ? (
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <IconCoin />
                <span className="text-xs text-[#8A93A6]">{t("walletBalance")}</span>
              </div>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-xl font-extrabold text-ink leading-none tabular-nums">
                  ₹{formatMoney(user.balance + user.thirdParty)}
                </span>
                <button
                  type="button"
                  aria-label={t("recycle")}
                  className="h-[1.125rem] w-[1.125rem] rounded-full border border-[#D5D8E2] grid place-items-center text-[#A0A7B8]"
                  onClick={() => {
                    recycle();
                    showToast(t("recycled"));
                  }}
                >
                  <IconRefresh className="h-2.5 w-2.5" />
                </button>
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <Link
                href="/wallet/withdraw"
                className="h-[2.875rem] w-[4.875rem] text-white flex flex-col items-center justify-center gap-0.5 bg-contain bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${IMG.homeWithdrawBtn})` }}
              >
                <ArrowUp className="h-4 w-4" />
                <span className="text-sm font-semibold leading-none">{t("withdraw")}</span>
              </Link>
              <Link
                href="/wallet/deposit"
                className="h-[2.875rem] w-[4.875rem] text-white flex flex-col items-center justify-center gap-0.5 bg-contain bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${IMG.homeRechargeBtn})` }}
              >
                <ArrowDown className="h-4 w-4" />
                <span className="text-sm font-semibold leading-none">{t("deposit")}</span>
              </Link>
            </div>
          </div>
        ) : null}

        <div className="grid grid-cols-2 gap-2">
          <button type="button" onClick={() => go("/activity")} className="rounded-md overflow-hidden h-[3.25rem]">
            <ImgIcon src={IMG.turntable} alt={t("wheelOfFortune")} className="h-full w-full object-cover" />
          </button>
          <button type="button" onClick={() => go("/vip")} className="rounded-md overflow-hidden h-[3.25rem]">
            <ImgIcon src={IMG.vip} alt={t("vipPrivileges")} className="h-full w-full object-cover" />
          </button>
        </div>
      </div>

      <div
        ref={tabBarRef}
        className="sticky top-0 z-30 bg-page px-3 py-1.5"
      >
        <div className="rounded-lg bg-[#F0F2F8] px-2 py-1.5">
          <div className="flex items-center gap-2 overflow-x-auto phone-scroll">
            {cats.map((c) => {
              const on = cat === c.key;
              return (
                <button
                  key={c.key}
                  type="button"
                  data-cat={c.key}
                  onClick={() => openTab(c.key)}
                  className={cn(
                    "shrink-0 flex items-center h-10",
                    c.graphic ? "px-1.5" : "gap-0.5 px-2.5",
                    on ? "bg-white rounded-lg shadow-[0_0.125rem_0.625rem_rgba(30,38,55,0.10)]" : "",
                  )}
                >
                  {c.graphic ? (
                    <ImgIcon
                      src={on ? c.activeSrc : c.src}
                      alt={c.label}
                      className="h-[1.5rem] w-auto max-w-[8rem] object-contain object-left"
                    />
                  ) : (
                    <>
                      <ImgIcon src={on ? c.activeSrc : c.src} alt="" className="h-5 w-5 object-contain shrink-0" />
                      <span
                        className={cn(
                          "whitespace-nowrap leading-none font-serif",
                          on ? " text-sm font-bold text-[#1E2637]" : "text-13 text-[#6B7285]",
                        )}
                      >
                        {c.label}
                      </span>
                    </>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="px-3 pt-3 space-y-5">

        {cat === "lobby" ? <GameSlider title={t("recommendedGames")} games={recGames} onOpen={soon} /> : null}

        {catalogs.map((c) =>
          cat === c.id ? (
            <GameIconGrid
              key={c.id}
              catalog={c}
              onOpen={soon}
              viewAll={t("viewAll")}
              href={viewAllHref(c)}
            />
          ) : null,
        )}

        {cat === "lobby" ? (
        <>
       

        <section>
          <div className="flex items-start gap-1 mb-2.5">
            <ImgIcon src={CATEGORIES.lobbyActive} alt="" className="h-6 w-6 shrink-0 mt-0.5 object-contain" />
            <div className="min-w-0">
              <h2 className="text-sm font-bold text-ink font-serif leading-none">{t("lottery")}</h2>
              <p className="text-11 text-[#7d889d] leading-snug mt-1">{t("lotteryIntro")}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { name: t("winGo"), img: GAMES.winGo, href: "/win-go" },
              { name: t("k3"), img: GAMES.k3, href: "/k3" },
              { name: t("fiveD"), img: GAMES.fiveD, href: "/five-d" },
              { name: t("trxWin"), img: GAMES.trxWin, href: "/trx-win" },
              { name: t("motoRacing"), img: GAMES.motoRacing, href: "" },
            ].map((g) => (
              <button
                key={g.name}
                type="button"
                onClick={() => (g.href ? go(g.href) : soon())}
                className="relative overflow-hidden rounded-lg aspect-[7/4] bg-white shadow-[0_0.125rem_0.5rem_rgba(30,38,55,0.08)]"
              >
                <ImgIcon src={g.img} alt={g.name} className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </section>

        {catalogs.map((c) => (
          <GameSlider
            key={c.id}
            title={t(c.tabKey)}
            icon={c.iconActive}
            games={c.games.slice(0, 20).map(toSlide)}
            detailLabel={t("detail")}
            onOpen={soon}
            onDetail={() => router.push(viewAllHref(c))}
          />
        ))}
        </>
        ) : null}

        {cat === "lobby" ? (
        <>
        <section>
          <div className="flex items-center gap-1.5 mb-2">
            <ImgIcon src={IMG.winner} alt="" className="h-5 w-5 object-contain" />
            <h2 className="text-sm font-semibold font-serif text-ink">{t("winningInfo")}</h2>
          </div>
          <div className="bg-white rounded-xl overflow-hidden">
            <div className="grid grid-cols-3 px-3 py-2.5 text-sm font-semibold text-ink">
              <span>{t("game")}</span>
              <span className="text-center">{t("user")}</span>
              <span className="text-right">{t("winningAmount")}</span>
            </div>
            {wins.map((w) => (
              <div
                key={w.name + w.game + w.amt}
                className="grid grid-cols-3 items-center px-3 py-2.5 text-sm border-t border-[#EEEFF3]"
              >
                <span className="flex items-center gap-1.5 min-w-0 text-ink">
                  <ImgIcon src={IMG.winner} alt="" className="h-4 w-4 shrink-0 object-contain" />
                  <span className="truncate">{w.game}</span>
                </span>
                <span className="text-center text-[#8E96A8]">{w.name}</span>
                <span className="text-right text-main">₹{formatMoney(w.amt)}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="">
          <div className="flex items-center gap-1.5 mb-2">
            <ImgIcon src={IMG.rank} alt="" className="h-5 w-auto object-contain" />
            <h2 className="text-sm font-semibold font-serif text-ink">{t("todayProfit")}</h2>
          </div>
<div className="px-1 pt-9 bg-white rounded-xl overflow-hidden">
          <div className="relative ">
            <ImgIcon src={IMG.rankBg} alt="" className="w-full h-auto block" />
            <div className="absolute left-1 right-1 top-9 bottom-0">
              {podiumSlots.map((p) => (
                <div
                  key={p.place}
                  className={cn(
                    "absolute flex flex-col items-center -translate-x-1/2",
                    p.place === 1 ? "w-[34%]" : "w-[28%]",
                  )}
                  style={{ left: p.left, top: p.colTop, height: `calc(100% - ${p.colTop})` }}
                >
                  <div className="relative -translate-y-1/1 shrink-0">
                    {p.crown ? (
                      <ImgIcon
                        src={IMG.rankCrown}
                        alt=""
                        className="absolute -top-4 -right-3 h-8 w-8 z-10"
                      />
                    ) : null}
                    <span
                      className={cn(
                        "block rounded-full overflow-hidden bg-[#E8EDF5] shadow-[0_0.125rem_0.375rem_rgba(30,38,55,0.12)]",
                        p.place === 1 ? "h-[3.125rem] w-[3.125rem] border-2 border-main" : "h-[2.75rem] w-[2.75rem]",
                      )}
                    >
                      <ImgIcon src={p.rank.avatar} alt="" className="h-full w-full object-cover" />
                    </span>
                  </div>
                  <div className="flex-1 min-h-0" />
                  <p
                    className="text-sm font-bold truncate w-full text-center leading-none"
                    style={{ color: p.color }}
                  >
                    {p.rank.name}
                  </p>
                  <p
                    className="text-10 font-semibold tabular-nums whitespace-nowrap mt-1 mb-[10%] leading-none"
                    style={{ color: p.color }}
                  >
                    ₹{formatRankAmt(p.rank.amt)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="px-3 pb-1">
            {ranks.slice(3).map((r, i) => (
              <div
                key={r.name}
                className="flex items-center gap-2.5 py-[0.6875rem] border-t border-[#F0F1F5] text-13"
              >
                <span className="w-5 text-center font-bold text-ink">{i + 4}</span>
                <span className="h-9 w-9 rounded-full overflow-hidden bg-[#E8EDF5] shrink-0">
                  <ImgIcon src={r.avatar} alt="" className="h-full w-full object-cover" />
                </span>
                <span className="flex-1 font-medium text-ink truncate">{r.name}</span>
                <span className="shrink-0 font-medium text-[#fb5755] tabular-nums">₹{formatRankAmt(r.amt)}</span>
              </div>
            ))}
          </div>
          </div>
        </section>
        </>
        ) : null}

        <footer className="mb-12 rounded-xl bg-white px-5 pt-5 pb-6 shadow-[0_0.25rem_0.875rem_rgba(30,38,55,0.08)]">
          <div className="mx-auto mb-4 grid h-[2.875rem] w-[2.875rem] place-items-center rounded-full border-[0.15625rem] border-[#F95959]">
            <span className="text-15 font-bold leading-none text-[#F95959]">+18</span>
          </div>
          <HtmlContent html={HOME_FOOTER_HTML} />
        </footer>
      </div>
      </div>
    </div>
  );
}

const GRID_PREVIEW = 15;

function GameIconGrid({
  catalog,
  onOpen,
  viewAll,
  href,
}: {
  catalog: GameCatalog;
  onOpen: () => void;
  viewAll: string;
  href: string;
}) {
  const vendors = catalog.vendors ?? [];
  const [vendor, setVendor] = useState(vendors[0]?.id ?? "");
  const games = catalog.games.filter((g) => !vendor || !g.vendorId || g.vendorId === vendor);
  const list = games.slice(0, GRID_PREVIEW).map(toSlide);
  return (
    <div>
      {vendors.length ? <VendorPicker vendors={vendors} value={vendor} onChange={setVendor} /> : null}
      <div className="grid grid-cols-3 justify-items-center gap-2">
        {list.map((g, i) => (
          <GameCard key={`${g.img}-${i}`} game={g} onOpen={onOpen} fill />
        ))}
      </div>
      <Link href={href} className="mt-4 w-full h-10 rounded-lg bg-white text-sm text-muted shadow-field grid place-items-center">
        {viewAll}
      </Link>
    </div>
  );
}
