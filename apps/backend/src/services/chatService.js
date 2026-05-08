// /**
//  * Chat service - works with your existing Supabase tables
//  */

// const supabase = require('../config/supabase');
// const { v4: uuidv4 } = require('uuid');
// const responses = require('../config/responses.json');

// class ChatService {
//   /**
//    * Start a new chat session
//    */
//   async startSession(intent, sessionId = null) {
//     const finalSessionId = sessionId || uuidv4();
    
//     const { data, error } = await supabase
//       .from('chat_sessions')
//       .insert([
//         {
//           session_id: finalSessionId,
//           intent: intent,
//           status: 'active',
//           created_at: new Date(),
//           updated_at: new Date()
//         }
//       ])
//       .select()
//       .single();
    
//     if (error) {
//       console.error('Error starting session:', error);
//       throw new Error('Failed to start chat session');
//     }
    
//     return data;
//   }
  
//   /**
//    * Get AI response based on intent
//    */
//   async getAIResponse(intent, userMessage = null) {
//     const responseMap = responses;
    
//     const defaultResponse = {
//       message: "Thanks for reaching out! How can I help you today?",
//       cta: "Get Started"
//     };
    
//     return responseMap[intent] || defaultResponse;
//   }
  
//   /**
//    * Save lead to your existing Supabase leads table
//    */
//   async saveLead(leadData) {
//     const { name, email, intent, sessionId } = leadData;
    
//     // Validate email
//     if (!email || !this.validateEmail(email)) {
//       throw new Error('Invalid email address');
//     }
    
//     const { data, error } = await supabase
//       .from('leads')  // Your existing leads table
//       .insert([
//         {
//           name: name || null,
//           email: email.toLowerCase().trim(),
//           intent: intent,
//           session_id: sessionId || null,
//           status: 'new',
//           created_at: new Date()
//         }
//       ])
//       .select()
//       .single();
    
//     if (error) {
//       console.error('Error saving lead:', error);
//       throw new Error('Failed to save lead');
//     }
    
//     // Update session status
//     if (sessionId) {
//       await supabase
//         .from('chat_sessions')
//         .update({ 
//           status: 'converted',
//           updated_at: new Date()
//         })
//         .eq('session_id', sessionId);
//     }
    
//     return data;
//   }
  
//   /**
//    * Track analytics event
//    */
//   async trackEvent(eventName, sessionId, properties = {}) {
//     const { error } = await supabase
//       .from('analytics_events')
//       .insert([
//         {
//           event_name: eventName,
//           session_id: sessionId,
//           properties: properties,
//           created_at: new Date()
//         }
//       ]);
    
//     if (error) {
//       console.error('Error tracking event:', error);
//       // Don't throw - analytics shouldn't break the main flow
//     }
    
//     return true;
//   }
  
//   /**
//    * Validate email format
//    */
//   validateEmail(email) {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return emailRegex.test(email);
//   }
// }

// module.exports = new ChatService();

/**
 * Chat service layer for Supabase integration
 */

const supabase = require('../config/supabase');
const { v4: uuidv4 } = require('uuid');

// Load responses directly
const responses = require('../config/responses.json');

class ChatService {
  /**
   * Start a new chat session
   */
  async startSession(intent, sessionId = null) {
    const finalSessionId = sessionId || uuidv4();
    
    const { data, error } = await supabase
      .from('chat_sessions')
      .insert([
        {
          session_id: finalSessionId,
          intent: intent,
          status: 'active'
        }
      ])
      .select()
      .single();
    
    if (error) {
      console.error('Error starting session:', error);
      throw new Error('Failed to start chat session');
    }
    
    return data;
  }
  
  /**
   * Get AI response based on intent
   */
  async getAIResponse(intent, userMessage = null) {
    console.log('📝 Getting response for intent:', intent);
    console.log('📚 Available responses:', Object.keys(responses));
    
    // Get response from the JSON file
    const response = responses[intent];
    
    if (!response) {
      console.error('❌ No response found for intent:', intent);
      // Return a fallback response
      return {
        message: "Thanks for reaching out! How can I help you today?",
        cta: "Get Started"
      };
    }
    
    console.log('✅ Found response:', response);
    return response;
  }
  
  /**
   * Save lead to database
   */
  async saveLead(leadData) {
    const { name, email, intent, sessionId } = leadData;
    
    // Validate email
    if (!email || !this.validateEmail(email)) {
      throw new Error('Invalid email address');
    }
    
    const { data, error } = await supabase
      .from('leads')
      .insert([
        {
          name: name || null,
          email: email.toLowerCase().trim(),
          intent: intent,
          session_id: sessionId || null,
          status: 'new'
        }
      ])
      .select()
      .single();
    
    if (error) {
      console.error('Error saving lead:', error);
      throw new Error('Failed to save lead');
    }
    
    return data;
  }
  
  /**
   * Validate email format
   */
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

module.exports = new ChatService();