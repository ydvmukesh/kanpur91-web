import { hashString, pad2 } from "./format";

export const K3_INTERVALS = [60, 180, 300, 600] as const;
export type K3Interval = (typeof K3_INTERVALS)[number];

export function k3Period(interval: number, periodStart: number) {
  const d = new Date(periodStart * 1000);
  const ymd = `${d.getFullYear()}${pad2(d.getMonth() + 1)}${pad2(d.getDate())}`;
  const seq = String(Math.floor(periodStart / interval) % 100000).padStart(5, "0");
  return `${ymd}K${seq}`;
}

export function k3Round(interval: number, nowMs = Date.now()) {
  const sec = Math.floor(nowMs / 1000);
  const periodStart = Math.floor(sec / interval) * interval;
  const remaining = interval - (sec - periodStart);
  return {
    period: k3Period(interval, periodStart),
    periodStart,
    remaining,
    locked: remaining <= 5,
  };
}

export function k3Dice(period: string): [number, number, number] {
  const h = hashString(period);
  return [(h % 6) + 1, ((h >> 3) % 6) + 1, ((h >> 7) % 6) + 1];
}

export function k3History(interval: number, count = 10, nowMs = Date.now()) {
  const { periodStart } = k3Round(interval, nowMs);
  return Array.from({ length: count }, (_, i) => {
    const ps = periodStart - (i + 1) * interval;
    const period = k3Period(interval, ps);
    const dice = k3Dice(period);
    const sum = dice[0] + dice[1] + dice[2];
    return { period, dice, sum, big: sum >= 11, odd: sum % 2 === 1 };
  });
}

export type K3Bet =
  | { kind: "size"; value: "big" | "small" }
  | { kind: "parity"; value: "odd" | "even" }
  | { kind: "sum"; value: number };

export function k3Payout(bet: K3Bet, dice: [number, number, number]) {
  const sum = dice[0] + dice[1] + dice[2];
  if (bet.kind === "size") {
    const big = sum >= 11;
    return (bet.value === "big" && big) || (bet.value === "small" && !big) ? 2 : 0;
  }
  if (bet.kind === "parity") {
    const odd = sum % 2 === 1;
    return (bet.value === "odd" && odd) || (bet.value === "even" && !odd) ? 2 : 0;
  }
  const table: Record<number, number> = {
    3: 207,
    4: 69,
    5: 34,
    6: 20,
    7: 13,
    8: 9,
    9: 8,
    10: 7,
    11: 7,
    12: 8,
    13: 9,
    14: 13,
    15: 20,
    16: 34,
    17: 69,
    18: 207,
  };
  return bet.value === sum ? table[sum] ?? 0 : 0;
}
