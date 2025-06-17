import React, { createContext, useContext, useState, useEffect } from 'react';
import { Email } from '../types/email';
import { AzureOpenAIService } from '../services/azureOpenAI';
import { outlookService } from '../services/outlookService';
import { useMsal } from '@azure/msal-react';
import { loginRequest } from '../msalConfig';

interface EmailContextType {
  emails: Email[];
  selectedEmail: Email | null;
  currentView: string;
  searchQuery: string;
  isLoading: boolean;
  isAuthenticated: boolean;
  user: any;
  accessToken: string | null;
  error: string | null;
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
  generateAIPriorities: () => Promise<void>;
  generateCustomView: (criteria: string) => Promise<void>;
  hasAIPriorities: boolean;
  hasCustomView: boolean;
  customCriteria: string;
}

const EmailContext = createContext<EmailContextType | undefined>(undefined);

export function EmailProvider({ children }: { children: React.ReactNode }) {
  const { instance, accounts } = useMsal();
  const account = accounts[0];
  const [emails, setEmails] = useState<Email[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [currentView, setCurrentView] = useState<string>('default');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasAIPriorities, setHasAIPriorities] = useState(false);
  const [hasCustomView, setHasCustomView] = useState(false);
  const [customCriteria, setCustomCriteria] = useState('');

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
        if (!hasAIPriorities) {
          // Show empty view until AI priorities are generated
          return [];
        }
        filtered.sort((a, b) => {
          if (a.urgency === 'high' && b.urgency !== 'high') return -1;
          if (a.urgency !== 'high' && b.urgency === 'high') return 1;
          if (a.isImportant && !b.isImportant) return -1;
          if (!a.isImportant && b.isImportant) return 1;
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        });
        break;
      case 'custom':
        if (!hasCustomView) {
          // Show empty view until custom sorting is generated
          return [];
        }
        // Custom view maintains the order set by generateCustomView
        // No additional sorting needed as emails are already in custom order
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
    setIsLoading(true);
    setError(null);
    try {
      if (!account) throw new Error('No account found. Please sign in.');
      const response = await instance.acquireTokenSilent({
        ...loginRequest,
        account,
      });
      setIsAuthenticated(true);
      setUser(account);
      setAccessToken(response.accessToken);
      // Fetch emails after authentication
      const outlookEmails = await outlookService.syncEmails(account.username, response.accessToken);
      setEmails(outlookEmails);
    } catch (error: any) {
      setIsAuthenticated(false);
      setUser(null);
      setAccessToken(null);
      setEmails([]);
      setError(error.message || 'Outlook authentication failed.');
      console.error('Outlook authentication failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const syncEmails = async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (!user || !accessToken) throw new Error('Not authenticated. Please sign in.');
      const outlookEmails = await outlookService.syncEmails(user.username, accessToken);
      setEmails(outlookEmails);
    } catch (error: any) {
      setEmails([]);
      setError(error.message || 'Failed to sync emails.');
      console.error('Failed to sync emails:', error);
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

  const generateAIPriorities = async () => {
    setIsLoading(true);
    try {
      console.log('Generating AI priorities for emails...');
      const priorities = await AzureOpenAIService.smartPrioritizeEmails(emails);
      console.log('AI-generated priorities:', priorities);
      
      // Update emails with AI-generated priorities
      const updatedEmails = emails.map(email => ({
        ...email,
        urgency: priorities[email.id] || email.urgency
      }));
      
      setEmails(updatedEmails);
      setHasAIPriorities(true);
      console.log('Emails updated with AI priorities');
    } catch (error) {
      console.error('Failed to generate AI priorities:', error);
      // Could add error state here if needed
    } finally {
      setIsLoading(false);
    }
  };

  const generateCustomView = async (criteria: string) => {
    setIsLoading(true);
    try {
      console.log('Generating custom view with criteria:', criteria);
      const customSorting = await AzureOpenAIService.generateCustomSorting(emails, criteria);
      console.log('AI-generated custom sorting:', customSorting);
      
      // Apply custom sorting to emails
      const sortedEmails = [...emails].sort((a, b) => {
        const aIndex = customSorting.indexOf(a.id);
        const bIndex = customSorting.indexOf(b.id);
        
        // If both emails are in the custom sorting, use that order
        if (aIndex !== -1 && bIndex !== -1) {
          return aIndex - bIndex;
        }
        // If only one is in the custom sorting, prioritize it
        if (aIndex !== -1) return -1;
        if (bIndex !== -1) return 1;
        // If neither is in custom sorting, maintain original order
        return 0;
      });
      
      setEmails(sortedEmails);
      setCustomCriteria(criteria);
      setHasCustomView(true);
      console.log('Emails updated with custom sorting');
    } catch (error) {
      console.error('Failed to generate custom view:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (account && !isAuthenticated) {
      authenticateOutlook();
    }
    // eslint-disable-next-line
  }, [account]);

  return (
    <EmailContext.Provider value={{
      emails,
      selectedEmail,
      currentView,
      searchQuery,
      isLoading,
      isAuthenticated,
      user,
      accessToken,
      error,
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
      scheduleMeeting,
      generateAIPriorities,
      generateCustomView,
      hasAIPriorities,
      hasCustomView,
      customCriteria
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