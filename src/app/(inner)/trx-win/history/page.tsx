"use client";

import { Suspense } from "react";
import { WinGoHistoryDetail } from "@/components/games/WinGoHistoryDetail";

export default function TrxWinHistoryPage() {
  return (
    <Suspense>
      <WinGoHistoryDetail trx />
    </Suspense>
  );
}
