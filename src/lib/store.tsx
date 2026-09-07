"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { DictKey, Lang } from "./i18n";
import { dict } from "./i18n";
import { formatPeriod, getRound, payoutMultiplier, resultForPeriod } from "./wingo";
import type { WinGoBetValue } from "./wingo";
import { k3Dice, k3Payout, k3Period, k3Round } from "./k3";
import type { K3Bet } from "./k3";
import { fiveDigits, fivePayout, fivePeriod, fiveRound } from "./fived";
import type { FiveBet } from "./fived";
import { nowStamp, uidFromPhone } from "./format";

export type Txn = {
  id: string;
  type: "deposit" | "withdraw";
  amount: number;
  status: "pending" | "completed" | "rejected";
  method: string;
  createdAt: string;
};

export type BetRecord = {
  id: string;
  game: "wingo" | "k3" | "5d" | "trx";
  interval: number;
  period: string;
  label: string;
  amount: number;
  status: "pending" | "win" | "lose";
  payout: number;
  createdAt: string;
  settle?: () => void;
};

export type StoredBet = Omit<BetRecord, "settle"> & {
  payload:
    | { game: "wingo"; bet: WinGoBetValue }
    | { game: "k3"; bet: K3Bet }
    | { game: "5d"; bet: FiveBet }
    | { game: "trx"; bet: WinGoBetValue };
};

export type User = {
  phone: string;
  email?: string;
  password: string;
  nickname: string;
  uid: string;
  inviteCode: string;
  balance: number;
  thirdParty: number;
  hideBalance: boolean;
  usedGifts: string[];
  lastCheckIn: string | null;
  checkStreak: number;
  vipExp: number;
  upi?: string;
  bank?: {
    holder: string;
    account: string;
    ifsc: string;
    bankName: string;
  };
};

type Persist = {
  lang: Lang;
  remember: boolean;
  users: User[];
  currentPhone: string | null;
  bets: StoredBet[];
  txns: Txn[];
  notifications: { id: string; title: string; body: string; time: string; read: boolean }[];
};

const KEY = "kanpur91-store-v1";

export const DEMO_LOGIN = {
  phone: "9876543210",
  email: "demo@kanpur91.com",
  password: "123456",
};

function demoUser(): User {
  return {
    phone: DEMO_LOGIN.phone,
    email: DEMO_LOGIN.email,
    password: DEMO_LOGIN.password,
    nickname: "Demo",
    uid: uidFromPhone(DEMO_LOGIN.phone),
    inviteCode: DEMO_LOGIN.phone.slice(-6),
    balance: 10000,
    thirdParty: 0,
    hideBalance: false,
    usedGifts: [],
    lastCheckIn: null,
    checkStreak: 0,
    vipExp: 0,
  };
}

function withDemo(p: Persist): Persist {
  if (p.users.some((u) => u.phone === DEMO_LOGIN.phone)) return p;
  return { ...p, users: [demoUser(), ...p.users] };
}

const defaultNotifs = [
  {
    id: "n1",
    title: "Welcome to 91 Club",
    body: "Deposit to start playing Win Go, K3 and 5D.",
    time: nowStamp(),
    read: false,
  },
];

function load(): Persist {
  if (typeof window === "undefined") {
    return {
      lang: "en",
      remember: true,
      users: [],
      currentPhone: null,
      bets: [],
      txns: [],
      notifications: defaultNotifs,
    };
  }
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      return withDemo({
        lang: "en",
        remember: true,
        users: [],
        currentPhone: null,
        bets: [],
        txns: [],
        notifications: defaultNotifs,
      });
    }
    return withDemo(JSON.parse(raw) as Persist);
  } catch {
    return withDemo({
      lang: "en",
      remember: true,
      users: [],
      currentPhone: null,
      bets: [],
      txns: [],
      notifications: defaultNotifs,
    });
  }
}

