import React from 'react';
import Sidebar from './Sidebar';
import InboxView from './InboxView';
import EmailDetail from './EmailDetail';
import AIAssistantSidebar from './AIAssistantSidebar';
import AIPromptBox from './AIPromptBox';
import Toast from './Toast';
import { useEmail } from '../contexts/EmailContext';

export default function Layout() {
  const { toasts, removeToast } = useEmail();
  
  return (
    <div className="h-screen flex bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col border-r border-gray-200 bg-white">
        <InboxView />
        <div className="border-t border-gray-200 bg-white">
          <AIPromptBox />
        </div>
      </div>
      <div className="w-[45%] flex flex-col border-r border-gray-200 bg-white">
        <EmailDetail />
      </div>
      <AIAssistantSidebar />
      <Toast toasts={toasts} removeToast={removeToast} />
    </div>
  );
}

function EmptyState() {
  return (
    <div className="h-full flex items-center justify-center bg-white">
      <div className="text-center max-w-md p-8">
        <div className="w-24 h-24 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
          <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-xl font-medium text-gray-900 mb-3">Welcome to SmartBox</h3>
        <p className="text-gray-600 leading-relaxed">
          Select an email to start reading with AI-powered assistance. Our smart features will help you focus on what matters most.
        </p>
      </div>
    </div>
  );
}