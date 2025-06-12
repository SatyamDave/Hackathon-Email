import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import InboxView from './InboxView';
import EmailDetail from './EmailDetail';
import DayPlanner from './DayPlanner';
import AuthenticationModal from './AuthenticationModal';
import AIPromptBox from './AIPromptBox';
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
        <div className="h-screen bg-dark-primary flex items-center justify-center">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-4 bg-dark-secondary rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-dark-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-dark-text-primary mb-2">Welcome to SmartInbox</h3>
            <p className="text-dark-text-secondary mb-4">Connect your Outlook account to get started with AI-powered email management</p>
            <button
              onClick={() => setShowAuthModal(true)}
              className="px-6 py-2 bg-dark-accent text-dark-primary rounded-lg hover:bg-dark-accent/90 transition-colors"
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
    <div className="h-screen bg-dark-primary flex">
      {/* Main Sidebar */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex">
        {/* Left Section: Inbox and Email Detail */}
        <div className="flex-1 flex flex-col">
      {/* Inbox View */}
          <div className="w-96 bg-dark-secondary border-r border-dark-muted flex flex-col">
        <InboxView />
      </div>
      
      {/* Email Detail */}
        <div className="flex-1">
          {selectedEmail ? <EmailDetail /> : <EmptyState />}
          </div>
        </div>
        
        {/* Right Section: Smart Planner */}
        <div className="w-80 bg-dark-secondary border-l border-dark-muted">
          <DayPlanner />
        </div>
      </div>

      {/* AI Assistant - Floating in bottom left */}
      <div className="fixed bottom-6 left-[420px]">
        <AIPromptBox />
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
    <div className="h-full flex items-center justify-center bg-dark-primary">
      <div className="text-center">
        <div className="w-24 h-24 mx-auto mb-4 bg-dark-secondary rounded-full flex items-center justify-center">
          <svg className="w-12 h-12 text-dark-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-dark-text-primary mb-2">Welcome to SmartInbox</h3>
        <p className="text-dark-text-secondary">Select an email to start reading with AI-powered assistance</p>
      </div>
    </div>
  );
}