function rid(prefix: string) {
  return `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
}

type Toast = { id: string; text: string } | null;

type StoreApi = {
  hydrated: boolean;
  lang: Lang;
  t: (key: DictKey) => string;
  setLang: (lang: Lang) => void;
  user: User | null;
  remember: boolean;
  setRemember: (v: boolean) => void;
  toast: Toast;
  showToast: (text: string) => void;
  bets: StoredBet[];
  txns: Txn[];
  notifications: Persist["notifications"];
  login: (account: string, password: string) => string | null;
  register: (payload: {
    phone?: string;
    email?: string;
    password: string;
    invite?: string;
  }) => string | null;
  logout: () => void;
  resetPassword: (account: string, password: string) => string | null;
  updateUser: (patch: Partial<User>) => void;
  deposit: (amount: number, method: string) => string | null;
  withdraw: (amount: number, method: string) => string | null;
  recycle: () => void;
  redeemGift: (code: string) => string | null;
  checkIn: () => string | null;
  placeWinGo: (interval: number, period: string, bet: WinGoBetValue, amount: number, game?: "wingo" | "trx") => string | null;
  placeK3: (interval: number, period: string, bet: K3Bet, amount: number) => string | null;
  placeFiveD: (interval: number, period: string, bet: FiveBet, amount: number) => string | null;
  settleDue: () => void;
  markRead: () => void;
};

const Ctx = createContext<StoreApi | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<Persist | null>(null);
  const [toast, setToast] = useState<Toast>(null);

  useEffect(() => {
    setData(load());
  }, []);

  useEffect(() => {
    if (!data) return;
    localStorage.setItem(KEY, JSON.stringify(data));
  }, [data]);

  const showToast = useCallback((text: string) => {
    const id = rid("t");
    setToast({ id, text });
    window.setTimeout(() => {
      setToast((cur) => (cur?.id === id ? null : cur));
    }, 2200);
  }, []);

  const persist = useCallback((updater: (prev: Persist) => Persist) => {
    setData((prev) => {
      if (!prev) return prev;
      const next = updater(prev);
      return next === prev ? prev : next;
    });
  }, []);

  const user = useMemo(() => {
    if (!data?.currentPhone) return null;
    return data.users.find((u) => u.phone === data.currentPhone) ?? null;
  }, [data]);

  const t = useCallback(
    (key: DictKey) => dict[data?.lang ?? "en"][key],
    [data?.lang],
  );

  const patchUser = useCallback(
    (phone: string, fn: (u: User) => User) => {
      persist((prev) => ({
        ...prev,
        users: prev.users.map((u) => (u.phone === phone ? fn(u) : u)),
      }));
    },
    [persist],
  );

  const settleDue = useCallback(() => {
    persist((prev) => {
      if (!prev.currentPhone) return prev;
      if (!prev.bets.some((b) => b.status === "pending")) return prev;
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
          const number = resultForPeriod(b.period);
          winMul = payoutMultiplier(b.payload.bet, number);
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
          users = users.map((u) =>
            u.phone === prev.currentPhone
              ? { ...u, balance: Number((u.balance + payout).toFixed(2)), vipExp: u.vipExp + b.amount }
              : u,
          );
        }
        return { ...b, status, payout };
      });
      if (!changed) return prev;
      return { ...prev, users, bets };
    });
  }, [persist]);

  const markRead = useCallback(() => {
    persist((p) => {
      if (p.notifications.every((n) => n.read)) return p;
      return {
        ...p,
        notifications: p.notifications.map((n) => (n.read ? n : { ...n, read: true })),
      };
    });
  }, [persist]);

  const api: StoreApi = {
    hydrated: Boolean(data),
    lang: data?.lang ?? "en",
    t,
    setLang: (lang) => persist((p) => ({ ...p, lang })),
    user,
    remember: data?.remember ?? true,
    setRemember: (v) => persist((p) => ({ ...p, remember: v })),
    toast,
    showToast,
    bets: data?.bets ?? [],
    txns: data?.txns ?? [],
    notifications: data?.notifications ?? [],
    login: (account, password) => {
      if (!data) return "wait";
      const key = account.trim().toLowerCase();
      const found = data.users.find(
        (u) =>
          u.password === password &&
          (u.phone === account.trim() || (u.email && u.email.toLowerCase() === key)),
      );
      if (!found) return t("loginFailed");
      persist((p) => ({ ...p, currentPhone: found.phone }));
      return null;
    },
    register: (payload) => {
      if (!data) return "wait";
      const email = payload.email?.trim().toLowerCase();
      let phone = payload.phone?.trim() ?? "";
      if (email && !phone) {
        phone = String(1000000000 + (Math.abs([...email].reduce((a, c) => a + c.charCodeAt(0), 0)) % 9000000000));
      }
      if (!/^\d{10}$/.test(phone)) return t("phoneInvalid");
      if (payload.password.length < 6) return t("passwordShort");
      if (data.users.some((u) => u.phone === phone || (email && u.email === email))) return t("loginFailed");
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
      persist((p) => ({
        ...p,
        users: [...p.users, u],
        currentPhone: phone,
      }));
      return null;
    },
    logout: () => persist((p) => ({ ...p, currentPhone: null })),
    resetPassword: (account, password) => {
      const key = account.trim().toLowerCase();
      const found = data?.users.find(
        (u) => u.phone === account.trim() || (u.email && u.email.toLowerCase() === key),
      );
      if (!found) return t("loginFailed");
      persist((p) => ({
        ...p,
        users: p.users.map((u) => (u.phone === found.phone ? { ...u, password } : u)),
      }));
      return null;
    },
    updateUser: (patch) => {
      if (!user) return;
      patchUser(user.phone, (u) => ({ ...u, ...patch }));
    },
    deposit: (amount, method) => {
      if (!user) return t("loginFailed");
      if (amount < 100) return t("minDeposit");
      const txn: Txn = {
        id: rid("D"),
        type: "deposit",
        amount,
        status: "completed",
        method,
        createdAt: nowStamp(),
      };
      persist((p) => ({
        ...p,
        txns: [txn, ...p.txns],
        users: p.users.map((u) =>
          u.phone === user.phone
            ? { ...u, balance: Number((u.balance + amount).toFixed(2)) }
            : u,
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
      return null;
    },
    withdraw: (amount, method) => {
      if (!user) return t("loginFailed");
      if (amount < 110) return t("minWithdraw");
      if (amount > user.balance) return t("insufficient");
      if (!user.upi && !user.bank) return t("needBind");
      const txn: Txn = {
        id: rid("W"),
        type: "withdraw",
        amount,
        status: "pending",
        method,
        createdAt: nowStamp(),
      };
      persist((p) => ({
        ...p,
        txns: [txn, ...p.txns],
        users: p.users.map((u) =>
          u.phone === user.phone
            ? { ...u, balance: Number((u.balance - amount).toFixed(2)) }
            : u,
        ),
      }));
      return null;
    },
    recycle: () => {
      if (!user) return;
      persist((p) => ({
        ...p,
        users: p.users.map((u) =>
          u.phone === user.phone
            ? { ...u, balance: Number((u.balance + u.thirdParty).toFixed(2)), thirdParty: 0 }
            : u,
        ),
      }));
    },
    redeemGift: (code) => {
      if (!user) return t("loginFailed");
      const c = code.trim().toUpperCase();
      const map: Record<string, number> = { KANPUR91: 20, WELCOME: 10, "91CLUB": 28 };
      if (!map[c] || user.usedGifts.includes(c)) return t("giftBad");
      persist((p) => ({
        ...p,
        users: p.users.map((u) =>
          u.phone === user.phone
            ? {
                ...u,
                balance: Number((u.balance + map[c]).toFixed(2)),
                usedGifts: [...u.usedGifts, c],
              }
            : u,
        ),
      }));
      return null;
    },
    checkIn: () => {
      if (!user) return t("loginFailed");
      const today = new Date().toISOString().slice(0, 10);
      if (user.lastCheckIn === today) return t("alreadyChecked");
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      const streak = user.lastCheckIn === yesterday ? Math.min(user.checkStreak + 1, 7) : 1;
      const bonus = [0, 5, 10, 15, 20, 25, 30, 50][streak];
      persist((p) => ({
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
      return null;
    },
    placeWinGo: (interval, period, bet, amount, game = "wingo") => {
      if (!user) return t("loginFailed");
      if (amount <= 0) return t("enterAmount");
      if (amount > user.balance) return t("insufficient");
      const round = getRound(interval);
      if (round.period !== period || round.locked) return t("bettingClosed");
      const label =
        bet.kind === "color"
          ? bet.value
          : bet.kind === "size"
            ? bet.value
            : `number ${bet.value}`;
      const rec: StoredBet = {
        id: rid("B"),
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
      persist((p) => ({
        ...p,
        bets: [rec, ...p.bets],
        users: p.users.map((u) =>
          u.phone === user.phone
            ? { ...u, balance: Number((u.balance - amount).toFixed(2)), vipExp: u.vipExp + amount }
            : u,
        ),
      }));
      return null;
    },
    placeK3: (interval, period, bet, amount) => {
      if (!user) return t("loginFailed");
      if (amount > user.balance) return t("insufficient");
      const round = k3Round(interval);
      if (round.period !== period || round.locked) return t("bettingClosed");
      const label = bet.kind === "sum" ? `sum ${bet.value}` : bet.value;
      const rec: StoredBet = {
        id: rid("B"),
        game: "k3",
        interval,
        period,
        label,
        amount,
        status: "pending",
        payout: 0,
        createdAt: nowStamp(),
        payload: { game: "k3", bet },
      };
      persist((p) => ({
        ...p,
        bets: [rec, ...p.bets],
        users: p.users.map((u) =>
          u.phone === user.phone
            ? { ...u, balance: Number((u.balance - amount).toFixed(2)), vipExp: u.vipExp + amount }
            : u,
        ),
      }));
      return null;
    },
    placeFiveD: (interval, period, bet, amount) => {
      if (!user) return t("loginFailed");
      if (amount > user.balance) return t("insufficient");
      const round = fiveRound(interval);
      if (round.period !== period || round.locked) return t("bettingClosed");
      const label = `${bet.pos} ${bet.kind === "number" ? bet.value : bet.value}`;
      const rec: StoredBet = {
        id: rid("B"),
        game: "5d",
        interval,
        period,
        label,
        amount,
        status: "pending",
        payout: 0,
        createdAt: nowStamp(),
        payload: { game: "5d", bet },
      };
      persist((p) => ({
        ...p,
        bets: [rec, ...p.bets],
        users: p.users.map((u) =>
          u.phone === user.phone
            ? { ...u, balance: Number((u.balance - amount).toFixed(2)), vipExp: u.vipExp + amount }
            : u,
        ),
      }));
      return null;
    },
    settleDue,
    markRead,
  };

  // keep period formatter referenced so tree-shaking doesn't drop used helpers in some builds
  void formatPeriod;
  void k3Period;
  void fivePeriod;

  if (!data) {
    return (
      <div className="min-h-dvh bg-main-y text-white flex items-center justify-center">
        <div className="h-10 w-10 rounded-full border-2 border-white/30 border-t-white animate-spin" />
      </div>
    );
  }

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useStore outside provider");
  return ctx;
}
