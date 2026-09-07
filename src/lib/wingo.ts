import { hashString, pad2 } from "./format";

export type WinGoInterval = 30 | 60 | 180 | 300;

export const WINGO_INTERVALS: { key: WinGoInterval; name: string; sub: string }[] = [
  { key: 30, name: "WinGo", sub: "30sec" },
  { key: 60, name: "WinGo", sub: "1 Min" },
  { key: 180, name: "WinGo", sub: "3 Min" },
  { key: 300, name: "WinGo", sub: "5 Min" },
];

export function numberColor(n: number): Array<"green" | "red" | "violet"> {
  if (n === 0) return ["red", "violet"];
  if (n === 5) return ["green", "violet"];
  if (n % 2 === 1) return ["green"];
  return ["red"];
}

export function isBig(n: number) {
  return n >= 5;
}

export function ballGradient(n: number) {
  if (n === 0) return "linear-gradient(180deg, #FB5B5B 50%, #C86EFF 50%)";
  if (n === 5) return "linear-gradient(180deg, #18B660 50%, #C86EFF 50%)";
  if (n % 2 === 1) return "linear-gradient(180deg, #40D070 0%, #18B660 100%)";
  return "linear-gradient(180deg, #FF6B70 0%, #F95959 100%)";
}

export function formatPeriod(interval: number, periodStart: number) {
  const d = new Date(periodStart * 1000);
  const ymd = `${d.getFullYear()}${pad2(d.getMonth() + 1)}${pad2(d.getDate())}`;
  const seq = String(Math.floor(periodStart / interval) % 100000).padStart(5, "0");
  const code = interval === 30 ? "1" : interval === 60 ? "2" : interval === 180 ? "3" : "4";
  return `${ymd}${code}${seq}`;
}

export function getRound(interval: number, nowMs = Date.now()) {
  const sec = Math.floor(nowMs / 1000);
  const periodStart = Math.floor(sec / interval) * interval;
  const remaining = interval - (sec - periodStart);
  const period = formatPeriod(interval, periodStart);
  return { period, periodStart, remaining, locked: remaining <= 5 };
}

export function resultForPeriod(period: string) {
  return hashString(period) % 10;
}

export function historyFor(interval: number, count = 10, nowMs = Date.now()) {
  const { periodStart } = getRound(interval, nowMs);
  return Array.from({ length: count }, (_, i) => {
    const ps = periodStart - (i + 1) * interval;
    const period = formatPeriod(interval, ps);
    const number = resultForPeriod(period);
    return { period, number, colors: numberColor(number), big: isBig(number) };
  });
}

export function chartBallBg(n: number) {
  if (n === 0) return "linear-gradient(135deg, #C86EFF 50%, #FB5B5B 50%)";
  if (n === 5) return "linear-gradient(135deg, #C86EFF 50%, #18B660 50%)";
  if (n % 2 === 1) return "#18B660";
  return "#FB5B5B";
}

export function chartStats(numbers: number[]) {
  const missing = Array.from({ length: 10 }, () => numbers.length);
  const avgMissing = Array.from({ length: 10 }, () => 0);
  const frequency = Array.from({ length: 10 }, () => 0);
  const maxConsecutive = Array.from({ length: 10 }, () => 0);

  for (let n = 0; n < 10; n++) {
    const hits: number[] = [];
    let streak = 0;
    let maxS = 0;
    for (let i = 0; i < numbers.length; i++) {
      if (numbers[i] === n) {
        if (missing[n] === numbers.length) missing[n] = i;
        frequency[n] += 1;
        hits.push(i);
        streak += 1;
        maxS = Math.max(maxS, streak);
      } else {
        streak = 0;
      }
    }
    maxConsecutive[n] = maxS;
    if (hits.length === 0) {
      avgMissing[n] = numbers.length;
    } else {
      const gaps = [hits[0]];
      for (let i = 1; i < hits.length; i++) gaps.push(hits[i] - hits[i - 1] - 1);
      gaps.push(Math.max(0, numbers.length - 1 - hits[hits.length - 1]));
      avgMissing[n] = Math.round(gaps.reduce((a, b) => a + b, 0) / gaps.length);
    }
  }

  return { missing, avgMissing, frequency, maxConsecutive };
}

export type WinGoBetValue =
  | { kind: "color"; value: "green" | "red" | "violet" }
  | { kind: "number"; value: number }
  | { kind: "size"; value: "big" | "small" };

export function payoutMultiplier(bet: WinGoBetValue, number: number) {
  const colors = numberColor(number);
  if (bet.kind === "number") {
    return bet.value === number ? 9 : 0;
  }
  if (bet.kind === "size") {
    const big = isBig(number);
    if ((bet.value === "big" && big) || (bet.value === "small" && !big)) {
      if (number === 0 || number === 5) return 1.5;
      return 2;
    }
    return 0;
  }
  if (bet.value === "violet") return colors.includes("violet") ? 4.5 : 0;
  if (colors.includes(bet.value)) {
    if (colors.includes("violet")) return 1.5;
    return 2;
  }
  return 0;
}
