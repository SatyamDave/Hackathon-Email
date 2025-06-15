import React from 'react';
import { Inbox, Star, Archive, Send, FileText, Settings, Brain, FolderSync as Sync } from 'lucide-react';
import { useEmail } from '../contexts/EmailContext';
import { Stack, Text, Persona, PersonaSize } from '@fluentui/react';
import { useMsal } from '@azure/msal-react';

export default function Sidebar() {
  const { emails, syncEmails, isLoading } = useEmail();
  const { accounts } = useMsal();
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

  return (
    <Stack styles={{ root: { width: 240, background: '#fff', minHeight: '100vh', boxShadow: '2px 0 8px #0001', borderRight: '1px solid #e5e7eb' } }}>
      <Stack horizontalAlign="center" styles={{ root: { padding: 24, borderBottom: '1px solid #e5e7eb', background: '#fff' } }}>
        <Persona
          text={user?.name || 'User'}
          secondaryText={user?.username || ''}
          size={PersonaSize.size48}
          imageAlt={user?.name || 'User'}
          hidePersonaDetails={false}
          initialsColor="green"
          imageInitials={initials}
        />
        <Text variant="medium" styles={{ root: { marginTop: 8, fontWeight: 600, color: '#111' } }}>{user?.name}</Text>
        <Text variant="small" styles={{ root: { color: '#222' } }}>{user?.username}</Text>
      </Stack>
      <div className="w-64 bg-gradient-to-b from-dark-primary via-dark-secondary to-dark-primary text-dark-text-primary flex flex-col shadow-xl border-r border-dark-muted">
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
        </div>
      </div>
    </Stack>
  );
}