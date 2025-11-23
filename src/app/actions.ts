"use server";

import { generateSalesForecast, GenerateSalesForecastInput } from "@/ai/flows/generate-sales-forecast";
import { invoices } from "@/lib/data";

export async function getSalesForecast() {
  // This is a simplified example. In a real app, you'd gather this data from your database.
  const historicalSalesData = invoices.map(i => ({
    productId: 'general',
    date: i.date,
    quantitySold: Math.floor(i.amount / 100), // dummy data
    revenue: i.amount,
  }));

  const marketTrendData = [
    { date: "2023-08-01", trendScore: 0.5 },
    { date: "2023-09-01", trendScore: 0.6 },
    { date: "2023-10-01", trendScore: 0.7 },
  ];

  const input: GenerateSalesForecastInput = {
    historicalSalesData,
    marketTrendData,
    productName: "All Products",
    forecastHorizon: "3 months",
  };

  try {
    const forecast = await generateSalesForecast(input);
    return { ...forecast, error: undefined };
  } catch (error) {
    console.error("Error generating sales forecast:", error);
    return { error: "Failed to generate forecast. The AI model may be unavailable." };
  }
}
