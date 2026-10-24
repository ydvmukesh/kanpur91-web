import type { FiveBet } from "@/lib/fived";
import type { K3Bet } from "@/lib/k3";
import type { WinGoBetValue } from "@/lib/wingo";

export type Txn = {
  id: string;
  ownerPhone: string;
  type: "deposit" | "withdraw";
  amount: number;
  status: "pending" | "completed" | "rejected";
  method: string;
  createdAt: string;
  remark?: string;
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
  ownerPhone: string;
  payload:
    | { game: "wingo"; bet: WinGoBetValue }
    | { game: "k3"; bet: K3Bet }
    | { game: "5d"; bet: FiveBet }
    | { game: "trx"; bet: WinGoBetValue };
};

export type BankAccount = {
  id: string;
  holder: string;
  account: string;
  ifsc: string;
  bankName: string;
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
  banks?: BankAccount[];
  selectedBankId?: string;
  bank?: BankAccount;
};

export type WalletSnapshot = {
  balance: number;
  thirdParty: number;
  hideBalance: boolean;
};

export type AppNotification = {
  id: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
};

export type Session = {
  token: string;
  user: User;
};
