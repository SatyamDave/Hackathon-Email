import React, { createContext, useContext, useState, useEffect } from 'react';
import { Email } from '../types/email';
import { mockEmails } from '../data/mockEmails';

// Toast system
interface Toast {
  id: number;
  message: string;
  type?: 'success' | 'error' | 'info';
}

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
  resetToDefault: () => void;
  toasts: Toast[];
  addToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: number) => void;
}

const EmailContext = createContext<EmailContextType | undefined>(undefined);

export function EmailProvider({ children }: { children: React.ReactNode }) {
  const [emails, setEmails] = useState<Email[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [currentView, setCurrentView] = useState<string>('default');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasAIPriorities, setHasAIPriorities] = useState(false);
  const [hasCustomView, setHasCustomView] = useState(false);
  const [customCriteria, setCustomCriteria] = useState('');
  const [toasts, setToasts] = useState<Toast[]>([]);
  let toastId = 0;

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    toastId += 1;
    const id = toastId;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 2500);
  };

  const removeToast = (id: number) => setToasts((prev) => prev.filter(t => t.id !== id));

  // Initialize emails on mount
  useEffect(() => {
    setEmails(mockEmails);
  }, []);

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
          return [];
        }
        break;
      default:
        filtered.sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
    }

    return filtered;
  };

  const syncEmails = async () => {
    setIsLoading(true);
    setError(null);
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setEmails(mockEmails);
        addToast('Emails synced!', 'success');
        setIsLoading(false);
        resolve();
      }, 1200);
    });
  };

  const generateAIPriorities = async () => {
    setIsLoading(true);
    
    // Simple mock priority logic - no real AI, start from fresh mock data
    const processedEmails = mockEmails.map(email => {
      let urgency: 'high' | 'medium' | 'low' = 'medium';
      
      const content = (email.subject + ' ' + email.content + ' ' + email.sender.name).toLowerCase();
      
      // High priority keywords
      if (content.includes('urgent') || content.includes('asap') || content.includes('immediate') || 
          content.includes('security') || content.includes('breach') || content.includes('critical') ||
          content.includes('deadline') || content.includes('ceo') || content.includes('manager')) {
        urgency = 'high';
      }
      // Low priority keywords  
      else if (content.includes('newsletter') || content.includes('unsubscribe') || 
               content.includes('social') || content.includes('promotion') || content.includes('marketing')) {
        urgency = 'low';
      }
      
      return { ...email, urgency };
    });
    
    setEmails(processedEmails);
    setHasAIPriorities(true);
    addToast('AI priorities generated!', 'success');
    setIsLoading(false);
  };

  const resetToDefault = () => {
    setEmails(mockEmails);
    setHasAIPriorities(false);
    setHasCustomView(false);
    setCustomCriteria('');
    addToast('Reset to default view!', 'info');
  };

  const generateCustomView = async (criteria: string) => {
    setIsLoading(true);
    
    const criteriaLower = criteria.toLowerCase();
    // Start fresh from mock emails to avoid stale state
    let sortedEmails = [...mockEmails];
    
    // Hardcoded use cases
    if (criteriaLower.includes('security')) {
      // Case 1: Security on top
      sortedEmails.sort((a, b) => {
        const aHasSecurity = (a.subject + ' ' + a.content + ' ' + a.sender.name).toLowerCase().includes('security');
        const bHasSecurity = (b.subject + ' ' + b.content + ' ' + b.sender.name).toLowerCase().includes('security');
        
        if (aHasSecurity && !bHasSecurity) return -1;
        if (!aHasSecurity && bHasSecurity) return 1;
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      });
      addToast('Security emails moved to top!', 'success');
    }
    else if (criteriaLower.includes('meeting')) {
      // Case 2: Meetings on top
      sortedEmails.sort((a, b) => {
        const aHasMeeting = (a.subject + ' ' + a.content).toLowerCase().includes('meeting') || 
                           (a.subject + ' ' + a.content).toLowerCase().includes('call') ||
                           (a.subject + ' ' + a.content).toLowerCase().includes('schedule');
        const bHasMeeting = (b.subject + ' ' + b.content).toLowerCase().includes('meeting') || 
                           (b.subject + ' ' + b.content).toLowerCase().includes('call') ||
                           (b.subject + ' ' + b.content).toLowerCase().includes('schedule');
        
        if (aHasMeeting && !bHasMeeting) return -1;
        if (!aHasMeeting && bHasMeeting) return 1;
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      });
      addToast('Meeting emails moved to top!', 'success');
    }
         
    else {
      // Default: just reverse chronological order
      sortedEmails.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      addToast('Custom filter applied!', 'success');
    }
    
         setEmails(sortedEmails);
     setCustomCriteria(criteria);
     setHasCustomView(true);
     setIsLoading(false);
  };

  const generateSummary = async (email: Email) => {
    // Simple mock summary - no real AI
    return `Summary: ${email.preview}`;
  };

  const generateReply = async (email: Email) => {
    // Simple mock reply - no real AI
    return `Thank you for your email about "${email.subject}". I will review and get back to you soon.`;
  };

  const sendReply = async (emailId: string, content: string) => {
    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        addToast('Reply sent!', 'success');
        resolve(true);
      }, 1000);
    });
  };

  const scheduleMeeting = async (meetingData: any) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        addToast('Meeting scheduled!', 'success');
        resolve({});
      }, 1000);
    });
  };

  return (
    <EmailContext.Provider value={{
      emails,
      selectedEmail,
      currentView,
      searchQuery,
      isLoading,
      isAuthenticated: true,
      user: { name: 'Demo User', username: 'demo@demo.com' },
      accessToken: 'demo-token',
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
      authenticateOutlook: async () => {},
      syncEmails,
      sendReply,
      scheduleMeeting,
      generateAIPriorities,
      generateCustomView,
      hasAIPriorities,
      hasCustomView,
      customCriteria,
      resetToDefault,
      toasts,
      addToast,
      removeToast
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