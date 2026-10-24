import type { QueryClient } from "@tanstack/react-query";
import { qk } from "@/lib/api/keys";
import type { StoredBet, Txn, User } from "@/lib/api/models";

export function writeUserCache(qc: QueryClient, user: User | null) {
  qc.setQueryData(qk.me, user);
  if (user) {
    qc.setQueryData(qk.wallet, {
      balance: user.balance,
      thirdParty: user.thirdParty,
      hideBalance: user.hideBalance,
    });
  } else {
    qc.removeQueries({ queryKey: qk.wallet });
  }
}

export function writeBetsCache(qc: QueryClient, bets: StoredBet[], game?: StoredBet["game"]) {
  if (game) {
    qc.setQueryData(qk.bets(game), bets);
    const all = qc.getQueryData<StoredBet[]>(qk.bets()) ?? [];
    qc.setQueryData(
      qk.bets(),
      [...bets, ...all.filter((b) => b.game !== game)].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)),
    );
    return;
  }
  qc.setQueryData(qk.bets(), bets);
  for (const g of ["wingo", "k3", "5d", "trx"] as const) {
    qc.setQueryData(
      qk.bets(g),
      bets.filter((b) => b.game === g),
    );
  }
}

export function prependTxn(qc: QueryClient, txn: Txn) {
  const keys = [qk.txns(), qk.txns(txn.type)] as const;
  for (const key of keys) {
    const cur = qc.getQueryData<Txn[]>(key);
    if (cur) qc.setQueryData(key, [txn, ...cur.filter((x) => x.id !== txn.id)]);
  }
}

export function errMsg(e: unknown) {
  if (e instanceof Error && e.message) return e.message;
  return "Error";
}
