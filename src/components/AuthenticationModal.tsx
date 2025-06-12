import React, { useState } from 'react';
import { Brain, Mail, Calendar, Sparkles, CheckCircle, ArrowRight } from 'lucide-react';
import { useEmail } from '../contexts/EmailContext';

interface AuthenticationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthenticationModal({ isOpen, onClose }: AuthenticationModalProps) {
  const { authenticateOutlook, isLoading } = useEmail();
  const [step, setStep] = useState<'intro' | 'connecting' | 'success'>('intro');

  if (!isOpen) return null;

  const handleConnect = async () => {
    try {
      setStep('connecting');
      await authenticateOutlook();
      setStep('success');
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Authentication failed:', error);
      setStep('intro');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
        {step === 'intro' && (
          <>
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                  <Brain className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Connect to Outlook</h2>
                  <p className="text-blue-100 text-sm">Enable AI-powered email management</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="space-y-4 mb-6">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Mail className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Smart Email Processing</h3>
                    <p className="text-sm text-gray-600">AI automatically summarizes, categorizes, and prioritizes your emails</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Sparkles className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Auto-Generated Replies</h3>
                    <p className="text-sm text-gray-600">Get intelligent reply suggestions based on email content and context</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Calendar className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Smart Scheduling</h3>
                    <p className="text-sm text-gray-600">Automatically detect and schedule meetings from email requests</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium text-gray-900">Secure & Private</span>
                </div>
                <p className="text-xs text-gray-600">
                  Your emails are processed securely. We only access what's needed for AI features and never store sensitive content.
                </p>
              </div>

              <button
                onClick={handleConnect}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <span>Connect to Outlook</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-xs text-gray-500 text-center mt-3">
                By connecting, you agree to our secure data processing practices
              </p>
            </div>
          </>
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