import React, { useState } from 'react';
import { Star, Paperclip, Calendar, AlertCircle, Brain, Wand2, Search, MoreHorizontal, Reply, Archive, Trash2, Flag } from 'lucide-react';
import { useEmail } from '../contexts/EmailContext';
import { Email } from '../types/email';
import Skeleton from './Skeleton';
import AttachmentPreviewModal from './AttachmentPreviewModal';

export default function EmailList() {
  const { getFilteredEmails, selectedEmail, setSelectedEmail, markAsRead, currentView, isLoading } = useEmail();
  const emails = getFilteredEmails();

  const [showAttachment, setShowAttachment] = useState(false);
  const [attachmentName, setAttachmentName] = useState('');

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

  const handleAttachmentClick = (fileName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setAttachmentName(fileName);
    setShowAttachment(true);
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

  if (isLoading) {
    return (
      <div className="flex flex-col space-y-2 p-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-3 p-3">
            <Skeleton width="2rem" height="2rem" rounded="rounded-full" />
            <div className="flex-1">
              <Skeleton width="35%" height="0.875rem" />
              <Skeleton width="70%" height="0.875rem" className="mt-1" />
              <Skeleton width="50%" height="0.75rem" className="mt-1" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (emails.length === 0) {
    const getEmptyStateContent = () => {
      switch (currentView) {
        case 'priority':
          return {
            icon: <Brain className="w-8 h-8 text-blue-500" />,
            title: "No AI Priorities Generated",
            description: "Click the 'Generate AI Priorities' button above to let AI analyze and prioritize your emails."
          };
        case 'custom':
          return {
            icon: <Wand2 className="w-8 h-8 text-blue-500" />,
            title: "No Custom View Generated",
            description: "Enter your sorting criteria above and click 'Generate' to create a custom email view."
          };
        default:
          return {
            icon: <Search className="w-8 h-8 text-gray-400" />,
            title: "No emails found",
            description: "Try adjusting your search criteria or refresh your inbox."
          };
      }
    };

    const { icon, title, description } = getEmptyStateContent();

    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            {icon}
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">{title}</h3>
          <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-white">
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
          <div
            key={email.id}
            onClick={(event) => handleEmailClick(email, event)}
            className={`group relative border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150 cursor-pointer
              ${selectedEmail?.id === email.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''}
              ${!isRead ? 'bg-blue-50/30' : ''}
            `}
          >
            <div className="flex items-start p-4 space-x-3">
              {/* Sender Avatar - iCloud style */}
              <div className="flex-shrink-0">
                {senderInfo.avatar ? (
                  <img
                    src={senderInfo.avatar}
                    alt={senderInfo.name}
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                    ${!isRead ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'}
                  `}>
                    {senderInfo.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {/* Email Content - iCloud style */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-1">
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm truncate ${
                      !isRead ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'
                    }`}>
                      {senderInfo.name}
                    </p>
                  </div>
                  <div className="flex items-center space-x-1 ml-2">
                    {urgency === 'high' && (
                      <AlertCircle className="w-4 h-4 text-red-500" />
                    )}
                    {isImportant && (
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    )}
                    {hasAttachments && (
                      <span onClick={e => handleAttachmentClick('DemoFile.pdf', e)}>
                        <Paperclip className="w-4 h-4 text-gray-400 cursor-pointer" />
                      </span>
                    )}
                    {hasMeetingRequest && (
                      <Calendar className="w-4 h-4 text-blue-500" />
                    )}
                    <span className="text-xs text-gray-500 ml-2">{formatTime(timestamp)}</span>
                  </div>
                </div>
                
                <div className="flex items-start justify-between mb-1">
                  <span className={`text-sm truncate flex-1 ${
                    !isRead ? 'font-semibold text-gray-900' : 'text-gray-700'
                  }`}>
                    {email.subject}
                  </span>
                </div>
                
                <div className="text-sm text-gray-500 truncate">{email.preview}</div>

                {/* Labels - iCloud style */}
                {labels && labels.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {labels.map((label: string, idx: number) => (
                      <span key={idx} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                        {label}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions - iCloud style hover actions */}
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
              <div className="flex items-center space-x-1 bg-white rounded-lg shadow-lg border border-gray-200 p-1">
                <button className="p-1.5 hover:bg-gray-100 rounded transition-colors" title="Reply">
                  <Reply className="w-4 h-4 text-gray-600" />
                </button>
                <button className="p-1.5 hover:bg-gray-100 rounded transition-colors" title="Archive">
                  <Archive className="w-4 h-4 text-gray-600" />
                </button>
                <button className="p-1.5 hover:bg-gray-100 rounded transition-colors" title="Flag">
                  <Flag className={`w-4 h-4 ${isImportant ? 'text-yellow-500 fill-current' : 'text-gray-600'}`} />
                </button>
                <button className="p-1.5 hover:bg-gray-100 rounded transition-colors" title="More">
                  <MoreHorizontal className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
      <AttachmentPreviewModal isOpen={showAttachment} onClose={() => setShowAttachment(false)} fileName={attachmentName} />
    </div>
  );
}