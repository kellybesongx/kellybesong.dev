// /**
//  * API service for chat backend communication
//  * Handles all HTTP requests with error handling
//  */

// import type { Intent, LeadFormData, ApiResponse } from '../types/chat';

// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// class ChatService {
//   private async request<T>(
//     endpoint: string,
//     options: RequestInit
//   ): Promise<ApiResponse<T>> {
//     try {
//       const response = await fetch(`${API_URL}${endpoint}`, {
//         ...options,
//         headers: {
//           'Content-Type': 'application/json',
//           ...options.headers,
//         },
//       });
      
//       if (!response.ok) {
//         const error = await response.json();
//         throw new Error(error.message || 'Request failed');
//       }
      
//       const data = await response.json();
//       return { success: true, data };
//     } catch (error) {
//       console.error(`API Error ${endpoint}:`, error);
//       return {
//         success: false,
//         error: error instanceof Error ? error.message : 'Unknown error occurred'
//       };
//     }
//   }
  
//   /**
//    * Start a chat session with selected intent
//    */
//   async startChat(intent: Intent): Promise<ApiResponse> {
//     return this.request('/chat/start', {
//       method: 'POST',
//       body: JSON.stringify({ intent }),
//     });
//   }
  
//   /**
//    * Submit lead information
//    */
//   async submitLead(data: LeadFormData & { intent: Intent }): Promise<ApiResponse> {
//     return this.request('/chat/lead', {
//       method: 'POST',
//       body: JSON.stringify(data),
//     });
//   }
  
//   /**
//    * Get AI response (currently using predefined templates)
//    * Future: This can be upgraded to actual AI
//    */
//   async getAIResponse(intent: Intent, userMessage?: string): Promise<ApiResponse> {
//     return this.request('/chat/respond', {
//       method: 'POST',
//       body: JSON.stringify({ intent, message: userMessage }),
//     });
//   }
// }

// export default new ChatService();

// frontend/src/services/chatService.ts

import type { Intent, LeadFormData, ApiResponse } from '../types/chat';

// Use relative path for Vercel deployment
// const API_URL = process.env.REACT_APP_API_URL || '/api';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

class ChatService {
  private async request<T>(
    endpoint: string,
    options: RequestInit
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Request failed');
      }
      
      const data = await response.json();
      // return { success: true, data };
      return data;
    } catch (error) {
      console.error(`API Error ${endpoint}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
  
  async startChat(intent: Intent): Promise<ApiResponse> {
    return this.request('/api/chat/start', {
      method: 'POST',
      body: JSON.stringify({ intent }),
    });
  }
  
  async getAIResponse(intent: Intent): Promise<ApiResponse> {
    return this.request('/api/chat/respond', {
      method: 'POST',
      body: JSON.stringify({ intent }),
    });
  }
  
  async submitLead(data: LeadFormData & { intent: Intent }): Promise<ApiResponse> {
    return this.request('/api/chat/lead', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export default new ChatService();