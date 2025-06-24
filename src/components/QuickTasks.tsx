import React, { useState, useEffect } from 'react';
import { Check, Plus, X, Clock, Flag, Star, AlertCircle, Brain, Sparkles, RefreshCw } from 'lucide-react';
import { useEmail } from '../contexts/EmailContext';

interface Task {
  id: string;
  title: string;
  category: 'email' | 'meeting' | 'followup' | 'urgent';
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  dueDate?: string;
  emailId?: string;
  aiGenerated?: boolean;
}

const MOCK_TASKS: Task[] = [];

export default function QuickTasks() {
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [showAddTask, setShowAddTask] = useState(false);
  const [isGeneratingTasks, setIsGeneratingTasks] = useState(false);
  const [lastAIUpdate, setLastAIUpdate] = useState<Date | null>(null);
  const { emails, selectedEmail, markAsRead, archiveEmail, markAsImportant, addToast } = useEmail();

  const toggleTask = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const addTask = () => {
    if (!newTaskTitle.trim()) return;
    
    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      category: 'email',
      priority: 'medium',
      completed: false,
      dueDate: 'Today',
      aiGenerated: false
    };
    
    setTasks(prev => [newTask, ...prev]);
    setNewTaskTitle('');
    setShowAddTask(false);
  };

  const removeTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  // Mock AI-powered task generation from emails
  const generateTasksFromEmails = async () => {
    if (isGeneratingTasks) return;
    
    setIsGeneratingTasks(true);
    try {
      // Simulate AI processing time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate mock tasks based on emails
      const importantEmails = emails.filter(email => 
        !email.isRead || email.isImportant || (email.attachments && email.attachments.length > 0)
      ).slice(0, 5);

      const mockTasks: Task[] = [
        {
          id: `ai-${Date.now()}-1`,
          title: 'Reply to urgent board meeting email',
          category: 'email',
          priority: 'high',
          completed: false,
          dueDate: 'Today',
          aiGenerated: true
        },
        {
          id: `ai-${Date.now()}-2`,
          title: 'Schedule Q4 financial review meeting',
          category: 'meeting',
          priority: 'medium',
          completed: false,
          dueDate: 'This week',
          aiGenerated: true
        },
        {
          id: `ai-${Date.now()}-3`,
          title: 'Review security breach incident report',
          category: 'urgent',
          priority: 'high',
          completed: false,
          dueDate: 'Today',
          aiGenerated: true
        }
      ];

      // Remove old AI-generated tasks and add new ones
      setTasks(prev => [
        ...mockTasks,
        ...prev.filter(task => !task.aiGenerated)
      ]);
      setLastAIUpdate(new Date());
      addToast('AI tasks generated!', 'success');
    } catch (error) {
      console.error('Error generating tasks from emails:', error);
      addToast('Demo mode: Task generation simulated', 'info');
    } finally {
      setIsGeneratingTasks(false);
    }
  };

  // Mock AI-powered quick actions
  const handleQuickAction = async (action: string) => {
    switch (action) {
      case 'flag-important':
        await generateTasksFromEmails();
        break;
      case 'find-urgent':
        addToast('Demo mode: Urgent items analysis simulated', 'info');
        break;
      default:
        break;
    }
  };

  const pendingTasks = tasks.filter(task => !task.completed);
  const aiGeneratedTasks = tasks.filter(task => task.aiGenerated);

  const handleMarkAllAsRead = () => {
    emails.forEach(email => markAsRead(email.id));
    addToast('All emails marked as read!', 'success');
  };

  const handleArchiveAll = () => {
    emails.forEach(email => archiveEmail(email.id));
    addToast('All emails archived!', 'success');
  };

  const handleStarRandom = () => {
    if (emails.length === 0) return;
    const random = emails[Math.floor(Math.random() * emails.length)];
    markAsImportant(random.id);
    addToast(`Starred: ${random.subject}`, 'info');
  };

  const getCategoryIcon = (category: Task['category']) => {
    switch (category) {
      case 'email': return <Flag className="w-3 h-3" />;
      case 'meeting': return <Clock className="w-3 h-3" />;
      case 'followup': return <RefreshCw className="w-3 h-3" />;
      case 'urgent': return <AlertCircle className="w-3 h-3" />;
      default: return <Flag className="w-3 h-3" />;
    }
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-dark-text-primary">Quick Tasks</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={generateTasksFromEmails}
            disabled={isGeneratingTasks}
            className="flex items-center space-x-1 px-2 py-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded text-xs hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50"
            title="Generate AI-powered tasks from emails"
          >
            {isGeneratingTasks ? (
              <RefreshCw className="w-3 h-3 animate-spin" />
            ) : (
              <Brain className="w-3 h-3" />
            )}
            <span>AI Tasks</span>
            <Sparkles className="w-2 h-2" />
          </button>
          <button
            onClick={() => setShowAddTask(true)}
            className="flex items-center space-x-1 px-2 py-1 bg-dark-accent text-dark-primary rounded text-xs hover:bg-dark-accent/90 transition-all"
          >
            <Plus className="w-3 h-3" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Quick Tasks */}
      <div className="p-4 bg-dark-surface rounded-lg shadow mb-4">
        <h3 className="text-dark-text-primary font-semibold mb-2">Quick Actions</h3>
        <div className="flex flex-wrap gap-2">
          <button
            className="px-3 py-2 bg-dark-accent text-dark-primary rounded-lg font-medium hover:bg-dark-accent/90 transition"
            onClick={handleMarkAllAsRead}
          >
            Mark all as read
          </button>
          <button
            className="px-3 py-2 bg-dark-accent text-dark-primary rounded-lg font-medium hover:bg-dark-accent/90 transition"
            onClick={handleArchiveAll}
          >
            Archive all
          </button>
          <button
            className="px-3 py-2 bg-dark-accent text-dark-primary rounded-lg font-medium hover:bg-dark-accent/90 transition"
            onClick={handleStarRandom}
          >
            Star random email
          </button>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-2">
        {tasks.length === 0 ? (
          <div className="text-center py-8 text-dark-text-secondary">
            <Brain className="w-8 h-8 mx-auto mb-2 text-dark-accent" />
            <p className="text-sm">No tasks yet</p>
            <p className="text-xs">Click "AI Tasks" to generate tasks from your emails</p>
          </div>
        ) : (
          tasks.map(task => (
            <div
              key={task.id}
              className={`flex items-center space-x-3 p-3 bg-dark-surface rounded-lg border transition-all ${
                task.completed ? 'opacity-60' : ''
              }`}
            >
              <button
                onClick={() => toggleTask(task.id)}
                className={`flex-shrink-0 w-5 h-5 rounded border-2 transition-all ${
                  task.completed
                    ? 'bg-dark-accent border-dark-accent'
                    : 'border-dark-muted hover:border-dark-accent'
                }`}
              >
                {task.completed && <Check className="w-3 h-3 text-dark-primary" />}
              </button>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  {getCategoryIcon(task.category)}
                  <span className={`text-xs font-medium ${getPriorityColor(task.priority)}`}>
                    {task.priority.toUpperCase()}
                  </span>
                  {task.aiGenerated && (
                    <Sparkles className="w-3 h-3 text-dark-accent" />
                  )}
                </div>
                <p className={`text-sm ${task.completed ? 'line-through' : 'text-dark-text-primary'}`}>
                  {task.title}
                </p>
                {task.dueDate && (
                  <p className="text-xs text-dark-text-secondary">{task.dueDate}</p>
                )}
              </div>
              
              <button
                onClick={() => removeTask(task.id)}
                className="flex-shrink-0 p-1 text-dark-text-secondary hover:text-red-400 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Add Task Modal */}
      {showAddTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-dark-surface rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold text-dark-text-primary mb-4">Add New Task</h3>
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Enter task title..."
              className="w-full px-3 py-2 bg-dark-muted text-dark-text-primary rounded-lg border border-dark-border focus:ring-2 focus:ring-dark-accent focus:border-transparent"
              onKeyDown={(e) => e.key === 'Enter' && addTask()}
            />
            <div className="flex space-x-2 mt-4">
              <button
                onClick={addTask}
                className="flex-1 py-2 bg-dark-accent text-dark-primary rounded-lg hover:bg-dark-accent/90 transition"
              >
                Add Task
              </button>
              <button
                onClick={() => setShowAddTask(false)}
                className="flex-1 py-2 bg-dark-muted text-dark-text-primary rounded-lg hover:bg-dark-muted/80 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 