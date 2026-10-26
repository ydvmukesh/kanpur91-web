"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Swiper from "swiper";
import "swiper/css";
import { Database, Gem, Heart } from "lucide-react";
import { IconBack, IconRuleHead } from "@/components/Icons";
import { Button, UnderlineTabs } from "@/components/ui";
import { useAuth } from "@/hooks/useAuth";
import { useI18n } from "@/hooks/useI18n";
import { IMG, ImgIcon } from "@/lib/img";
import { VIP_LEVELS, vipFromExp, vipHistoryRows, type VipLevel } from "@/lib/vip";

const PAYOUT_DAYS = 6;

export default function VipPage() {
  const { t } = useI18n();
  const { user } = useAuth();
  const router = useRouter();
  if (!user) return null;
  const exp = user.vipExp;
  const current = vipFromExp(exp);

  return (
    <div className="flex h-full min-h-0 flex-col bg-page pb-safe-b">
      <div className="shrink-0 z-30 bg-main-x text-white pt-safe-t">
        <div className="relative flex h-12 w-full items-center justify-between px-3">
          <button
            type="button"
            className="relative z-10 h-8 w-8 grid place-items-center"
            onClick={() => router.back()}
            aria-label="Back"
          >
            <IconBack />
          </button>
          <div className="pointer-events-none absolute inset-0 grid place-items-center">
            <div className="text-lg font-medium">{t("vip")}</div>
          </div>
          <span className="h-8 w-8" />
        </div>
      </div>

      <div className="phone-scroll flex-1 min-h-0 overflow-y-auto">
        <div className="flex min-h-[calc(11rem-3rem)] w-full items-center bg-main-x text-white px-3 pt-1 pb-14">
          <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full bg-white">
            <ImgIcon src={IMG.vipAvatar} alt="" className="h-full w-full object-cover" />
          </div>
          <div className="ml-3 min-w-0">
            <ImgIcon src={IMG.vipBadge0} alt={`VIP${current}`} className="h-6 w-auto" />
            <h3 className="mt-2 truncate text-base font-medium leading-none">{user.nickname}</h3>
          </div>
        </div>

        <div className="-mt-10 px-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-white py-2 text-center">
              <p className="text-sm font-semibold text-main">{exp} EXP</p>
              <p className="mt-1.5 text-11 text-muted">{t("myExperience")}</p>
            </div>
            <div className="rounded-lg bg-white py-2 text-center">
              <p className="text-sm font-semibold text-main">{t("days", { n: PAYOUT_DAYS })}</p>
              <p className="mt-1.5 text-11 text-muted">{t("payoutTime")}</p>
            </div>
          </div>
        </div>
        <p className="mx-3 mt-3 mb-6 rounded-lg bg-white px-3 py-2.5 text-center text-11 leading-snug text-muted">
          {t("vipSettleNote")}
        </p>
        <VipLevelSwipe exp={exp} current={current} />
        <VipHistoryRules />
      </div>
    </div>
  );
}

function VipLevelSwipe({ exp, current }: { exp: number; current: number }) {
  const root = useRef<HTMLDivElement>(null);
  const start = VIP_LEVELS.find((row) => row.n > 0 && exp < row.need)?.n ?? Math.max(1, current);
  const [active, setActive] = useState(start);
  const row = VIP_LEVELS.find((x) => x.n === active) ?? VIP_LEVELS[1];

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const swiper = new Swiper(el, {
      slidesPerView: "auto",
      centeredSlides: true,
      spaceBetween: 20,
      grabCursor: true,
      speed: 450,
      resistanceRatio: 0.65,
      initialSlide: Math.max(0, start - 1),
      on: {
        slideChange(s) {
          setActive((s.activeIndex ?? 0) + 1);
        },
      },
    });
    return () => {
      swiper.destroy(true, true);
    };
  }, [start]);

  return (
    <>
      <div ref={root} className="swiper mt-3 w-full overflow-hidden">
        <div className="swiper-wrapper">
          {VIP_LEVELS.filter((x) => x.n > 0).map((x) => (
            <div key={x.n} className="swiper-slide !h-[10.5rem] !w-[17.875rem]">
              <VipLevelCard row={x} exp={exp} />
            </div>
          ))}
        </div>
      </div>
      <VipBenefits row={row} />
    </>
  );
}

