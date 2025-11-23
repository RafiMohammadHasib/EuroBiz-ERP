'use server';

/**
 * @fileOverview An AI agent for generating sales forecasts.
 *
 * - generateSalesForecast - A function that generates a sales forecast.
 * - GenerateSalesForecastInput - The input type for the generateSalesForecast function.
 * - GenerateSalesForecastOutput - The return type for the generateSalesForecast function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const HistoricalSalesDataSchema = z.object({
  productId: z.string().describe('The unique identifier for the product.'),
  date: z.string().describe('The date of the sale (YYYY-MM-DD).'),
  quantitySold: z.number().describe('The quantity of the product sold.'),
  revenue: z.number().describe('The revenue generated from the sale.'),
});

const MarketTrendDataSchema = z.object({
  date: z.string().describe('The date for the market trend (YYYY-MM-DD).'),
  trendScore: z.number().describe('A numerical score indicating the market trend strength.'),
});

const GenerateSalesForecastInputSchema = z.object({
  historicalSalesData: z.array(HistoricalSalesDataSchema).describe('Historical sales data for the product.'),
  marketTrendData: z.array(MarketTrendDataSchema).describe('Market trend data relevant to the product.'),
  productName: z.string().describe('The name of the product to forecast sales for.'),
  forecastHorizon: z.string().describe('The forecast horizon in months (e.g., 3 months, 6 months).'),
});
export type GenerateSalesForecastInput = z.infer<typeof GenerateSalesForecastInputSchema>;

const SalesForecastSchema = z.object({
  month: z.string().describe('The month for the sales forecast (YYYY-MM).'),
  predictedSales: z.number().describe('The predicted sales volume for the month.'),
  confidenceIntervalLow: z.number().optional().describe('The lower bound of the confidence interval for the prediction.'),
  confidenceIntervalHigh: z.number().optional().describe('The upper bound of the confidence interval for the prediction.'),
});

const GenerateSalesForecastOutputSchema = z.object({
  forecast: z.array(SalesForecastSchema).describe('Sales forecast for the next quarter.'),
  summary: z.string().describe('A summary of the sales forecast, including key trends and insights.'),
});
export type GenerateSalesForecastOutput = z.infer<typeof GenerateSalesForecastOutputSchema>;

export async function generateSalesForecast(input: GenerateSalesForecastInput): Promise<GenerateSalesForecastOutput> {
  return generateSalesForecastFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSalesForecastPrompt',
  input: {schema: GenerateSalesForecastInputSchema},
  output: {schema: GenerateSalesForecastOutputSchema},
  prompt: `You are an AI sales forecasting expert. Analyze the historical sales data and market trends to generate a sales forecast for the next quarter.

  Product Name: {{{productName}}}
  Forecast Horizon: {{{forecastHorizon}}}

  Historical Sales Data:
  {{#each historicalSalesData}}
  - Date: {{{date}}}, Quantity Sold: {{{quantitySold}}}, Revenue: {{{revenue}}}
  {{/each}}

  Market Trend Data:
  {{#each marketTrendData}}
  - Date: {{{date}}}, Trend Score: {{{trendScore}}}
  {{/each}}

  Based on this data, provide a sales forecast for each month in the next quarter, including predicted sales volume, a confidence interval (if possible), and a summary of key trends and insights.
  `,
});

const generateSalesForecastFlow = ai.defineFlow(
  {
    name: 'generateSalesForecastFlow',
    inputSchema: GenerateSalesForecastInputSchema,
    outputSchema: GenerateSalesForecastOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
