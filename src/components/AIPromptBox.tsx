import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Loader, ChevronDown, ChevronUp, MessageSquare, Calendar, Star, Filter, Brain, FileText } from 'lucide-react';
import { useEmail } from '../contexts/EmailContext';

interface ChatMessage {
  role: 'user' | 'ai';
  content: string;
}

export default function AIPromptBox() {
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentPrompts, setRecentPrompts] = useState<string[]>([]);
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { selectedEmail } = useEmail();

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [prompt]);

  // Scroll to bottom on new chat
  const chatEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chat]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    setIsProcessing(true);
    setRecentPrompts(prev => [prompt, ...prev].slice(0, 5));
    setChat(prev => [...prev, { role: 'user', content: prompt }]);
    // Mock AI response
    setTimeout(() => {
      setChat(prev => [...prev, { role: 'ai', content: `This is a mock AI response to: "${prompt}"` }]);
      setIsProcessing(false);
      setPrompt('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }, 1200);
  };

  // Summarize selected email
  const handleSummarizeEmail = () => {
    if (!selectedEmail) return;
    const summaryPrompt = `Summarize this email: ${selectedEmail.content}`;
    setIsProcessing(true);
    setChat(prev => [...prev, { role: 'user', content: summaryPrompt }]);
    setTimeout(() => {
      setChat(prev => [...prev, { role: 'ai', content: `Mock summary for email: "${selectedEmail.content.slice(0, 80)}..."` }]);
      setIsProcessing(false);
    }, 1200);
  };

  const quickActions = [
    { icon: Star, label: "Prioritize Unread", prompt: "Prioritize my unread emails" },
    { icon: MessageSquare, label: "Summarize Important", prompt: "Summarize my important emails" },
    { icon: Calendar, label: "Find Urgent Items", prompt: "Find urgent action items" },
    { icon: Filter, label: "Organize by Project", prompt: "Organize by project" },
    { icon: Star, label: "Flag Important", prompt: "Flag all important emails from last week" },
    { icon: Calendar, label: "Schedule Review", prompt: "Schedule a review for pending emails" },
  ];

  return (
    <div className={`w-96 transition-all duration-300 ease-in-out ${isMinimized ? 'translate-y-[calc(100%-48px)]' : ''}`}>
      {/* Header */}
      <div 
        className="bg-gradient-to-r from-dark-primary to-dark-secondary rounded-t-xl border border-dark-muted cursor-pointer shadow-lg"
        onClick={() => setIsMinimized(!isMinimized)}
      >
        <div className="p-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-dark-accent rounded-lg flex items-center justify-center">
              <Brain className="w-4 h-4 text-dark-primary" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-dark-text-primary">AI Assistant</h3>
              <p className="text-xs text-dark-text-secondary">Smart inbox management</p>
            </div>
          </div>
          <button 
            className="p-1 text-dark-text-secondary hover:text-dark-text-primary transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setIsMinimized(!isMinimized);
            }}
          >
            {isMinimized ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-dark-secondary rounded-b-xl border border-dark-muted border-t-0 shadow-lg flex flex-col h-[420px]">
        {/* Chat History */}
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2">
          {chat.length === 0 && (
            <div className="text-dark-text-secondary text-xs text-center mt-8">No conversation yet. Start by asking something or use a quick action below.</div>
          )}
          {chat.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] px-3 py-2 rounded-lg text-sm whitespace-pre-line ${msg.role === 'user' ? 'bg-dark-accent text-dark-primary' : 'bg-dark-muted text-dark-text-primary'}`}>
                {msg.content}
              </div>
            </div>
          ))}
          {isProcessing && (
            <div className="flex justify-start">
              <div className="max-w-[80%] px-3 py-2 rounded-lg bg-dark-muted text-dark-text-primary flex items-center space-x-2">
                <Loader className="w-4 h-4 animate-spin mr-2" /> <span>AI is thinking...</span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Prompt Input */}
        <form onSubmit={handleSubmit} className="p-3 border-t border-dark-muted bg-dark-secondary">
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask AI to help manage your inbox..."
              className="w-full min-h-[60px] max-h-[120px] px-3 py-2 bg-dark-primary border border-dark-muted rounded-lg focus:ring-2 focus:ring-dark-accent focus:border-transparent text-dark-text-primary placeholder-dark-text-secondary resize-none transition-all"
              onFocus={() => setShowSuggestions(true)}
              disabled={isProcessing}
            />
            <div className="absolute bottom-2 right-2 flex space-x-1">
              <button
                type="button"
                onClick={() => setShowSuggestions(!showSuggestions)}
                className="p-1.5 text-dark-text-secondary hover:text-dark-text-primary transition-colors"
                tabIndex={-1}
              >
                <Sparkles className="w-4 h-4" />
              </button>
              <button
                type="submit"
                disabled={isProcessing || !prompt.trim()}
                className="p-1.5 bg-dark-accent text-dark-primary rounded-lg hover:bg-dark-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Suggestions Panel */}
          {showSuggestions && (
            <div className="mt-3 space-y-3">
              {/* Quick Actions */}
              <div>
                <p className="text-xs font-medium text-dark-text-secondary mb-1.5">Quick Actions</p>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={handleSummarizeEmail}
                    className="flex items-center space-x-1.5 px-2 py-1.5 text-xs bg-dark-muted text-dark-text-primary rounded-lg hover:bg-dark-muted/80 transition-colors"
                    disabled={!selectedEmail}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span className="truncate">Summarize Email</span>
                  </button>
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setPrompt(action.prompt)}
                      className="flex items-center space-x-1.5 px-2 py-1.5 text-xs bg-dark-muted text-dark-text-primary rounded-lg hover:bg-dark-muted/80 transition-colors"
                    >
                      <action.icon className="w-3.5 h-3.5" />
                      <span className="truncate">{action.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Recent Prompts */}
              {recentPrompts.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-dark-text-secondary mb-1.5">Recent Prompts</p>
                  <div className="space-y-1">
                    {recentPrompts.map((recentPrompt, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setPrompt(recentPrompt)}
                        className="w-full text-left px-2 py-1.5 text-xs bg-dark-muted text-dark-text-primary rounded-lg hover:bg-dark-muted/80 transition-colors truncate"
                      >
                        {recentPrompt}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
} 