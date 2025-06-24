import React, { useState } from 'react';
import { Search, Filter, RefreshCw, Loader, Brain, Sparkles, Wand2, Send } from 'lucide-react';
import { useEmail } from '../contexts/EmailContext';
import EmailList from './EmailList';
import ViewModeSelector from './ViewModeSelector';

export default function InboxView() {
  const { searchQuery, setSearchQuery, syncEmails, isLoading, currentView, generateAIPriorities, generateCustomView, hasCustomView, customCriteria, error } = useEmail();
  const [customInput, setCustomInput] = useState('');

  const handleRefresh = async () => {
    try {
      await syncEmails();
    } catch (error) {
      console.error('Failed to refresh emails:', error);
    }
  };

  const handleGenerateAIPriorities = async () => {
    try {
      await generateAIPriorities();
    } catch (error) {
      console.error('Failed to generate AI priorities:', error);
    }
  };

  const handleGenerateCustomView = async () => {
    if (!customInput.trim()) return;
    
    try {
      await generateCustomView(customInput);
    } catch (error) {
      console.error('Failed to generate custom view:', error);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-2">
          <p className="text-red-700 text-xs">{error}</p>
        </div>
      )}
      <div className="h-full flex flex-col bg-white">
        {/* Header */}
        <div className="shrink-0 p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 tracking-wide">Inbox</h2>
            <div className="flex items-center space-x-2">
              {currentView === 'priority' && (
                <button 
                  onClick={handleGenerateAIPriorities}
                  disabled={isLoading}
                  className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white rounded-lg transition-all disabled:opacity-50 shadow-sm"
                  title="Generate AI-powered priority rankings"
                >
                  {isLoading ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    <Brain className="w-4 h-4" />
                  )}
                  <span className="text-sm font-medium">AI Priority</span>
                  <Sparkles className="w-3 h-3" />
                </button>
              )}
              <button 
                onClick={handleRefresh}
                disabled={isLoading}
                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
              </button>
              <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-colors">
                <Filter className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search emails..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400 transition-all"
            />
          </div>

          {/* View Mode Selector */}
          <ViewModeSelector />

          {/* Custom View Input - Only show in custom view */}
          {currentView === 'custom' && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Custom Sorting Criteria</h3>
              <p className="text-xs text-gray-500 mb-3">
                Describe how you want to sort your emails (e.g., "Put all meeting requests at the top", "Show project emails first", "Prioritize urgent client communications")
              </p>
              {hasCustomView && (
                <div className="mb-3 p-2 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-xs text-green-700">
                    <strong>Current criteria:</strong> {customCriteria}
                  </p>
                </div>
              )}
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  placeholder="e.g., Put all emails about meetings at the top, then security alerts..."
                  className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400 text-sm"
                  onKeyPress={(e) => e.key === 'Enter' && handleGenerateCustomView()}
                  disabled={isLoading}
                />
                <button
                  onClick={handleGenerateCustomView}
                  disabled={isLoading || !customInput.trim()}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white rounded-lg transition-all disabled:opacity-50 shadow-sm"
                  title="Generate custom email sorting"
                >
                  {isLoading ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    <Wand2 className="w-4 h-4" />
                  )}
                  <span className="text-sm font-medium">Generate</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Email List */}
        <div className="flex-1 min-h-0 overflow-y-auto bg-white">
          <EmailList />
        </div>
      </div>
    </div>
  );
}