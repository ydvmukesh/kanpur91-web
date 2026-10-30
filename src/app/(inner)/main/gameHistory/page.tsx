"use client";

import { useState } from "react";
import { ChevronDown, Fish, Gamepad2 } from "lucide-react";
import { IconLaundryTab } from "@/components/Icons";
import { InnerShell } from "@/components/layout/InnerShell";
import { ChipPickSheet, DateSelect, EmptyState, ScrollTabs } from "@/components/ui";
import { useI18n } from "@/hooks/useI18n";
import { cn } from "@/lib/cn";
import {
  defaultPick,
  GAME_HISTORY_PICKS,
  type GameHistoryPick,
  type GameHistoryTab,
} from "@/lib/game-history";

function PickMark({ item, on }: { item: GameHistoryPick; on: boolean }) {
  if (item.mark === "all") {
    return <IconLaundryTab name="all" className={cn("h-6 w-6 shrink-0", on ? "text-white" : "text-main")} />;
  }
  if (item.mark === "kool") {
    return (
      <span className={cn("shrink-0 text-10 font-bold tracking-tight", on ? "text-white" : "text-muted")}>
        KOOLBET
      </span>
    );
  }
  if (item.mark === "365") {
    return (
      <span className={cn("shrink-0 text-sm font-bold", on ? "text-white" : "text-blue-norm")}>365</span>
    );
  }
  return null;
}

export default function GameHistoryPage() {
  const { t } = useI18n();
  const [tab, setTab] = useState<GameHistoryTab>("lottery");
  const [game, setGame] = useState(defaultPick("lottery"));
  const [date, setDate] = useState("");
  const [gameOpen, setGameOpen] = useState(false);
  const picks = GAME_HISTORY_PICKS[tab];
  const current = picks.find((g) => g.id === game) ?? picks[0];

  function changeTab(next: GameHistoryTab) {
    setTab(next);
    setGame(defaultPick(next));
    setGameOpen(false);
  }

  return (
    <>
    <InnerShell
      title={t("betHistory")}
      variant="light"
      headerExtra={
        <div className="bg-page px-3 pb-3 pt-2">
          <ScrollTabs
            value={tab}
            onChange={changeTab}
            items={[
              { id: "lottery", label: t("lottery"), icon: <IconLaundryTab name="lottery" /> },
              { id: "casino", label: t("casino"), icon: <IconLaundryTab name="video" /> },
              { id: "fishing", label: t("fishing"), icon: <Fish className="h-6 w-6 shrink-0" /> },
              { id: "rummy", label: t("rummy"), icon: <IconLaundryTab name="lottery" /> },
              { id: "original", label: t("original"), icon: <Gamepad2 className="h-6 w-6 shrink-0" /> },
            ]}
          />
          <div className="mt-2.5 grid grid-cols-2 gap-2">
            <button
              type="button"
              className="flex h-11 items-center justify-between gap-2 rounded-lg bg-white px-3 text-left text-sm text-ink"
              onClick={() => setGameOpen(true)}
            >
              <span className="min-w-0 truncate">{t(current.labelKey)}</span>
              <ChevronDown className="h-5 w-5 shrink-0 text-muted" />
            </button>
            <DateSelect value={date} onChange={setDate} calendar={false} />
          </div>
        </div>
      }
    >
      <EmptyState />
    </InnerShell>
      <ChipPickSheet
        open={gameOpen}
        value={current.id}
        onClose={() => setGameOpen(false)}
        onChange={setGame}
        items={picks.map((item) => ({
          id: item.id,
          label: t(item.labelKey),
          leading: item.mark ? <PickMark item={item} on={item.id === current.id} /> : undefined,
        }))}
      />
    </>
  );
}
