// Integrate with third-party predictive sales analytics services using an LLM to improve the accuracy of sales forecasts.

'use server';

/**
 * @fileOverview Integrates with third-party predictive sales analytics services using an LLM to improve the accuracy of sales forecasts.
 *
 * - integratePredictiveAnalytics - A function that handles the integration with predictive analytics services.
 * - IntegratePredictiveAnalyticsInput - The input type for the integratePredictiveAnalytics function.
 * - IntegratePredictiveAnalyticsOutput - The return type for the integratePredictiveAnalytics function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IntegratePredictiveAnalyticsInputSchema = z.object({
  historicalSalesData: z.string().describe('Historical sales data in JSON format.'),
  marketTrends: z.string().describe('Market trends data in JSON format.'),
  predictiveAnalyticsServiceDescription: z
    .string()
    .describe('A description of the predictive analytics service to use.'),
});

export type IntegratePredictiveAnalyticsInput = z.infer<
  typeof IntegratePredictiveAnalyticsInputSchema
>;

const IntegratePredictiveAnalyticsOutputSchema = z.object({
  improvedSalesForecast: z.string().describe('Improved sales forecast using the predictive analytics service.'),
  analysisSummary: z.string().describe('Summary of the analysis performed by the LLM.'),
});

export type IntegratePredictiveAnalyticsOutput = z.infer<
  typeof IntegratePredictiveAnalyticsOutputSchema
>;

async function integratePredictiveAnalytics(
  input: IntegratePredictiveAnalyticsInput
): Promise<IntegratePredictiveAnalyticsOutput> {
  return integratePredictiveAnalyticsFlow(input);
}

const integratePredictiveAnalyticsPrompt = ai.definePrompt({
  name: 'integratePredictiveAnalyticsPrompt',
  input: {schema: IntegratePredictiveAnalyticsInputSchema},
  output: {schema: IntegratePredictiveAnalyticsOutputSchema},
  prompt: `You are an AI expert in sales forecasting.  Integrate this historical data:
{{historicalSalesData}}
with these market trends:
{{marketTrends}}
using the service described as:
{{predictiveAnalyticsServiceDescription}}
to create an improved sales forecast.  Summarize the analysis you performed to create the forecast.

Format your response as follows:
{"improvedSalesForecast": "your improved sales forecast here", "analysisSummary": "your analysis summary here"}`,
});

const integratePredictiveAnalyticsFlow = ai.defineFlow(
  {
    name: 'integratePredictiveAnalyticsFlow',
    inputSchema: IntegratePredictiveAnalyticsInputSchema,
    outputSchema: IntegratePredictiveAnalyticsOutputSchema,
  },
  async input => {
    const {output} = await integratePredictiveAnalyticsPrompt(input);
    return output!;
  }
);

export {integratePredictiveAnalytics, IntegratePredictiveAnalyticsInput, IntegratePredictiveAnalyticsOutput};
