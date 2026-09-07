import { hashString, pad2 } from "./format";

export const FIVE_D_INTERVALS = [60, 180, 300, 600] as const;
export type FiveDInterval = (typeof FIVE_D_INTERVALS)[number];
export const FIVE_D_POS = ["A", "B", "C", "D", "E", "SUM"] as const;
export type FiveDPos = (typeof FIVE_D_POS)[number];

export function fivePeriod(interval: number, periodStart: number) {
  const d = new Date(periodStart * 1000);
  const ymd = `${d.getFullYear()}${pad2(d.getMonth() + 1)}${pad2(d.getDate())}`;
  const seq = String(Math.floor(periodStart / interval) % 100000).padStart(5, "0");
  return `${ymd}D${seq}`;
}

export function fiveRound(interval: number, nowMs = Date.now()) {
  const sec = Math.floor(nowMs / 1000);
  const periodStart = Math.floor(sec / interval) * interval;
  const remaining = interval - (sec - periodStart);
  return {
    period: fivePeriod(interval, periodStart),
    periodStart,
    remaining,
    locked: remaining <= 5,
  };
}

export function fiveDigits(period: string): [number, number, number, number, number] {
  const h = hashString(period + "5d");
  return [
    h % 10,
    (h >> 3) % 10,
    (h >> 6) % 10,
    (h >> 9) % 10,
    (h >> 12) % 10,
  ];
}

export function fiveHistory(interval: number, count = 10, nowMs = Date.now()) {
  const { periodStart } = fiveRound(interval, nowMs);
  return Array.from({ length: count }, (_, i) => {
    const ps = periodStart - (i + 1) * interval;
    const period = fivePeriod(interval, ps);
    const digits = fiveDigits(period);
    const sum = digits.reduce((a, b) => a + b, 0);
    return { period, digits, sum };
  });
}

export type FiveBet =
  | { pos: FiveDPos; kind: "number"; value: number }
  | { pos: FiveDPos; kind: "size"; value: "big" | "small" }
  | { pos: FiveDPos; kind: "parity"; value: "odd" | "even" };

function valueForPos(pos: FiveDPos, digits: number[]) {
  if (pos === "SUM") return digits.reduce((a, b) => a + b, 0);
  return digits["ABCDE".indexOf(pos)];
}

export function fivePayout(bet: FiveBet, digits: number[]) {
  const v = valueForPos(bet.pos, digits);
  if (bet.kind === "number") return bet.value === v ? (bet.pos === "SUM" ? 9 : 9) : 0;
  if (bet.kind === "size") {
    const threshold = bet.pos === "SUM" ? 23 : 5;
    const big = v >= threshold;
    return (bet.value === "big" && big) || (bet.value === "small" && !big) ? 2 : 0;
  }
  const odd = v % 2 === 1;
  return (bet.value === "odd" && odd) || (bet.value === "even" && !odd) ? 2 : 0;
}
