/**
 * Central configuration for the chatbot
 * Easy to modify without touching component logic
 */

import type { Intent, ResponseTemplate } from '../../types/chat';

// Available intents for the user to choose from
export const INTENTS = [
  { id: 'project' as Intent, label: 'Start a Project', emoji: '🚀' },
  { id: 'advice' as Intent, label: 'Get Advice', emoji: '💡' },
  { id: 'mentorship' as Intent, label: 'Mentorship', emoji: '🎓' }
];

// Response templates for each intent
export const RESPONSES: Record<Intent, ResponseTemplate> = {
  project: {
    message: "I can help you build your project quickly. Let's discuss your requirements and create a timeline that works for you!",
    cta: "Deliver My Project"
  },
  advice: {
    message: "Let's discuss your ideas over a quick chat. I've helped many developers overcome similar challenges.",
    cta: "Coffee With Me ☕"
  },
  mentorship: {
    message: "I can guide you step by step through your learning journey. Let's create a personalized roadmap for you.",
    cta: "Mentor Me"
  }
};

// UI Configuration
export const CHAT_CONFIG = {
  title: 'Talk To Us',
  welcomeMessage: "Hi 👋 What do you need help with?",
  successMessage: "✅ Got it! I'll reach out soon.",
  errorMessage: "❌ Something went wrong. Please try again.",
  loadingText: "Typing...",
  submittingText: "Submitting...",
  
  // Timing configurations
  typingDelay: 500, // ms
  autoCloseDelay: 30000, // ms - auto close after 30 seconds of inactivity
  
  // Color scheme (matching your portfolio)
  colors: {
    primary: '#6366f1', // Indigo - matches modern portfolios
    secondary: '#8b5cf6',
    success: '#10b981',
    error: '#ef4444',
    userBubble: '#6366f1',
    botBubble: '#f3f4f6'
  }
};