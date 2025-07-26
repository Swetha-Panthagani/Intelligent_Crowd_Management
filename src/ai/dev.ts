import { config } from 'dotenv';
config();

import '@/ai/flows/incident-prediction.ts';
import '@/ai/flows/targeted-announcement-generation.ts';
import '@/ai/flows/emergency-dispatch.ts';
