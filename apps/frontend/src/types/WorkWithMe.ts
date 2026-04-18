// FILE: workWithMe.ts
// PURPOSE: Define the shape of our data for TypeScript
// ANALOGY: Like a form you fill out that tells you what information to put where

/**
 * A single plan (like "Essential MVP" or "Hourly Consulting")
 * This is the smallest piece of our data
 */
export interface Plan {
    id: string;           // Unique ID like "deliver_basic" - never changes
    name: string;         // Display name like "Essential MVP"
    price: string;        // Price like "$1,500"
    value: string[];      // Array of benefits like ["3-page website", "Mobile responsive"]
    specs: string[];      // Array of technical features like ["React", "Tailwind CSS"]
}

/**
 * A category (like "Deliver My Project" or "Work With Me")
 * This groups related plans together
 */
export interface Category {
    id: string;           // Unique ID like "deliver" or "work" or "coffee"
    title: string;        // Display title like "🚀 Deliver My Project"
    description: string;  // Short explanation of what this category offers
    icon: string;         // Emoji icon like "🚀"
    color: string;        // Color code like "#6366f1" (indigo)
    plans: Plan[];        // Array of plans inside this category
}

/**
 * The complete data structure from our JSON file
 */
export interface PlansData {
    categories: Category[];  // Array of all categories
}

/**
 * What the user selects in the first modal
 * This stores which category they clicked on
 */
export interface SelectedCategory {
    id: string;        // "deliver", "work", or "coffee"
    title: string;     // Display title
    icon: string;      // Emoji
    color: string;     // Color for styling
}

/**
 * What the user selects in the second modal
 * This stores which plan they clicked on
 */
export interface SelectedPlan {
    categoryId: string;  // Which category this plan belongs to
    plan: Plan;          // The actual plan object
}

/**
 * The form data the user submits
 * This is what gets saved to the database
 */

// FORM DATA TYPES - Different for each category

// For "Deliver My Project" form
export interface DeliverFormData {
    name: string;
    email: string;
    projectType: string;      // Selected from dropdown
    projectDescription: string;
    planId: string;
    planName: string;
    price: string;
    createdAt: string;
}

// For "Work With Me" (Mentor) form
export interface WorkFormData {
    name: string;
    email: string;
    currentLevel: string;     // Beginner, Intermediate, Advanced
    primaryGoal: string;       // Learn, Build Projects, Get Job, Other
    goalsDescription: string;
    planId: string;
    planName: string;
    price: string;
    createdAt: string;
}

// For "Coffee With Me" form
export interface CoffeeFormData {
    name: string;
    email: string;
    urgency: string;           // Low, Medium, High
    details: string;
    planId: string;
    planName: string;
    price: string;
    createdAt: string;
}

// Union type for all form data
export type InquiryFormData = DeliverFormData | WorkFormData | CoffeeFormData;