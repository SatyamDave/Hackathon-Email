import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, FileText, Lightbulb, Tag, Loader, AlertCircle, CheckCircle, Info, Sparkles } from 'lucide-react';
import { useEmail } from '../contexts/EmailContext';

interface AIInsights {
  summary: string;
  suggestions: string[];
  labels: string[];
}

export default function AIAssistantSidebar() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [insights, setInsights] = useState<AIInsights | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { selectedEmail } = useEmail();

  useEffect(() => {
    if (selectedEmail) {
      generateInsights();
    } else {
      setInsights(null);
    }
  }, [selectedEmail]);

  const generateInsights = async () => {
    if (!selectedEmail) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate AI processing time
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate mock insights based on email content
      const mockSummary = `This email from ${selectedEmail.sender.name} regarding "${selectedEmail.subject}" appears to be ${selectedEmail.isImportant ? 'important' : 'standard'} communication. It requires ${selectedEmail.urgency === 'high' ? 'immediate' : 'standard'} attention.`;
      
      const mockSuggestions = [
        selectedEmail.isImportant ? 'Consider flagging this email for follow-up' : 'This can be processed during regular review time',
        selectedEmail.attachments && selectedEmail.attachments.length > 0 ? 'Review attached documents carefully' : 'No attachments to review',
        'Add to your task list if action is required'
      ];
      
      const mockLabels = [
        selectedEmail.isImportant ? 'Action Needed' : 'FYI',
        selectedEmail.urgency === 'high' ? 'Urgent' : 'Standard',
        selectedEmail.attachments && selectedEmail.attachments.length > 0 ? 'Has Attachments' : 'No Attachments'
      ];
      
      setInsights({ summary: mockSummary, suggestions: mockSuggestions, labels: mockLabels });
    } catch (error) {
      console.error('Failed to generate AI insights:', error);
      setError('Demo mode: AI insights are simulated.');
    } finally {
      setIsLoading(false);
    }
  };

  const getLabelColor = (label: string) => {
    switch (label.toLowerCase()) {
      case 'action needed':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'fyi':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'proposal':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'urgent':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'has attachments':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getLabelIcon = (label: string) => {
    switch (label.toLowerCase()) {
      case 'action needed':
        return <AlertCircle className="w-3 h-3" />;
      case 'fyi':
        return <Info className="w-3 h-3" />;
      case 'proposal':
        return <CheckCircle className="w-3 h-3" />;
      case 'urgent':
        return <AlertCircle className="w-3 h-3" />;
      case 'has attachments':
        return <FileText className="w-3 h-3" />;
      default:
        return <Tag className="w-3 h-3" />;
    }
  };

  return (
    <div className={`transition-all duration-300 ease-in-out bg-white border-l border-gray-200 ${
      isExpanded ? 'w-80' : 'w-12'
    }`}>
      {/* Toggle Button - iCloud style */}
      <div className="p-4 border-b border-gray-200">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between text-gray-700 hover:text-gray-900 transition-colors"
        >
          {isExpanded && (
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-blue-500" />
              <span className="font-medium text-sm">AI Assistant</span>
            </div>
          )}
          {isExpanded ? (
            <ChevronRight className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronLeft className="w-5 h-5 text-gray-500" />
          )}
        </button>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="p-4 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {!selectedEmail && (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">
                Select an email to view AI insights
              </p>
            </div>
          )}

          {isLoading && (
            <div className="text-center py-8">
              <Loader className="w-8 h-8 text-blue-500 mx-auto mb-3 animate-spin" />
              <p className="text-gray-500 text-sm">
                Generating AI insights...
              </p>
            </div>
          )}

          {insights && !isLoading && (
            <>
              {/* Email Summarization - iCloud style */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-blue-500" />
                  <h3 className="font-medium text-gray-900 text-sm">Summary</h3>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {insights.summary}
                  </p>
                </div>
              </div>

              {/* Smart Suggestions - iCloud style */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Lightbulb className="w-4 h-4 text-yellow-500" />
                  <h3 className="font-medium text-gray-900 text-sm">Suggestions</h3>
                </div>
                <div className="space-y-2">
                  {insights.suggestions.map((suggestion, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {suggestion}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Smart Labels - iCloud style */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Tag className="w-4 h-4 text-green-500" />
                  <h3 className="font-medium text-gray-900 text-sm">Smart Labels</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {insights.labels.map((label, index) => (
                    <div
                      key={index}
                      className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getLabelColor(label)}`}
                    >
                      {getLabelIcon(label)}
                      <span>{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
} 