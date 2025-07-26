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
  output: {schema: z.object({ message: z.string() })},
  prompt: `You are an emergency dispatcher for a large event. Your task is to process an incoming request and determine the appropriate response.

Request Details:
- Zone: {{{zoneId}}}
- Incident Type: {{{incidentType}}}
- Message: {{{message}}}

Analyze the message. If it contains keywords like "emergency," "urgent," "ambulance," "unconscious," or "not breathing," treat it as a high-priority emergency. In this case, construct a message payload that includes the word 'emergency'.

If the message describes a less critical situation, construct a message payload that includes the word 'info'.

If the message is unclear or lacks information, construct a message payload that asks for more details.
`,
});

const emergencyDispatchFlow = ai.defineFlow(
  {
    name: 'emergencyDispatchFlow',
    inputSchema: EmergencyDispatchInputSchema,
    outputSchema: EmergencyDispatchOutputSchema,
  },
  async input => {
    // Generate a message payload using the AI prompt
    const { output } = await prompt(input);

    if (!output) {
      return {
        status: 'error',
        responseMessage: 'Failed to generate a valid dispatch message.',
      };
    }

    try {
      // Call the external ambulance dispatch service
      const response = await fetch('http://127.0.0.1:3000/call_ambulance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: output.message }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Dispatch API error:', errorText);
        return {
          status: 'error',
          responseMessage: `Dispatch service returned an error: ${response.statusText}`,
        };
      }

      const result = await response.json();

      return {
        status: result.status || 'info',
        responseMessage: result.message || 'Dispatch completed.',
      };
    } catch (error) {
      console.error('Failed to call dispatch service:', error);
      return {
        status: 'error',
        responseMessage: 'Could not connect to the emergency dispatch service.',
      };
    }
  }
);
