import React from 'react';
import { Inbox, Star, Archive, Send, FileText, Settings, Brain, FolderSync as Sync, LogOut } from 'lucide-react';
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
    <div className="w-64 bg-gradient-subtle from-dark-primary to-dark-surface text-dark-text-primary flex flex-col shadow-xl border-r border-dark-border">
      {/* User Profile */}
      <div className="p-6 border-b border-dark-border bg-dark-surface/50 backdrop-blur-sm">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-radial from-dark-accent to-dark-accent-muted rounded-full flex items-center justify-center text-dark-primary font-semibold shadow-glow">
            {initials || 'U'}
          </div>
          <div>
            <h3 className="font-semibold text-dark-text-primary">{user?.name || 'User'}</h3>
            <p className="text-dark-text-secondary text-sm">{user?.username || 'user@company.com'}</p>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="p-6 border-b border-dark-border">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-radial from-dark-accent to-dark-accent-muted rounded-lg flex items-center justify-center shadow-glow">
            <Brain className="w-6 h-6 text-dark-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-wide">SmartInbox</h1>
            <p className="text-dark-text-secondary text-sm">AI-Powered Email</p>
          </div>
        </div>
      </div>

      {/* Sync Button */}
      <div className="p-4 border-b border-dark-border">
        <button
          onClick={handleSync}
          disabled={isLoading}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-gradient-subtle from-dark-accent to-dark-accent-hover text-dark-primary rounded-lg transition-all duration-200 hover:from-dark-accent-hover hover:to-dark-accent disabled:opacity-50 shadow-glow disabled:shadow-none"
        >
          <Sync className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span className="font-medium">{isLoading ? 'Syncing...' : 'Sync Emails'}</span>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        <ul className="space-y-1">
          {menuItems.map((item, index) => (
            <li key={index}>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  // Handle navigation here if needed
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 font-medium group
                  ${item.isActive
                    ? 'bg-dark-accent text-dark-primary shadow-glow'
                    : 'text-dark-text-secondary hover:text-dark-text-primary hover:bg-dark-muted'}
                `}
              >
                <div className="flex items-center space-x-3">
                  <item.icon className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${
                    item.isActive ? '' : 'group-hover:text-dark-accent'
                  }`} />
                  <span>{item.label}</span>
                </div>
                {item.count !== undefined && item.count > 0 && (
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    item.isActive
                      ? 'bg-dark-primary/20 text-dark-primary'
                      : 'bg-dark-surface text-dark-text-secondary'
                  }`}>
                    {item.count}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-dark-border space-y-2">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            // Handle settings click
          }}
          className="flex items-center space-x-3 px-4 py-3 w-full text-dark-text-secondary hover:text-dark-text-primary hover:bg-dark-muted rounded-lg transition-all duration-200 font-medium group"
        >
          <Settings className="w-5 h-5 transition-transform duration-200 group-hover:rotate-90 group-hover:text-dark-accent" />
          <span>Settings</span>
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleLogout();
          }}
          className="flex items-center space-x-3 px-4 py-3 w-full text-dark-text-secondary hover:text-dark-text-primary hover:bg-dark-muted rounded-lg transition-all duration-200 font-medium group"
        >
          <LogOut className="w-5 h-5 transition-transform duration-200 group-hover:-translate-x-1 group-hover:text-dark-accent" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}