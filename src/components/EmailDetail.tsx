import React, { useState } from 'react';
import { Star, Reply, Forward, Archive, Trash2, Calendar, Sparkles, Clock, CheckCircle } from 'lucide-react';
import { useEmail } from '../contexts/EmailContext';

export default function EmailDetail() {
  const { selectedEmail, markAsImportant, archiveEmail, generateSummary, generateReply } = useEmail();
  const [aiSummary, setAiSummary] = useState<string>('');
  const [autoReply, setAutoReply] = useState<string>('');
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [isGeneratingReply, setIsGeneratingReply] = useState(false);
  const [showReplyComposer, setShowReplyComposer] = useState(false);

  if (!selectedEmail) return null;

  const handleGenerateSummary = async () => {
    setIsGeneratingSummary(true);
    try {
      const summary = await generateSummary(selectedEmail);
      setAiSummary(summary);
    } catch (error) {
      console.error('Failed to generate summary:', error);
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const handleGenerateReply = async () => {
    setIsGeneratingReply(true);
    try {
      const reply = await generateReply(selectedEmail);
      setAutoReply(reply);
      setShowReplyComposer(true);
    } catch (error) {
      console.error('Failed to generate reply:', error);
    } finally {
      setIsGeneratingReply(false);
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <h1 className="text-xl font-semibold text-gray-900 truncate">
              {selectedEmail.subject}
            </h1>
            {selectedEmail.urgency === 'high' && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                High Priority
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => markAsImportant(selectedEmail.id)}
              className={`p-2 rounded-lg transition-colors ${
                selectedEmail.isImportant
                  ? 'text-yellow-500 hover:bg-yellow-50'
                  : 'text-gray-400 hover:text-yellow-500 hover:bg-gray-100'
              }`}
            >
              <Star className={`w-5 h-5 ${selectedEmail.isImportant ? 'fill-current' : ''}`} />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Reply className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Forward className="w-5 h-5" />
            </button>
            <button
              onClick={() => archiveEmail(selectedEmail.id)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Archive className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* AI Actions */}
        <div className="flex items-center space-x-3">
          <button
            onClick={handleGenerateSummary}
            disabled={isGeneratingSummary}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isGeneratingSummary ? 'Generating...' : 'AI Summary'}</span>
          </button>
          <button
            onClick={handleGenerateReply}
            disabled={isGeneratingReply}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            <Reply className="w-4 h-4" />
            <span>{isGeneratingReply ? 'Generating...' : 'Auto Reply'}</span>
          </button>
          {selectedEmail.meetingRequest && (
            <button className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              <Calendar className="w-4 h-4" />
              <span>Schedule</span>
            </button>
          )}
        </div>
      </div>

      {/* AI Summary */}
      {aiSummary && (
        <div className="px-6 py-4 bg-blue-50 border-b border-blue-100">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-blue-900 mb-1">AI Summary</h3>
              <p className="text-sm text-blue-800">{aiSummary}</p>
            </div>
          </div>
        </div>
      )}

      {/* Meeting Request */}
      {selectedEmail.meetingRequest && (
        <div className="px-6 py-4 bg-purple-50 border-b border-purple-100">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
              <Calendar className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-purple-900 mb-2">Meeting Request Detected</h3>
              <div className="bg-white rounded-lg p-3 border border-purple-200">
                <p className="font-medium text-gray-900">{selectedEmail.meetingRequest.title}</p>
                <p className="text-sm text-gray-600 mt-1">
                  {new Date(selectedEmail.meetingRequest.date).toLocaleDateString()} at {selectedEmail.meetingRequest.time}
                </p>
                {selectedEmail.meetingRequest.location && (
                  <p className="text-sm text-gray-600">📍 {selectedEmail.meetingRequest.location}</p>
                )}
                <div className="flex items-center space-x-2 mt-3">
                  <button className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors">
                    <CheckCircle className="w-4 h-4" />
                    <span>Accept & Schedule</span>
                  </button>
                  <button className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-md hover:bg-gray-300 transition-colors">
                    Tentative
                  </button>
                  <button className="px-3 py-1 bg-red-100 text-red-700 text-sm rounded-md hover:bg-red-200 transition-colors">
                    Decline
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Email Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-6 py-6">
          {/* Email Header */}
          <div className="flex items-start space-x-4 mb-6">
            {selectedEmail.sender.avatar ? (
              <img
                src={selectedEmail.sender.avatar}
                alt={selectedEmail.sender.name}
                className="w-12 h-12 rounded-full"
              />
            ) : (
              <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-lg font-medium text-gray-700">
                  {selectedEmail.sender.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{selectedEmail.sender.name}</p>
                  <p className="text-sm text-gray-500">{selectedEmail.sender.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">{formatTime(selectedEmail.timestamp)}</p>
                  <div className="flex items-center justify-end space-x-1 mt-1">
                    {selectedEmail.labels.map((label, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Email Body */}
          <div className="prose max-w-none">
            <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
              {selectedEmail.content}
            </div>
          </div>
        </div>
      </div>

      {/* Reply Composer */}
      {showReplyComposer && (
        <div className="border-t border-gray-200 bg-gray-50">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-900">AI-Generated Reply</h3>
              <button
                onClick={() => setShowReplyComposer(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <textarea
              value={autoReply}
              onChange={(e) => setAutoReply(e.target.value)}
              className="w-full h-32 p-3 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Your reply..."
            />
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center space-x-2">
                <button className="text-sm text-blue-600 hover:text-blue-700">
                  Edit with AI
                </button>
                <span className="text-gray-300">|</span>
                <button className="text-sm text-gray-600 hover:text-gray-700">
                  Add attachment
                </button>
              </div>
              <div className="flex items-center space-x-2">
                <button className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors">
                  Save Draft
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Send Reply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}