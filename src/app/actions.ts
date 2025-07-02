'use server';

import { suggestGarmentDetails, type SuggestGarmentDetailsInput } from '@/ai/flows/suggest-garment-details';
import { collection, doc, getDocs, limit, query, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function getAiSuggestions(data: SuggestGarmentDetailsInput) {
    try {
        const result = await suggestGarmentDetails(data);
        return { success: true, suggestions: result.suggestions };
    } catch (error) {
        console.error('Error getting AI suggestions:', error);
        return { success: false, error: 'Failed to get AI suggestions.' };
    }
}

export async function createUserDocument(uid: string) {
    try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, limit(1));
        const snapshot = await getDocs(q);
        
        const role = snapshot.empty ? 'admin' : 'tailor';

        await setDoc(doc(db, 'users', uid), { role });

        return { success: true, role };
    } catch (error: any) {
        console.error('Error creating user document:', error);
        return { success: false, error: error.message || 'Failed to create user document.' };
    }
}
