// src/ai/flows/generate-report-draft.ts
'use server';

/**
 * @fileOverview Generates a draft medical report from appointment notes using AI.
 *
 * - generateReportDraft - A function that generates a draft medical report.
 * - GenerateReportDraftInput - The input type for the generateReportDraft function.
 * - GenerateReportDraftOutput - The return type for the generateReportDraft function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateReportDraftInputSchema = z.object({
  appointmentNotes: z
    .string()
    .describe('The notes taken during the medical appointment.'),
});
export type GenerateReportDraftInput = z.infer<typeof GenerateReportDraftInputSchema>;

const GenerateReportDraftOutputSchema = z.object({
  reportDraft: z.string().describe('The draft medical report, including ICD codes.'),
});
export type GenerateReportDraftOutput = z.infer<typeof GenerateReportDraftOutputSchema>;

export async function generateReportDraft(input: GenerateReportDraftInput): Promise<GenerateReportDraftOutput> {
  return generateReportDraftFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateReportDraftPrompt',
  input: {schema: GenerateReportDraftInputSchema},
  output: {schema: GenerateReportDraftOutputSchema},
  prompt: `You are an AI assistant to a doctor. You are provided with notes from a medical appointment. Your job is to generate a draft report for billing purposes, including relevant ICD codes.

Appointment Notes: {{{appointmentNotes}}}`,
});

const generateReportDraftFlow = ai.defineFlow(
  {
    name: 'generateReportDraftFlow',
    inputSchema: GenerateReportDraftInputSchema,
    outputSchema: GenerateReportDraftOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
