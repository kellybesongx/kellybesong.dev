import React, { useState } from 'react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface LeadForm {
  name: string;
  email: string;
}

const responses = {
  project: {
    message: "I can help you build your project quickly.",
    cta: "Deliver My Project"
  },
  advice: {
    message: "Let's discuss your ideas over a quick chat.",
    cta: "Coffee With Me"
  },
  mentorship: {
    message: "I can guide you step by step.",
    cta: "Mentor Me"
  }
};

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi 👋 What do you need help with?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [selectedIntent, setSelectedIntent] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [leadForm, setLeadForm] = useState<LeadForm>({ name: '', email: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleIntentClick = async (intent: string) => {
    setIsLoading(true);
    setSelectedIntent(intent);
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: `I want to ${intent}`,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    
    // Call backend
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/chat/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ intent })
      });
      
      if (response.ok) {
        // Add bot response
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: responses[intent as keyof typeof responses].message,
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
      }
    } catch (error) {
      console.error('Error:', error);
      // Fallback to local response
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: responses[intent as keyof typeof responses].message,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    }
    
    setIsLoading(false);
  };

  const handleCTA = () => {
    setShowForm(true);
  };

  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadForm.email) {
      alert('Email is required');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/chat/lead`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: leadForm.name,
          email: leadForm.email,
          intent: selectedIntent
        })
      });
      
      if (response.ok) {
        const successMessage: Message = {
          id: Date.now().toString(),
          text: "✅ Got it! I'll reach out soon.",
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, successMessage]);
        setShowForm(false);
        setLeadForm({ name: '', email: '' });
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to submit. Please try again.');
    }
    
    setIsSubmitting(false);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
          fontSize: '24px',
          zIndex: 1000
        }}
      >
        💬
      </button>

      {/* Chat Modal */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '90px',
            right: '20px',
            width: '350px',
            height: '500px',
            backgroundColor: 'white',
            borderRadius: '10px',
            boxShadow: '0 5px 20px rgba(0,0,0,0.2)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1000,
            overflow: 'hidden'
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '15px',
              backgroundColor: '#007bff',
              color: 'white',
              fontWeight: 'bold',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <span>Chat Assistant</span>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                fontSize: '18px'
              }}
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              padding: '15px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '80%'
                }}
              >
                <div
                  style={{
                    padding: '10px',
                    borderRadius: '10px',
                    backgroundColor: msg.sender === 'user' ? '#007bff' : '#f1f1f1',
                    color: msg.sender === 'user' ? 'white' : 'black'
                  }}
                >
                  {msg.text}
                </div>
                <div
                  style={{
                    fontSize: '10px',
                    color: '#999',
                    marginTop: '5px',
                    textAlign: msg.sender === 'user' ? 'right' : 'left'
                  }}
                >
                  {msg.timestamp.toLocaleTimeString()}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div style={{ textAlign: 'center', color: '#999' }}>
                Thinking...
              </div>
            )}

            {/* Intent Buttons (only show at start) */}
            {messages.length === 1 && !selectedIntent && (
              <div
                style={{
                  display: 'flex',
                  gap: '10px',
                  justifyContent: 'center',
                  marginTop: '10px'
                }}
              >
                <button
                  onClick={() => handleIntentClick('project')}
                  style={{
                    padding: '10px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}
                >
                  Start a Project
                </button>
                <button
                  onClick={() => handleIntentClick('advice')}
                  style={{
                    padding: '10px',
                    backgroundColor: '#ffc107',
                    color: 'black',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}
                >
                  Get Advice
                </button>
                <button
                  onClick={() => handleIntentClick('mentorship')}
                  style={{
                    padding: '10px',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}
                >
                  Mentorship
                </button>
              </div>
            )}

            {/* CTA Button */}
            {selectedIntent && !showForm && messages[messages.length - 1]?.sender === 'bot' && (
              <button
                onClick={handleCTA}
                style={{
                  marginTop: '10px',
                  padding: '10px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  width: '100%'
                }}
              >
                {responses[selectedIntent as keyof typeof responses]?.cta}
              </button>
            )}

            {/* Lead Form */}
            {showForm && (
              <form
                onSubmit={handleSubmitLead}
                style={{
                  marginTop: '10px',
                  padding: '15px',
                  backgroundColor: '#f9f9f9',
                  borderRadius: '10px'
                }}
              >
                <input
                  type="text"
                  placeholder="Your Name"
                  value={leadForm.name}
                  onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    marginBottom: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '5px'
                  }}
                />
                <input
                  type="email"
                  placeholder="Your Email *"
                  required
                  value={leadForm.email}
                  onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    marginBottom: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '5px'
                  }}
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer'
                  }}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;