"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { mockSessions } from "@/app/mockData";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "An interactive bar chart";

import { cn } from "@/lib/utils";

const chartConfig = {
  views: {
    label: "Page Views",
  },
  confidenceCoach: { label: "Confidence Coach", color: "var(--chart-1)" },
  socialMentor: { label: "Social Mentor", color: "var(--chart-2)" },
  microLearning: { label: "Micro‑Learning", color: "var(--chart-3)" },
  inQuizzo: { label: "InQuizzo", color: "var(--chart-4)" },
};

export const ActivityChart = React.memo(function ActivityChart({ data, selectedDate }) {
  const [activeChart, setActiveChart] = React.useState("confidenceCoach");

  const total = React.useMemo(
    () => ({
      confidenceCoach: data.reduce((acc, curr) => acc + curr.confidenceCoach, 0),
      socialMentor: data.reduce((acc, curr) => acc + curr.socialMentor, 0),
      microLearning: data.reduce((acc, curr) => acc + curr.microLearning, 0),
      inQuizzo: data.reduce((acc, curr) => acc + curr.inQuizzo, 0),
    }),
    [data]
  );

  const tickFormatter = React.useCallback((value) => {
    const date = new Date(value);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  }, []);

  const tooltipLabelFormatter = React.useCallback((value) => {
    return new Date(value).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }, []);

  console.log("ActivityChart Rendered");
  console.log("Selected Date in ActivityChart:", selectedDate);
  console.log("Data in ActivityChart:", data);

  return (
    <Card className="py-0 h-full">
      <CardHeader className="flex flex-col items-stretch border-b p-0! sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:py-0!">
          <CardTitle>Activity Chart</CardTitle>
          <CardDescription>
            {`Showing total sessions from the last 7 days`}
          </CardDescription>
        </div>
        <div className="flex">
          {["confidenceCoach", "socialMentor", "microLearning", "inQuizzo"].map((key) => {
            const chart = key;
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className={cn("data-[active=true]:bg-muted/50 relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-center font-medium even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6 cursor-pointer hover:bg-muted/30", { "data-[active=true]:rounded-tr-lg": activeChart === "inQuizzo" })}
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-muted-foreground text-xs">
                  {chartConfig[chart].label}
                </span>
                <span className="text-lg leading-none font-bold sm:text-3xl">
                  {total[chart].toLocaleString()}
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>

      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={tickFormatter}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey={chartConfig.activeChart}
                  labelFormatter={tooltipLabelFormatter}
                />
              }
            />
            <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
});

export function getActivityChartData(sessions = []) {
  if (!Array.isArray(sessions)) {
    console.error("getActivityChartData received non-array data:", sessions);
    return [];
  }

  const dailyMap = {};

  sessions.forEach((session) => {
    const date = session.date;

    if (!dailyMap[date]) {
      dailyMap[date] = {
        date,
        confidenceCoach: 0,
        socialMentor: 0,
        microLearning: 0,
        inQuizzo: 0,
      }

    }
    dailyMap[date][session.module] += 1;
  });

  return Object.values(dailyMap);
}