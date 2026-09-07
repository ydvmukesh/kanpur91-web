"use client";

import { useState } from "react";
import { IconCopy } from "@/components/Icons";
import { cn } from "@/lib/cn";
import { copyText, formatMoney, pad2 } from "@/lib/format";
import { useStore, type StoredBet } from "@/lib/store";
import {
  getRound,
  historyFor,
  isBig,
  numberColor,
  resultForPeriod,
  type WinGoBetValue,
} from "@/lib/wingo";

type WingoStored = StoredBet & {
  payload: { game: "wingo" | "trx"; bet: WinGoBetValue };
};

function isWingoBet(b: StoredBet): b is WingoStored {
  const p = (b as WingoStored).payload;
  return p?.game === "wingo" || p?.game === "trx";
}

function betFace(bet: WinGoBetValue) {
  if (bet.kind === "number") {
    return { text: String(bet.value), bg: "linear-gradient(180deg, #FF8A7A 0%, #F95959 100%)" };
  }
  if (bet.kind === "color") {
    const bg = bet.value === "green" ? "#18B660" : bet.value === "violet" ? "#9B48DB" : "#F95959";
    return { text: bet.value[0]!.toUpperCase(), bg };
  }
  return {
    text: bet.value === "big" ? "B" : "S",
    bg: bet.value === "big" ? "#FEAA57" : "#6EA8F4",
  };
}

function selectLabel(bet: WinGoBetValue, t: ReturnType<typeof useStore>["t"]) {
  if (bet.kind === "number") return String(bet.value);
  if (bet.kind === "color") return t(bet.value);
  return t(bet.value);
}

