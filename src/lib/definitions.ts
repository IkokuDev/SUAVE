export interface Client {
    id: string;
    name: string;
    phone?: string;
    email?: string;
    createdBy?: string;
}

export interface Order {
    id: string;
    date_in: string;
    date_out: string;
    status: string;
    instructions: string;
    gender: 'male' | 'female';
    measurements: Record<string, string>;
    garment_options?: Record<string, boolean>;
    tailor_name?: string;
    ai_suggestions?: string;
}

export const femaleMeasurements = {
    "Bust Point": "", "Under Bust Length": "", "Half Length/Half Back": "", "Blouse Length": "", "Knee Gown Length": "", "3/4 Gown Length": "", "Full Gown Length": "", "Shoulder/Round Shoulder": "", "Back Width": "", "Bust": "", "Round Under Bust": "", "Blouse Waist": "", "Hip": "", "Hip Line": "", "Chest Line": "", "Above Bust": "", "Long Sleeves": "", "Short / 3/4 Sleeves": "", "Round Sleeves": "", "Armhole": "", "Neck Depth / Round Neck": "", "Skirt Length": "", "Skirt Waist": "", "Trouser / Short Length": "", "Trouser Waist": "", "Thigh": "", "Trouser Mouth": "", "Jumpsuit Length": ""
};
export const maleMeasurements = {
    "Agbada/Babanriga Length": "", "Agbada/Babanriga Back": "", "Bufa/Kaftan Length": "", "Back": "", "Neck": "", "Long Sleeves Length": "", "Short Sleeves Length": "", "3/4 Sleeves Length": "", "Girth/Chest Length": "", "Shirt Length": "", "Trouser Length": "", "Trouser Waist": "", "Thigh/Lap": "", "Trouser Mouth": "", "Trouser Knee": "", "Cap": ""
};
export const maleGarmentOptions = {
    "Patch Pocket": false, "Inner Pocket": false, "Suit Pocket": false, "Chest Pocket": false, "Patch Suit Pocket": false, "Long Sleeves with Links": false, "Long Sleeves with Buttons": false, "Open Sleeves with Buttons": false, "English Trouser": false, "Joggers Trouser": false, "Rope only": false, "Rope & Elastics": false, "Trouser & Belt Holes": false
};
