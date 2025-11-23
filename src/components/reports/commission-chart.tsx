
"use client";

import { commissions } from "@/lib/data";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Pie, PieChart } from "recharts";
import { useMemo } from "react";

const chartConfig = {
  percentage: {
    label: "Percentage",
    color: "hsl(var(--chart-1))",
  },
  fixed: {
    label: "Fixed",
    color: "hsl(var(--chart-2))",
  },
};

export default function CommissionChart() {
  const data = useMemo(() => {
    const commissionTypes = commissions.reduce((acc, commission) => {
        acc[commission.type] = (acc[commission.type] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(commissionTypes).map(([key, value]) => ({
        type: key,
        count: value,
        fill: key === 'Percentage' ? 'var(--color-percentage)' : 'var(--color-fixed)'
    }));
  }, []);


  return (
    <ChartContainer config={chartConfig} className="w-full h-full">
        <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie data={data} dataKey="count" nameKey="type" innerRadius={60} />
            <ChartLegend content={<ChartLegendContent nameKey="type" />} />
        </PieChart>
      </ChartContainer>
  );
}
