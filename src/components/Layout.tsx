import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import InboxView from './InboxView';
import EmailDetail from './EmailDetail';
import DayPlanner from './DayPlanner';
import AuthenticationModal from './AuthenticationModal';
import { useEmail } from '../contexts/EmailContext';

export default function Layout() {
  const { selectedEmail, isAuthenticated, isLoading } = useEmail();
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      setShowAuthModal(true);
    }
  }, [isAuthenticated, isLoading]);

  const handleAuthModalClose = () => {
    setShowAuthModal(false);
  };

  if (!isAuthenticated) {
    return (
      <>
        <div className="h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Welcome to SmartInbox</h3>
            <p className="text-gray-500 mb-4">Connect your Outlook account to get started with AI-powered email management</p>
            <button
              onClick={() => setShowAuthModal(true)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Connect to Outlook
            </button>
          </div>
        </div>
        <AuthenticationModal 
          isOpen={showAuthModal} 
          onClose={handleAuthModalClose}
        />
      </>
    );
  }

  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Main Sidebar */}
      <Sidebar />
      
      {/* Inbox View */}
      <div className="w-96 bg-white border-r border-gray-200 flex flex-col">
        <InboxView />
      </div>
      
      {/* Email Detail */}
      <div className="flex-1 flex">
        <div className="flex-1">
          {selectedEmail ? <EmailDetail /> : <EmptyState />}
        </div>
        
        {/* Day Planner */}
        <div className="w-80 bg-white border-l border-gray-200">
          <DayPlanner />
        </div>
      </div>

      <AuthenticationModal 
        isOpen={showAuthModal} 
        onClose={handleAuthModalClose}
      />
    </div>
  );
}

function EmptyState() {
  return (
    <div className="h-full flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-24 h-24 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
          <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Welcome to SmartInbox</h3>
        <p className="text-gray-500">Select an email to start reading with AI-powered assistance</p>
      </div>
    </div>
  );
}