function stampAt(sec: number) {
  const d = new Date(sec * 1000);
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())} ${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`;
}

export function dummyWinGoBets(interval: number, game: "wingo" | "trx"): StoredBet[] {
  const { periodStart } = getRound(interval);
  return historyFor(interval, 6).map((h, i) => {
    const createdAt = stampAt(periodStart - (i + 1) * interval);
    const loseN = (h.number + 2) % 10;
    const win = i === 2 || i === 3 || i === 5;
    const bet: WinGoBetValue =
      i === 3
        ? { kind: "size", value: h.big ? "big" : "small" }
        : i === 4
          ? { kind: "size", value: h.big ? "small" : "big" }
          : i === 5
            ? { kind: "color", value: h.colors.includes("green") ? "green" : "red" }
            : { kind: "number", value: win ? h.number : loseN };
    const amount = win && i === 2 ? 10 : 2;
    const payout = !win ? 0 : bet.kind === "number" ? amount * 9 : amount * 2;
    const label =
      bet.kind === "number" ? `number ${bet.value}` : bet.kind === "color" ? bet.value : bet.value;
    return {
      id: `DUM${game}${interval}${h.period}${i}`,
      game,
      interval,
      period: h.period,
      label,
      amount,
      status: win ? ("win" as const) : ("lose" as const),
      payout,
      createdAt,
      payload: { game, bet },
    };
  });
}

export function withDummyWinGo(real: StoredBet[], interval: number, game: "wingo" | "trx") {
  return [...real.filter((b) => !String(b.id).startsWith("DUM")), ...dummyWinGoBets(interval, game)];
}

function ResultValue({ n, t }: { n: number; t: ReturnType<typeof useStore>["t"] }) {
  const colors = numberColor(n);
  const tone = { green: "#18B660", red: "#F95959", violet: "#9B48DB" };
  return (
    <span className="inline-flex items-center gap-1.5 font-medium">
      <span className="text-l2">{n}</span>
      {colors.map((c) => (
        <span key={c} style={{ color: tone[c] }}>
          {t(c)}
        </span>
      ))}
      <span style={{ color: isBig(n) ? "#FEAA57" : "#6EA8F4" }}>{isBig(n) ? t("big") : t("small")}</span>
    </span>
  );
}

function DetailRow({
  label,
  value,
  valueClass,
}: {
  label: string;
  value: React.ReactNode;
  valueClass?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 min-h-8 py-1.5">
      <span className="text-l2 shrink-0">{label}</span>
      <span className={cn("text-right text-l1 tabular-nums min-w-0", valueClass)}>{value}</span>
    </div>
  );
}

export function WinGoBetRows({ bets, cards }: { bets: StoredBet[]; cards?: boolean }) {
  const { t, showToast } = useStore();
  const [open, setOpen] = useState<string | null>(null);
  const rows = bets.filter(isWingoBet);

  if (rows.length === 0) return null;

  return (
    <div className={cn(cards && "px-3 pt-3 space-y-2")}>
      {rows.map((b) => {
        const face = betFace(b.payload.bet);
        const expanded = open === b.id;
        const result = b.status === "pending" ? null : resultForPeriod(b.period);
        const tax = Number((b.amount * 0.02).toFixed(2));
        const afterTax = Number((b.amount - tax).toFixed(2));
        const ok = b.status === "win";
        const fail = b.status === "lose";
        const statusText = ok ? t("succeed") : fail ? t("failed") : t("pending");
        const winLose = ok ? `+₹${formatMoney(b.payout)}` : fail ? `-₹${formatMoney(b.amount)}` : "--";
        return (
          <div key={b.id} className={cn(cards ? "overflow-hidden rounded-xl bg-white" : "border-t border-[#F0F1F5] first:border-t-0")}>
            <button
              type="button"
              onClick={() => setOpen(expanded ? null : b.id)}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left"
            >
              <span
                className="h-11 w-11 shrink-0 rounded-lg text-white text-[20px] font-bold grid place-items-center"
                style={{ background: face.bg }}
              >
                {face.text}
              </span>
              <span className="flex-1 min-w-0">
                <span className="flex items-center gap-1.5 text-[13px] font-semibold text-l1 tabular-nums">
                  {b.period}
                  <i
                    className={cn(
                      "inline-block border-x-[4px] border-x-transparent border-t-[5px] border-t-[#1e2637]",
                      expanded && "rotate-180",
                    )}
                  />
                </span>
                <span className="block mt-0.5 text-[11px] text-l3">{b.createdAt}</span>
              </span>
              <span className="shrink-0 text-right">
                <span
                  className={cn(
                    "inline-flex h-[22px] min-w-[58px] px-2 rounded border text-[12px] font-medium items-center justify-center",
                    ok && "border-green-norm text-green-norm",
                    fail && "border-main text-main",
                    b.status === "pending" && "border-secondary text-secondary",
                  )}
                >
                  {statusText}
                </span>
                <span
                  className={cn(
                    "block mt-1 text-[13px] font-semibold tabular-nums",
                    ok ? "text-green-norm" : fail ? "text-main" : "text-l3",
                  )}
                >
                  {winLose}
                </span>
              </span>
            </button>
            {expanded ? (
              <div className="px-3 pb-3">
                <p className="text-[14px] font-semibold text-l1 mb-2">{t("details")}</p>
                <div className="rounded-lg bg-[#F6F7FB] px-3 py-1 text-[12px]">
                  <DetailRow
                    label={t("orderNumber")}
                    value={
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 text-l1"
                        onClick={(e) => {
                          e.stopPropagation();
                          copyText(b.id);
                          showToast(t("copied"));
                        }}
                      >
                        <span className="max-w-[170px] truncate">{b.id}</span>
                        <IconCopy />
                      </button>
                    }
                  />
                  <DetailRow label={t("period")} value={b.period} />
                  <DetailRow label={t("purchaseAmount")} value={`₹${formatMoney(b.amount)}`} />
                  <DetailRow label={t("quantity")} value="1" />
                  <DetailRow label={t("amountAfterTax")} value={`₹${formatMoney(afterTax)}`} valueClass="text-main font-medium" />
                  <DetailRow label={t("tax")} value={`₹${formatMoney(tax)}`} />
                  <DetailRow
                    label={t("result")}
                    value={result === null ? "--" : <ResultValue n={result} t={t} />}
                  />
                  <DetailRow label={t("select")} value={selectLabel(b.payload.bet, t)} />
                  <DetailRow
                    label={t("status")}
                    value={statusText}
                    valueClass={ok ? "text-green-norm" : fail ? "text-main" : "text-secondary"}
                  />
                  <DetailRow
                    label={t("winLose")}
                    value={winLose}
                    valueClass={ok ? "text-green-norm" : fail ? "text-main" : "text-l3"}
                  />
                  <DetailRow label={t("orderTime")} value={b.createdAt} />
                </div>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
