"use server";

import { predictIncident, PredictIncidentInput } from "@/ai/flows/incident-prediction";
import { targetedAnnouncement, TargetedAnnouncementInput } from "@/ai/flows/targeted-announcement-generation";

export async function runIncidentPrediction(input: PredictIncidentInput) {
  return await predictIncident(input);
}

export async function runTargetedAnnouncement(input: TargetedAnnouncementInput) {
  return await targetedAnnouncement(input);
}
