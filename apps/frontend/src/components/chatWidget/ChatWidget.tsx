/**
 * Main ChatWidget component - Entry point
 * Floating button that triggers the chat modal
 */

import React, { lazy, Suspense, useState, useEffect } from 'react';
import { useChatAnalytics } from '../../hooks/useChatAnalytics';

// Lazy load the chat modal for performance
const ChatModal = lazy(() => import("../chatWidget/ChatModal"));

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { trackChatOpen } = useChatAnalytics();
  
  // Prevent body scroll when chat is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);
  
  const handleOpen = () => {
    setIsOpen(true);
    trackChatOpen();
  };
  
  const handleClose = () => {
    setIsOpen(false);
  };
  
  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={handleOpen}
        className="fixed bottom-6 right-6 group z-40"
        aria-label="Open chat"
        style={{
          animation: 'float 2s ease-in-out infinite'
        }}
      >
        <div className="relative">
          {/* Pulsing ring effect */}
          <div className="absolute inset-0 rounded-full bg-indigo-400 opacity-75 animate-ping" />
          
          {/* Main button */}
          <div className="relative bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110">
            <svg 
              className="w-6 h-6 text-white" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" 
              />
            </svg>
          </div>
        </div>
      </button>
      
      {/* Chat Modal */}
      {isOpen && (
        <Suspense fallback={
          <div className="fixed bottom-20 right-4 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex items-center justify-center z-50">
            <div className="text-gray-500">Loading chat...</div>
          </div>
        }>
          <ChatModal onClose={handleClose} />
        </Suspense>
      )}
      
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </>
  );
};

export default ChatWidget;