function VipBenefits({ row }: { row: VipLevel }) {
  const { t } = useI18n();
  return (
    <div className="mx-3 mt-4 rounded-lg bg-white px-3 py-3.5">
      <div className="flex items-center gap-1.5 border-b border-gray-200 pb-3">
        <Gem className="h-4 w-4 text-main" strokeWidth={2.2} />
        <h2 className="text-base font-bold text-ink">{t("benefitsLevel", { n: row.n })}</h2>
      </div>

      <BenefitRow
        icon={IMG.vipLevelUp}
        title={t("levelUpRewards")}
        hint={t("receiveOnce")}
        chips={[
          { tone: "orange", icon: "wallet", value: String(row.upReward) },
          { tone: "red", icon: "heart", value: "0" },
        ]}
      />
      <BenefitRow
        icon={IMG.vipMonthly}
        title={t("monthlyReward")}
        hint={t("receiveOnceMonth")}
        chips={[
          { tone: "orange", icon: "wallet", value: String(row.monthly) },
          { tone: "red", icon: "heart", value: "0" },
        ]}
      />
      <BenefitRow
        icon={IMG.vipRebate}
        title={t("rebateRate")}
        hint={t("rebateHint")}
        chips={[{ tone: "red", icon: "coins", value: `${row.rebate}%` }]}
      />
    </div>
  );
}

function BenefitRow({
  icon,
  title,
  hint,
  chips,
}: {
  icon: string;
  title: string;
  hint: string;
  chips: { tone: "orange" | "red"; icon: "wallet" | "heart" | "coins"; value: string }[];
}) {
  return (
    <div className="mt-3 flex items-center gap-2.5">
      <ImgIcon src={icon} alt="" className="h-12 w-12 shrink-0 rounded-lg object-contain" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-ink">{title}</p>
        <p className="mt-0.5 text-11 leading-snug text-muted">{hint}</p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1">
        {chips.map((chip) => (
          <span
            key={`${chip.icon}-${chip.value}`}
            className={
              chip.tone === "orange"
                ? "inline-flex h-6 min-w-18 items-center justify-center gap-1 rounded-lg border border-secondary px-2 text-11 font-medium text-secondary"
                : "inline-flex h-6 min-w-18 items-center justify-center gap-1 rounded-lg border border-main px-2 text-11 font-medium text-main"
            }
          >
            {chip.icon === "wallet" ? <ImgIcon src={IMG.vipGold} alt="" className="h-3.5 w-3.5 object-contain" /> : null}
            {chip.icon === "heart" ? <Heart className="h-3 w-3 fill-current" /> : null}
            {chip.icon === "coins" ? <Database className="h-3 w-3" /> : null}
            {chip.value}
          </span>
        ))}
      </div>
    </div>
  );
}

