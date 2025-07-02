'use server';
/**
 * @fileOverview An AI agent that suggests garment details and measurements based on client instructions.
 *
 * - suggestGarmentDetails - A function that handles the garment detail suggestion process.
 * - SuggestGarmentDetailsInput - The input type for the suggestGarmentDetails function.
 * - SuggestGarmentDetailsOutput - The return type for the suggestGarmentDetails function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestGarmentDetailsInputSchema = z.object({
  gender: z.enum(['male', 'female']).describe('The gender for which the garment is being made.'),
  instructions: z.string().describe('The client instructions for the garment.'),
});
export type SuggestGarmentDetailsInput = z.infer<typeof SuggestGarmentDetailsInputSchema>;

const SuggestGarmentDetailsOutputSchema = z.object({
  suggestions: z.string().describe('AI-generated suggestions for garment details and measurements.'),
});
export type SuggestGarmentDetailsOutput = z.infer<typeof SuggestGarmentDetailsOutputSchema>;

export async function suggestGarmentDetails(input: SuggestGarmentDetailsInput): Promise<SuggestGarmentDetailsOutput> {
  return suggestGarmentDetailsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestGarmentDetailsPrompt',
  input: {schema: SuggestGarmentDetailsInputSchema},
  output: {schema: SuggestGarmentDetailsOutputSchema},
  prompt: `You are an expert tailoring assistant. Based on the client's instructions and the specified gender, you will suggest garment details and measurements.  Provide only the suggestion, and nothing else.\n\nGender: {{{gender}}}\nInstructions: {{{instructions}}}`,
});

const suggestGarmentDetailsFlow = ai.defineFlow(
  {
    name: 'suggestGarmentDetailsFlow',
    inputSchema: SuggestGarmentDetailsInputSchema,
    outputSchema: SuggestGarmentDetailsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
