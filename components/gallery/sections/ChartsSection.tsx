"use client";

import * as React from "react";

import { GallerySection } from "@/components/gallery/GallerySection";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

type StockRow = { date: string; close: number; ma20: number | null };

/** Deterministic pseudo-random in [0, 1). */
function mulberry32(seed: number) {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** ~18 months of weekday closes: noisy daily returns + gaps / regime shifts (not a smooth wave). */
function generateAdjustedCloseSeries(): Array<{ date: string; close: number }> {
  const result: Array<{ date: string; close: number }> = [];
  let price = 118.06;
  const cursor = new Date(2023, 0, 3);
  const end = new Date(2024, 5, 28);
  let i = 0;
  const rand = mulberry32(0x5_1a6e13);

  const ymd = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

  while (cursor <= end) {
    const dow = cursor.getDay();
    if (dow !== 0 && dow !== 6) {
      const u = rand();
      const v = rand();
      // Fat-tailed-ish daily move: mostly small noise, occasional larger jumps
      const base =
        (u - 0.5) * 0.052 +
        (v - 0.5) * 0.038 +
        (rand() - 0.5) * 0.022;
      const regime = i < 85 ? 0.00015 : i < 200 ? -0.00025 : 0.00035;
      const event =
        i % 113 === 47 ? (rand() - 0.3) * 0.045 : i % 211 === 19 ? (rand() - 0.7) * 0.062 : 0;
      const ret = regime + base + event;
      price = Math.max(28.5, price * (1 + ret));
      price = Math.round(price * 100) / 100;
      result.push({ date: ymd(cursor), close: price });
      i += 1;
    }
    cursor.setDate(cursor.getDate() + 1);
  }
  return result;
}

function withSimpleMovingAverage(
  rows: Array<{ date: string; close: number }>,
  window: number
): StockRow[] {
  return rows.map((row, i) => {
    if (i < window - 1) {
      return { ...row, ma20: null };
    }
    let sum = 0;
    for (let j = i - window + 1; j <= i; j += 1) {
      sum += rows[j].close;
    }
    const ma = Math.round((sum / window) * 100) / 100;
    return { ...row, ma20: ma };
  });
}

const stockChartData: StockRow[] = withSimpleMovingAverage(
  generateAdjustedCloseSeries(),
  20
);

const MA_PERIOD = 20;

const stockChartConfig = {
  close: {
    label: "Adj. close",
    color: "var(--color-chart-1)",
  },
  ma20: {
    label: `${MA_PERIOD}-day SMA`,
    color: "var(--color-chart-2)",
  },
} satisfies ChartConfig;

/** Last N trading sessions (rows), not calendar days. */
const SESSION_RANGE: Record<string, number> = {
  "7d": 7,
  "30d": 30,
  "90d": 90,
  "1y": 252,
};

/** Stacked area: opaque stroke, translucent fill (Recharts applies fillOpacity to fill only). */
const STACKED_AREA_FILL_OPACITY = 0.42;

type AllocationMonth = {
  period: string;
  equities: number;
  fixedIncome: number;
  cash: number;
  alternatives: number;
  commodities: number;
  multiStrat: number;
};

const ALLOCATION_KEYS = [
  "equities",
  "fixedIncome",
  "cash",
  "alternatives",
  "commodities",
  "multiStrat",
] as const;

/** 36 months of evolving sleeve weights (diverse mix, regime shifts — expand normalizes to 100%). */
function generateAllocationTimeline(monthCount: number): AllocationMonth[] {
  const rand = mulberry32(0x5ca1e);
  const out: AllocationMonth[] = [];
  const start = new Date(2022, 0, 1);

  for (let m = 0; m < monthCount; m += 1) {
    const d = new Date(start);
    d.setMonth(start.getMonth() + m);
    const t = monthCount > 1 ? m / (monthCount - 1) : 0;

    const riskCycle = Math.sin(t * Math.PI * 2.4) * 14 + Math.cos(t * Math.PI * 0.9) * 6;
    const rateShock = m >= 8 && m <= 16 ? -6 : m >= 24 && m <= 30 ? 5 : 0;
    const altSeason = Math.sin((m / 6) * Math.PI) * 5;

    let equities = 36 + riskCycle * 0.45 + rateShock * 0.4 + (rand() - 0.5) * 6;
    let fixedIncome = 30 - riskCycle * 0.25 + rateShock * 0.35 + (rand() - 0.5) * 5;
    let cash = 7 + (m > 18 && m < 26 ? 9 : 0) - riskCycle * 0.08 + (rand() - 0.5) * 3;
    let alternatives = 11 + altSeason + (rand() - 0.5) * 4;
    let commodities = 6 + Math.sin(t * Math.PI * 3) * 3 + (rand() - 0.5) * 2.5;
    let multiStrat = 10 - altSeason * 0.2 + (rand() - 0.5) * 2;

    if (m > 20 && m < 28) {
      equities -= 5;
      cash += 4;
      fixedIncome += 2;
    }

    const floor = 0.8;
    equities = Math.max(floor, equities);
    fixedIncome = Math.max(floor, fixedIncome);
    cash = Math.max(floor, cash);
    alternatives = Math.max(floor, alternatives);
    commodities = Math.max(floor, commodities);
    multiStrat = Math.max(floor, multiStrat);

    const period = d.toLocaleDateString("en-US", {
      month: "short",
      year: "2-digit",
    });

    out.push({
      period,
      equities: Math.round(equities * 10) / 10,
      fixedIncome: Math.round(fixedIncome * 10) / 10,
      cash: Math.round(cash * 10) / 10,
      alternatives: Math.round(alternatives * 10) / 10,
      commodities: Math.round(commodities * 10) / 10,
      multiStrat: Math.round(multiStrat * 10) / 10,
    });
  }
  return out;
}

const allocationTimelineData = generateAllocationTimeline(36);

const allocationChartConfig = {
  equities: {
    label: "Equities",
    color: "var(--color-chart-1)",
  },
  fixedIncome: {
    label: "Fixed income",
    color: "var(--color-chart-2)",
  },
  cash: {
    label: "Cash & equivalents",
    color: "var(--color-chart-3)",
  },
  alternatives: {
    label: "Alternatives",
    color: "var(--color-chart-4)",
  },
  commodities: {
    label: "Commodities",
    color: "var(--color-chart-5)",
  },
  multiStrat: {
    label: "Multi-strategy",
    color: "var(--color-primary)",
  },
} satisfies ChartConfig;

/** Legend row above plot: padded like header/footer, divider under legend. */
const chartFlushLegendClass =
  "w-full justify-start border-b border-border/50 px-[var(--card-padding)] pt-3 pb-3";

const chartFlushContainerClass =
  "!aspect-auto h-[320px] w-full min-h-[280px] max-w-none justify-stretch";

const areaChartFlushContainerClass =
  "!aspect-auto h-[360px] w-full min-h-[300px] max-w-none justify-stretch";

export function ChartsSection() {
  const [timeRange, setTimeRange] = React.useState("90d");

  const filteredStockData = React.useMemo(() => {
    const n = SESSION_RANGE[timeRange] ?? 90;
    return stockChartData.slice(-n);
  }, [timeRange]);

  return (
    <GallerySection
      id="charts"
      title="Charts"
      description="Interactive line and area charts using design tokens"
    >
      <div className="flex flex-col gap-6 w-full">
        <Card className="w-full gap-0 overflow-hidden p-0">
          <CardHeader className="border-b border-border/60 px-[var(--card-padding)] pt-[var(--card-padding)] pb-4">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <CardTitle className="font-mono text-base tracking-tight">
                  SGNL
                </CardTitle>
                <CardDescription>
                  Adj. close & {MA_PERIOD}-day SMA (USD) · NYSE
                </CardDescription>
              </div>
              <Select value={timeRange} onValueChange={(v) => setTimeRange(v ?? timeRange)}>
                <SelectTrigger className="w-[160px] sm:mt-0">
                  <SelectValue placeholder="Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1y">Last 252 sessions (~1Y)</SelectItem>
                  <SelectItem value="90d">Last 90 sessions (~3M)</SelectItem>
                  <SelectItem value="30d">Last 30 sessions</SelectItem>
                  <SelectItem value="7d">Last 7 sessions</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="px-0 pb-0 pt-0">
            <ChartContainer
              config={stockChartConfig}
              className={chartFlushContainerClass}
            >
              <LineChart
                data={filteredStockData}
                margin={{ left: 4, right: 8, top: 4, bottom: 0 }}
                accessibilityLayer
              >
                <ChartLegend
                  verticalAlign="top"
                  align="left"
                  content={(props) => (
                    <ChartLegendContent
                      payload={props.payload}
                      verticalAlign={props.verticalAlign}
                      className={cn(
                        "flex flex-wrap gap-x-5 gap-y-1",
                        chartFlushLegendClass
                      )}
                    />
                  )}
                />
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  minTickGap={timeRange === "7d" ? 8 : timeRange === "1y" ? 40 : 20}
                  tickFormatter={(value) => {
                    const date = new Date(value + "T12:00:00");
                    return date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                />
                <YAxis
                  orientation="right"
                  tickLine={false}
                  axisLine={false}
                  width={56}
                  tickFormatter={(v) =>
                    typeof v === "number" ? `$${v.toFixed(0)}` : String(v)
                  }
                  domain={["auto", "auto"]}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      labelFormatter={(value) =>
                        new Date(String(value) + "T12:00:00").toLocaleDateString(
                          "en-US",
                          {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }
                        )
                      }
                      formatter={(value, name) => (
                        <div className="flex w-full min-w-[11rem] items-center justify-between gap-4 leading-none">
                          <span className="text-muted-foreground">{name}</span>
                          <span className="font-mono font-medium text-foreground tabular-nums">
                            {typeof value === "number" ? usd.format(value) : String(value)}
                          </span>
                        </div>
                      )}
                    />
                  }
                />
                <Line
                  name="Adj. close"
                  dataKey="close"
                  type="linear"
                  stroke="var(--color-chart-1)"
                  strokeWidth={1.15}
                  dot={false}
                  isAnimationActive={false}
                  activeDot={{ r: 3, strokeWidth: 1 }}
                />
                <Line
                  name={`${MA_PERIOD}-day SMA`}
                  dataKey="ma20"
                  type="monotone"
                  stroke="var(--color-chart-2)"
                  strokeWidth={2}
                  dot={false}
                  connectNulls
                  isAnimationActive={false}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="w-full gap-0 overflow-hidden p-0">
          <CardHeader className="border-b border-border/60 px-[var(--card-padding)] pt-[var(--card-padding)] pb-4">
            <CardTitle>Model portfolio — sleeve mix over time</CardTitle>
            <CardDescription>
              100% stacked (expanded): monthly notional weights across asset classes · illustrative
            </CardDescription>
          </CardHeader>
          <CardContent className="px-0 pb-0 pt-0">
            <ChartContainer
              config={allocationChartConfig}
              className={areaChartFlushContainerClass}
            >
              <AreaChart
                data={allocationTimelineData}
                stackOffset="expand"
                margin={{ left: 4, right: 8, top: 4, bottom: 0 }}
                accessibilityLayer
              >
                <ChartLegend
                  verticalAlign="top"
                  align="left"
                  content={(props) => (
                    <ChartLegendContent
                      payload={props.payload}
                      verticalAlign={props.verticalAlign}
                      className={cn(
                        "flex flex-wrap gap-x-4 gap-y-1",
                        chartFlushLegendClass
                      )}
                    />
                  )}
                />
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="period"
                  tickLine={false}
                  axisLine={false}
                  minTickGap={10}
                  interval="preserveStartEnd"
                />
                <YAxis
                  orientation="right"
                  tickLine={false}
                  axisLine={false}
                  width={44}
                  tickFormatter={(v) =>
                    typeof v === "number" ? `${Math.round(v * 100)}%` : String(v)
                  }
                  domain={[0, 1]}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value, name, item) => {
                        const row = item?.payload as Record<string, number> | undefined;
                        const total = ALLOCATION_KEYS.reduce(
                          (s, k) => s + (Number(row?.[k]) || 0),
                          0
                        );
                        const raw = typeof value === "number" ? value : Number(value);
                        const pct = total > 0 ? (raw / total) * 100 : 0;
                        return (
                          <div className="flex w-full min-w-[12rem] items-center justify-between gap-4 leading-none">
                            <span className="text-muted-foreground">{name}</span>
                            <span className="font-mono font-medium tabular-nums text-foreground">
                              {pct.toFixed(1)}% · {raw}
                            </span>
                          </div>
                        );
                      }}
                    />
                  }
                />
                <Area
                  dataKey="equities"
                  type="monotone"
                  stackId="allocation"
                  stroke="var(--color-equities)"
                  strokeWidth={1.25}
                  strokeOpacity={1}
                  fill="var(--color-equities)"
                  fillOpacity={STACKED_AREA_FILL_OPACITY}
                  isAnimationActive={false}
                />
                <Area
                  dataKey="fixedIncome"
                  type="monotone"
                  stackId="allocation"
                  stroke="var(--color-fixedIncome)"
                  strokeWidth={1.25}
                  strokeOpacity={1}
                  fill="var(--color-fixedIncome)"
                  fillOpacity={STACKED_AREA_FILL_OPACITY}
                  isAnimationActive={false}
                />
                <Area
                  dataKey="cash"
                  type="monotone"
                  stackId="allocation"
                  stroke="var(--color-cash)"
                  strokeWidth={1.25}
                  strokeOpacity={1}
                  fill="var(--color-cash)"
                  fillOpacity={STACKED_AREA_FILL_OPACITY}
                  isAnimationActive={false}
                />
                <Area
                  dataKey="alternatives"
                  type="monotone"
                  stackId="allocation"
                  stroke="var(--color-alternatives)"
                  strokeWidth={1.25}
                  strokeOpacity={1}
                  fill="var(--color-alternatives)"
                  fillOpacity={STACKED_AREA_FILL_OPACITY}
                  isAnimationActive={false}
                />
                <Area
                  dataKey="commodities"
                  type="monotone"
                  stackId="allocation"
                  stroke="var(--color-commodities)"
                  strokeWidth={1.25}
                  strokeOpacity={1}
                  fill="var(--color-commodities)"
                  fillOpacity={STACKED_AREA_FILL_OPACITY}
                  isAnimationActive={false}
                />
                <Area
                  dataKey="multiStrat"
                  type="monotone"
                  stackId="allocation"
                  stroke="var(--color-multiStrat)"
                  strokeWidth={1.25}
                  strokeOpacity={1}
                  fill="var(--color-multiStrat)"
                  fillOpacity={STACKED_AREA_FILL_OPACITY}
                  isAnimationActive={false}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </GallerySection>
  );
}
