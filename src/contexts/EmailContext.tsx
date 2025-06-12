import React, { createContext, useContext, useState } from 'react';
import { Email } from '../types/email';

interface EmailContextType {
  emails: Email[];
  selectedEmail: Email | null;
  currentView: string;
  searchQuery: string;
  isLoading: boolean;
  isAuthenticated: boolean;
  user: any;
  setSelectedEmail: (email: Email | null) => void;
  setCurrentView: (view: string) => void;
  setSearchQuery: (query: string) => void;
  markAsRead: (emailId: string) => void;
  markAsImportant: (emailId: string) => void;
  archiveEmail: (emailId: string) => void;
  getFilteredEmails: () => Email[];
  generateSummary: (email: Email) => Promise<string>;
  generateReply: (email: Email) => Promise<string>;
  authenticateOutlook: () => Promise<void>;
  syncEmails: () => Promise<void>;
  sendReply: (emailId: string, content: string) => Promise<boolean>;
  scheduleMeeting: (meetingData: any) => Promise<any>;
}

const EmailContext = createContext<EmailContextType | undefined>(undefined);

export function EmailProvider({ children }: { children: React.ReactNode }) {
  // Minimal state, all empty or no-op
  const [emails, setEmails] = useState<Email[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [currentView, setCurrentView] = useState<string>('default');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);

  // All functions are no-ops or return empty values
  const markAsRead = (_emailId: string) => {};
  const markAsImportant = (_emailId: string) => {};
  const archiveEmail = (_emailId: string) => {};
  const getFilteredEmails = () => [];
  const generateSummary = async (_email: Email) => '';
  const generateReply = async (_email: Email) => '';
  const authenticateOutlook = async () => {
    setIsAuthenticated(true);
    setUser({ id: 'placeholder', name: 'User', email: 'user@example.com' });
  };
  const syncEmails = async () => {};
  const sendReply = async (_emailId: string, _content: string) => false;
  const scheduleMeeting = async (_meetingData: any) => ({});

  return (
    <EmailContext.Provider value={{
      emails,
      selectedEmail,
      currentView,
      searchQuery,
      isLoading,
      isAuthenticated,
      user,
      setSelectedEmail,
      setCurrentView,
      setSearchQuery,
      markAsRead,
      markAsImportant,
      archiveEmail,
      getFilteredEmails,
      generateSummary,
      generateReply,
      authenticateOutlook,
      syncEmails,
      sendReply,
      scheduleMeeting
    }}>
      {children}
    </EmailContext.Provider>
  );
}

export function useEmail() {
  const context = useContext(EmailContext);
  if (context === undefined) {
    throw new Error('useEmail must be used within an EmailProvider');
  }
  return context;
}