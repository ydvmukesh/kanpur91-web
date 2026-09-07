"use client";

import { useEffect, useRef, useState } from "react";
import { IconChevronDown } from "@/components/Icons";
import { RuleModal } from "@/components/RuleModal";
import { cn } from "@/lib/cn";
import { formatMoney } from "@/lib/format";
import { useStore } from "@/lib/store";
import {
  FOLLOW_STRATEGIES,
  choiceTone,
  strategyBet,
  type FollowStrategy,
} from "@/lib/strategies";
import { getRound, type WinGoInterval } from "@/lib/wingo";

type ActiveFollow = {
  strategy: FollowStrategy;
  amount: number;
  remaining: number;
  martingale: boolean;
  lastPeriod: string;
};

type HistItem = {
  id: string;
  name: string;
  author: string;
  amount: number;
  rounds: number;
  at: string;
};

function LionAvatar({ className = "h-11 w-11" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <circle cx="32" cy="32" r="31" fill="#F4C15A" />
      <circle cx="32" cy="32" r="26" fill="#E8A83A" />
      <circle cx="32" cy="34" r="16" fill="#F7D48A" />
      <path
        fill="#C47A22"
        d="M18 22c2-8 8-12 14-12 6 0 12 4 14 12 3-1 8 2 8 8 0 4-3 7-6 7-1 6-8 12-16 12s-15-6-16-12c-3 0-6-3-6-7 0-6 5-9 8-8Z"
      />
      <circle cx="32" cy="36" r="12" fill="#FBE3B0" />
      <circle cx="27" cy="34" r="2.1" fill="#3A2A18" />
      <circle cx="37" cy="34" r="2.1" fill="#3A2A18" />
      <path d="M32 36.5v4" stroke="#C47A22" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M28 42c2.2 2 5.8 2 8 0" fill="none" stroke="#C47A22" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function EmptyStrategyArt() {
  return (
    <svg viewBox="0 0 180 110" className="mx-auto h-[92px] w-[150px]" aria-hidden>
      <ellipse cx="90" cy="98" rx="46" ry="6" fill="#EEF0F5" />
      <rect x="108" y="38" width="28" height="36" rx="3" fill="#E4E7EE" />
      <rect x="114" y="44" width="16" height="2" rx="1" fill="#D0D5DE" />
      <rect x="114" y="50" width="12" height="2" rx="1" fill="#D0D5DE" />
      <path
        fill="#D8DCE6"
        d="M72 86c-8 0-14-8-12-16 2-9 12-14 22-12 4-10 16-14 24-8 7 5 8 14 5 20 8 2 12 10 8 16-3 6-12 8-22 6-4 6-16 4-25-6Z"
      />
      <circle cx="86" cy="48" r="10" fill="#C9CED9" />
      <path fill="#C9CED9" d="M74 86h26c2-12-2-22-13-22s-15 10-13 22Z" />
      <rect x="48" y="28" width="18" height="22" rx="2" fill="#E4E7EE" transform="rotate(-18 57 39)" />
      <rect x="132" y="22" width="16" height="20" rx="2" fill="#E4E7EE" transform="rotate(16 140 32)" />
    </svg>
  );
}

function IconPeople() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor">
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 18c.8-3 3-4.6 5.5-4.6S13.7 15 14.5 18" />
      <circle cx="16.5" cy="9" r="2.4" />
      <path d="M16.5 13.2c2.2 0 4.1 1.3 4.8 3.8" />
    </svg>
  );
}

function IconHelp({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="9" />
      <path d="M9.6 9.6a2.4 2.4 0 1 1 3.4 2.2c-.7.4-1 .8-1 1.5V14" strokeLinecap="round" />
      <circle cx="12" cy="17" r=".8" fill="currentColor" />
    </svg>
  );
}

function IconHistoryClock() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v4.2L15 15" strokeLinecap="round" />
      <path d="M7 5.2 5.2 7" strokeLinecap="round" />
    </svg>
  );
}

function IconChip() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
      <circle cx="12" cy="12" r="10" fill="#F95959" />
      <circle cx="12" cy="12" r="6.2" fill="none" stroke="#fff" strokeWidth="1.6" strokeDasharray="2.2 2.4" />
      <text x="12" y="15.2" textAnchor="middle" fontSize="8" fontWeight="700" fill="#fff">
        $
      </text>
    </svg>
  );
}

