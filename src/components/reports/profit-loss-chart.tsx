
"use client";

import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { useMemo } from "react";
import { useSettings } from "@/context/settings-context";
import { collection } from "firebase/firestore";
import type { Invoice, FinishedGood } from "@/lib/data";
import { Skeleton } from "../ui/skeleton";

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-1))",
  },
  cogs: {
    label: "COGS",
    color: "hsl(var(--chart-2))",
  },
  grossProfit: {
    label: "Gross Profit",
    color: "hsl(var(--chart-3))",
  },
};

export default function ProfitLossChart() {
  const { currencySymbol } = useSettings();
  const firestore = useFirestore();

  const invoicesCol = useMemoFirebase(() => collection(firestore, 'invoices'), [firestore]);
  const finishedGoodsCol = useMemoFirebase(() => collection(firestore, 'finishedGoods'), [firestore]);

  const { data: invoices, isLoading: l1 } = useCollection<Invoice>(invoicesCol);
  const { data: finishedGoods, isLoading: l2 } = useCollection<FinishedGood>(finishedGoodsCol);
  
  const isLoading = l1 || l2;

  const data = useMemo(() => {
    if (!invoices || !finishedGoods) return [];

    const monthlyData: { [key: string]: { revenue: number, cogs: number } } = {};
    const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    monthOrder.forEach(m => monthlyData[m] = { revenue: 0, cogs: 0 });

    invoices.forEach(inv => {
        if (inv.status === 'Paid') {
            const month = new Date(inv.date).toLocaleString('default', { month: 'short' });
            if(monthlyData[month]) {
                monthlyData[month].revenue += inv.totalAmount;
                inv.items.forEach(item => {
                    const product = finishedGoods.find(fg => fg.productName === item.description);
                    if (product) {
                        monthlyData[month].cogs += item.quantity * product.unitCost;
                    }
                });
            }
        }
    });
    
    return monthOrder.map(month => ({
        month,
        revenue: monthlyData[month].revenue,
        cogs: monthlyData[month].cogs,
        grossProfit: monthlyData[month].revenue - monthlyData[month].cogs,
    }));

  }, [invoices, finishedGoods]);

  if (isLoading) {
    return <Skeleton className="h-full w-full" />;
  }

  return (
    <ChartContainer config={chartConfig} className="w-full h-full">
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
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => value.slice(0, 3)}
        />
         <YAxis
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${currencySymbol}${Number(value) / 1000}K`}
          />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar
          dataKey="revenue"
          fill="var(--color-revenue)"
          radius={4}
        />
        <Bar
          dataKey="cogs"
          fill="var(--color-cogs)"
          radius={4}
        />
      </BarChart>
    </ChartContainer>
  );
}


