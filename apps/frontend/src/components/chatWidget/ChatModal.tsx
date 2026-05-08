/**
 * Chat Modal with MUI Typography and Glassmorphism effect
 * Following the implementation plan exactly
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Typography,
  Box,
  IconButton,
  Paper,
  CircularProgress,
  useTheme
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import MessageBubble from './MessageBubble';
import QuickReplies from './QuickReplies';
import LeadForm from './LeadForm';
import { CHAT_CONFIG, RESPONSES } from './chatConfig';
import  type { Message, Intent, LeadFormData } from '../../types/chat';
import chatService from '../../services/chatService';
import { useChatAnalytics } from '../../hooks/useChatAnalytics';

const ChatModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const theme = useTheme();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: CHAT_CONFIG.welcomeMessage,
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [selectedIntent, setSelectedIntent] = useState<Intent | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { trackIntentSelected, trackLeadSubmitted, trackChatClose } = useChatAnalytics();
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const addMessage = (text: string, sender: 'user' | 'bot') => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
  };
  
  const handleIntentSelect = async (intent: Intent) => {
    setSelectedIntent(intent);
    trackIntentSelected(intent);
    
    // Add user message
    addMessage(`I want a ${intent}`, 'user');
    
    setIsLoading(true);
    
    try {
      // Call POST /chat/respond endpoint (as per plan)
      const response = await chatService.getAIResponse(intent);
      
      if (response.success && response.data) {
        setTimeout(() => {
          addMessage(response.data.message, 'bot');
          setIsLoading(false);
        }, CHAT_CONFIG.typingDelay);
      } else {
        addMessage(CHAT_CONFIG.errorMessage, 'bot');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error:', error);
      addMessage(CHAT_CONFIG.errorMessage, 'bot');
      setIsLoading(false);
    }
  };
  
  const handleCTAClick = () => {
    setShowForm(true);
    addMessage("Please share your contact details so I can reach out to you:", 'bot');
  };
  
  const handleLeadSubmit = async (formData: LeadFormData) => {
    if (!selectedIntent) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await chatService.submitLead({
        ...formData,
        intent: selectedIntent,
      });
      
      if (response.success) {
        addMessage(CHAT_CONFIG.successMessage, 'bot');
        trackLeadSubmitted(selectedIntent, true);
        
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        addMessage(CHAT_CONFIG.errorMessage, 'bot');
        trackLeadSubmitted(selectedIntent, false);
      }
    } catch (error) {
      console.error('Error:', error);
      addMessage(CHAT_CONFIG.errorMessage, 'bot');
      trackLeadSubmitted(selectedIntent, false);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Paper
      elevation={24}
      sx={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        width: { xs: '100%', sm: 400 },
        height: 600,
        borderRadius: 4,
        overflow: 'hidden',
        zIndex: 1300,
        // Glassmorphism effect
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        animation: 'slideUp 0.3s ease-out',
      }}
    >
      {/* Header with MUI Typography */}
      <Box
        sx={{
          background: 'linear-gradient(to top right, #d946ef, #059669, #020617)',
          p: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box>
          <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
            {CHAT_CONFIG.title}
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
            Typically replies in minutes
          </Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </Box>
      
      {/* Messages Area with Scroll */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          height: 'calc(100% - 120px)',
          backgroundColor: 'rgba(248, 250, 252, 0.5)',
        }}
      >
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        
        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
            <CircularProgress size={24} />
            <Typography variant="body2" sx={{ ml: 1 }}>
              {CHAT_CONFIG.loadingText}
            </Typography>
          </Box>
        )}
        
        {/* Quick Replies - Dynamic rendering from config */}
        {messages.length === 1 && !selectedIntent && (
          <QuickReplies onSelect={handleIntentSelect} disabled={isLoading} />
        )}
        
        {/* CTA Button */}
        {selectedIntent && !showForm && messages[messages.length - 1]?.sender === 'bot' && (
          <Box sx={{ mt: 2 }}>
            <button
              onClick={handleCTAClick}
              style={{
                width: '100%',
                padding: '12px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'transform 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              {RESPONSES[selectedIntent].cta}
            </button>
          </Box>
        )}
        
        {/* Lead Form */}
        {showForm && (
          <LeadForm onSubmit={handleLeadSubmit} isLoading={isSubmitting} />
        )}
        
        <div ref={messagesEndRef} />
      </Box>
      
      {/* Footer with Typography */}
      <Box
        sx={{
          p: 1.5,
          borderTop: '1px solid rgba(0,0,0,0.1)',
          textAlign: 'center',
          backgroundColor: 'rgba(255,255,255,0.8)',
        }}
      >
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          Powered by AI • Secure & Private
        </Typography>
      </Box>
      
      <style>
        {`
          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </Paper>
  );
};

export default ChatModal;