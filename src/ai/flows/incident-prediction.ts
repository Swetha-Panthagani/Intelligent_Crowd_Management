'use server';

/**
 * @fileOverview An incident prediction AI agent.
 *
 * - predictIncident - A function that handles the incident prediction process.
 * - PredictIncidentInput - The input type for the predictIncident function.
 * - PredictIncidentOutput - The return type for the predictIncident function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictIncidentInputSchema = z.object({
  zoneDensities: z.array(
    z.object({
      zoneId: z.string().describe('The ID of the zone (e.g., north, east, south, west).'),
      density: z
        .number()
        .min(0)
        .max(1)
        .describe('The crowd density in the zone, between 0 and 1.'),
    })
  ).describe('An array of zone densities.'),
  historicalData: z.string().describe('Historical data of past events, including dates, times, and incident occurrences.'),
});
export type PredictIncidentInput = z.infer<typeof PredictIncidentInputSchema>;

const PredictIncidentOutputSchema = z.object({
  predictedIncidents: z.array(
    z.object({
      zoneId: z.string().describe('The ID of the zone where the incident is predicted.'),
      incidentType: z.string().describe('The type of incident predicted (e.g., overcrowding, security breach).'),
      severity: z.enum(['low', 'medium', 'high']).describe('The severity of the predicted incident.'),
      probability: z.number().min(0).max(1).describe('The probability of the incident occurring, between 0 and 1.'),
      recommendations: z.string().describe('Recommendations to prevent the predicted incident.'),
    })
  ).describe('An array of predicted incidents.'),
});
export type PredictIncidentOutput = z.infer<typeof PredictIncidentOutputSchema>;

export async function predictIncident(input: PredictIncidentInput): Promise<PredictIncidentOutput> {
  return predictIncidentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictIncidentPrompt',
  input: {schema: PredictIncidentInputSchema},
  output: {schema: PredictIncidentOutputSchema},
  prompt: `You are an AI assistant designed to predict potential incidents at events based on crowd density and historical data.

You are provided with the current crowd densities for different zones and historical data from past events. Your goal is to analyze this information and predict any potential incidents that might occur.

Current Zone Densities:
{{#each zoneDensities}}
- Zone ID: {{this.zoneId}}, Density: {{this.density}}
{{/each}}

Historical Data:
{{historicalData}}

Based on this information, predict any potential incidents, including the zone ID, incident type, severity (low, medium, high), probability (0-1), and recommendations to prevent the incident.

Format your output as a JSON array of predicted incidents. Each incident should include the zoneId, incidentType, severity, probability, and recommendations.
`,
});

const predictIncidentFlow = ai.defineFlow(
  {
    name: 'predictIncidentFlow',
    inputSchema: PredictIncidentInputSchema,
    outputSchema: PredictIncidentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
