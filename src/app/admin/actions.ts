"use server";

import { predictIncident, PredictIncidentInput } from "@/ai/flows/incident-prediction";
import { targetedAnnouncement, TargetedAnnouncementInput } from "@/ai/flows/targeted-announcement-generation";
import { emergencyDispatch, EmergencyDispatchInput } from "@/ai/flows/emergency-dispatch";

export async function runIncidentPrediction(input: PredictIncidentInput) {
  return await predictIncident(input);
}

export async function runTargetedAnnouncement(input: TargetedAnnouncementInput) {
  return await targetedAnnouncement(input);
}

export async function runEmergencyDispatch(input: EmergencyDispatchInput) {
  return await emergencyDispatch(input);
}
