"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { LogoWhite } from "@/components/Logo";
import {
  IconBack,
  IconBook,
  IconCheck,
  IconFlame,
  IconHeadset,
  IconRefresh,
  IconSpeaker,
  IconVolume,
  IconWalletMini,
  IconChevron,
} from "@/components/Icons";
import { RuleModal } from "@/components/RuleModal";
import { EmptyNoData } from "@/components/games/EmptyNoData";
import { dummyWinGoBets, WinGoBetRows } from "@/components/games/WinGoBetHistory";
import { WinGoChart } from "@/components/games/WinGoChart";
import { WinGoFollow } from "@/components/games/WinGoFollow";
import { IMG, ImgIcon, WINGO_BALLS } from "@/lib/img";
import { PRESALE_RULES, wingoHowToPlay } from "@/lib/rules";
import { useStore } from "@/lib/store";
import { formatMoney, pad2 } from "@/lib/format";
import { cn } from "@/lib/cn";
import {
  WINGO_INTERVALS,
  type WinGoBetValue,
  type WinGoInterval,
  getRound,
  historyFor,
  numberColor,
} from "@/lib/wingo";

const amounts = [1, 10, 100, 1000];
const multiples = [1, 5, 10, 20, 50, 100];
const HISTORY_PAGE_SIZE = 10;
const HISTORY_PAGES = 50;

function betTheme(bet: WinGoBetValue) {
  if (bet.kind === "color") {
    if (bet.value === "green") return "#18B660";
    if (bet.value === "violet") return "#9B48DB";
    return "#F95959";
  }
  if (bet.kind === "number") {
    if (bet.value === 0) return "#F95959";
    if (bet.value === 5) return "#18B660";
    return bet.value % 2 === 1 ? "#18B660" : "#F95959";
  }
  return bet.value === "big" ? "#FBB84D" : "#54B0FD";
}

function ColorDots({ colors }: { colors: Array<"green" | "red" | "violet"> }) {
  const map = { green: "#18B660", red: "#FB5B5B", violet: "#C86EFF" };
  return (
    <span className="inline-flex items-center justify-center gap-[3px]">
      {colors.map((c) => (
        <i key={c} className="h-[10px] w-[10px] rounded-full inline-block" style={{ background: map[c] }} />
      ))}
    </span>
  );
}

function HistoryNumber({ n }: { n: number }) {
  if (n === 0 || n === 5) {
    return (
      <span
        className="text-[20px] font-extrabold leading-none"
        style={{
          backgroundImage:
            n === 0
              ? "linear-gradient(180deg, #FB5B5B 50%, #C86EFF 50%)"
              : "linear-gradient(180deg, #18B660 50%, #C86EFF 50%)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
        }}
      >
        {n}
      </span>
    );
  }
  return (
    <span
      className="text-[20px] font-extrabold leading-none"
      style={{ color: n % 2 === 1 ? "#18B660" : "#FB5B5B" }}
    >
      {n}
    </span>
  );
}

function ColorBetBtn({
  tone,
  children,
  onClick,
}: {
  tone: "green" | "violet" | "red";
  children: React.ReactNode;
  onClick: () => void;
}) {
  const theme = {
    green: { bg: "linear-gradient(180deg, #3BD67A 0%, #18B660 100%)", shadow: "#0E8A48" },
    violet: { bg: "linear-gradient(180deg, #B56AEE 0%, #9B48DB 100%)", shadow: "#6D2FA8" },
    red: { bg: "linear-gradient(180deg, #FF7A7A 0%, #FB5B5B 100%)", shadow: "#C63C3C" },
  }[tone];
  return (
    <button
      type="button"
      onClick={onClick}
      className="wingo-color-btn"
      style={{ background: theme.bg, boxShadow: `0 3px 0 ${theme.shadow}` }}
    >
      {children}
    </button>
  );
}

function TimeBox({ n, pulse }: { n: string; pulse?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex h-[30px] w-[22px] items-center justify-center rounded-[5px] bg-white text-[#2B3270] text-[20px] font-extrabold tabular-nums leading-none",
        pulse && "digit-pulse",
      )}
    >
      {n}
    </span>
  );
}

