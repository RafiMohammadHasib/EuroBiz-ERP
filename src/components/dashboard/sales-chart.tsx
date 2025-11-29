
"use client";

import { useMemo } from "react";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection } from "firebase/firestore";
import type { Invoice } from "@/lib/data";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Skeleton } from "../ui/skeleton";
import { useSettings } from "@/context/settings-context";
import { DateRange } from "react-day-picker";

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-1))",
  },
};

export default function SalesChart({ dateRange }: { dateRange?: DateRange }) {
  const firestore = useFirestore();
  const { currencySymbol } = useSettings();
  const invoicesCollection = useMemoFirebase(() => collection(firestore, 'invoices'), [firestore]);
  const { data: invoices, isLoading } = useCollection<Invoice>(invoicesCollection);
  
  const filteredInvoices = useMemo(() => {
    let items = (invoices || []).filter(inv => inv.status !== 'Cancelled');
    if (dateRange?.from) {
      items = items.filter(item => new Date(item.date) >= dateRange.from!);
    }
    if (dateRange?.to) {
      items = items.filter(item => new Date(item.date) <= dateRange.to!);
    }
    return items;
  }, [invoices, dateRange]);


  const salesData = useMemo(() => {
    const monthlyRevenue: { [key: string]: number } = {};
    
    filteredInvoices?.forEach(invoice => {
      const date = new Date(invoice.date);
      // Format as 'YYYY-MM' to group by month
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!monthlyRevenue[monthKey]) {
        monthlyRevenue[monthKey] = 0;
      }
      // Use paidAmount for revenue recognition
      monthlyRevenue[monthKey] += invoice.paidAmount;
    });

    return Object.entries(monthlyRevenue)
      .map(([monthKey, revenue]) => ({
        month: new Date(monthKey + '-02').toLocaleString('default', { month: 'short' }), // Use a specific day to avoid timezone issues
        revenue: revenue,
      }))
      .sort((a, b) => {
          const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
          return monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month);
      });
  }, [filteredInvoices]);

  if (isLoading) {
    return <Skeleton className="h-[350px] w-full" />;
  }

  return (
      <ChartContainer config={chartConfig} className="w-full h-full">
        <AreaChart
          accessibilityLayer
          data={salesData}
          margin={{
            left: 12,
            right: 12,
            top: 10,
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
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => `${currencySymbol}${Number(value) / 1000}K`}
          />
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <defs>
            <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-revenue)"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="var(--color-revenue)"
                stopOpacity={0.1}
              />
            </linearGradient>
          </defs>
          <Area
            dataKey="revenue"
            type="natural"
            fill="url(#fillRevenue)"
            stroke="var(--color-revenue)"
            stackId="a"
          />
        </AreaChart>
      </ChartContainer>
  );
}
