import React from 'react';
import { Inbox, Star, Archive, Send, FileText, Settings, Brain, FolderSync as Sync } from 'lucide-react';
import { useEmail } from '../contexts/EmailContext';
import { useMsal } from '@azure/msal-react';

export default function Sidebar() {
  const { emails, syncEmails, isLoading } = useEmail();
  const { accounts, instance } = useMsal();
  const user = accounts[0];
  const initials = user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : '';
  
  const unreadCount = emails.filter(email => !email.isRead).length;
  const importantCount = emails.filter(email => email.isImportant).length;

  const menuItems = [
    { icon: Inbox, label: 'Inbox', count: unreadCount, isActive: true },
    { icon: Star, label: 'Important', count: importantCount },
    { icon: Send, label: 'Sent' },
    { icon: FileText, label: 'Drafts', count: 0 },
    { icon: Archive, label: 'Archive' },
  ];

  const handleSync = async () => {
    try {
      await syncEmails();
    } catch (error) {
      console.error('Sync failed:', error);
    }
  };

  const handleLogout = () => {
    instance.logoutPopup();
  };

  return (
    <div className="w-64 bg-gradient-to-b from-dark-primary via-dark-secondary to-dark-primary text-dark-text-primary flex flex-col shadow-xl border-r border-dark-muted">
      {/* User Profile */}
      <div className="p-6 border-b border-dark-muted bg-dark-secondary">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-dark-accent rounded-full flex items-center justify-center text-dark-primary font-semibold">
            {initials || 'U'}
          </div>
          <div>
            <h3 className="font-semibold text-dark-text-primary">{user?.name || 'User'}</h3>
            <p className="text-dark-text-secondary text-sm">{user?.username || 'user@company.com'}</p>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="p-6 border-b border-dark-muted">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-dark-accent rounded-lg flex items-center justify-center shadow-lg">
            <Brain className="w-6 h-6 text-dark-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-wide">SmartInbox</h1>
            <p className="text-dark-text-secondary text-sm">AI-Powered Email</p>
          </div>
        </div>
      </div>

      {/* Sync Button */}
      <div className="p-4 border-b border-dark-muted">
        <button
          onClick={handleSync}
          disabled={isLoading}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-dark-accent hover:bg-dark-accent/90 text-dark-primary rounded-lg transition-colors disabled:opacity-50 shadow-md"
        >
          <Sync className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span>{isLoading ? 'Syncing...' : 'Sync Emails'}</span>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item, index) => (
            <li key={index}>
              <a
                href="#"
                className={`flex items-center justify-between px-4 py-3 rounded-lg transition-colors font-medium shadow-sm
                  ${item.isActive
                    ? 'bg-dark-accent text-dark-primary'
                    : 'text-dark-text-secondary hover:bg-dark-muted hover:text-dark-text-primary'}
                `}
              >
                <div className="flex items-center space-x-3">
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </div>
                {item.count !== undefined && item.count > 0 && (
                  <span className="bg-dark-muted text-dark-text-secondary px-2 py-1 rounded-full text-xs">
                    {item.count}
                  </span>
                )}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Settings */}
      <div className="p-4 border-t border-dark-muted">
        <a
          href="#"
          className="flex items-center space-x-3 px-4 py-3 text-dark-text-secondary hover:bg-dark-muted hover:text-dark-text-primary rounded-lg transition-colors font-medium"
        >
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </a>
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 px-4 py-3 mt-2 w-full text-dark-text-secondary hover:bg-dark-muted hover:text-dark-text-primary rounded-lg transition-colors font-medium"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1" /></svg>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}