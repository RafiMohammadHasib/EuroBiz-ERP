
"use client";

import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { useMemo } from "react";
import { useSettings } from "@/context/settings-context";
import { collection } from "firebase/firestore";
import type { Invoice, PurchaseOrder, ProductionOrder, SalesCommission, SalaryPayment, Expense } from "@/lib/data";
import { Skeleton } from "../ui/skeleton";
import { DateRange } from "react-day-picker";

const chartConfig = {
  income: {
    label: "Income",
    color: "hsl(var(--chart-1))",
  },
  expense: {
    label: "Expense",
    color: "hsl(var(--chart-2))",
  },
};

export default function BalanceChart({ dateRange }: { dateRange?: DateRange }) {
  const { currencySymbol } = useSettings();
  const firestore = useFirestore();

  const invoicesCol = useMemoFirebase(() => collection(firestore, 'invoices'), [firestore]);
  const poCol = useMemoFirebase(() => collection(firestore, 'purchaseOrders'), [firestore]);
  const prodCol = useMemoFirebase(() => collection(firestore, 'productionOrders'), [firestore]);
  const salaryCol = useMemoFirebase(() => collection(firestore, 'salary_payments'), [firestore]);
  const commissionCol = useMemoFirebase(() => collection(firestore, 'sales_commissions'), [firestore]);
  const expenseCol = useMemoFirebase(() => collection(firestore, 'expenses'), [firestore]);

  const { data: invoices, isLoading: l1 } = useCollection<Invoice>(invoicesCol);
  const { data: purchaseOrders, isLoading: l2 } = useCollection<PurchaseOrder>(poCol);
  const { data: productionOrders, isLoading: l3 } = useCollection<ProductionOrder>(prodCol);
  const { data: salaryPayments, isLoading: l4 } = useCollection<SalaryPayment>(salaryCol);
  const { data: salesCommissions, isLoading: l5 } = useCollection<SalesCommission>(commissionCol);
  const { data: expenses, isLoading: l6 } = useCollection<Expense>(expenseCol);
  
  const isLoading = l1 || l2 || l3 || l4 || l5 || l6;

  const data = useMemo(() => {
    let allInvoices = invoices || [];
    if (dateRange?.from) {
        allInvoices = allInvoices.filter(item => new Date(item.date) >= dateRange.from!);
    }
    if (dateRange?.to) {
        allInvoices = allInvoices.filter(item => new Date(item.date) <= dateRange.to!);
    }

    const allExpensesRaw = [
        ...(purchaseOrders || []),
        ...(productionOrders || []),
        ...(salaryPayments || []),
        ...(salesCommissions || []),
        ...(expenses || []),
    ];
    let allExpenses = allExpensesRaw;
     if (dateRange?.from) {
        allExpenses = allExpenses.filter(item => {
            const date = (item as any).date || (item as any).startDate || (item as any).saleDate || (item as any).paymentDate;
            return new Date(date) >= dateRange.from!
        });
    }
    if (dateRange?.to) {
         allExpenses = allExpenses.filter(item => {
            const date = (item as any).date || (item as any).startDate || (item as any).saleDate || (item as any).paymentDate;
            return new Date(date) <= dateRange.to!
        });
    }


    const monthlyData: { [key: string]: { income: number, expense: number } } = {};
    const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    monthOrder.forEach(m => monthlyData[m] = { income: 0, expense: 0 });

    allInvoices.forEach(inv => {
        if (inv.paidAmount > 0) {
            const month = new Date(inv.date).toLocaleString('default', { month: 'short' });
            if(monthlyData[month]) {
                monthlyData[month].income += inv.paidAmount;
            }
        }
    });

    allExpenses.forEach(exp => {
        const date = (exp as any).date || (exp as any).startDate || (exp as any).saleDate || (exp as any).paymentDate;
        const month = new Date(date).toLocaleString('default', { month: 'short' });
        if(monthlyData[month]) {
            if('paidAmount' in exp) monthlyData[month].expense += exp.paidAmount;
            else if('labourCost' in exp) monthlyData[month].expense += exp.labourCost + exp.otherCosts;
            else if('commissionAmount' in exp) monthlyData[month].expense += exp.commissionAmount;
            else if('amount' in exp) monthlyData[month].expense += exp.amount;
        }
    });
    
    return monthOrder.map(month => ({
        month,
        income: monthlyData[month].income,
        expense: monthlyData[month].expense,
    }));

  }, [invoices, purchaseOrders, productionOrders, salesCommissions, salaryPayments, expenses, dateRange]);

  if (isLoading) {
    return <Skeleton className="h-full w-full" />;
  }

  return (
    <ChartContainer config={chartConfig} className="w-full h-full">
      <AreaChart
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
        <defs>
            <linearGradient id="fillIncome" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-income)"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="var(--color-income)"
                stopOpacity={0.1}
              />
            </linearGradient>
             <linearGradient id="fillExpense" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-expense)"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="var(--color-expense)"
                stopOpacity={0.1}
              />
            </linearGradient>
          </defs>
        <Area
          dataKey="income"
          type="natural"
          fill="url(#fillIncome)"
          stroke="var(--color-income)"
        />
        <Area
          dataKey="expense"
          type="natural"
          fill="url(#fillExpense)"
          stroke="var(--color-expense)"
        />
      </AreaChart>
    </ChartContainer>
  );
}
