"use client";

import * as React from "react";

import { GallerySection } from "@/components/gallery/GallerySection";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
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

// 90 days of data: 2024-04-01 to 2024-06-30 (from shadcn area chart example, extended)
const areaChartData = [
  { date: "2024-04-01", desktop: 222, mobile: 150 },
  { date: "2024-04-02", desktop: 97, mobile: 180 },
  { date: "2024-04-03", desktop: 167, mobile: 120 },
  { date: "2024-04-04", desktop: 242, mobile: 260 },
  { date: "2024-04-05", desktop: 373, mobile: 290 },
  { date: "2024-04-06", desktop: 301, mobile: 340 },
  { date: "2024-04-07", desktop: 245, mobile: 180 },
  { date: "2024-04-08", desktop: 409, mobile: 320 },
  { date: "2024-04-09", desktop: 59, mobile: 110 },
  { date: "2024-04-10", desktop: 261, mobile: 190 },
  { date: "2024-04-11", desktop: 327, mobile: 350 },
  { date: "2024-04-12", desktop: 292, mobile: 210 },
  { date: "2024-04-13", desktop: 342, mobile: 380 },
  { date: "2024-04-14", desktop: 137, mobile: 220 },
  { date: "2024-04-15", desktop: 120, mobile: 170 },
  { date: "2024-04-16", desktop: 138, mobile: 190 },
  { date: "2024-04-17", desktop: 446, mobile: 360 },
  { date: "2024-04-18", desktop: 364, mobile: 410 },
  { date: "2024-04-19", desktop: 243, mobile: 180 },
  { date: "2024-04-20", desktop: 89, mobile: 150 },
  { date: "2024-04-21", desktop: 137, mobile: 200 },
  { date: "2024-04-22", desktop: 224, mobile: 170 },
  { date: "2024-04-23", desktop: 138, mobile: 230 },
  { date: "2024-04-24", desktop: 387, mobile: 290 },
  { date: "2024-04-25", desktop: 215, mobile: 250 },
  { date: "2024-04-26", desktop: 75, mobile: 130 },
  { date: "2024-04-27", desktop: 383, mobile: 420 },
  { date: "2024-04-28", desktop: 122, mobile: 180 },
  { date: "2024-04-29", desktop: 315, mobile: 240 },
  { date: "2024-04-30", desktop: 454, mobile: 380 },
  { date: "2024-05-01", desktop: 289, mobile: 210 },
  { date: "2024-05-02", desktop: 156, mobile: 175 },
  { date: "2024-05-03", desktop: 198, mobile: 245 },
  { date: "2024-05-04", desktop: 334, mobile: 295 },
  { date: "2024-05-05", desktop: 267, mobile: 185 },
  { date: "2024-05-06", desktop: 412, mobile: 330 },
  { date: "2024-05-07", desktop: 178, mobile: 195 },
  { date: "2024-05-08", desktop: 223, mobile: 265 },
  { date: "2024-05-09", desktop: 356, mobile: 310 },
  { date: "2024-05-10", desktop: 145, mobile: 155 },
  { date: "2024-05-11", desktop: 278, mobile: 225 },
  { date: "2024-05-12", desktop: 391, mobile: 365 },
  { date: "2024-05-13", desktop: 134, mobile: 205 },
  { date: "2024-05-14", desktop: 245, mobile: 275 },
  { date: "2024-05-15", desktop: 367, mobile: 340 },
  { date: "2024-05-16", desktop: 189, mobile: 165 },
  { date: "2024-05-17", desktop: 312, mobile: 285 },
  { date: "2024-05-18", desktop: 423, mobile: 395 },
  { date: "2024-05-19", desktop: 167, mobile: 215 },
  { date: "2024-05-20", desktop: 256, mobile: 255 },
  { date: "2024-05-21", desktop: 378, mobile: 355 },
  { date: "2024-05-22", desktop: 201, mobile: 195 },
  { date: "2024-05-23", desktop: 289, mobile: 305 },
  { date: "2024-05-24", desktop: 401, mobile: 375 },
  { date: "2024-05-25", desktop: 156, mobile: 175 },
  { date: "2024-05-26", desktop: 234, mobile: 235 },
  { date: "2024-05-27", desktop: 345, mobile: 325 },
  { date: "2024-05-28", desktop: 178, mobile: 205 },
  { date: "2024-05-29", desktop: 267, mobile: 285 },
  { date: "2024-05-30", desktop: 389, mobile: 365 },
  { date: "2024-05-31", desktop: 212, mobile: 245 },
  { date: "2024-06-01", desktop: 323, mobile: 295 },
  { date: "2024-06-02", desktop: 445, mobile: 385 },
  { date: "2024-06-03", desktop: 167, mobile: 185 },
  { date: "2024-06-04", desktop: 256, mobile: 265 },
  { date: "2024-06-05", desktop: 378, mobile: 345 },
  { date: "2024-06-06", desktop: 201, mobile: 225 },
  { date: "2024-06-07", desktop: 312, mobile: 315 },
  { date: "2024-06-08", desktop: 434, mobile: 395 },
  { date: "2024-06-09", desktop: 178, mobile: 195 },
  { date: "2024-06-10", desktop: 289, mobile: 275 },
  { date: "2024-06-11", desktop: 401, mobile: 355 },
  { date: "2024-06-12", desktop: 223, mobile: 245 },
  { date: "2024-06-13", desktop: 334, mobile: 325 },
  { date: "2024-06-14", desktop: 456, mobile: 405 },
  { date: "2024-06-15", desktop: 189, mobile: 215 },
  { date: "2024-06-16", desktop: 278, mobile: 295 },
  { date: "2024-06-17", desktop: 390, mobile: 375 },
  { date: "2024-06-18", desktop: 212, mobile: 255 },
  { date: "2024-06-19", desktop: 323, mobile: 335 },
  { date: "2024-06-20", desktop: 445, mobile: 415 },
  { date: "2024-06-21", desktop: 167, mobile: 195 },
  { date: "2024-06-22", desktop: 256, mobile: 275 },
  { date: "2024-06-23", desktop: 378, mobile: 355 },
  { date: "2024-06-24", desktop: 201, mobile: 235 },
  { date: "2024-06-25", desktop: 312, mobile: 315 },
  { date: "2024-06-26", desktop: 434, mobile: 395 },
  { date: "2024-06-27", desktop: 178, mobile: 225 },
  { date: "2024-06-28", desktop: 289, mobile: 305 },
  { date: "2024-06-29", desktop: 401, mobile: 385 },
  { date: "2024-06-30", desktop: 234, mobile: 265 },
];

const areaChartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--color-chart-1)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--color-chart-2)",
  },
} satisfies ChartConfig;

const barChartData = [
  { month: "January", saas: 186, services: 80, other: 45 },
  { month: "February", saas: 305, services: 200, other: 100 },
  { month: "March", saas: 237, services: 120, other: 60 },
  { month: "April", saas: 73, services: 190, other: 90 },
  { month: "May", saas: 209, services: 130, other: 75 },
  { month: "June", saas: 214, services: 140, other: 55 },
];

const barChartConfig = {
  saas: {
    label: "SaaS",
    color: "var(--color-chart-1)",
  },
  services: {
    label: "Services",
    color: "var(--color-chart-2)",
  },
  other: {
    label: "Other",
    color: "var(--color-chart-3)",
  },
} satisfies ChartConfig;

export function ChartsSection() {
  const [timeRange, setTimeRange] = React.useState("90d");

  const filteredData = React.useMemo(() => {
    const referenceDate = new Date("2024-06-30");
    let daysToSubtract = 90;
    if (timeRange === "30d") daysToSubtract = 30;
    else if (timeRange === "7d") daysToSubtract = 7;
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);

    return areaChartData.filter((item) => {
      const date = new Date(item.date);
      return date >= startDate;
    });
  }, [timeRange]);

  return (
    <GallerySection
      id="charts"
      title="Charts"
      description="Interactive area and bar charts using design tokens"
    >
      <div className="flex flex-col gap-6 w-full">
        <Card className="w-full">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Visitor Traffic</CardTitle>
                <CardDescription>
                  Desktop vs mobile — April 2024
                </CardDescription>
              </div>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Last 3 months" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="90d">Last 3 months</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={areaChartConfig}
              className="h-[300px] w-full"
            >
              <AreaChart
                data={filteredData}
                margin={{ left: 12, right: 12 }}
                accessibilityLayer
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      labelFormatter={(value) =>
                        new Date(value).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      }
                    />
                  }
                />
                <ChartLegend content={<ChartLegendContent />} />
                <Area
                  dataKey="desktop"
                  type="natural"
                  fill="var(--color-desktop)"
                  fillOpacity={0.4}
                  stroke="var(--color-desktop)"
                />
                <Area
                  dataKey="mobile"
                  type="natural"
                  fill="var(--color-mobile)"
                  fillOpacity={0.4}
                  stroke="var(--color-mobile)"
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>Monthly Revenue</CardTitle>
            <CardDescription>
              Breakdown by revenue stream — H1 2024
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={barChartConfig}
              className="h-[300px] w-full"
            >
              <BarChart
                data={barChartData}
                margin={{ left: 12, right: 12 }}
                accessibilityLayer
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="saas" fill="var(--color-saas)" radius={4} />
                <Bar dataKey="services" fill="var(--color-services)" radius={4} />
                <Bar dataKey="other" fill="var(--color-other)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </GallerySection>
  );
}