function IconRound() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
      <circle cx="12" cy="12" r="10" fill="#F95959" />
      <path d="M12 7v5l3 2" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M16.5 6.2 18 4.8" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IconPad() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="8" width="18" height="11" rx="3" />
      <path d="M8 13h.01M16 12v2M15 13h2" strokeLinecap="round" />
    </svg>
  );
}

function HelpBtn({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" className="text-l3" onClick={onClick} aria-label="Help">
      <IconHelp />
    </button>
  );
}

function formatRoi(n: number) {
  return `+${n}%`;
}

export function WinGoFollow({
  interval,
  now,
  trx,
}: {
  interval: WinGoInterval;
  now: number;
  trx?: boolean;
}) {
  const { t, placeWinGo, showToast } = useStore();
  const round = getRound(interval, now);
  const [hint, setHint] = useState<null | "strategy" | "roi" | "profit" | "wagered">(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [history, setHistory] = useState<HistItem[]>([]);
  const [pick, setPick] = useState<FollowStrategy | null>(null);
  const [amount, setAmount] = useState(10);
  const [rounds, setRounds] = useState(10);
  const [martingale, setMartingale] = useState(false);
  const [extra, setExtra] = useState(false);
  const [active, setActive] = useState<ActiveFollow | null>(null);
  const lastBetPeriod = useRef("");

  function clampAmt(n: number) {
    if (!Number.isFinite(n) || n < 1) return 1;
    return Math.min(Math.floor(n), 100000);
  }

  function openSettings(s: FollowStrategy) {
    setPick(s);
    setAmount(10);
    setRounds(10);
    setMartingale(false);
    setExtra(false);
  }

  function startFollow(tryOnly: boolean) {
    if (!pick) return;
    const amt = clampAmt(amount);
    const n = Math.max(1, Math.min(100, Math.floor(rounds) || 1));
    if (tryOnly) {
      showToast(t("tryIt"));
      setPick(null);
      return;
    }
    if (!round.locked) {
      const err = placeWinGo(interval, round.period, strategyBet(pick), amt, trx ? "trx" : "wingo");
      if (err) return showToast(err);
      lastBetPeriod.current = round.period;
    } else {
      lastBetPeriod.current = "";
    }
    setActive({
      strategy: pick,
      amount: amt,
      remaining: round.locked ? n : n - 1,
      martingale,
      lastPeriod: lastBetPeriod.current,
    });
    setHistory((h) => [
      {
        id: `${pick.id}-${Date.now()}`,
        name: pick.type,
        author: pick.author,
        amount: amt,
        rounds: n,
        at: new Date().toLocaleString(),
      },
      ...h,
    ]);
    setPick(null);
    showToast(t("strategyFollowed"));
  }

  useEffect(() => {
    if (!active || active.remaining <= 0) return;
    if (round.locked) return;
    if (lastBetPeriod.current === round.period) return;
    lastBetPeriod.current = round.period;
    const err = placeWinGo(
      interval,
      round.period,
      strategyBet(active.strategy),
      active.amount,
      trx ? "trx" : "wingo",
    );
    if (err) {
      lastBetPeriod.current = "";
      showToast(err);
      setActive(null);
      return;
    }
    setActive((prev) =>
      prev
        ? {
            ...prev,
            remaining: prev.remaining - 1,
            lastPeriod: round.period,
          }
        : prev,
    );
  }, [active, interval, round.locked, round.period, placeWinGo, showToast, trx]);

  useEffect(() => {
    if (active && active.remaining <= 0) setActive(null);
  }, [active]);

  const hintBody =
    hint === "strategy"
      ? t("bettingStrategyHint")
      : hint === "roi"
        ? t("roiHint")
        : hint === "profit"
          ? t("profitHint")
          : hint === "wagered"
            ? t("wageredHint")
            : "";

  return (
    <div className="space-y-2.5">
      <section className="rounded-xl bg-white px-3 pt-3 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-[15px] font-semibold text-l1">
            {t("bettingStrategy")}
            <HelpBtn onClick={() => setHint("strategy")} />
          </div>
          <button
            type="button"
            onClick={() => setHistoryOpen((v) => !v)}
            className="h-7 px-2.5 rounded-md border border-[#18B660] text-[#18B660] text-[12px] font-medium inline-flex items-center gap-1"
          >
            <IconHistoryClock />
            {t("history")}
          </button>
        </div>

        {historyOpen ? (
          history.length === 0 ? (
            <div className="pt-6 pb-2">
              <EmptyStrategyArt />
              <p className="mt-2 text-center text-[13px] text-l3">{t("noStrategyHistory")}</p>
            </div>
          ) : (
            <div className="mt-3 space-y-2">
              {history.map((h) => (
                <div key={h.id} className="flex justify-between text-[12px] py-2 border-t border-[#F0F1F5]">
                  <div>
                    <p className="font-semibold text-l1">{h.name}</p>
                    <p className="text-l3 mt-0.5">
                      {h.author} · {h.rounds} · ₹{formatMoney(h.amount)}
                    </p>
                  </div>
                  <p className="text-l3">{h.at}</p>
                </div>
              ))}
            </div>
          )
        ) : active ? (
          <div className="mt-3 flex items-center gap-2.5">
            <LionAvatar />
            <div className="flex-1 min-w-0">
              <p className="text-[15px] font-bold text-l1">{active.strategy.type}</p>
              <p className="text-[12px] text-l2 mt-0.5">
                {t("remainingRounds")} {active.remaining}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                lastBetPeriod.current = "";
                setActive(null);
                showToast(t("strategyStopped"));
              }}
              className="h-8 px-3 rounded-md border border-main text-main text-[12px] font-semibold"
            >
              {t("stopFollow")}
            </button>
          </div>
        ) : (
          <div className="pt-6 pb-2">
            <EmptyStrategyArt />
            <p className="mt-2 text-center text-[13px] text-l3">{t("pleaseSelectStrategy")}</p>
          </div>
        )}
      </section>

      {FOLLOW_STRATEGIES.map((s) => (
        <article key={s.id} className="rounded-xl bg-white px-3 pt-3 pb-3 shadow-[0_1px_4px_rgba(30,38,55,0.04)]">
          <div className="flex gap-2.5">
            <LionAvatar />
            <div className="flex-1 min-w-0">
              <p className="text-[16px] font-bold text-l1 leading-tight">{s.type}</p>
              <p className="mt-1 flex items-center gap-1 text-[12px] text-main font-medium">
                <span className="text-main">
                  <IconPeople />
                </span>
                {s.followed} {t("followedCount")}
              </p>
              <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
                <span className="text-[12px] text-l3">{s.author}</span>
                <span className={cn("h-5 px-1.5 rounded text-[11px] font-medium grid place-items-center", choiceTone(s.choice))}>
                  {s.choice === "follow" ? t("followTag") : s.choice}
                </span>
                <span className="h-5 px-1.5 rounded bg-[#F2F3F7] text-[11px] text-l2 grid place-items-center">
                  {t("martingale")}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-3 border-t border-[#F0F1F5] pt-2.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1 text-[12px] text-l2">
                {t("returnOnInvestment")}
                <HelpBtn onClick={() => setHint("roi")} />
              </span>
              <span className="text-[20px] font-extrabold text-main leading-none">{formatRoi(s.roi)}</span>
            </div>
            <div className="flex items-center justify-between text-[13px]">
              <span className="inline-flex items-center gap-1 text-l2">
                {t("totalProfit")}
                <HelpBtn onClick={() => setHint("profit")} />
              </span>
              <span className="text-l1 tabular-nums">₹{formatMoney(s.profit)}</span>
            </div>
            <div className="flex items-center justify-between text-[13px]">
              <span className="inline-flex items-center gap-1 text-l2">
                {t("totalBetAmount")}
                <HelpBtn onClick={() => setHint("wagered")} />
              </span>
              <span className="text-l1 tabular-nums">₹{formatMoney(s.wagered)}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => openSettings(s)}
            className="mt-3 w-full h-11 rounded-lg bg-main-x text-white text-[15px] font-semibold"
          >
            {t("followStrategy")}
          </button>
        </article>
      ))}

      {pick ? (
        <div className="fixed inset-0 z-50 flex justify-center">
          <div className="relative w-full max-w-[400px] h-full">
            <button type="button" className="absolute inset-0 bg-black/55" onClick={() => setPick(null)} />
            <div className="absolute inset-x-6 top-1/2 -translate-y-1/2 flex flex-col items-center">
              <div className="w-full overflow-hidden rounded-2xl bg-white">
                <div className="h-11 bg-main-x grid place-items-center">
                  <p className="text-white text-[15px] font-medium">· {t("strategySettings")} ·</p>
                </div>
                <div className="px-4 pt-4 pb-3">
                  <label className="flex items-center gap-1.5 text-[13px] text-l2">
                    <IconChip />
                    <span>
                      {t("betAmountLabel")}
                      <span className="text-main">*</span>
                    </span>
                  </label>
                  <div className="mt-2 flex items-center gap-2">
                    <input
                      value={amount}
                      onChange={(e) => setAmount(clampAmt(Number(e.target.value)))}
                      inputMode="numeric"
                      className="flex-1 h-10 rounded-md border border-[#E6E8EE] px-3 text-[14px] text-l1 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setAmount((a) => clampAmt(a / 2))}
                      className="h-10 w-11 rounded-md bg-main text-white text-[12px] font-semibold"
                    >
                      1/2
                    </button>
                    <button
                      type="button"
                      onClick={() => setAmount((a) => clampAmt(a * 2))}
                      className="h-10 w-11 rounded-md bg-main text-white text-[12px] font-semibold"
                    >
                      2X
                    </button>
                  </div>

                  <label className="mt-3 flex items-center gap-1.5 text-[13px] text-l2">
                    <IconRound />
                    <span>
                      {t("strategyRound")}
                      <span className="text-main">*</span>
                    </span>
                  </label>
                  <input
                    value={rounds}
                    onChange={(e) => setRounds(Math.max(1, Math.min(100, Number(e.target.value) || 1)))}
                    inputMode="numeric"
                    className="mt-2 w-full h-10 rounded-md border border-[#E6E8EE] px-3 text-[14px] text-l1 outline-none"
                  />

                  <button
                    type="button"
                    onClick={() => setExtra((v) => !v)}
                    className="mx-auto mt-3 flex items-center gap-1 text-[13px] text-[#7FADD1]"
                  >
                    {extra ? t("putAway") : t("expandMore")}
                    <span className={cn("transition-transform", extra && "rotate-180")}>
                      <IconChevronDown className="h-3.5 w-3.5" />
                    </span>
                  </button>

                  <p className="mt-2 text-[13px] text-l1 font-medium">{t("strategyParameters")}</p>
                  <div className="mt-2 rounded-xl bg-[#F6F7FB] px-3 py-2 text-[13px]">
                    <div className="flex justify-between py-1.5">
                      <span className="text-l2">{t("remainingRounds")}</span>
                      <span className="text-l1">{rounds}</span>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <span className="text-l2">{t("wagerAfterWin")}</span>
                      <span className="text-[#FD8654]">₹{formatMoney(amount)}</span>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <span className="text-l2">{t("wagerAfterLoss")}</span>
                      <span className="text-[#FD8654]">
                        ₹{formatMoney(amount)}
                        {martingale ? (
                          <>
                            ×1<sup>n</sup>
                          </>
                        ) : null}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-1.5">
                      <span className="text-l2 pr-3">{t("enableMartingale")}</span>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={martingale}
                        onClick={() => setMartingale((v) => !v)}
                        className={cn(
                          "relative h-[22px] w-10 rounded-full transition-colors",
                          martingale ? "bg-main" : "bg-[#D8DCE6]",
                        )}
                      >
                        <i
                          className={cn(
                            "absolute top-[2px] h-[18px] w-[18px] rounded-full bg-white shadow transition-all",
                            martingale ? "left-[20px]" : "left-[2px]",
                          )}
                        />
                      </button>
                    </div>
                    {extra ? (
                      <p className="py-1.5 text-[12px] text-l3">
                        {pick.type} · {pick.choice === "follow" ? t("followTag") : pick.choice}
                      </p>
                    ) : null}
                  </div>
                </div>
                <div className="px-4 pb-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => startFollow(true)}
                    className="h-11 px-3 rounded-lg border border-main text-main text-[14px] font-semibold inline-flex items-center gap-1 shrink-0"
                  >
                    <IconPad />
                    {t("tryIt")}
                  </button>
                  <button
                    type="button"
                    onClick={() => startFollow(false)}
                    className="h-11 flex-1 rounded-lg bg-main-x text-white text-[16px] font-semibold"
                  >
                    {t("confirm")}
                  </button>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPick(null)}
                className="mt-4 h-9 w-9 rounded-full border-2 border-white text-white grid place-items-center text-xl leading-none"
                aria-label={t("close")}
              >
                ×
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <RuleModal
        open={hint !== null}
        title={
          hint === "strategy"
            ? t("bettingStrategy")
            : hint === "roi"
              ? t("returnOnInvestment")
              : hint === "profit"
                ? t("totalProfit")
                : t("totalBetAmount")
        }
        onClose={() => setHint(null)}
      >
        <p>{hintBody}</p>
      </RuleModal>
    </div>
  );
}
