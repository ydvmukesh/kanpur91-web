"use client";

import { useEffect, useMemo, useState } from "react";
import { InnerHeader } from "@/components/Ui";
import { useStore } from "@/lib/store";
import { formatMoney, pad2 } from "@/lib/format";
import { cn } from "@/lib/cn";
import { K3_INTERVALS, k3History, k3Round, type K3Bet } from "@/lib/k3";

const labels: Record<number, string> = { 60: "1Min", 180: "3Min", 300: "5Min", 600: "10Min" };

export default function K3Page() {
  const { t, placeK3, showToast, bets, user } = useStore();
  const [interval, setIntervalSec] = useState<(typeof K3_INTERVALS)[number]>(60);
  const [now, setNow] = useState(Date.now());
  const [sumPick, setSumPick] = useState<number | null>(null);
  const [amt, setAmt] = useState(10);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 200);
    return () => clearInterval(id);
  }, []);

  const round = k3Round(interval, now);
  const history = useMemo(() => k3History(interval, 10, now), [interval, round.periodStart]);
  const ss = pad2(round.remaining % 60);
  const mm = pad2(Math.floor(round.remaining / 60));
  const my = bets.filter((b) => b.game === "k3" && b.interval === interval);

  function play(bet: K3Bet) {
    if (round.locked) return showToast(t("bettingClosed"));
    const err = placeK3(interval, round.period, bet, amt);
    showToast(err ?? t("betPlaced"));
    setSumPick(null);
  }

  return (
    <div className="min-h-dvh bg-bg-l3 pb-6">
      <InnerHeader title={t("k3")} />
      <div className="px-2 pt-2 grid grid-cols-4 gap-1.5">
        {K3_INTERVALS.map((x) => (
          <button
            key={x}
            type="button"
            onClick={() => setIntervalSec(x)}
            className={cn("rounded-lg py-2 text-[11px] font-semibold", interval === x ? "bg-main-x text-white" : "bg-white text-l2")}
          >
            K3 {labels[x]}
          </button>
        ))}
      </div>
      <div className="mx-2 mt-2 bg-white rounded-xl p-3 flex justify-between">
        <div>
          <p className="text-[11px] text-l2">{t("period")}</p>
          <p className="text-sm font-bold">{round.period}</p>
        </div>
        <div className="text-right">
          <p className="text-[11px] text-l2">{t("timeRemaining")}</p>
          <p className={cn("text-xl font-black text-main", round.locked && "digit-pulse")}>
            {mm}:{ss}
          </p>
        </div>
      </div>

      <div className="relative mx-2 mt-2 bg-white rounded-xl p-3">
        {round.locked ? (
          <div className="absolute inset-0 z-10 bg-white/80 rounded-xl grid place-items-center text-5xl font-black text-main digit-pulse">
            {ss}
          </div>
        ) : null}
        <p className="text-xs text-l2 mb-2">{t("balance")}: ₹{formatMoney(user?.balance ?? 0)}</p>
        <div className="flex gap-2 mb-3">
          {[1, 10, 100, 1000].map((a) => (
            <button key={a} type="button" onClick={() => setAmt(a)} className={cn("flex-1 h-8 rounded text-xs font-semibold", amt === a ? "bg-main text-white" : "bg-bg-l3")}>
              {a}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button type="button" onClick={() => play({ kind: "size", value: "big" })} className="h-10 rounded-lg bg-orange text-white font-bold">
            {t("big")} 2x
          </button>
          <button type="button" onClick={() => play({ kind: "size", value: "small" })} className="h-10 rounded-lg bg-blue-2 text-white font-bold">
            {t("small")} 2x
          </button>
          <button type="button" onClick={() => play({ kind: "parity", value: "odd" })} className="h-10 rounded-lg bg-violet-norm text-white font-bold">
            {t("odd")} 2x
          </button>
          <button type="button" onClick={() => play({ kind: "parity", value: "even" })} className="h-10 rounded-lg bg-green-norm text-white font-bold">
            {t("even")} 2x
          </button>
        </div>
        <p className="text-xs text-l2 mt-3 mb-2">{t("sum")}</p>
        <div className="grid grid-cols-8 gap-1.5">
          {Array.from({ length: 16 }, (_, i) => i + 3).map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => {
                setSumPick(n);
                play({ kind: "sum", value: n });
              }}
              className={cn("h-8 rounded text-[11px] font-semibold", sumPick === n ? "bg-main text-white" : "bg-bg-l3")}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-2 mt-2 bg-white rounded-xl overflow-hidden">
        <p className="px-3 py-2 text-sm font-semibold">{t("gameHistory")}</p>
        {history.map((h) => (
          <div key={h.period} className="px-3 py-2 border-t border-line flex items-center justify-between text-xs">
            <span>{h.period.slice(-8)}</span>
            <span className="font-bold">{h.dice.join(" + ")} = {h.sum}</span>
            <span>{h.big ? t("big") : t("small")}</span>
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
