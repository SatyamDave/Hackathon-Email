import React from 'react';
import { Star, Paperclip, Calendar, AlertCircle, Brain, Wand2 } from 'lucide-react';
import { useEmail } from '../contexts/EmailContext';
import { Email } from '../types/email';

export default function EmailList() {
  const { getFilteredEmails, selectedEmail, setSelectedEmail, markAsRead, currentView } = useEmail();
  const emails = getFilteredEmails();

  const handleEmailClick = (email: Email) => {
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

  if (emails.length === 0) {
    const getEmptyStateContent = () => {
      switch (currentView) {
        case 'priority':
          return {
            icon: <Brain className="w-8 h-8 text-purple-500" />,
            title: "No AI Priorities Generated",
            description: "Click the 'Generate AI Priorities' button above to let AI analyze and prioritize your emails."
          };
        case 'custom':
          return {
            icon: <Wand2 className="w-8 h-8 text-indigo-500" />,
            title: "No Custom View Generated",
            description: "Enter your sorting criteria above and click 'Generate' to create a custom email view."
          };
        default:
          return {
            icon: <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>,
            title: "No emails found",
            description: "Try adjusting your search criteria or refresh your inbox."
          };
      }
    };

    const { icon, title, description } = getEmptyStateContent();

    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 mx-auto mb-4 bg-dark-primary rounded-full flex items-center justify-center shadow-lg">
            {icon}
          </div>
          <h3 className="text-lg font-medium text-dark-text-primary mb-2">{title}</h3>
          <p className="text-dark-text-secondary text-sm leading-relaxed">{description}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto">
      {emails.map((email) => (
        <div
          key={email.id}
          onClick={() => handleEmailClick(email)}
          className={`p-4 border-b border-gray-800 cursor-pointer transition-all hover:bg-gray-800/60
            ${selectedEmail?.id === email.id ? 'bg-blue-900/40 border-l-4 border-l-blue-500' : ''}
            ${!email.isRead ? 'bg-gray-900' : 'bg-gray-950'}`}
        >
          <div className="flex items-start space-x-3">
            {/* Avatar */}
            <div className="flex-shrink-0">
              {email.sender.avatar ? (
                <img
                  src={email.sender.avatar}
                  alt={email.sender.name}
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-300">
                    {email.sender.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            {/* Email Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <p className={`text-sm font-medium truncate ${
                  !email.isRead ? 'text-gray-100' : 'text-gray-400'
                }`}>
                  {email.sender.name}
                </p>
                <div className="flex items-center space-x-2">
                  {email.urgency === 'high' && (
                    <AlertCircle className="w-4 h-4 text-red-400" />
                  )}
                  {email.isImportant && (
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  )}
                  {email.attachments && (
                    <Paperclip className="w-4 h-4 text-gray-400" />
                  )}
                  {email.meetingRequest && (
                    <Calendar className="w-4 h-4 text-blue-400" />
                  )}
                  <span className="text-xs text-gray-500">
                    {formatTime(email.timestamp)}
                  </span>
                </div>
              </div>
              
              <p className={`text-sm mb-2 truncate ${
                !email.isRead ? 'font-medium text-gray-100' : 'text-gray-400'
              }`}>
                {email.subject}
              </p>
              
              <p className="text-xs text-gray-500 truncate mb-2">
                {email.preview}
              </p>

              {/* Labels */}
              {email.labels.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {email.labels.slice(0, 2).map((label, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-900 text-blue-300"
                    >
                      {label}
                    </span>
                  ))}
                  {email.labels.length > 2 && (
                    <span className="text-xs text-gray-400">
                      +{email.labels.length - 2} more
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}