'use server';

import { suggestGarmentDetails, type SuggestGarmentDetailsInput } from '@/ai/flows/suggest-garment-details';

export async function getAiSuggestions(data: SuggestGarmentDetailsInput) {
    try {
        const result = await suggestGarmentDetails(data);
        return { success: true, suggestions: result.suggestions };
    } catch (error) {
        console.error('Error getting AI suggestions:', error);
        let errorMessage = 'Failed to get AI suggestions.';
        if (error instanceof Error) {
            if (error.message.includes('API key')) {
                errorMessage = 'Your Google AI API key is missing or invalid. Please check your .env file.';
            } else {
                errorMessage = error.message;
            }
        }
        return { success: false, error: errorMessage };
    }
}
