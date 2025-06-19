import React from 'react';
import { Star, Paperclip, Calendar, AlertCircle, Brain, Wand2, Search } from 'lucide-react';
import { useEmail } from '../contexts/EmailContext';
import { Email } from '../types/email';

export default function EmailList() {
  const { getFilteredEmails, selectedEmail, setSelectedEmail, markAsRead, currentView } = useEmail();
  const emails = getFilteredEmails();

  const handleEmailClick = (email: Email, event?: React.MouseEvent) => {
    // Prevent default behavior to avoid page refresh
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    setSelectedEmail(email);
    if (!email.isRead) {
      markAsRead(email.id);
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  // Helper function to get sender info from either structure
  const getSenderInfo = (email: any) => {
    // Handle nested sender structure (from Email interface)
    if (email.sender && typeof email.sender === 'object') {
      return {
        name: email.sender.name || 'Unknown',
        email: email.sender.email || '',
        avatar: email.sender.avatar
      };
    }
    
    // Handle flat structure (from mock data)
    return {
      name: email.sender_name || email.sender?.name || 'Unknown',
      email: email.sender_email || email.sender?.email || '',
      avatar: email.sender_avatar || email.sender?.avatar
    };
  };

  // Helper function to get email properties
  const getEmailProperty = (email: any, property: string, fallback?: any) => {
    // Try direct property first
    if (email[property] !== undefined) {
      return email[property];
    }
    
    // Try alternative property names
    const alternatives: { [key: string]: string[] } = {
      'timestamp': ['received_at', 'timestamp'],
      'isRead': ['is_read', 'isRead'],
      'isImportant': ['is_important', 'isImportant'],
      'urgency': ['urgency'],
      'subject': ['subject'],
      'preview': ['preview'],
      'content': ['content'],
      'attachments': ['has_attachments', 'attachments'],
      'meetingRequest': ['meeting_request', 'meetingRequest'],
      'labels': ['labels']
    };
    
    if (alternatives[property]) {
      for (const alt of alternatives[property]) {
        if (email[alt] !== undefined) {
          return email[alt];
        }
      }
    }
    
    return fallback;
  };

  if (emails.length === 0) {
    const getEmptyStateContent = () => {
      switch (currentView) {
        case 'priority':
          return {
            icon: <Brain className="w-8 h-8 text-dark-accent" />,
            title: "No AI Priorities Generated",
            description: "Click the 'Generate AI Priorities' button above to let AI analyze and prioritize your emails."
          };
        case 'custom':
          return {
            icon: <Wand2 className="w-8 h-8 text-dark-accent" />,
            title: "No Custom View Generated",
            description: "Enter your sorting criteria above and click 'Generate' to create a custom email view."
          };
        default:
          return {
            icon: <Search className="w-8 h-8 text-dark-accent" />,
            title: "No emails found",
            description: "Try adjusting your search criteria or refresh your inbox."
          };
      }
    };

    const { icon, title, description } = getEmptyStateContent();

    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 mx-auto mb-6 bg-gradient-radial from-dark-accent-muted to-dark-surface rounded-full flex items-center justify-center shadow-glow">
            {icon}
          </div>
          <h3 className="text-lg font-medium text-dark-text-primary mb-3">{title}</h3>
          <p className="text-dark-text-secondary text-sm leading-relaxed">{description}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {emails.map((email) => {
        const senderInfo = getSenderInfo(email);
        const isRead = getEmailProperty(email, 'isRead', false);
        const urgency = getEmailProperty(email, 'urgency', 'low');
        const isImportant = getEmailProperty(email, 'isImportant', false);
        const hasAttachments = getEmailProperty(email, 'attachments', false);
        const hasMeetingRequest = getEmailProperty(email, 'meetingRequest', false);
        const timestamp = getEmailProperty(email, 'timestamp', new Date().toISOString());
        const labels = getEmailProperty(email, 'labels', []);

        return (
          <button
            key={email.id}
            onClick={(event) => handleEmailClick(email, event)}
            className={`w-full text-left p-4 border-b border-dark-border transition-all duration-200 group
              ${selectedEmail?.id === email.id ? 'bg-dark-surface' : 'hover:bg-dark-surface/50'}
            `}
          >
            <div className="flex items-start space-x-4">
              {/* Sender Avatar */}
              <div className="flex-shrink-0">
                {senderInfo.avatar ? (
                  <img
                    src={senderInfo.avatar}
                    alt={senderInfo.name}
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center
                    ${!isRead ? 'bg-gradient-radial from-dark-accent-muted to-dark-surface shadow-glow' : 'bg-dark-muted'}
                  `}>
                    <span className="text-sm font-medium text-dark-text-primary">
                      {senderInfo.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              {/* Email Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className={`text-sm font-medium truncate ${
                    !isRead ? 'text-dark-text-primary' : 'text-dark-text-secondary'
                  }`}>
                    {senderInfo.name}
                  </p>
                  <div className="flex items-center space-x-2">
                    {urgency === 'high' && (
                      <AlertCircle className="w-4 h-4 text-red-400" />
                    )}
                    {isImportant && (
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    )}
                    {hasAttachments && (
                      <Paperclip className="w-4 h-4 text-dark-text-secondary" />
                    )}
                    {hasMeetingRequest && (
                      <Calendar className="w-4 h-4 text-dark-accent" />
                    )}
                    <span className="text-xs text-dark-text-secondary">
                      {formatTime(timestamp)}
                    </span>
                  </div>
                </div>
                
                <p className={`text-sm mb-1.5 truncate ${
                  !isRead ? 'font-medium text-dark-text-primary' : 'text-dark-text-secondary'
                }`}>
                  {email.subject}
                </p>
                
                <p className="text-xs text-dark-text-secondary truncate mb-2">
                  {email.preview}
                </p>

                {/* Labels */}
                {labels && labels.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {labels.map((label: string, index: number) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-dark-accent-muted text-dark-accent"
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}