import React, { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle, AlertTriangle, Plus, Loader } from 'lucide-react';

interface DayPlanItem {
  id: string;
  title: string;
  description?: string;
  scheduled_date: string;
  scheduled_time?: string;
  item_type: 'email' | 'meeting' | 'task' | 'reminder';
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  ai_generated: boolean;
  email_id?: string;
  meeting_request_id?: string;
}

export default function DayPlanner() {
  const [dayPlanItems, setDayPlanItems] = useState<DayPlanItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Set up mock data
    setDayPlanItems([
      {
        id: '1',
        title: 'Meeting with John',
        description: 'Discuss project progress',
        scheduled_date: '2023-04-15',
        scheduled_time: '10:00',
        item_type: 'meeting',
        priority: 'medium',
        status: 'pending',
        ai_generated: false,
      },
      {
        id: '2',
        title: 'Email from Jane',
        description: 'Follow up on the proposal',
        scheduled_date: '2023-04-15',
        scheduled_time: '11:00',
        item_type: 'email',
        priority: 'low',
        status: 'pending',
        ai_generated: false,
      },
      {
        id: '3',
        title: 'Task: Research',
        description: 'Complete the market analysis',
        scheduled_date: '2023-04-15',
        scheduled_time: '14:00',
        item_type: 'task',
        priority: 'high',
        status: 'pending',
        ai_generated: false,
      },
      {
        id: '4',
        title: 'Reminder: Team Meeting',
        description: 'Discuss project progress',
        scheduled_date: '2023-04-15',
        scheduled_time: '16:00',
        item_type: 'reminder',
        priority: 'high',
        status: 'pending',
        ai_generated: false,
      },
    ]);
  }, []);

  const updateItemStatus = async (itemId: string, newStatus: DayPlanItem['status']) => {
    // Implementation of updateItemStatus function
  };

  const formatDate = () => {
    return new Date().toLocaleDateString();
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'meeting':
        return <Calendar className="w-4 h-4" />;
      case 'email':
        return <Clock className="w-4 h-4" />;
      default:
        return <CheckCircle className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'meeting':
        return 'text-blue-600 bg-blue-100';
      case 'email':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-purple-600 bg-purple-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500';
      case 'medium':
        return 'border-l-yellow-500';
      default:
        return 'border-l-green-500';
    }
  };

  const getStats = () => {
    const meetings = dayPlanItems.filter(item => item.item_type === 'meeting').length;
    const highPriority = dayPlanItems.filter(item => item.priority === 'high').length;
    const completed = dayPlanItems.filter(item => item.status === 'completed').length;
    
    return { meetings, highPriority, completed };
  };

  const stats = getStats();

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Smart Day Planner</h2>
            <p className="text-sm text-gray-500">{formatDate()}</p>
          </div>
          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">{stats.meetings} Meetings</span>
            </div>
          </div>
          <div className="bg-red-50 p-3 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span className="text-sm font-medium text-red-900">{stats.highPriority} High Priority</span>
            </div>
          </div>
        </div>
      </div>

      {/* Day Plan Items */}
      <div className="flex-1 overflow-y-auto p-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader className="w-6 h-6 animate-spin text-gray-400" />
          </div>
        ) : dayPlanItems.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500">No items scheduled for today</p>
            <p className="text-sm text-gray-400 mt-1">AI will automatically add items as emails are processed</p>
          </div>
        ) : (
          <div className="space-y-3">
            {dayPlanItems.map((item) => (
              <div
                key={item.id}
                className={`bg-white p-4 rounded-lg border-l-4 ${getPriorityColor(item.priority)} shadow-sm hover:shadow-md transition-shadow ${
                  item.status === 'completed' ? 'opacity-60' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className={`p-1 rounded-full ${getTypeColor(item.item_type)}`}>
                        {getTypeIcon(item.item_type)}
                      </div>
                      <span className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                        {item.item_type}
                      </span>
                      {item.ai_generated && (
                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                          AI Generated
                        </span>
                      )}
                      {item.status === 'completed' && (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      )}
                    </div>
                    <h3 className={`font-medium mb-1 ${
                      item.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'
                    }`}>
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                    )}
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-500">
                        {item.scheduled_time || 'All day'}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.priority === 'high' 
                        ? 'bg-red-100 text-red-800'
                        : item.priority === 'medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {item.priority} priority
                    </span>
                    {item.status === 'pending' && (
                      <button
                        onClick={() => updateItemStatus(item.id, 'completed')}
                        className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Mark Complete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* AI Insights */}
        {dayPlanItems.length > 0 && (
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">AI Insight</h4>
                <p className="text-sm text-gray-600">
                  {stats.highPriority > 0 
                    ? `You have ${stats.highPriority} high-priority items today. Consider tackling these first to stay on track.`
                    : stats.meetings > 2
                    ? `You have ${stats.meetings} meetings scheduled. Make sure to leave buffer time between them.`
                    : 'Your schedule looks manageable today. Great time to focus on deep work between meetings.'
                  }
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}