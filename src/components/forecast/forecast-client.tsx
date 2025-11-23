"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Bar, BarChart, XAxis, YAxis } from "recharts";
import { BrainCircuit, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getSalesForecast } from "@/app/actions";
import type { GenerateSalesForecastOutput } from "@/ai/flows/generate-sales-forecast";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

type ForecastResult = Partial<GenerateSalesForecastOutput> & { error?: string };

const chartConfig = {
  predictedSales: {
    label: "Predicted Sales",
    color: "hsl(var(--primary))",
  },
};

export default function ForecastClient() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ForecastResult | null>(null);

  const handleGenerateForecast = async () => {
    setLoading(true);
    setResult(null);
    const forecastResult = await getSalesForecast();
    setResult(forecastResult);
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-4">
        <div className="flex-1 space-y-1">
          <p className="text-sm font-medium">Quarterly Sales Forecast</p>
          <p className="text-sm text-muted-foreground">
            Generate a 3-month sales forecast based on recent sales and market trends.
          </p>
        </div>
        <Button onClick={handleGenerateForecast} disabled={loading}>
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <BrainCircuit className="mr-2 h-4 w-4" />
          )}
          Generate Forecast
        </Button>
      </div>

      {loading && (
        <div className="flex items-center justify-center rounded-lg border border-dashed h-64">
            <div className="text-center">
                <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                <p className="mt-2 text-sm text-muted-foreground">AI is analyzing the data...</p>
            </div>
        </div>
      )}

      {result?.error && (
        <Card className="border-destructive">
            <CardHeader>
                <CardTitle className="text-destructive">Error</CardTitle>
            </CardHeader>
            <CardContent>
                <p>{result.error}</p>
            </CardContent>
        </Card>
      )}

      {result?.forecast && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
            <Card className="lg:col-span-3">
                <CardHeader>
                    <CardTitle>Forecasted Sales</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px] w-full">
                    <ChartContainer config={chartConfig} className="w-full h-full">
                        <BarChart accessibilityLayer data={result.forecast}>
                            <XAxis
                                dataKey="month"
                                stroke="hsl(var(--muted-foreground))"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                stroke="hsl(var(--muted-foreground))"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `${value}`}
                            />
                            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                            <Bar dataKey="predictedSales" fill="var(--color-predictedSales)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>
            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle>AI Summary & Insights</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">{result.summary}</p>
                </CardContent>
            </Card>
        </div>
      )}
    </div>
  );
}
