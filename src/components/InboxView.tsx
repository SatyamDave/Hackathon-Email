import React from 'react';
import { Search, Filter, RefreshCw, Loader } from 'lucide-react';
import { useEmail } from '../contexts/EmailContext';
import EmailList from './EmailList';
import ViewModeSelector from './ViewModeSelector';

export default function InboxView() {
  const { searchQuery, setSearchQuery, syncEmails, isLoading } = useEmail();

  const handleRefresh = async () => {
    try {
      await syncEmails();
    } catch (error) {
      console.error('Failed to refresh emails:', error);
    }
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-dark-primary via-dark-secondary to-dark-primary">
      {/* Header */}
      <div className="p-4 border-b border-dark-muted">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-dark-text-primary tracking-wide">Inbox</h2>
          <div className="flex items-center space-x-2">
            <button 
              onClick={handleRefresh}
              disabled={isLoading}
              className="p-2 text-dark-text-secondary hover:text-dark-accent hover:bg-dark-muted rounded-lg transition-colors disabled:opacity-50"
            >
              {isLoading ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
            </button>
            <button className="p-2 text-dark-text-secondary hover:text-dark-accent hover:bg-dark-muted rounded-lg transition-colors">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-text-secondary" />
          <input
            type="text"
            placeholder="Search emails..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-dark-primary border border-dark-muted rounded-lg focus:ring-2 focus:ring-dark-accent focus:border-transparent text-dark-text-primary placeholder-dark-text-secondary transition-all"
          />
        </div>

        {/* View Mode Selector */}
        <ViewModeSelector />
      </div>

      {/* Email List */}
      <div className="flex-1 overflow-hidden">
        <EmailList />
      </div>
    </div>
  );
}