import React from 'react';
import { Inbox, Star, Archive, Send, FileText, Settings, Brain, FolderSync as Sync } from 'lucide-react';
import { useEmail } from '../contexts/EmailContext';

export default function Sidebar() {
  const { emails, syncEmails, isLoading } = useEmail();
  
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
    <div className="w-64 bg-gradient-to-b from-gray-900 via-gray-950 to-gray-900 text-gray-100 flex flex-col shadow-xl border-r border-gray-800">
      {/* Header */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-wide">SmartInbox</h1>
            <p className="text-gray-400 text-sm">AI-Powered Email</p>
          </div>
        </div>
      </div>

      {/* Sync Button */}
      <div className="p-4 border-b border-gray-800">
        <button
          onClick={handleSync}
          disabled={isLoading}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors disabled:opacity-50 shadow-md"
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
                    ? 'bg-blue-700 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'}
                `}
              >
                <div className="flex items-center space-x-3">
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </div>
                {item.count !== undefined && item.count > 0 && (
                  <span className="bg-gray-800 text-gray-300 px-2 py-1 rounded-full text-xs">
                    {item.count}
                  </span>
                )}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Settings */}
      <div className="p-4 border-t border-gray-800">
        <a
          href="#"
          className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors font-medium"
        >
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </a>
      </div>
    </div>
  );
}