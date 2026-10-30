import { fiveDigits, fivePayout, fiveRound } from "@/lib/fived";
import type { FiveBet } from "@/lib/fived";
import { nowStamp, uidFromPhone } from "@/lib/format";
import { translate, type DictKey } from "@/lib/i18n";
import { k3Dice, k3Payout, k3Round } from "@/lib/k3";
import type { K3Bet } from "@/lib/k3";
import { depositAmountSchema, isPassword, isPhone, withdrawAmountSchema } from "@/lib/validation/auth";
import { getRound, payoutMultiplier, resultForPeriod } from "@/lib/wingo";
import type { WinGoBetValue } from "@/lib/wingo";
import { ApiError } from "@/lib/api/client";
import { notifyTokenExpired } from "@/lib/api/token";
import type { AppNotification, CmsPage, Session, StoredBet, Txn, User, WalletSnapshot } from "@/lib/api/models";
import { signinBonus } from "@/lib/daily-signin";
import { CONFIDENTIALITY_HTML } from "@/lib/confidentiality-agreement";
import { currentUser, getDb, rid, updateDb } from "./db";

function msg(key: DictKey) {
  return translate(getDb().lang, key);
}

function fail(status: number, key: DictKey): never {
  throw new ApiError(status, msg(key));
}

function needUser() {
  const user = currentUser();
  if (!user) {
    notifyTokenExpired();
    fail(401, "tokenExpired");
  }
  return user;
}

function walletOf(user: User): WalletSnapshot {
  return { balance: user.balance, thirdParty: user.thirdParty, hideBalance: user.hideBalance };
}

export function mockLogin(account: string, password: string): Session {
  if (!isPassword(password)) fail(400, "passwordShort");
  const key = account.trim().toLowerCase();
  const found = getDb().users.find(
    (u) =>
      u.password === password &&
      (u.phone === account.trim() || (u.email && u.email.toLowerCase() === key)),
  );
  if (!found) fail(401, "loginFailed");
  updateDb((p) => ({ ...p, currentPhone: found.phone }));
  return { token: `mock:${found.phone}`, user: found };
}

export function mockRegister(payload: {
  phone?: string;
  email?: string;
  password: string;
  invite?: string;
}): Session {
  const email = payload.email?.trim().toLowerCase();
  let phone = payload.phone?.trim() ?? "";
  if (email && !phone) {
    phone = String(1000000000 + (Math.abs([...email].reduce((a, c) => a + c.charCodeAt(0), 0)) % 9000000000));
  }
  if (!isPhone(phone)) fail(400, "phoneInvalid");
  if (!isPassword(payload.password)) fail(400, "passwordShort");
  const data = getDb();
  if (data.users.some((u) => u.phone === phone || (email && u.email === email))) fail(409, "loginFailed");
  const u: User = {
    phone,
    email,
    password: payload.password,
    nickname: email ? email.split("@")[0] : `Member${phone.slice(-4)}`,
    uid: uidFromPhone(phone),
    inviteCode: payload.invite?.trim() || phone.slice(-6),
    balance: 0,
    thirdParty: 0,
    hideBalance: false,
    usedGifts: [],
    lastCheckIn: null,
    checkStreak: 0,
    vipExp: 0,
  };
  updateDb((p) => ({ ...p, users: [...p.users, u], currentPhone: phone }));
  return { token: `mock:${phone}`, user: u };
}

export function mockLogout() {
  updateDb((p) => ({ ...p, currentPhone: null }));
}

export function mockResetPassword(account: string, password: string) {
  const key = account.trim().toLowerCase();
  const found = getDb().users.find(
    (u) => u.phone === account.trim() || (u.email && u.email.toLowerCase() === key),
  );
  if (!found) fail(404, "loginFailed");
  updateDb((p) => ({
    ...p,
    users: p.users.map((u) => (u.phone === found.phone ? { ...u, password } : u)),
  }));
}

export function mockMe(): User {
  return needUser();
}

export function mockWallet(): WalletSnapshot {
  return walletOf(needUser());
}

export function mockUpdateMe(patch: Partial<User>): User {
  const user = needUser();
  updateDb((p) => ({
    ...p,
    users: p.users.map((u) => (u.phone === user.phone ? { ...u, ...patch } : u)),
  }));
  return currentUser()!;
}

export function mockTxns(type?: "deposit" | "withdraw"): Txn[] {
  const user = needUser();
  return getDb()
    .txns.filter((x) => x.ownerPhone === user.phone && (!type || x.type === type));
}

