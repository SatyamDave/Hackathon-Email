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
        <div className="bg-red-900/20 border border-red-700 rounded-lg p-3 mb-2">
          <p className="text-red-400 text-xs">{error}</p>
        </div>
      )}
      <div className="h-full flex flex-col bg-gradient-to-br from-dark-primary via-dark-secondary to-dark-primary">
        {/* Header */}
        <div className="p-4 border-b border-dark-muted">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-dark-text-primary tracking-wide">Inbox</h2>
            <div className="flex items-center space-x-2">
              {currentView === 'priority' && (
                <button 
                  onClick={handleGenerateAIPriorities}
                  disabled={isLoading}
                  className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg transition-all disabled:opacity-50 shadow-sm"
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

          {/* Custom View Input - Only show in custom view */}
          {currentView === 'custom' && (
            <div className="mt-4 p-4 bg-dark-primary rounded-lg border border-dark-muted">
              <h3 className="text-sm font-medium text-dark-text-primary mb-2">Custom Sorting Criteria</h3>
              <p className="text-xs text-dark-text-secondary mb-3">
                Describe how you want to sort your emails (e.g., "Put all meeting requests at the top", "Show project emails first", "Prioritize urgent client communications")
              </p>
              
              {hasCustomView && (
                <div className="mb-3 p-2 bg-green-900/20 border border-green-700 rounded-lg">
                  <p className="text-xs text-green-400">
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
                  className="flex-1 px-3 py-2 bg-dark-secondary border border-dark-muted rounded-lg focus:ring-2 focus:ring-dark-accent focus:border-transparent text-dark-text-primary placeholder-dark-text-secondary text-sm"
                  onKeyPress={(e) => e.key === 'Enter' && handleGenerateCustomView()}
                  disabled={isLoading}
                />
                <button
                  onClick={handleGenerateCustomView}
                  disabled={isLoading || !customInput.trim()}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg transition-all disabled:opacity-50 shadow-sm"
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
        <div className="flex-1 overflow-hidden">
          <EmailList />
        </div>
      </div>
    </div>
  );
}