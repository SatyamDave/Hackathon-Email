import React, { createContext, useContext, useState } from 'react';
import { Email } from '../types/email';
import { mockEmails } from '../data/mockEmails';

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
  const [emails, setEmails] = useState<Email[]>(mockEmails);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [currentView, setCurrentView] = useState<string>('default');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);

  const markAsRead = (emailId: string) => {
    setEmails(emails.map(email => 
      email.id === emailId ? { ...email, isRead: true } : email
    ));
  };

  const markAsImportant = (emailId: string) => {
    setEmails(emails.map(email => 
      email.id === emailId ? { ...email, isImportant: !email.isImportant } : email
    ));
  };

  const archiveEmail = (emailId: string) => {
    setEmails(emails.filter(email => email.id !== emailId));
  };

  const getFilteredEmails = () => {
    let filtered = [...emails];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(email => 
        email.subject.toLowerCase().includes(query) ||
        email.sender.name.toLowerCase().includes(query) ||
        email.preview.toLowerCase().includes(query)
      );
    }

    // Apply view mode filter
    switch (currentView) {
      case 'priority':
        filtered.sort((a, b) => {
          if (a.urgency === 'high' && b.urgency !== 'high') return -1;
          if (a.urgency !== 'high' && b.urgency === 'high') return 1;
          if (a.isImportant && !b.isImportant) return -1;
          if (!a.isImportant && b.isImportant) return 1;
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        });
        break;
      case 'custom':
        filtered = filtered.filter(email => 
          email.urgency === 'high' || 
          email.isImportant || 
          email.labels.includes('Action Needed')
        );
        break;
      default:
        filtered.sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
    }

    return filtered;
  };

  const generateSummary = async (email: Email) => {
    return `Summary of ${email.subject}: ${email.preview}`;
  };

  const generateReply = async (email: Email) => {
    return `Thank you for your email regarding ${email.subject}. I will review this and get back to you soon.`;
  };

  const authenticateOutlook = async () => {
    setIsAuthenticated(true);
    setUser({ id: 'placeholder', name: 'User', email: 'user@example.com' });
  };

  const syncEmails = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setEmails(mockEmails);
    } finally {
      setIsLoading(false);
    }
  };

  const sendReply = async (emailId: string, content: string) => {
    return true;
  };

  const scheduleMeeting = async (meetingData: any) => {
    return {};
  };

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