export type SigninRecord = {
  id: string;
  amount: number;
  time: string;
};

export const SIGNIN_RECORDS: SigninRecord[] = [];

export const SIGNIN_DAYS = [
  { day: 1, need: 200, amount: 5 },
  { day: 2, need: 1000, amount: 18 },
  { day: 3, need: 3000, amount: 100 },
  { day: 4, need: 10000, amount: 200 },
  { day: 5, need: 20000, amount: 400 },
  { day: 6, need: 100000, amount: 3000 },
  { day: 7, need: 200000, amount: 7000 },
] as const;

export function signinBonus(streak: number) {
  return SIGNIN_DAYS[Math.min(Math.max(streak, 1), 7) - 1]?.amount ?? 0;
}

export function signinAccumulated(streak: number) {
  return SIGNIN_DAYS.slice(0, Math.max(0, streak)).reduce((sum, row) => sum + row.amount, 0);
}
