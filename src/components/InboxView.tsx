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
    <div className="h-full flex flex-col bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900">
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-100 tracking-wide">Inbox</h2>
          <div className="flex items-center space-x-2">
            <button 
              onClick={handleRefresh}
              disabled={isLoading}
              className="p-2 text-gray-400 hover:text-blue-400 hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50"
            >
              {isLoading ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
            </button>
            <button className="p-2 text-gray-400 hover:text-blue-400 hover:bg-gray-800 rounded-lg transition-colors">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search emails..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-800 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent text-gray-100 placeholder-gray-500 transition-all"
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