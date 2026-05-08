// frontend/src/types/chat.types.ts

export type Intent = 'project' | 'advice' | 'mentorship';

export interface ResponseTemplate {
  message: string;
  cta: string;
}

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'text' | 'cta' | 'form';
}

export interface LeadFormData {
  name: string;
  email: string;
}

export interface ChatSession {
  id: string;
  intent?: Intent;
  messages: Message[];
  leadCaptured?: boolean;
  startedAt: Date;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

// Analytics event types
export type AnalyticsEvent = 
  | 'chat_open'
  | 'chat_close'
  | 'intent_selected'
  | 'cta_clicked'
  | 'lead_form_opened'
  | 'lead_submitted'
  | 'lead_submit_error'
  | 'api_error';

// Helper function to create a message
export const createMessage = (text: string, sender: 'user' | 'bot'): Message => ({
  id: Date.now().toString(),
  text,
  sender,
  timestamp: new Date()
});