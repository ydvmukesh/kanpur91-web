import type { BankAccount, User } from "@/lib/api/models";

export function listBanks(user: User): BankAccount[] {
  if (user.banks?.length) return user.banks;
  if (user.bank) return [{ ...user.bank, id: user.bank.id || "legacy" }];
  return [];
}

export function selectedBank(user: User): BankAccount | undefined {
  const all = listBanks(user);
  return all.find((b) => b.id === user.selectedBankId) ?? user.bank ?? all[0];
}

export const BANKS = [
  "Bank of Baroda",
  "Union Bank of India",
  "Central Bank of India",
  "Yes Bank",
  "HDFC Bank",
  "Karnataka Bank",
  "Standard Chartered Bank",
  "IDBI Bank",
  "Bank of India",
  "Punjab National Bank",
  "ICICI Bank",
  "Kotak Mahindra Bank",
  "State Bank of India",
  "Axis Bank",
  "Canara Bank",
  "Indian Bank",
  "Indian Overseas Bank",
  "UCO Bank",
  "Bank of Maharashtra",
  "Federal Bank",
  "IndusInd Bank",
] as const;
