/**
 * Lead capture form with validation
 * Secure form handling with proper error messages
 */

import React, { useState } from 'react';
import type { LeadFormData } from '../../types/chat';

interface LeadFormProps {
  onSubmit: (data: LeadFormData) => Promise<void>;
  isLoading?: boolean;
}

const LeadForm: React.FC<LeadFormProps> = ({ onSubmit, isLoading = false }) => {
  const [formData, setFormData] = useState<LeadFormData>({ name: '', email: '' });
  const [errors, setErrors] = useState<Partial<LeadFormData>>({});

  // Email validation regex - secure and comprehensive
  const validateEmail = (email: string): boolean => {
    // RFC 5322 compliant email regex (simplified but secure)
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<LeadFormData> = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Name is optional but if provided, sanitize it
    if (formData.name && formData.name.length > 100) {
      newErrors.name = 'Name is too long (max 100 characters)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Sanitize inputs before sending
    const sanitizedData: LeadFormData = {
      name: formData.name.trim().slice(0, 100),
      email: formData.email.trim().toLowerCase()
    };
    
    await onSubmit(sanitizedData);
  };

  const handleInputChange = (field: keyof LeadFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 p-4 bg-white rounded-lg shadow-md">
      <div className="mb-3">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Name (Optional)
        </label>
        <input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Your name"
          maxLength={100}
          disabled={isLoading}
        />
        {errors.name && (
          <p className="text-red-500 text-xs mt-1">{errors.name}</p>
        )}
      </div>
      
      <div className="mb-3">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email Address *
        </label>
        <input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            errors.email ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="you@example.com"
          required
          disabled={isLoading}
        />
        {errors.email && (
          <p className="text-red-500 text-xs mt-1">{errors.email}</p>
        )}
      </div>
      
      <button
        type="submit"
        disabled={isLoading}
        className={`
          w-full py-2 rounded-lg font-medium transition-all duration-200
          ${isLoading 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:shadow-lg transform hover:scale-[1.02]'
          }
          text-white
        `}
      >
        {isLoading ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
};

export default LeadForm;