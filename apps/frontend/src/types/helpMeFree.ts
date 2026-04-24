// FILE: helpMeFree.ts
// PURPOSE: Type definitions for the Help Me Free feature

/**
 * A free option (like "15-Minute Chat" or "Audit My Website")
 * This is what shows in the first modal
 */
export interface FreeOption {
    id: string;           // Unique ID like "fifteen_min_chat"
    title: string;        // Display title like "15-Minute Chat"
    description: string;  // Short explanation of what this offers
    icon: string;         // Emoji icon like "⚡"
    color: string;        // Color code for borders/accents
    formType: string;     // Which form to show: "quick_chat", "website_audit", "tech_catchup"
}

/**
 * The data structure from our JSON file
 */
export interface HelpMeFreeData {
    freeOptions: FreeOption[];
}

/**
 * Form data for 15-Minute Chat
 */
export interface QuickChatFormData {
    name: string;
    email: string;
    question: string;      // What they need help with in 15 minutes
    optionId: string;
    optionTitle: string;
    createdAt: string;
}

/**
 * Form data for Website Audit
 */
export interface WebsiteAuditFormData {
    name: string;
    email: string;
    websiteUrl: string;    // The URL to audit
    optionId: string;
    optionTitle: string;
    createdAt: string;
}

/**
 * Form data for Tech Catch-up
 */
export interface TechCatchupFormData {
    name: string;
    email: string;
    description: string;   // What they want to talk about
    preferredDate: string; // Date they want to meet (YYYY-MM-DD)
    preferredTime: string; // Time they want to meet (HH:MM)
    meetingMethod: string; // "video_call", "phone_call", "in_person"
    optionId: string;
    optionTitle: string;
    createdAt: string;
}

// Union type for all free help form data
export type FreeHelpFormData = QuickChatFormData | WebsiteAuditFormData | TechCatchupFormData;

/**
 * What the user selects in the first modal
 */
export interface SelectedFreeOption {
    id: string;
    title: string;
    icon: string;
    color: string;
    formType: string;
}