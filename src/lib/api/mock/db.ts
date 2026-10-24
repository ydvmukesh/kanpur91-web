import { nowStamp, uidFromPhone } from "@/lib/format";
import type { Lang } from "@/lib/i18n";
import type { AppNotification, StoredBet, Txn, User } from "@/lib/api/models";

export type Persist = {
  lang: Lang;
  remember: boolean;
  users: User[];
  currentPhone: string | null;
  bets: StoredBet[];
  txns: Txn[];
  notifications: AppNotification[];
};

export const STORE_KEY = "kanpur91-store-v1";

export const DEMO_LOGIN = {
  phone: "9876543210",
  email: "demo@kanpur91.com",
  password: "123456",
};

const defaultNotifs: AppNotification[] = [
  {
    id: "n1",
    title: "Welcome to 91 Club",
    body: "Deposit to start playing Win Go, K3 and 5D.",
    time: nowStamp(),
    read: false,
  },
];

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
    bank: {
      id: "bk-demo",
      holder: "Mahi",
      account: "7676671234899",
      ifsc: "KKBK00025722",
      bankName: "Kotak Mahindra Bank",
    },
    banks: [
      {
        id: "bk-demo",
        holder: "Mahi",
        account: "7676671234899",
        ifsc: "KKBK00025722",
        bankName: "Kotak Mahindra Bank",
      },
    ],
    selectedBankId: "bk-demo",
  };
}

function empty(): Persist {
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

function demoWithdraws(): Txn[] {
  return [
    {
      id: "WD202607281859030210448593gg",
      ownerPhone: DEMO_LOGIN.phone,
      type: "withdraw",
      amount: 249,
      status: "rejected",
      method: "BANKCARD",
      createdAt: "2026-07-28 18:59:03",
      remark: "[Withdrawal failed] Your withdrawal was rejected. Please contact your upline for assistance.",
    },
    {
      id: "WD202605231144788638566ff",
      ownerPhone: DEMO_LOGIN.phone,
      type: "withdraw",
      amount: 110,
      status: "completed",
      method: "BANKCARD",
      createdAt: "2026-05-23 11:44:17",
    },
  ];
}

function withDemo(p: Persist): Persist {
  let next = p.users.some((u) => u.phone === DEMO_LOGIN.phone) ? p : { ...p, users: [demoUser(), ...p.users] };
  const missing = demoWithdraws().filter((row) => !next.txns.some((x) => x.id === row.id));
  if (missing.length) next = { ...next, txns: [...missing, ...next.txns] };
  return next;
}

function migrate(p: Persist): Persist {
  const fallback = p.currentPhone ?? DEMO_LOGIN.phone;
  const demoBank = demoUser().bank;
  return {
    ...p,
    users: p.users.map((u) => {
      let next = u;
      if (u.phone === DEMO_LOGIN.phone && !u.bank && demoBank) next = { ...next, bank: demoBank };
      if (next.bank && !next.banks?.length) {
        const card = { ...next.bank, id: next.bank.id || "legacy" };
        next = { ...next, banks: [card], selectedBankId: card.id, bank: card };
      }
      return next;
    }),
    bets: p.bets.map((b) => ({ ...b, ownerPhone: b.ownerPhone || fallback })),
    txns: p.txns.map((x) => ({ ...x, ownerPhone: x.ownerPhone || fallback })),
  };
}

let db: Persist = empty();
let ready = false;
const listeners = new Set<(next: Persist) => void>();

export function hydrateDb() {
  if (ready) return db;
  ready = true;
  if (typeof window === "undefined") {
    db = empty();
    return db;
  }
  try {
    const raw = window.localStorage.getItem(STORE_KEY);
    db = raw ? migrate(withDemo(JSON.parse(raw) as Persist)) : withDemo(empty());
  } catch {
    db = withDemo(empty());
  }
  return db;
}

export function getDb() {
  if (!ready) hydrateDb();
  return db;
}

export function updateDb(fn: (prev: Persist) => Persist) {
  const prev = getDb();
  const next = fn(prev);
  if (next === prev) return prev;
  db = next;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORE_KEY, JSON.stringify(db));
  }
  listeners.forEach((l) => l(db));
  return db;
}

export function subscribeDb(fn: (next: Persist) => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export function currentUser() {
  const p = getDb();
  if (!p.currentPhone) return null;
  return p.users.find((u) => u.phone === p.currentPhone) ?? null;
}

export function rid(prefix: string) {
  return `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
}