export function mockBets(game?: "wingo" | "k3" | "5d" | "trx"): StoredBet[] {
  const user = needUser();
  return getDb()
    .bets.filter((b) => b.ownerPhone === user.phone && (!game || b.game === game));
}

export function mockNotifs(): AppNotification[] {
  needUser();
  return getDb().notifications;
}

export function mockMarkRead(): AppNotification[] {
  needUser();
  updateDb((p) => {
    if (p.notifications.every((n) => n.read)) return p;
    return {
      ...p,
      notifications: p.notifications.map((n) => (n.read ? n : { ...n, read: true })),
    };
  });
  return getDb().notifications;
}

export function mockDeposit(amount: number, method: string): { user: User; txn: Txn } {
  const user = needUser();
  if (!depositAmountSchema.safeParse(amount).success) fail(400, "minDeposit");
  const txn: Txn = {
    id: rid("D"),
    ownerPhone: user.phone,
    type: "deposit",
    amount,
    status: "completed",
    method,
    createdAt: nowStamp(),
  };
  updateDb((p) => ({
    ...p,
    txns: [txn, ...p.txns],
    users: p.users.map((u) =>
      u.phone === user.phone ? { ...u, balance: Number((u.balance + amount).toFixed(2)) } : u,
    ),
    notifications: [
      {
        id: rid("n"),
        title: "Deposit successful",
        body: `₹${amount} added to main wallet`,
        time: nowStamp(),
        read: false,
      },
      ...p.notifications,
    ],
  }));
  return { user: currentUser()!, txn };
}

export function mockWithdraw(amount: number, method: string): { user: User; txn: Txn } {
  const user = needUser();
  if (!withdrawAmountSchema.safeParse(amount).success) fail(400, "minWithdraw");
  if (amount > user.balance) fail(400, "insufficient");
  if (!user.upi && !user.bank) fail(400, "needBind");
  const txn: Txn = {
    id: rid("W"),
    ownerPhone: user.phone,
    type: "withdraw",
    amount,
    status: "pending",
    method,
    createdAt: nowStamp(),
  };
  updateDb((p) => ({
    ...p,
    txns: [txn, ...p.txns],
    users: p.users.map((u) =>
      u.phone === user.phone ? { ...u, balance: Number((u.balance - amount).toFixed(2)) } : u,
    ),
  }));
  return { user: currentUser()!, txn };
}

export function mockRecycle(): User {
  const user = needUser();
  updateDb((p) => ({
    ...p,
    users: p.users.map((u) =>
      u.phone === user.phone
        ? { ...u, balance: Number((u.balance + u.thirdParty).toFixed(2)), thirdParty: 0 }
        : u,
    ),
  }));
  return currentUser()!;
}

export function mockRedeemGift(code: string): User {
  const user = needUser();
  const c = code.trim().toUpperCase();
  const map: Record<string, number> = { KANPUR91: 20, WELCOME: 10, "91CLUB": 28 };
  if (!map[c] || user.usedGifts.includes(c)) fail(400, "giftBad");
  updateDb((p) => ({
    ...p,
    users: p.users.map((u) =>
      u.phone === user.phone
        ? { ...u, balance: Number((u.balance + map[c]).toFixed(2)), usedGifts: [...u.usedGifts, c] }
        : u,
    ),
  }));
  return currentUser()!;
}

export function mockCheckIn(): User {
  const user = needUser();
  const today = new Date().toISOString().slice(0, 10);
  if (user.lastCheckIn === today) fail(400, "alreadyChecked");
  const deposited = getDb().txns.some(
    (x) => x.ownerPhone === user.phone && x.type === "deposit" && x.status === "completed",
  );
  if (!deposited) fail(502, "signinDepositNeed");
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const streak = user.lastCheckIn === yesterday ? Math.min(user.checkStreak + 1, 7) : 1;
  const bonus = signinBonus(streak);
  updateDb((p) => ({
    ...p,
    users: p.users.map((u) =>
      u.phone === user.phone
        ? {
            ...u,
            lastCheckIn: today,
            checkStreak: streak,
            balance: Number((u.balance + bonus).toFixed(2)),
          }
        : u,
    ),
  }));
  return currentUser()!;
}

function debitBet(user: User, rec: StoredBet) {
  updateDb((p) => ({
    ...p,
    bets: [rec, ...p.bets],
    users: p.users.map((u) =>
      u.phone === user.phone
        ? { ...u, balance: Number((u.balance - rec.amount).toFixed(2)), vipExp: u.vipExp + rec.amount }
        : u,
    ),
  }));
  return { user: currentUser()!, bet: rec };
}