function VipHistoryRules() {
  const { t } = useI18n();
  const [tab, setTab] = useState<"history" | "rules">("history");
  const items = vipHistoryRows(t).slice(0, 2);

  const rules = [
    { title: t("upgradeStandard"), body: t("upgradeStandardBody") },
    { title: t("upgradeOrder"), body: t("upgradeOrderBody") },
    { title: t("levelMaintenance"), body: t("maintenanceRuleBody") },
    { title: t("downgradeStandard"), body: t("downgradeStandardBody") },
  ];

  return (
    <div className="mx-3 mt-3 mb-6">
      <div className="overflow-hidden rounded-lg bg-white">
        <UnderlineTabs
          variant="line"
          className="h-12 [&_button]:h-12"
          value={tab}
          onChange={setTab}
          items={[
            { id: "history", label: t("history") },
            { id: "rules", label: t("rules") },
          ]}
        />

        {tab === "history" ? (
          <div className="px-3 pb-4 pt-4">
            {items.map((item, i) => (
              <div key={item.id} className={i > 0 ? "mt-3 border-t border-line pt-3" : ""}>
                <p className={item.tone === "orange" ? "text-sm font-medium text-secondary" : "text-sm font-medium text-main"}>
                  {item.title}
                </p>
                <p className="mt-1 text-xs leading-snug text-muted">{item.body}</p>
                <div className="mt-1.5 flex items-end justify-between gap-2">
                  <span className="text-11 text-faint">{item.time}</span>
                  {item.exp ? <span className="text-11 text-muted">{item.exp}</span> : null}
                </div>
              </div>
            ))}
            <Button className="mt-5" size="sm" href="/vip/RecordVsruleHistory">
              {t("viewAll")}
            </Button>
          </div>
        ) : null}
      </div>

      {tab === "rules" ? (
        <>
          <h2 className="mt-4 text-center text-md font-semibold text-main">{t("vipPrivileges")}</h2>
          <p className="mt-1 text-center text-13 text-muted">{t("vipRuleDescription")}</p>
          <div className="mt-5 space-y-3">
            {rules.map((rule) => (
              <div key={rule.title} className="overflow-hidden rounded-lg bg-white">
                <div className="relative">
                  <IconRuleHead className="h-8 w-75 mx-auto text-main" />
                  <span className="absolute inset-0 grid place-items-center text-xs  text-white">
                    {rule.title}
                  </span>
                </div>
                <p className="whitespace-pre-line px-3 py-3 text-xs leading-relaxed text-muted">{rule.body}</p>
              </div>
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}

function VipLevelCard({ row, exp }: { row: VipLevel; exp: number }) {
  const { t } = useI18n();
  const open = exp >= row.need;
  const remain = Math.max(0, row.need - exp);
  const pct = row.need <= 0 ? 100 : Math.min(100, (exp / row.need) * 100);
  const icon = row.n <= 1 ? IMG.vipIcon1 : IMG.vipIcon2;

  return (
    <div
      className="relative flex h-full w-full flex-col justify-between overflow-hidden rounded-lg px-2.5 py-[0.46875rem] text-11 font-normal text-white"
      style={
        row.n === 1
          ? {
              background:
                "url(/vip/bg-1.png) no-repeat center, linear-gradient(117.29deg, #a6b7d0 21.85%, #889ebe 67.02%)",
              boxShadow: "0 0.0625rem #7991b6, inset 0 0.0625rem #bdcadc",
            }
          : {
              background: `linear-gradient(117.29deg, ${row.tone} 21.85%, ${row.track} 67.02%)`,
              boxShadow: `0 0.0625rem ${row.track}, inset 0 0.0625rem ${row.tone}`,
            }
      }
    >
      <ImgIcon
        src={`/vip/badge-${row.n}.png`}
        alt=""
        className="pointer-events-none absolute right-2 top-2 h-[4.75rem] w-[4.75rem] object-contain"
      />
      <div className="relative pr-16">
        <div className="flex items-center gap-1">
          <ImgIcon src={icon} alt="" className="h-4 w-4 object-contain" />
          <h1 className="text-lg font-bold leading-none">VIP{row.n}</h1>
          {!open ? (
            <>
              <ImgIcon src={IMG.vipLocked} alt="" className="h-3.5 w-3.5 object-contain" />
              <span className="text-11">{t("notOpenYet")}</span>
            </>
          ) : null}
        </div>
        <p className="mt-2 text-11 leading-snug">
          {t("upgradingRequires", { n: row.n })}
          <br />
          {remain}EXP
        </p>
        <div className="mt-3 inline-flex h-6 items-center rounded-lg border border-white/70 px-3 text-11">
          {t("betExpRate")}
        </div>
      </div>
      <div className="relative">
        <p className="mb-1.5 text-right text-11">VIP{row.n}</p>
        <div
          className="h-2 w-full rounded-lg"
          style={{ background: row.track, boxShadow: row.trackShadow }}
        >
          <div className="h-full overflow-hidden rounded-lg">
            <span
              className="block h-full rounded-lg"
              style={{
                width: `${pct}%`,
                background: "linear-gradient(rgb(255, 252, 231) 0%, rgb(255, 200, 33) 100%)",
              }}
            />
          </div>
        </div>
        <div className="mt-1.5 flex items-center justify-between gap-2 text-10">
          <span>
            {exp}/{row.need}
          </span>
          <span className="text-right">{t("expCanLevelUp", { exp: row.need })}</span>
        </div>
      </div>
    </div>
  );
}
