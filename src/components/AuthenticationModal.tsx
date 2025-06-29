import React, { useState } from 'react';
import { Brain, CheckCircle, ArrowRight } from 'lucide-react';

interface AuthenticationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthenticationModal({ isOpen, onClose }: AuthenticationModalProps) {
  const [step, setStep] = useState<'intro' | 'connecting' | 'success'>('intro');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleConnect = async () => {
    try {
      setIsLoading(true);
      setStep('connecting');
      
      // Mock connection process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setStep('success');
      
      // Auto close after success
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Mock auth error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
        {step === 'intro' && (
          <div className="p-6 text-center">
            <h2 className="text-xl font-bold mb-4">Sign in to SmartInbox</h2>
            <button
              onClick={handleConnect}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <span>Sign in with Microsoft</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
        {step === 'connecting' && (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="animate-spin">
                <Brain className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Connecting to Outlook</h3>
            <p className="text-gray-600 mb-4">Setting up your AI-powered inbox...</p>
            <div className="flex justify-center">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        {step === 'success' && (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Successfully Connected!</h3>
            <p className="text-gray-600">Your SmartInbox is now syncing with Outlook and processing emails with AI.</p>
          </div>
        )}
      </div>
    </div>
  );
}