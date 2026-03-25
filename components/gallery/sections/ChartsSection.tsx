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
    color: "var(--chart-1)",
  },
  ma20: {
    label: `${MA_PERIOD}-day SMA`,
    color: "var(--chart-2)",
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
    color: "var(--chart-1)",
  },
  fixedIncome: {
    label: "Fixed income",
    color: "var(--chart-2)",
  },
  cash: {
    label: "Cash & equivalents",
    color: "var(--chart-3)",
  },
  alternatives: {
    label: "Alternatives",
    color: "var(--chart-4)",
  },
  commodities: {
    label: "Commodities",
    color: "var(--chart-5)",
  },
  multiStrat: {
    label: "Multi-strategy",
    color: "var(--color-primary)",
  },
} satisfies ChartConfig;

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
      <div className="gallery-chart-stack">
        <Card className="gallery-chart-card">
          <CardHeader className="gallery-chart-card-header">
            <div className="gallery-chart-header-row">
              <div>
                <CardTitle className="gallery-chart-ticker">SGNL</CardTitle>
                <CardDescription>
                  Adj. close & {MA_PERIOD}-day SMA (USD) · NYSE
                </CardDescription>
              </div>
              <Select value={timeRange} onValueChange={(v) => setTimeRange(v ?? timeRange)}>
                <SelectTrigger className="gallery-select-range">
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
          <CardContent className="gallery-chart-card-content">
            <ChartContainer
              config={stockChartConfig}
              className="gallery-chart-flush-line"
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
                      className="gallery-chart-legend-row"
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
                        <div className="gallery-chart-tooltip-format-row">
                          <span className="gallery-chart-format-name">{name}</span>
                          <span className="gallery-chart-format-value">
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
                  stroke="var(--chart-1)"
                  strokeWidth={1.15}
                  dot={false}
                  isAnimationActive={false}
                  activeDot={{ r: 3, strokeWidth: 1 }}
                />
                <Line
                  name={`${MA_PERIOD}-day SMA`}
                  dataKey="ma20"
                  type="monotone"
                  stroke="var(--chart-2)"
                  strokeWidth={2}
                  dot={false}
                  connectNulls
                  isAnimationActive={false}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="gallery-chart-card">
          <CardHeader className="gallery-chart-card-header">
            <CardTitle>Model portfolio — sleeve mix over time</CardTitle>
            <CardDescription>
              100% stacked (expanded): monthly notional weights across asset classes · illustrative
            </CardDescription>
          </CardHeader>
          <CardContent className="gallery-chart-card-content">
            <ChartContainer
              config={allocationChartConfig}
              className="gallery-chart-flush-area"
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
                      className="gallery-chart-legend-row gallery-chart-legend-row--tight"
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
                          <div className="gallery-chart-tooltip-format-row gallery-chart-tooltip-format-row--wide">
                            <span className="gallery-chart-format-name">{name}</span>
                            <span className="gallery-chart-format-value">
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
                  stroke="var(--chart-1)"
                  strokeWidth={1.25}
                  strokeOpacity={1}
                  fill="var(--chart-1)"
                  fillOpacity={STACKED_AREA_FILL_OPACITY}
                  isAnimationActive={false}
                />
                <Area
                  dataKey="fixedIncome"
                  type="monotone"
                  stackId="allocation"
                  stroke="var(--chart-2)"
                  strokeWidth={1.25}
                  strokeOpacity={1}
                  fill="var(--chart-2)"
                  fillOpacity={STACKED_AREA_FILL_OPACITY}
                  isAnimationActive={false}
                />
                <Area
                  dataKey="cash"
                  type="monotone"
                  stackId="allocation"
                  stroke="var(--chart-3)"
                  strokeWidth={1.25}
                  strokeOpacity={1}
                  fill="var(--chart-3)"
                  fillOpacity={STACKED_AREA_FILL_OPACITY}
                  isAnimationActive={false}
                />
                <Area
                  dataKey="alternatives"
                  type="monotone"
                  stackId="allocation"
                  stroke="var(--chart-4)"
                  strokeWidth={1.25}
                  strokeOpacity={1}
                  fill="var(--chart-4)"
                  fillOpacity={STACKED_AREA_FILL_OPACITY}
                  isAnimationActive={false}
                />
                <Area
                  dataKey="commodities"
                  type="monotone"
                  stackId="allocation"
                  stroke="var(--chart-5)"
                  strokeWidth={1.25}
                  strokeOpacity={1}
                  fill="var(--chart-5)"
                  fillOpacity={STACKED_AREA_FILL_OPACITY}
                  isAnimationActive={false}
                />
                <Area
                  dataKey="multiStrat"
                  type="monotone"
                  stackId="allocation"
                  stroke="var(--color-primary)"
                  strokeWidth={1.25}
                  strokeOpacity={1}
                  fill="var(--color-primary)"
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
