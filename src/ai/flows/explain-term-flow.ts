'use server';

/**
 * @fileOverview Explains a medical term using AI.
 *
 * - explainMedicalTerm - A function that provides an explanation for a medical term.
 * - ExplainMedicalTermInput - The input type for the explainMedicalTerm function.
 * - ExplainMedicalTermOutput - The return type for the explainMedicalTerm function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainMedicalTermInputSchema = z.object({
  term: z.string().describe('The medical term to be explained.'),
});
export type ExplainMedicalTermInput = z.infer<typeof ExplainMedicalTermInputSchema>;

const ExplainMedicalTermOutputSchema = z.object({
  explanation: z
    .string()
    .describe('A simple, easy-to-understand explanation of the medical term.'),
});
export type ExplainMedicalTermOutput = z.infer<typeof ExplainMedicalTermOutputSchema>;

export async function explainMedicalTerm(
  input: ExplainMedicalTermInput
): Promise<ExplainMedicalTermOutput> {
  return explainMedicalTermFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainMedicalTermPrompt',
  input: {schema: ExplainMedicalTermInputSchema},
  output: {schema: ExplainMedicalTermOutputSchema},
  prompt: `You are a medical expert with a talent for explaining complex topics in simple terms. A user has asked for an explanation of a medical term.

Provide a concise, easy-to-understand explanation for the following term: {{{term}}}

Keep the explanation to 2-3 sentences.`,
});

const explainMedicalTermFlow = ai.defineFlow(
  {
    name: 'explainMedicalTermFlow',
    inputSchema: ExplainMedicalTermInputSchema,
    outputSchema: ExplainMedicalTermOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
