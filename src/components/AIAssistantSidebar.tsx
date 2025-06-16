import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, FileText, Lightbulb, Tag, Loader, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { useEmail } from '../contexts/EmailContext';
import { AzureOpenAIService } from '../services/azureOpenAI';

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

  // Check if OpenAI is configured
  const isConfigured = !!(
    import.meta.env.VITE_AZURE_OPENAI_API_KEY &&
    import.meta.env.VITE_AZURE_OPENAI_ENDPOINT &&
    import.meta.env.VITE_AZURE_OPENAI_DEPLOYMENT_NAME
  );

  useEffect(() => {
    if (selectedEmail && isConfigured) {
      generateInsights();
    } else {
      setInsights(null);
    }
  }, [selectedEmail, isConfigured]);

  const generateInsights = async () => {
    if (!selectedEmail) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const [summary, suggestions, labels] = await Promise.all([
        AzureOpenAIService.generateEmailSummary(selectedEmail),
        AzureOpenAIService.generateSmartSuggestions(selectedEmail),
        AzureOpenAIService.generateSmartLabels(selectedEmail)
      ]);
      
      setInsights({ summary, suggestions, labels });
    } catch (error) {
      console.error('Failed to generate AI insights:', error);
      setError('Failed to generate AI insights. Please check your OpenAI configuration.');
    } finally {
      setIsLoading(false);
    }
  };

  const getLabelColor = (label: string) => {
    switch (label.toLowerCase()) {
      case 'action needed':
        return 'bg-red-900/30 text-red-400 border-red-700';
      case 'fyi':
        return 'bg-blue-900/30 text-blue-400 border-blue-700';
      case 'proposal':
        return 'bg-green-900/30 text-green-400 border-green-700';
      default:
        return 'bg-gray-900/30 text-gray-400 border-gray-700';
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
      default:
        return <Tag className="w-3 h-3" />;
    }
  };

  return (
    <div className={`transition-all duration-300 ease-in-out bg-dark-secondary border-l border-dark-muted ${
      isExpanded ? 'w-80' : 'w-12'
    }`}>
      {/* Toggle Button */}
      <div className="p-3 border-b border-dark-muted">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between text-dark-text-primary hover:text-dark-accent transition-colors"
        >
          {isExpanded && <span className="font-medium">AI Assistant</span>}
          {isExpanded ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="p-4 space-y-6">
          {!isConfigured && (
            <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-3">
              <p className="text-yellow-400 text-sm">
                AI features require Azure OpenAI configuration.
              </p>
            </div>
          )}

          {error && (
            <div className="bg-red-900/20 border border-red-700 rounded-lg p-3">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {!selectedEmail && isConfigured && (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-dark-text-secondary mx-auto mb-3" />
              <p className="text-dark-text-secondary text-sm">
                Select an email to view AI insights
              </p>
            </div>
          )}

          {isLoading && (
            <div className="text-center py-8">
              <Loader className="w-8 h-8 text-dark-accent mx-auto mb-3 animate-spin" />
              <p className="text-dark-text-secondary text-sm">
                Generating AI insights...
              </p>
            </div>
          )}

          {insights && !isLoading && (
            <>
              {/* Email Summarization */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-dark-accent" />
                  <h3 className="font-medium text-dark-text-primary">TL;DR Summary</h3>
                </div>
                <div className="bg-dark-primary rounded-lg p-3 border border-dark-muted">
                  <p className="text-dark-text-primary text-sm leading-relaxed">
                    {insights.summary}
                  </p>
                </div>
              </div>

              {/* Smart Suggestions */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Lightbulb className="w-4 h-4 text-yellow-400" />
                  <h3 className="font-medium text-dark-text-primary">Smart Suggestions</h3>
                </div>
                <div className="space-y-2">
                  {insights.suggestions.map((suggestion, index) => (
                    <div key={index} className="bg-dark-primary rounded-lg p-3 border border-dark-muted">
                      <p className="text-dark-text-primary text-sm leading-relaxed">
                        {suggestion}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Smart Labels */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Tag className="w-4 h-4 text-green-400" />
                  <h3 className="font-medium text-dark-text-primary">Smart Labels</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {insights.labels.map((label, index) => (
                    <div
                      key={index}
                      className={`inline-flex items-center space-x-1 px-2 py-1 rounded-lg text-xs font-medium border ${getLabelColor(label)}`}
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