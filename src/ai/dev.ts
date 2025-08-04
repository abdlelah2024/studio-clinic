import { config } from 'dotenv';
config();

import '@/ai/flows/generate-report-draft.ts';
import '@/ai/flows/explain-term-flow.ts';
import '@/ai/flows/delete-user-flow.ts';
