import React, { useState } from 'react';
import { Reply, Forward, Archive, Trash2, Flag, Sparkles, MoreHorizontal, Clock, User } from 'lucide-react';
import { useEmail } from '../contexts/EmailContext';
import CalendarModal from './CalendarModal';
import EmailTemplates from './EmailTemplates';

export default function EmailDetail() {
  const { selectedEmail, markAsImportant, archiveEmail, generateSummary, generateReply, isLoading, addToast } = useEmail();
  const [aiSummary, setAiSummary] = useState('');
  const [showReplyComposer, setShowReplyComposer] = useState(false);
  const [aiReply, setAiReply] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showAIPopover, setShowAIPopover] = useState(false);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [loadingReply, setLoadingReply] = useState(false);

  if (isLoading) {
    return <div className="p-8 text-center text-gray-400">Loading...</div>;
  }
  if (!selectedEmail) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 text-sm">Select an email to view details</p>
        </div>
      </div>
    );
  }

  const handleGenerateSummary = async () => {
    setLoadingSummary(true);
    setAiSummary('');
    const summary = await generateSummary(selectedEmail);
    setAiSummary(summary);
    setLoadingSummary(false);
    addToast('AI summary generated!', 'success');
  };

  const handleGenerateReply = async () => {
    setLoadingReply(true);
    setAiReply('');
    const reply = await generateReply(selectedEmail);
    setAiReply(reply);
    setShowReplyComposer(true);
    setLoadingReply(false);
    addToast('AI reply generated!', 'success');
  };

  const handleUseTemplate = (subject: string, body: string) => {
    setAiReply(body);
    setShowReplyComposer(true);
    addToast('Template applied!', 'success');
  };

  const formatTime = (timestamp: string) => new Date(timestamp).toLocaleString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true
  });

  return (
    <div className="flex flex-col h-full bg-white">
      {/* iCloud-style Header */}
      <div className="border-b border-gray-200 bg-white">
        {/* Subject and Actions */}
        <div className="flex items-center justify-between px-6 py-4">
          <h1 className="text-xl font-semibold text-gray-900 truncate flex-1 mr-4">
            {selectedEmail.subject}
          </h1>
          <div className="flex items-center space-x-1">
            <button 
              className="p-2 hover:bg-gray-100 rounded-full transition-colors" 
              title="Reply"
              onClick={() => setShowReplyComposer(true)}
            >
              <Reply className="w-5 h-5 text-gray-600" />
            </button>
            <button 
              className="p-2 hover:bg-gray-100 rounded-full transition-colors" 
              title="Forward"
              onClick={() => addToast('Forward feature coming soon!', 'info')}
            >
              <Forward className="w-5 h-5 text-gray-600" />
            </button>
            <button 
              className="p-2 hover:bg-gray-100 rounded-full transition-colors" 
              title="Archive"
              onClick={() => { archiveEmail(selectedEmail.id); addToast('Email archived!', 'success'); }}
            >
              <Archive className="w-5 h-5 text-gray-600" />
            </button>
            <button 
              className="p-2 hover:bg-gray-100 rounded-full transition-colors" 
              title="Flag"
              onClick={() => markAsImportant(selectedEmail.id)}
            >
              <Flag className={`w-5 h-5 ${selectedEmail.isImportant ? 'text-yellow-500 fill-current' : 'text-gray-600'}`} />
            </button>
            <button 
              className="p-2 hover:bg-gray-100 rounded-full transition-colors" 
              title="AI Assistant"
              onClick={() => setShowAIPopover(v => !v)}
            >
              <Sparkles className="w-5 h-5 text-blue-500" />
            </button>
            <button 
              className="p-2 hover:bg-gray-100 rounded-full transition-colors" 
              title="More"
            >
              <MoreHorizontal className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Sender Info - iCloud style */}
        <div className="px-6 pb-4">
          <div className="flex items-center space-x-3">
            {selectedEmail.sender.avatar ? (
              <img
                src={selectedEmail.sender.avatar}
                alt={selectedEmail.sender.name}
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                {selectedEmail.sender.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">{selectedEmail.sender.name}</p>
              <p className="text-sm text-gray-500">{selectedEmail.sender.email}</p>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="w-4 h-4 mr-1" />
              {formatTime(selectedEmail.timestamp)}
            </div>
          </div>
        </div>
      </div>

      {/* AI Popover */}
      {showAIPopover && (
        <div className="absolute right-6 top-20 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50 min-w-[280px]">
          <div className="flex items-center space-x-2 mb-3">
            <Sparkles className="w-5 h-5 text-blue-500" />
            <h3 className="font-medium text-gray-900">AI Assistant</h3>
          </div>
          <div className="space-y-2">
            <button 
              className="w-full text-left py-2 px-3 hover:bg-gray-50 rounded-md transition-colors flex items-center space-x-2" 
              onClick={handleGenerateSummary} 
              disabled={loadingSummary}
            >
              <Sparkles className="w-4 h-4 text-blue-500" />
              <span className="text-sm">{loadingSummary ? 'Generating summary...' : 'AI Summary'}</span>
            </button>
            <button 
              className="w-full text-left py-2 px-3 hover:bg-gray-50 rounded-md transition-colors flex items-center space-x-2" 
              onClick={handleGenerateReply} 
              disabled={loadingReply}
            >
              <Reply className="w-4 h-4 text-blue-500" />
              <span className="text-sm">{loadingReply ? 'Generating reply...' : 'AI Reply'}</span>
            </button>
            <button 
              className="w-full text-left py-2 px-3 hover:bg-gray-50 rounded-md transition-colors flex items-center space-x-2" 
              onClick={() => setShowTemplates(true)}
            >
              <Sparkles className="w-4 h-4 text-blue-500" />
              <span className="text-sm">Templates</span>
            </button>
          </div>
          {aiSummary && (
            <div className="mt-3 p-3 bg-blue-50 rounded-md">
              <p className="text-xs text-blue-700 leading-relaxed">{aiSummary}</p>
            </div>
          )}
        </div>
      )}

      {/* Message Body - iCloud style */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="prose max-w-none text-gray-900 whitespace-pre-wrap leading-relaxed">
          {selectedEmail.content}
        </div>
      </div>

      {/* Reply Composer - iCloud style */}
      {showReplyComposer && (
        <div className="border-t border-gray-200 bg-gray-50">
          <div className="px-6 py-4">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="px-4 py-3 border-b border-gray-200">
                <p className="text-sm font-medium text-gray-900">Reply to {selectedEmail.sender.name}</p>
              </div>
              <textarea
                value={aiReply}
                onChange={(e) => setAiReply(e.target.value)}
                className="w-full h-32 p-4 border-0 resize-none focus:ring-0 focus:outline-none text-gray-900 placeholder-gray-500"
                placeholder="Type your reply..."
              />
              <div className="px-4 py-3 border-t border-gray-200 flex justify-end space-x-2">
                <button 
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                  onClick={() => addToast('Draft saved!', 'success')}
                >
                  Save Draft
                </button>
                <button 
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors"
                  onClick={() => { setShowReplyComposer(false); addToast('Reply sent!', 'success'); }}
                >
                  Send Reply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <CalendarModal isOpen={showCalendar} onClose={() => setShowCalendar(false)} email={selectedEmail} />
      <EmailTemplates isOpen={showTemplates} onClose={() => setShowTemplates(false)} onUseTemplate={handleUseTemplate} />
    </div>
  );
}

// Add these styles to your global CSS or Tailwind config:
// .icon-btn { @apply p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-blue-600 transition; }
// .icloud-email-detail { @apply bg-white rounded-lg shadow-sm; }
// .btn-primary { @apply px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50; }
// .btn-secondary { @apply px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50; }