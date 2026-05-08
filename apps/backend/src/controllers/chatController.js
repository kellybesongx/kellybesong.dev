/**
 * Chat controller - handles all chat endpoints
 * POST /chat/start, POST /chat/respond, POST /chat/lead
 */

const chatService = require('../services/chatService');
const { sendLeadNotification } = require('../utils/emailService');

const chatController = {
  /**
   * POST /chat/start
   * Start a new chat session
   */
  async startChat(req, res) {
    try {
      const { intent } = req.body;
      
      // Validate intent (security)
      if (!intent || !['project', 'advice', 'mentorship'].includes(intent)) {
        return res.status(400).json({ 
          success: false, 
          error: 'Invalid intent' 
        });
      }
      
      // Start session
      const session = await chatService.startSession(intent);
      
      // Track analytics
      await chatService.trackEvent('chat_started', session.session_id, { intent });
      
      res.json({
        success: true,
        data: {
          sessionId: session.session_id,
          intent: session.intent,
          message: 'Chat session started'
        }
      });
    } catch (error) {
      console.error('Start chat error:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to start chat session' 
      });
    }
  },
  
  /**
   * POST /chat/respond
   * Get AI response based on intent
   * Maps intent to response template
   */
  async getResponse(req, res) {
    try {
      const { intent, message, sessionId } = req.body;
      
      // Validate intent
      if (!intent || !['project', 'advice', 'mentorship'].includes(intent)) {
        return res.status(400).json({ 
          success: false, 
          error: 'Invalid intent' 
        });
      }
      
      // Get AI response from service
      const response = await chatService.getAIResponse(intent, message);
      
      // Track response event
      if (sessionId) {
        await chatService.trackEvent('ai_response', sessionId, { intent });
      }
      
      res.json({
        success: true,
        data: {
          message: response.message,
          cta: response.cta,
          intent
        }
      });
    } catch (error) {
      console.error('Get response error:', error);
      // Fallback message for recovery
      res.status(500).json({ 
        success: false, 
        error: 'Something went wrong. Try again.',
        data: {
          message: "I'm having trouble right now. Please try again in a moment.",
          cta: "Try Again"
        }
      });
    }
  },
  
  /**
   * POST /chat/lead
   * Capture lead information
   */
  async saveLead(req, res) {
    try {
      const { name, email, intent, sessionId } = req.body;
      
      // Validate required fields
      if (!email) {
        return res.status(400).json({ 
          success: false, 
          error: 'Email is required' 
        });
      }
      
      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ 
          success: false, 
          error: 'Invalid email format' 
        });
      }
      
      // Save lead
      const lead = await chatService.saveLead({
        name: name || '',
        email,
        intent,
        sessionId
      });
      
      // Track conversion
      if (sessionId) {
        await chatService.trackEvent('lead_captured', sessionId, { intent, email });
      }
      
      // OPTIONAL: Send email notification (as per implementation plan)
      await sendLeadNotification({ name, email, intent });
      
      res.json({
        success: true,
        data: {
          message: 'Lead captured successfully',
          leadId: lead.id
        }
      });
    } catch (error) {
      console.error('Save lead error:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to save lead' 
      });
    }
  },
  
  /**
   * GET /chat/analytics
   * Get analytics data (for observation phase)
   */
  // async getAnalytics(req, res) {
  //   try {
  //     const analytics = await chatService.getIntentAnalytics();
      
  //     res.json({
  //       success: true,
  //       data: analytics
  //     });
  //   } catch (error) {
  //     console.error('Get analytics error:', error);
  //     res.status(500).json({ 
  //       success: false, 
  //       error: 'Failed to get analytics' 
  //     });
  //   }
  // }
};

module.exports = {chatController};