export function mockPlaceWinGo(
  interval: number,
  period: string,
  bet: WinGoBetValue,
  amount: number,
  game: "wingo" | "trx" = "wingo",
) {
  const user = needUser();
  if (amount <= 0) fail(400, "enterAmount");
  if (amount > user.balance) fail(400, "insufficient");
  const round = getRound(interval);
  if (round.period !== period || round.locked) fail(400, "bettingClosed");
  const label = bet.kind === "color" ? bet.value : bet.kind === "size" ? bet.value : `number ${bet.value}`;
  const rec: StoredBet = {
    id: rid("B"),
    ownerPhone: user.phone,
    game,
    interval,
    period,
    label,
    amount,
    status: "pending",
    payout: 0,
    createdAt: nowStamp(),
    payload: { game, bet },
  };
  return debitBet(user, rec);
}

export function mockPlaceK3(interval: number, period: string, bet: K3Bet, amount: number) {
  const user = needUser();
  if (amount > user.balance) fail(400, "insufficient");
  const round = k3Round(interval);
  if (round.period !== period || round.locked) fail(400, "bettingClosed");
  const rec: StoredBet = {
    id: rid("B"),
    ownerPhone: user.phone,
    game: "k3",
    interval,
    period,
    label: bet.kind === "sum" ? `sum ${bet.value}` : bet.value,
    amount,
    status: "pending",
    payout: 0,
    createdAt: nowStamp(),
    payload: { game: "k3", bet },
  };
  return debitBet(user, rec);
}

export function mockPlaceFiveD(interval: number, period: string, bet: FiveBet, amount: number) {
  const user = needUser();
  if (amount > user.balance) fail(400, "insufficient");
  const round = fiveRound(interval);
  if (round.period !== period || round.locked) fail(400, "bettingClosed");
  const rec: StoredBet = {
    id: rid("B"),
    ownerPhone: user.phone,
    game: "5d",
    interval,
    period,
    label: `${bet.pos} ${bet.kind === "number" ? bet.value : bet.value}`,
    amount,
    status: "pending",
    payout: 0,
    createdAt: nowStamp(),
    payload: { game: "5d", bet },
  };
  return debitBet(user, rec);
}

export function mockSettleDue() {
  const prev = getDb();
  if (!prev.currentPhone || !prev.bets.some((b) => b.status === "pending")) {
    return { changed: false as const, user: currentUser(), bets: mockBets() };
  }
  let users = prev.users;
  let changed = false;
  const bets = prev.bets.map((b) => {
    if (b.status !== "pending") return b;
    const now = Date.now();
    let done = false;
    let winMul = 0;
    if (b.payload.game === "wingo" || b.payload.game === "trx") {
      const cur = getRound(b.interval, now);
      if (cur.period === b.period) return b;
      winMul = payoutMultiplier(b.payload.bet, resultForPeriod(b.period));
      done = true;
    } else if (b.payload.game === "k3") {
      const cur = k3Round(b.interval, now);
      if (cur.period === b.period) return b;
      winMul = k3Payout(b.payload.bet, k3Dice(b.period));
      done = true;
    } else {
      const cur = fiveRound(b.interval, now);
      if (cur.period === b.period) return b;
      winMul = fivePayout(b.payload.bet, fiveDigits(b.period));
      done = true;
    }
    if (!done) return b;
    changed = true;
    const payout = Number((b.amount * winMul).toFixed(2));
    const status: StoredBet["status"] = winMul > 0 ? "win" : "lose";
    if (payout > 0) {
      const owner = b.ownerPhone || prev.currentPhone;
      users = users.map((u) =>
        u.phone === owner
          ? { ...u, balance: Number((u.balance + payout).toFixed(2)), vipExp: u.vipExp + b.amount }
          : u,
      );
    }
    return { ...b, status, payout };
  });
  if (!changed) return { changed: false as const, user: currentUser(), bets: mockBets() };
  updateDb((p) => ({ ...p, users, bets }));
  return { changed: true as const, user: currentUser(), bets: mockBets() };
}

export function mockCmsPage(slug: string): CmsPage {
  const lang = getDb().lang;
  if (slug === "confidentiality") {
    return {
      slug,
      title: translate(lang, "confidentialityAgreement"),
      html: CONFIDENTIALITY_HTML,
    };
  }
  if (slug === "privacy") {
    const blocks = ["userAgreement", "riskP1", "riskP2", "riskP3", "riskP4", "riskP5"] as const;
    return {
      slug,
      title: translate(lang, "riskDisclosure"),
      html: blocks.map((k) => `<p>${translate(lang, k)}</p>`).join(""),
    };
  }
  fail(404, "comingSoon");
}
