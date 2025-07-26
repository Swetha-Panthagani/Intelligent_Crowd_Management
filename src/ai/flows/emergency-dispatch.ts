'use server';

/**
 * @fileOverview An emergency dispatch AI agent.
 *
 * - emergencyDispatch - A function that handles the emergency dispatch process.
 * - EmergencyDispatchInput - The input type for the emergencyDispatch function.
 * - EmergencyDispatchOutput - The return type for the emergencyDispatch function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EmergencyDispatchInputSchema = z.object({
  zoneId: z.string().describe('The ID of the zone where the emergency is.'),
  incidentType: z.string().describe('The type of incident (e.g., Medical, Security).'),
  message: z.string().describe('A message describing the situation.'),
});
export type EmergencyDispatchInput = z.infer<typeof EmergencyDispatchInputSchema>;

const EmergencyDispatchOutputSchema = z.object({
  status: z.enum(['success', 'info', 'error']).describe('The status of the dispatch call.'),
  responseMessage: z.string().describe('A confirmation or informational message.'),
});
export type EmergencyDispatchOutput = z.infer<typeof EmergencyDispatchOutputSchema>;

export async function emergencyDispatch(input: EmergencyDispatchInput): Promise<EmergencyDispatchOutput> {
  return emergencyDispatchFlow(input);
}

const prompt = ai.definePrompt({
  name: 'emergencyDispatchPrompt',
  input: {schema: EmergencyDispatchInputSchema},
  output: {schema: EmergencyDispatchOutputSchema},
  prompt: `You are an emergency dispatcher for a large event. Your task is to process an incoming request and determine the appropriate response.

Request Details:
- Zone: {{{zoneId}}}
- Incident Type: {{{incidentType}}}
- Message: {{{message}}}

Analyze the message. If it contains keywords like "emergency," "urgent," "ambulance," "unconscious," or "not breathing," treat it as a high-priority emergency. In this case, the response should confirm that emergency services have been notified and an ambulance has been dispatched. Set the status to "success".

If the message describes a less critical situation, the response should state that the information has been received and the relevant personnel have been informed. Set the status to "info".

If the message is unclear or lacks information, ask for more details and set the status to "error".
`,
});

const emergencyDispatchFlow = ai.defineFlow(
  {
    name: 'emergencyDispatchFlow',
    inputSchema: EmergencyDispatchInputSchema,
    outputSchema: EmergencyDispatchOutputSchema,
  },
  async input => {
    // In a real-world scenario, you would integrate with a third-party API
    // here to actually dispatch emergency services.
    // For this demo, we are using an AI to simulate the response.
    const {output} = await prompt(input);
    return output!;
  }
);
