// Targeted announcement generation flow.

'use server';

/**
 * @fileOverview A targeted announcement AI agent.
 *
 * - targetedAnnouncement - A function that handles the targeted announcement process.
 * - TargetedAnnouncementInput - The input type for the targetedAnnouncement function.
 * - TargetedAnnouncementOutput - The return type for the targetedAnnouncement function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TargetedAnnouncementInputSchema = z.object({
  zone: z.string().describe('The zone to target with the announcement.'),
  userGroup: z.string().describe('The user group to target with the announcement.'),
  realTimeNeeds: z.string().describe('The real-time needs or situation prompting the announcement.'),
});
export type TargetedAnnouncementInput = z.infer<typeof TargetedAnnouncementInputSchema>;

const TargetedAnnouncementOutputSchema = z.object({
  announcement: z.string().describe('The generated targeted announcement.'),
});
export type TargetedAnnouncementOutput = z.infer<typeof TargetedAnnouncementOutputSchema>;

export async function targetedAnnouncement(input: TargetedAnnouncementInput): Promise<TargetedAnnouncementOutput> {
  return targetedAnnouncementFlow(input);
}

const prompt = ai.definePrompt({
  name: 'targetedAnnouncementPrompt',
  input: {schema: TargetedAnnouncementInputSchema},
  output: {schema: TargetedAnnouncementOutputSchema},
  prompt: `You are an expert in crafting targeted announcements for events.

You will generate an announcement that is relevant and effectively communicates the necessary information based on real-time needs.

Zone: {{{zone}}}
User Group: {{{userGroup}}}
Real-time Needs: {{{realTimeNeeds}}}

Announcement:`,
});

const targetedAnnouncementFlow = ai.defineFlow(
  {
    name: 'targetedAnnouncementFlow',
    inputSchema: TargetedAnnouncementInputSchema,
    outputSchema: TargetedAnnouncementOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