export function WinGoGame({ title, trx }: { title: string; trx?: boolean }) {
  const { t, user, placeWinGo, showToast, recycle, bets } = useStore();
  const router = useRouter();
  const [interval, setIntervalSec] = useState<WinGoInterval>(30);
  const [now, setNow] = useState(Date.now());
  const [sheet, setSheet] = useState<WinGoBetValue | null>(null);
  const [amt, setAmt] = useState(1);
  const [qty, setQty] = useState(1);
  const [mul, setMul] = useState(1);
  const [agree, setAgree] = useState(true);
  const [rules, setRules] = useState(false);
  const [presale, setPresale] = useState(false);
  const [muted, setMuted] = useState(false);
  const [tab, setTab] = useState<"game" | "chart" | "follow" | "mine">("game");
  const [histPage, setHistPage] = useState(1);
  const [flashN, setFlashN] = useState<number | null>(null);
  const [pickN, setPickN] = useState<number | null>(null);
  const [flashTick, setFlashTick] = useState(0);
  const histTabsRef = useRef<HTMLDivElement>(null);
  const randomBusy = useRef(false);
  const randomTimers = useRef<number[]>([]);

  function selectTab(next: "game" | "chart" | "follow" | "mine") {
    setTab(next);
    window.requestAnimationFrame(() => {
      histTabsRef.current
        ?.querySelector<HTMLElement>(`[data-hist-tab="${next}"]`)
        ?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    });
  }

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 200);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    setHistPage(1);
  }, [interval]);

  useEffect(() => {
    return () => {
      randomTimers.current.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  const round = getRound(interval, now);
  const history = useMemo(() => historyFor(interval, 5, now), [interval, round.periodStart]);
  const allRecords = useMemo(
    () => historyFor(interval, HISTORY_PAGE_SIZE * HISTORY_PAGES, now),
    [interval, round.periodStart],
  );
  const records = allRecords.slice((histPage - 1) * HISTORY_PAGE_SIZE, histPage * HISTORY_PAGE_SIZE);
  const my = [
    ...bets.filter((b) => (trx ? b.game === "trx" : b.game === "wingo") && b.interval === interval),
    ...dummyWinGoBets(interval, trx ? "trx" : "wingo"),
  ];
  const mm = pad2(Math.floor(round.remaining / 60));
  const ss = pad2(round.remaining % 60);
  const overlay = round.locked ? pad2(round.remaining) : null;
  const total = amt * qty * mul;
  const active = WINGO_INTERVALS.find((x) => x.key === interval)!;
  const gameName = `${trx ? "TrxWin" : active.name} ${active.sub}`;

  function open(bet: WinGoBetValue) {
    if (round.locked) return showToast(t("bettingClosed"));
    setAmt(1);
    setQty(1);
    setAgree(true);
    setSheet(bet);
  }

  function randomPick() {
    if (round.locked) return showToast(t("bettingClosed"));
    if (randomBusy.current) return;
    randomBusy.current = true;
    const pick = Math.floor(Math.random() * 10);
    setPickN(null);
    setFlashN(null);
    randomTimers.current.forEach((id) => window.clearTimeout(id));
    randomTimers.current = [];
    let step = 0;
    const steps = 16;
    const run = () => {
      if (step >= steps) {
        setFlashN(pick);
        setPickN(pick);
        const done = window.setTimeout(() => {
          setFlashN(null);
          setPickN(null);
          randomBusy.current = false;
          open({ kind: "number", value: pick });
        }, 450);
        randomTimers.current.push(done);
        return;
      }
      setFlashN(Math.floor(Math.random() * 10));
      setFlashTick((x) => x + 1);
      step += 1;
      const wait = window.setTimeout(run, 45 + step * 20);
      randomTimers.current.push(wait);
    };
    run();
  }

  function confirm() {
    if (!sheet) return;
    if (!agree) return showToast(t("agree"));
    const err = placeWinGo(interval, round.period, sheet, total, trx ? "trx" : "wingo");
    if (err) return showToast(err);
    showToast(t("betPlaced"));
    setSheet(null);
  }

  const theme = sheet ? betTheme(sheet) : "#F95959";
  const selectLabel =
    sheet?.kind === "number"
      ? String(sheet.value)
      : sheet?.kind === "color"
        ? t(sheet.value)
        : sheet?.kind === "size"
          ? t(sheet.value)
          : "";

  return (
    <div className="min-h-full bg-[#f6f6f6] pb-8">
      <header className="sticky top-0 z-30 h-12 px-1 flex items-center text-white bg-main">
        <button
          type="button"
          onClick={() => router.back()}
          className="h-10 w-10 grid place-items-center shrink-0"
          aria-label="Back"
        >
          <IconBack />
        </button>
        <div className="flex-1 flex justify-center">
          <LogoWhite className="h-8" />
        </div>
        <div className="flex items-center shrink-0 pr-1">
          <Link
            href="/customer-service"
            className="h-10 w-9 grid place-items-center"
            aria-label={t("customerService")}
          >
            <IconHeadset />
          </Link>
          <button
            type="button"
            className="h-10 w-9 grid place-items-center"
            aria-label={muted ? "Unmute" : "Mute"}
            onClick={() => setMuted((m) => !m)}
          >
            <IconVolume muted={muted} />
          </button>
        </div>
      </header>

      <div className="wingo-hero px-3 pt-2 pb-4 space-y-2.5">
        <section className="bg-white rounded-2xl px-4 pt-4 pb-3.5 shadow-[0_2px_8px_rgba(30,38,55,0.06)]">
          <div className="flex items-center gap-1.5">
            <span className="text-[22px] font-extrabold text-[#1e2637] leading-none tabular-nums">
              ₹{formatMoney(user?.balance ?? 0)}
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
          <div className="mt-2 flex items-center gap-1 text-main">
            <IconWalletMini />
            <span className="text-[12px] text-[#2B3270]">{t("walletBalance")}</span>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Link
              href="/withdraw"
              className="h-10 rounded-full bg-[#F95959] text-white text-[14px] font-semibold grid place-items-center"
            >
              {t("withdraw")}
            </Link>
            <Link
              href="/deposit"
              className="h-10 rounded-full bg-[#18B660] text-white text-[14px] font-semibold grid place-items-center"
            >
              {t("deposit")}
            </Link>
          </div>
        </section>

        <div className="h-9 rounded-full bg-white px-2 flex items-center gap-1.5 shadow-[0_1px_4px_rgba(30,38,55,0.05)]">
          <span className="shrink-0 pl-0.5">
            <IconSpeaker />
          </span>
          <div className="flex-1 overflow-hidden">
            <div className="marquee text-[11px] text-l1">
              <span className="pr-8">{t("withdrawNotice")}</span>
              <span className="pr-8">{t("withdrawNotice")}</span>
            </div>
          </div>
          <Link
            href="/notifications"
            className="shrink-0 h-7 pl-1.5 pr-2 rounded-full bg-main text-white text-[11px] font-semibold flex items-center gap-0.5"
          >
            <span className="text-[#FFD45A]">
              <IconFlame />
            </span>
            {t("detail")}
          </Link>
        </div>

        <div className="bg-white rounded-xl p-1.5 grid grid-cols-4 gap-1 shadow-[0_2px_8px_rgba(30,38,55,0.05)]">
          {WINGO_INTERVALS.map((x) => {
            const on = interval === x.key;
            return (
              <button
                key={x.key}
                type="button"
                onClick={() => setIntervalSec(x.key)}
                className={cn(
                  "rounded-lg py-2 flex flex-col items-center gap-1",
                  on ? "bg-main-x text-white" : "text-[#9AA3B5]",
                )}
              >
                <ImgIcon
                  src={on ? IMG.wingoTimeActive : IMG.wingoTime}
                  alt=""
                  className="h-[34px] w-[34px] object-contain"
                />
                <span className="text-[11px] font-semibold leading-none">{trx ? "TrxWin" : x.name}</span>
                <span className="text-[11px] font-semibold leading-none">{x.sub}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="px-3 space-y-2.5">
        <section className="wingo-ticket rounded-xl text-white">
          <div className="grid grid-cols-2 min-h-[128px]">
            <div className="relative px-3 py-2.5 flex flex-col">
              <button
                type="button"
                onClick={() => setRules(true)}
                className="self-start h-7 px-2.5 rounded-full border border-white/85 text-[11px] font-medium flex items-center gap-1"
              >
                <IconBook className="h-3.5 w-3.5" />
                {t("howToPlay")}
              </button>
              <p className="mt-2.5 text-[13px] font-semibold">{gameName}</p>
              <div className="mt-auto pt-2 flex gap-1.5">
                {history.map((h) => (
                  <ImgIcon
                    key={h.period}
                    src={WINGO_BALLS[h.number]}
                    alt={String(h.number)}
                    className="h-[22px] w-[22px] object-contain"
                  />
                ))}
              </div>
            </div>
            <div className="relative px-3 py-2.5 flex flex-col items-center">
              <div
                className="pointer-events-none absolute inset-y-3 left-0 border-l border-dashed border-white/70"
                aria-hidden
              />
              <p className="text-[12px] font-medium">{t("timeRemaining")}</p>
              <div className="mt-2 flex items-center gap-[3px]">
                <TimeBox n={mm[0]} />
                <TimeBox n={mm[1]} />
                <span className="text-white font-black text-lg px-0.5 leading-none">:</span>
                <TimeBox n={ss[0]} pulse={round.locked} />
                <TimeBox n={ss[1]} pulse={round.locked} />
              </div>
              <p className="mt-auto pt-2 text-[12px] font-semibold tracking-wide tabular-nums">{round.period}</p>
            </div>
          </div>
        </section>

        <div className="relative p-1 bg-white rounded-xl">
          {overlay ? (
            <div className="absolute inset-0 z-10 rounded-xl bg-black/50 flex items-center justify-center gap-3">
              <span className="h-[86px] w-[64px] rounded-xl bg-white text-[#F95959] text-[52px] font-black grid place-items-center digit-pulse shadow-[0_4px_12px_rgba(0,0,0,0.15)]">
                {overlay[0]}
              </span>
              <span className="h-[86px] w-[64px] rounded-xl bg-white text-[#F95959] text-[52px] font-black grid place-items-center digit-pulse shadow-[0_4px_12px_rgba(0,0,0,0.15)]">
                {overlay[1]}
              </span>
            </div>
          ) : null}

          <div className="grid grid-cols-3 gap-2 pb-[3px]">
            <ColorBetBtn tone="green" onClick={() => open({ kind: "color", value: "green" })}>
              {t("green")}
            </ColorBetBtn>
            <ColorBetBtn tone="violet" onClick={() => open({ kind: "color", value: "violet" })}>
              {t("violet")}
            </ColorBetBtn>
            <ColorBetBtn tone="red" onClick={() => open({ kind: "color", value: "red" })}>
              {t("red")}
            </ColorBetBtn>
          </div>

          <div className="grid grid-cols-5 gap-x-3 gap-y-3 mt-3.5 px-1 overflow-visible bg-[#f7f8ff] py-1 px-2 rounded-lg">
            {Array.from({ length: 10 }, (_, n) => (
              <button
                key={flashN === n ? `flash-${n}-${flashTick}` : `ball-${n}`}
                type="button"
                onClick={() => {
                  if (randomBusy.current) return;
                  open({ kind: "number", value: n });
                }}
                className={cn(
                  "aspect-square relative wingo-press",
                  flashN === n && pickN !== n && "wingo-ball-flash",
                  pickN === n && "wingo-ball-pick",
                )}
                aria-label={`Number ${n}`}
              >
                <ImgIcon src={WINGO_BALLS[n]} alt={String(n)} className="h-full w-full object-contain" />
              </button>
            ))}
          </div>

          <div className="mt-3 flex items-center gap-1.5">
            <button
              type="button"
              onClick={randomPick}
              className={cn(
                "h-8 px-3 rounded-full border border-main text-main text-[12px] font-semibold shrink-0 wingo-press",
                randomBusy.current && "opacity-60",
              )}
            >
              {t("random")}
            </button>
            <div className="flex flex-1 justify-end gap-1">
              {multiples.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMul(m)}
                  className={cn(
                    "h-8 min-w-[36px] px-1.5 rounded-full text-[12px] font-semibold wingo-press",
                    mul === m ? "bg-main text-white" : "bg-[#F0F1F5] text-l2",
                  )}
                >
                  X{m}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-3 flex overflow-hidden rounded-full">
            <button
              type="button"
              onClick={() => open({ kind: "size", value: "big" })}
              className=" flex-1 h-11 bg-[#FEAA57] text-white text-[16px] font-bold"
            >
              {t("big")}
            </button>
            <button
              type="button"
              onClick={() => open({ kind: "size", value: "small" })}
              className=" flex-1 h-11 bg-[#6EA8F4] text-white text-[16px] font-bold"
            >
              {t("small")}
            </button>
          </div>
        </div>

        <div ref={histTabsRef} className="flex gap-2 pt-1 overflow-x-auto phone-scroll">
          {(
            [
              { key: "game" as const, label: t("gameHistory") },
              { key: "chart" as const, label: t("chart") },
              { key: "follow" as const, label: t("followStrategy") },
              { key: "mine" as const, label: t("myHistory") },
            ] as const
          ).map((x) => (
            <button
              key={x.key}
              type="button"
              data-hist-tab={x.key}
              onClick={() => selectTab(x.key)}
              className={cn(
                "h-10 shrink-0 w-[calc((100%-2.4rem)/3)] rounded-lg text-[12px] font-semibold border px-1 leading-tight",
                tab === x.key
                  ? "bg-main-x text-white border-transparent"
                  : "bg-white text-l2 border-[#E6E8EE]",
              )}
            >
              {x.label}
            </button>
          ))}
        </div>

        {tab === "game" ? (
          <div>
            <div className="overflow-hidden rounded-xl bg-white">
              <div className="grid grid-cols-[1.55fr_0.5fr_0.7fr_0.55fr] bg-main text-white text-[13px] font-semibold items-center py-2.5">
                <span className="pl-3 text-left">{t("period")}</span>
                <span className="text-center">{t("number")}</span>
                <span className="text-center">{t("bigSmall")}</span>
                <span className="text-center">{t("color")}</span>
              </div>
              {records.map((h) => (
                <div
                  key={h.period}
                  className="grid grid-cols-[1.55fr_0.5fr_0.7fr_0.55fr] items-center py-2.5 text-[13px] border-t border-[#F0F1F5]"
                >
                  <span className="pl-3 text-left text-l1 tabular-nums text-[12px]">{h.period}</span>
                  <span className="text-center">
                    <HistoryNumber n={h.number} />
                  </span>
                  <span className="text-center text-l1">{h.big ? t("big") : t("small")}</span>
                  <span className="text-center">
                    <ColorDots colors={h.colors} />
                  </span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center gap-6 py-4">
              <button
                type="button"
                disabled={histPage <= 1}
                onClick={() => setHistPage((p) => Math.max(1, p - 1))}
                className={cn(
                  "h-8 w-8 rounded-md grid place-items-center",
                  histPage <= 1 ? "bg-[#E9EDF3] text-[#B6BCC8]" : "bg-main text-white",
                )}
                aria-label="Previous page"
              >
                <span className="rotate-180">
                  <IconChevron />
                </span>
              </button>
              <span className="text-[13px] text-l1 tabular-nums">
                {histPage}/{HISTORY_PAGES}
              </span>
              <button
                type="button"
                disabled={histPage >= HISTORY_PAGES}
                onClick={() => setHistPage((p) => Math.min(HISTORY_PAGES, p + 1))}
                className={cn(
                  "h-8 w-8 rounded-md grid place-items-center",
                  histPage >= HISTORY_PAGES ? "bg-[#E9EDF3] text-[#B6BCC8]" : "bg-main text-white",
                )}
                aria-label="Next page"
              >
                <IconChevron />
              </button>
            </div>
          </div>
        ) : null}

        {tab === "chart" ? <WinGoChart interval={interval} now={now} /> : null}

        {tab === "follow" ? <WinGoFollow interval={interval} now={now} trx={trx} /> : null}

        {tab === "mine" ? (
          <div className="relative overflow-hidden rounded-xl bg-white min-h-[220px]">
            <Link
              href={`${trx ? "/trx-win" : "/win-go"}/history?interval=${interval}`}
              className="absolute right-2.5 top-2.5 z-10 h-7 pl-2.5 pr-1.5 rounded border border-main text-main text-[12px] font-medium inline-flex items-center gap-1"
            >
              {t("detail")}
              <span className="h-3.5 w-3.5 rounded-full border border-current grid place-items-center text-[10px] leading-none">
                ›
              </span>
            </Link>
            {my.length === 0 ? (
              <div className="pt-12 pb-8">
                <EmptyNoData />
                <p className="mt-1 text-center text-[14px] text-l1">{t("noData")}</p>
              </div>
            ) : (
              <div className="pt-10">
                <WinGoBetRows bets={my.slice(0, 10)} />
              </div>
            )}
          </div>
        ) : null}
      </div>

      {sheet ? (
        <div className="fixed inset-0 z-50 flex justify-center">
          <div className="relative w-full max-w-[400px] h-full">
            <button type="button" className="absolute inset-0 bg-black/55" onClick={() => setSheet(null)} />
            <div className="absolute bottom-0 inset-x-0 overflow-hidden rounded-t-xl bg-white">
              <div className="wingo-bet-head pt-3 pb-8 text-center text-white" style={{ background: theme }}>
                <p className="text-[16px] font-semibold">{gameName}</p>
                <div className="mt-2 mx-auto w-fit min-w-[148px] h-[30px] px-6 rounded-md bg-white text-[#1e2637] text-[13px] font-semibold grid place-items-center">
                  {t("select")} {selectLabel}
                </div>
              </div>

              <div className="px-3 pt-1 pb-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[13px] text-l2">{t("balance")}</span>
                  <div className="flex gap-1.5">
                    {amounts.map((a) => (
                      <button
                        key={a}
                        type="button"
                        onClick={() => setAmt(a)}
                        className={cn(
                          "h-8 min-w-[46px] px-2 rounded-md text-[13px] font-semibold",
                          amt === a ? "text-white" : "bg-[#F4F5F8] text-l2",
                        )}
                        style={amt === a ? { background: theme } : undefined}
                      >
                        {a}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between gap-3">
                  <span className="text-[13px] text-l2">{t("quantity")}</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      className="h-8 w-8 rounded-md text-white text-lg font-semibold leading-none"
                      style={{ background: theme }}
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                    >
                      −
                    </button>
                    <span className="h-8 min-w-[52px] px-2 rounded-md border border-[#E6E8EE] bg-white text-[14px] font-semibold grid place-items-center tabular-nums">
                      {qty}
                    </span>
                    <button
                      type="button"
                      className="h-8 w-8 rounded-md text-white text-lg font-semibold leading-none"
                      style={{ background: theme }}
                      onClick={() => setQty((q) => q + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="mt-3 flex justify-end gap-1.5">
                  {multiples.map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMul(m)}
                      className={cn(
                        "h-7 min-w-[36px] px-1.5 rounded-md text-[12px] font-semibold",
                        mul === m ? "text-white" : "bg-[#F4F5F8] text-l2",
                      )}
                      style={mul === m ? { background: theme } : undefined}
                    >
                      X{m}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  className="mt-4 flex items-center gap-1.5 text-[13px] text-l2"
                  onClick={() => setAgree((v) => !v)}
                >
                  <span
                    className={cn(
                      "h-[18px] w-[18px] rounded-full border grid place-items-center shrink-0",
                      agree ? "border-main bg-main text-white" : "border-l3 bg-white",
                    )}
                  >
                    {agree ? <IconCheck className="h-2.5 w-2.5" /> : null}
                  </span>
                  <span>
                    {t("agree")}{" "}
                    <span
                      className="text-main"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPresale(true);
                      }}
                    >
                      《{t("preSaleRules")}》
                    </span>
                  </span>
                </button>
              </div>

              <div className="flex">
                <button
                  type="button"
                  onClick={() => setSheet(null)}
                  className="h-12 w-[32%] bg-[#F4F5F8] text-l2 text-[15px] font-medium"
                >
                  {t("cancel")}
                </button>
                <button
                  type="button"
                  onClick={confirm}
                  className="h-12 flex-1 text-white text-[15px] font-semibold"
                  style={{ background: theme }}
                >
                  {t("totalAmount")} ₹{formatMoney(total)}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <RuleModal open={presale} title={t("preSaleRules")} onClose={() => setPresale(false)}>
        <div className="whitespace-pre-wrap">{PRESALE_RULES}</div>
      </RuleModal>

      <RuleModal open={rules} title={t("howToPlay")} onClose={() => setRules(false)}>
        {wingoHowToPlay(interval).map((p) => (
          <p key={p} className="mb-3 last:mb-0">
            {p}
          </p>
        ))}
      </RuleModal>
    </div>
  );
}
