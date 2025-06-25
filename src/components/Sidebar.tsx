import React, { useState } from 'react';
import { Inbox, Star, Archive, Send, FileText, Settings, Brain, FolderSync as Sync, LogOut, Plus, Keyboard, Mail, RotateCcw } from 'lucide-react';
import { useEmail } from '../contexts/EmailContext';
import SettingsModal from './SettingsModal';
import EmailComposer from './EmailComposer';
import KeyboardShortcuts from './KeyboardShortcuts';

export default function Sidebar() {
  const { emails, syncEmails, isLoading, addToast, resetToDefault } = useEmail();
  const mockUser = { name: 'Demo User', username: 'demo@company.com' };
  const initials = mockUser.name ? mockUser.name.split(' ').map(n => n[0]).join('').toUpperCase() : '';
  
  const unreadCount = emails.filter(email => !email.isRead).length;
  const importantCount = emails.filter(email => email.isImportant).length;

  const [showSettings, setShowSettings] = useState(false);
  const [showComposer, setShowComposer] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);

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
    addToast('Logged out successfully!', 'success');
  };

  const handleSettingsSave = () => {
    addToast('Settings saved!', 'success');
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Header - SmartBox branding */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <Mail className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">SmartBox</h1>
            <p className="text-gray-500 text-sm">AI-Powered</p>
          </div>
        </div>
      </div>

      {/* User Profile */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
            {initials || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{mockUser.name}</p>
            <p className="text-xs text-gray-500 truncate">{mockUser.username}</p>
          </div>
        </div>
      </div>

      {/* Compose Button */}
      <div className="p-4 border-b border-gray-200">
        <button
          onClick={() => setShowComposer(true)}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg transition-colors hover:bg-blue-700 font-medium"
        >
          <Plus className="w-4 h-4" />
          <span>Compose</span>
        </button>
      </div>

      {/* Sync and Reset Buttons */}
      <div className="p-4 border-b border-gray-200 space-y-2">
        <button
          onClick={handleSync}
          disabled={isLoading}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg transition-colors hover:bg-gray-200 disabled:opacity-50 font-medium"
        >
          <Sync className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span>{isLoading ? 'Syncing...' : 'Sync'}</span>
        </button>
        <button
          onClick={resetToDefault}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-red-50 text-red-700 rounded-lg transition-colors hover:bg-red-100 font-medium"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset</span>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-1">
          {menuItems.map((item, index) => (
            <li key={index}>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  // Handle navigation here if needed
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors font-medium text-sm
                  ${item.isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'}
                `}
              >
                <div className="flex items-center space-x-3">
                  <item.icon className={`w-5 h-5 ${
                    item.isActive ? 'text-blue-600' : 'text-gray-500'
                  }`} />
                  <span>{item.label}</span>
                </div>
                {item.count !== undefined && item.count > 0 && (
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    item.isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {item.count}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>

        {/* AI Features Section */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">
            AI Features
          </h3>
          <ul className="space-y-1">
            <li>
              <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                <Brain className="w-5 h-5 text-blue-600" />
                <span>Smart Inbox</span>
              </button>
            </li>
            <li>
              <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                <Brain className="w-5 h-5 text-green-600" />
                <span>AI Assistant</span>
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 space-y-1">
        <button
          onClick={() => setShowShortcuts(true)}
          className="flex items-center space-x-3 px-3 py-2 w-full text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors text-sm"
        >
          <Keyboard className="w-5 h-5 text-gray-500" />
          <span>Shortcuts</span>
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowSettings(true);
          }}
          className="flex items-center space-x-3 px-3 py-2 w-full text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors text-sm"
        >
          <Settings className="w-5 h-5 text-gray-500" />
          <span>Settings</span>
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleLogout();
          }}
          className="flex items-center space-x-3 px-3 py-2 w-full text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors text-sm"
        >
          <LogOut className="w-5 h-5 text-gray-500" />
          <span>Sign Out</span>
        </button>
      </div>
      
      {/* Modals */}
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} onSave={handleSettingsSave} />
      <EmailComposer isOpen={showComposer} onClose={() => setShowComposer(false)} />
      <KeyboardShortcuts isOpen={showShortcuts} onClose={() => setShowShortcuts(false)} />
    </div>
  );
}