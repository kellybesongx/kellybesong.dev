/**
 * Individual message bubble component
 * Handles both user and bot messages with proper styling
 */

import React from 'react';
import type { Message } from '../../types/chat';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  
  // Escape any potential XSS attempts in user input
  const sanitizedText = React.useMemo(() => {
    if (isUser) {
      // Basic sanitization: remove script tags and dangerous HTML
      return message.text.replace(/<[^>]*>/g, '');
    }
    return message.text;
  }, [message.text, isUser]);

  return (
    <div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3 animate-fade-in`}
      style={{
        animation: 'fadeIn 0.3s ease-in-out'
      }}
    >
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2 ${
          isUser
            ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
            : 'bg-gray-100 text-gray-800'
        }`}
        style={{
          boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
        }}
      >
        <p className="text-sm break-words">{sanitizedText}</p>
        <span className="text-xs opacity-75 mt-1 block">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
};

export default MessageBubble;