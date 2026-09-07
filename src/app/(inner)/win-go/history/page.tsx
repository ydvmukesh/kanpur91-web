"use client";

import { Suspense } from "react";
import { WinGoHistoryDetail } from "@/components/games/WinGoHistoryDetail";

export default function WinGoHistoryPage() {
  return (
    <Suspense>
      <WinGoHistoryDetail />
    </Suspense>
  );
}
