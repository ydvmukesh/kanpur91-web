export const qk = {
  me: ["me"] as const,
  wallet: ["wallet"] as const,
  txns: (type?: "deposit" | "withdraw") => ["txns", type ?? "all"] as const,
  bets: (game?: "wingo" | "k3" | "5d" | "trx" | "all") => ["bets", game ?? "all"] as const,
  notifs: ["notifications"] as const,
};
