import type { LucideIcon } from "lucide-react";

export type Zone = {
  id: 'north' | 'east' | 'south' | 'west';
  label: string;
  density: number;
  count: number;
};

export type Stat = {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: LucideIcon;
};

export type Stage = {
  id: number;
  stage: string;
  description: string;
};

export type Activity = {
  id: number;
  title: string;
  description: string;
  time: string;
  type: 'success' | 'warning' | 'danger';
  icon: React.ReactNode;
};

export type ScheduleItem = {
    time: string;
    artist: string;
    stage: string;
};

export type Announcement = {
    id: string;
    title: string;
    content: string;
    timestamp: string;
    priority: 'info' | 'critical';
};

export type PredictedIncident = {
  zoneId: string;
  incidentType: string;
  severity: "low" | "medium" | "high";
  probability: number;
  recommendations: string;
};
