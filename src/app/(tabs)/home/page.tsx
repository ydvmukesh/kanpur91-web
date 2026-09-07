"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { HomeLogo } from "@/components/Logo";
import { IconCoin, IconDownload, IconRefresh } from "@/components/Icons";
import { GameSlider, type GameSlide } from "@/components/GameSlider";
import { BANNERS, CARD_VENDORS, CASINO_VENDORS, CATEGORIES, FISHING_GAMES, GAMES, IMG, ImgIcon, MINI_GAMES, SLOT_VENDORS, SPORTS_VENDORS } from "@/lib/img";
import { useStore } from "@/lib/store";
import { formatMoney } from "@/lib/format";
import { cn } from "@/lib/cn";

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

function miniLabel(src: string) {
  const file = src.split("/").pop() ?? src;
  return file
    .replace(/^\d{3}-/, "")
    .replace(/\.[^.]+$/, "")
    .replace(/_\d{8,}.*$/, "")
    .replace(/[-_]+/g, " ");
}

const miniGames: GameSlide[] = MINI_GAMES.map((img) => ({ n: miniLabel(img), img }));
const slotVendors: GameSlide[] = SLOT_VENDORS.map((img) => ({ n: miniLabel(img), img }));
const cardVendors: GameSlide[] = CARD_VENDORS.map((img) => ({ n: miniLabel(img), img }));
const fishingGames: GameSlide[] = FISHING_GAMES.map((img) => ({ n: miniLabel(img), img }));
const casinoVendors: GameSlide[] = CASINO_VENDORS.map((img) => ({ n: miniLabel(img), img }));
const sportsVendors: GameSlide[] = SPORTS_VENDORS.map((img) => ({ n: miniLabel(img), img }));

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
  const { t, user, showToast, recycle } = useStore();
  const router = useRouter();
  const [bi, setBi] = useState(0);
  const [cat, setCat] = useState<
    "lobby" | "mini" | "slots" | "card" | "fishing" | "casino" | "sports"
  >("lobby");
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
    if (!user) router.push("/login");
    else router.push(href);
  }

  function soon() {
    if (!user) router.push("/login");
    else showToast(t("comingSoon"));
  }

  const cats = [
    { key: "lobby" as const, label: t("lobby"), src: CATEGORIES.lobby, activeSrc: CATEGORIES.lobbyActive, graphic: false },
    { key: "mini" as const, label: t("miniGame"), src: CATEGORIES.miniGame, activeSrc: CATEGORIES.miniGame, graphic: true },
    { key: "slots" as const, label: t("slots"), src: CATEGORIES.slots, activeSrc: CATEGORIES.slotsActive, graphic: false },
    { key: "card" as const, label: t("card"), src: CATEGORIES.card, activeSrc: CATEGORIES.cardActive, graphic: false },
    { key: "fishing" as const, label: t("fishing"), src: CATEGORIES.fishing, activeSrc: CATEGORIES.fishingActive, graphic: false },
    { key: "casino" as const, label: t("casino"), src: CATEGORIES.casino, activeSrc: CATEGORIES.casinoActive, graphic: false },
    { key: "sports" as const, label: t("sports"), src: CATEGORIES.sports, activeSrc: CATEGORIES.sportsActive, graphic: false },
  ];

  return (
    <div className="pb-8">
      <header className=" top-0 z-40 bg-white px-3 h-12 flex items-center justify-between">
        <HomeLogo className="h-11" />
        {user ? (
          <button
            type="button"
            className="h-9 w-9 grid place-items-center text-main"
            onClick={() => showToast(t("download"))}
          >
            <IconDownload />
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="h-[30px] px-3.5 rounded-md border border-[#D8DCE6] bg-white text-l1 text-[13px] font-medium grid place-items-center"
            >
              {t("login")}
            </Link>
            <Link
              href="/register"
              className="h-[30px] px-3.5 rounded-md bg-main text-white text-[13px] font-medium grid place-items-center"
            >
              {t("register")}
            </Link>
          </div>
        )}
      </header>

      <div className="h-9 bg-[#F3F4F8] px-3 flex items-center gap-2">
        <ImgIcon src={IMG.notice} alt="" className="h-4 w-4 shrink-0" />
        <div className="flex-1 overflow-hidden">
          <div className="marquee text-[11px] text-l1">
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
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-[3px] z-10">
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
                <span className="text-[12px] text-[#8A93A6]">{t("walletBalance")}</span>
              </div>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-[22px] font-extrabold text-l1 leading-none tabular-nums">
                  ₹{formatMoney(user.balance + user.thirdParty)}
                </span>
                <button
                  type="button"
                  aria-label={t("recycle")}
                  className="h-[18px] w-[18px] rounded-full border border-[#D5D8E2] grid place-items-center text-[#A0A7B8]"
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
                href="/withdraw"
                className="h-[46px] w-[74px] rounded-lg bg-gradient-to-b from-[#FFB24A] to-[#FF8C3A] text-white flex flex-col items-center justify-center gap-0.5 shadow-[0_2px_6px_rgba(255,140,58,0.35)]"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M12 19V6M7 10l5-5 5 5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-[11px] font-semibold leading-none">{t("withdraw")}</span>
              </Link>
              <Link
                href="/deposit"
                className="h-[46px] w-[74px] rounded-lg bg-gradient-to-b from-[#FF7B8C] to-[#F95959] text-white flex flex-col items-center justify-center gap-0.5 shadow-[0_2px_6px_rgba(249,89,89,0.35)]"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M12 5v13M7 14l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-[11px] font-semibold leading-none">{t("deposit")}</span>
              </Link>
            </div>
          </div>
        ) : null}

        <div className="grid grid-cols-2 gap-2">
          <button type="button" onClick={() => go("/activity")} className="rounded-md overflow-hidden h-[52px]">
            <ImgIcon src={IMG.turntable} alt={t("wheelOfFortune")} className="h-full w-full object-cover" />
          </button>
          <button type="button" onClick={() => go("/vip")} className="rounded-md overflow-hidden h-[52px]">
            <ImgIcon src={IMG.vip} alt={t("vipPrivileges")} className="h-full w-full object-cover" />
          </button>
        </div>
      </div>

      <div
        ref={tabBarRef}
        className="sticky top-0 z-30 bg-bg-l1 px-3 py-1.5"
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
                  onClick={() => setCat(c.key)}
                  className={cn(
                    "shrink-0 flex items-center h-10",
                    c.graphic ? "px-1.5" : "gap-0.5 px-2.5",
                    on ? "bg-white rounded-lg shadow-[0_2px_10px_rgba(30,38,55,0.10)]" : "",
                  )}
                >
                  {c.graphic ? (
                    <ImgIcon
                      src={on ? c.activeSrc : c.src}
                      alt={c.label}
                      className="h-[24px] w-auto max-w-[128px] object-contain object-left"
                    />
                  ) : (
                    <>
                      <ImgIcon src={on ? c.activeSrc : c.src} alt="" className="h-5 w-5 object-contain shrink-0" />
                      <span
                        className={cn(
                          "whitespace-nowrap leading-none font-serif",
                          on ? " text-[12px] font-bold text-[#1E2637]" : "text-[13px] text-[#6B7285]",
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

        {cat === "mini" ? (
          <GameSlider title={t("miniGame")} icon={CATEGORIES.miniGame} games={miniGames} onOpen={soon} />
        ) : null}
        {cat === "slots" ? (
          <GameSlider title={t("slots")} icon={CATEGORIES.slotsActive} games={slotVendors} onOpen={soon} />
        ) : null}
        {cat === "card" ? (
          <GameSlider title={t("cardRummy")} icon={CATEGORIES.cardActive} games={cardVendors} onOpen={soon} />
        ) : null}
        {cat === "fishing" ? (
          <GameSlider title={t("fishing")} icon={CATEGORIES.fishingActive} games={fishingGames} onOpen={soon} />
        ) : null}
        {cat === "casino" ? (
          <GameSlider title={t("casino")} icon={CATEGORIES.casinoActive} games={casinoVendors} onOpen={soon} />
        ) : null}
        {cat === "sports" ? (
          <GameSlider title={t("sports")} icon={CATEGORIES.sportsActive} games={sportsVendors} onOpen={soon} />
        ) : null}

        {cat === "lobby" ? (
        <>
       

        <section>
          <div className="flex items-start gap-1 mb-2.5">
            <ImgIcon src={CATEGORIES.lobbyActive} alt="" className="h-6 w-6 shrink-0 mt-0.5 object-contain" />
            <div className="min-w-0">
              <h2 className="text-[14px] font-bold text-l1 font-serif leading-none">{t("lottery")}</h2>
              <p className="text-[11px] text-[#7d889d] leading-snug mt-1">{t("lotteryIntro")}</p>
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
                className="relative overflow-hidden rounded-lg aspect-[7/4] bg-white shadow-[0_2px_8px_rgba(30,38,55,0.08)]"
              >
                <ImgIcon src={g.img} alt={g.name} className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </section>

        <GameSlider title={t("miniGame")} icon={CATEGORIES.miniGame} games={miniGames} detailLabel={t("detail")} onOpen={soon} onDetail={() => openTab("mini")} />

        <GameSlider title={t("slots")} icon={CATEGORIES.slotsActive} games={slotVendors} detailLabel={t("detail")} onOpen={soon} onDetail={() => openTab("slots")} />

        <GameSlider title={t("cardRummy")} icon={CATEGORIES.cardActive} games={cardVendors} detailLabel={t("detail")} onOpen={soon} onDetail={() => openTab("card")} />

        <GameSlider title={t("fishing")} icon={CATEGORIES.fishingActive} games={fishingGames} detailLabel={t("detail")} onOpen={soon} onDetail={() => openTab("fishing")} />

        <GameSlider title={t("casino")} icon={CATEGORIES.casinoActive} games={casinoVendors} detailLabel={t("detail")} onOpen={soon} onDetail={() => openTab("casino")} />

        <GameSlider title={t("sports")} icon={CATEGORIES.sportsActive} games={sportsVendors} detailLabel={t("detail")} onOpen={soon} onDetail={() => openTab("sports")} />
        </>
        ) : null}

        <section>
          <div className="flex items-center gap-1.5 mb-2">
            <ImgIcon src={IMG.winner} alt="" className="h-5 w-5 object-contain" />
            <h2 className="text-[14px] font-semibold font-serif text-l1">{t("winningInfo")}</h2>
          </div>
          <div className="bg-white rounded-xl overflow-hidden">
            <div className="grid grid-cols-3 px-3 py-2.5 text-[12px] font-semibold text-l1">
              <span>{t("game")}</span>
              <span className="text-center">{t("user")}</span>
              <span className="text-right">{t("winningAmount")}</span>
            </div>
            {wins.map((w) => (
              <div
                key={w.name + w.game + w.amt}
                className="grid grid-cols-3 items-center px-3 py-2.5 text-[12px] border-t border-[#EEEFF3]"
              >
                <span className="flex items-center gap-1.5 min-w-0 text-l1">
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
            <h2 className="text-[14px] font-semibold font-serif text-l1">{t("todayProfit")}</h2>
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
                        "block rounded-full overflow-hidden bg-[#E8EDF5] shadow-[0_2px_6px_rgba(30,38,55,0.12)]",
                        p.place === 1 ? "h-[50px] w-[50px] border-2 border-main" : "h-[44px] w-[44px]",
                      )}
                    >
                      <ImgIcon src={p.rank.avatar} alt="" className="h-full w-full object-cover" />
                    </span>
                  </div>
                  <div className="flex-1 min-h-0" />
                  <p
                    className="text-[12px] font-bold truncate w-full text-center leading-none"
                    style={{ color: p.color }}
                  >
                    {p.rank.name}
                  </p>
                  <p
                    className="text-[10px] font-semibold tabular-nums whitespace-nowrap mt-1 mb-[10%] leading-none"
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
                className="flex items-center gap-2.5 py-[11px] border-t border-[#F0F1F5] text-[13px]"
              >
                <span className="w-5 text-center font-bold text-l1">{i + 4}</span>
                <span className="h-9 w-9 rounded-full overflow-hidden bg-[#E8EDF5] shrink-0">
                  <ImgIcon src={r.avatar} alt="" className="h-full w-full object-cover" />
                </span>
                <span className="flex-1 font-medium text-l1 truncate">{r.name}</span>
                <span className="shrink-0 font-medium text-[#fb5755] tabular-nums">₹{formatRankAmt(r.amt)}</span>
              </div>
            ))}
          </div>
          </div>
        </section>

        <footer className="bg-white rounded-[20px] px-5 pt-5 pb-6 shadow-[0_4px_14px_rgba(30,38,55,0.08)] mb-16">
          <div className="mx-auto mb-4 h-[46px] w-[46px] rounded-full border-[2.5px] border-[#F95959] grid place-items-center">
            <span className="text-[15px] font-bold text-[#F95959] leading-none">+18</span>
          </div>
          <div
            className="space-y-1.5 text-[13px] leading-[1.55] text-[#6E7C91]"
            style={{ fontFamily: '"Times New Roman", Times, serif' }}
          >
            {[t("footerFair"), t("footerPartners"), t("footerVisit")].map((line) => (
              <p key={line} className="flex gap-2">
                <span className="mt-[7px] h-[6px] w-[6px] shrink-0 rotate-45 bg-[#F95959]" />
                <span>{line}</span>
              </p>
            ))}
          </div>
          <p
            className="text-[13px] leading-[1.55] text-[#E07060] mt-3.5"
            style={{ fontFamily: '"Times New Roman", Times, serif' }}
          >
            {t("footerAddictive")}
          </p>
          <p
            className="text-[13px] leading-[1.55] text-[#E07060]"
            style={{ fontFamily: '"Times New Roman", Times, serif' }}
          >
            {t("footerAge18")}
          </p>
        </footer>
      </div>
    </div>
  );
}
