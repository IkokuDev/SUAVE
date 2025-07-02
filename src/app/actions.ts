'use server';

import { suggestGarmentDetails, type SuggestGarmentDetailsInput } from '@/ai/flows/suggest-garment-details';

export async function getAiSuggestions(data: SuggestGarmentDetailsInput) {
    try {
        const result = await suggestGarmentDetails(data);
        return { success: true, suggestions: result.suggestions };
    } catch (error) {
        console.error('Error getting AI suggestions:', error);
        return { success: false, error: 'Failed to get AI suggestions.' };
    }
}
