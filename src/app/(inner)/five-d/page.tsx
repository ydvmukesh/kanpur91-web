"use client";

import { useEffect, useMemo, useState } from "react";
import { InnerHeader } from "@/components/Ui";
import { NumberBall } from "@/components/NumberBall";
import { useStore } from "@/lib/store";
import { formatMoney, pad2 } from "@/lib/format";
import { cn } from "@/lib/cn";
import { FIVE_D_INTERVALS, FIVE_D_POS, fiveHistory, fiveRound, type FiveBet, type FiveDPos } from "@/lib/fived";

const labels: Record<number, string> = { 60: "1Min", 180: "3Min", 300: "5Min", 600: "10Min" };

export default function FiveDPage() {
  const { t, placeFiveD, showToast, bets, user } = useStore();
  const [interval, setIntervalSec] = useState<(typeof FIVE_D_INTERVALS)[number]>(60);
  const [pos, setPos] = useState<FiveDPos>("A");
  const [now, setNow] = useState(Date.now());
  const [amt, setAmt] = useState(10);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 200);
    return () => clearInterval(id);
  }, []);

  const round = fiveRound(interval, now);
  const history = useMemo(() => fiveHistory(interval, 10, now), [interval, round.periodStart]);
  const mm = pad2(Math.floor(round.remaining / 60));
  const ss = pad2(round.remaining % 60);
  const my = bets.filter((b) => b.game === "5d" && b.interval === interval);

  function play(bet: FiveBet) {
    if (round.locked) return showToast(t("bettingClosed"));
    const err = placeFiveD(interval, round.period, bet, amt);
    showToast(err ?? t("betPlaced"));
  }

  return (
    <div className="min-h-dvh bg-bg-l3 pb-6">
      <InnerHeader title={t("fiveD")} />
      <div className="px-2 pt-2 grid grid-cols-4 gap-1.5">
        {FIVE_D_INTERVALS.map((x) => (
          <button
            key={x}
            type="button"
            onClick={() => setIntervalSec(x)}
            className={cn("rounded-lg py-2 text-[11px] font-semibold", interval === x ? "bg-main-x text-white" : "bg-white text-l2")}
          >
            5D {labels[x]}
          </button>
        ))}
      </div>
      <div className="mx-2 mt-2 bg-white rounded-xl p-3 flex justify-between">
        <div>
          <p className="text-[11px] text-l2">{t("period")}</p>
          <p className="text-sm font-bold">{round.period}</p>
        </div>
        <p className={cn("text-xl font-black text-main", round.locked && "digit-pulse")}>
          {mm}:{ss}
        </p>
      </div>
      <div className="relative mx-2 mt-2 bg-white rounded-xl p-3">
        {round.locked ? (
          <div className="absolute inset-0 z-10 bg-white/80 rounded-xl grid place-items-center text-5xl font-black text-main digit-pulse">
            {ss}
          </div>
        ) : null}
        <p className="text-xs text-l2 mb-2">
          {t("balance")}: ₹{formatMoney(user?.balance ?? 0)}
        </p>
        <div className="flex gap-1 mb-3">
          {FIVE_D_POS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPos(p)}
              className={cn("flex-1 h-8 rounded text-[11px] font-semibold", pos === p ? "bg-main text-white" : "bg-bg-l3")}
            >
              {p}
            </button>
          ))}
        </div>
        <div className="flex gap-2 mb-3">
          {[1, 10, 100, 1000].map((a) => (
            <button key={a} type="button" onClick={() => setAmt(a)} className={cn("flex-1 h-8 rounded text-xs", amt === a ? "bg-main text-white" : "bg-bg-l3")}>
              {a}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-5 gap-2">
          {Array.from({ length: 10 }, (_, n) => (
            <button key={n} type="button" onClick={() => play({ pos, kind: "number", value: n })}>
              <NumberBall n={n} size={40} />
            </button>
          ))}
        </div>
        <div className="grid grid-cols-4 gap-2 mt-3">
          <button type="button" onClick={() => play({ pos, kind: "size", value: "big" })} className="h-9 rounded-lg bg-orange text-white text-xs font-bold">
            {t("big")}
          </button>
          <button type="button" onClick={() => play({ pos, kind: "size", value: "small" })} className="h-9 rounded-lg bg-blue-2 text-white text-xs font-bold">
            {t("small")}
          </button>
          <button type="button" onClick={() => play({ pos, kind: "parity", value: "odd" })} className="h-9 rounded-lg bg-violet-norm text-white text-xs font-bold">
            {t("odd")}
          </button>
          <button type="button" onClick={() => play({ pos, kind: "parity", value: "even" })} className="h-9 rounded-lg bg-green-norm text-white text-xs font-bold">
            {t("even")}
          </button>
        </div>
      </div>
      <div className="mx-2 mt-2 bg-white rounded-xl overflow-hidden">
        <p className="px-3 py-2 text-sm font-semibold">{t("gameHistory")}</p>
        {history.map((h) => (
          <div key={h.period} className="px-3 py-2 border-t border-line flex items-center justify-between text-xs">
            <span>{h.period.slice(-8)}</span>
            <span className="flex gap-1">
              {h.digits.map((d, i) => (
                <NumberBall key={i} n={d} size={20} />
              ))}
            </span>
            <span>{h.sum}</span>
          </div>
        ))}
      </div>
      <div className="mx-2 mt-2 bg-white rounded-xl overflow-hidden">
        <p className="px-3 py-2 text-sm font-semibold">{t("myHistory")}</p>
        {my.slice(0, 12).map((b) => (
          <div key={b.id} className="px-3 py-2 border-t border-line flex justify-between text-xs">
            <span>{b.label}</span>
            <span className={b.status === "win" ? "text-green-norm" : "text-l2"}>
              {b.status === "win" ? `+₹${formatMoney(b.payout)}` : t(b.status === "pending" ? "pending" : "lose")}
            </span>
          </div>
        ))}
        {my.length === 0 ? <p className="text-center text-l3 py-6 text-sm">{t("noData")}</p> : null}
      </div>
    </div>
  );
}
