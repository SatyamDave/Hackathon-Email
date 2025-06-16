import React from 'react';
import Sidebar from './Sidebar';
import InboxView from './InboxView';
import EmailDetail from './EmailDetail';
import RightSidebar from './RightSidebar';
import AIPromptBox from './AIPromptBox';

export default function Layout() {
  // Simply show the main app UI with mock data
  // Authentication is handled at the App level
  return (
    <div className="h-screen flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <InboxView />
        <AIPromptBox />
      </div>
      <EmailDetail />
      <RightSidebar />
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