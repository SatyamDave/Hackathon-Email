import React, { useState, useEffect } from 'react';
import { Check, Plus, X, Clock, Flag, Star, AlertCircle, Brain, Sparkles, RefreshCw } from 'lucide-react';
import { useEmail } from '../contexts/EmailContext';
import { AzureOpenAIService } from '../services/azureOpenAI';

interface Task {
  id: string;
  title: string;
  category: 'email' | 'meeting' | 'followup' | 'urgent';
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  dueDate?: string;
  emailId?: string; // Link to source email
  aiGenerated?: boolean; // Mark AI-generated tasks
}

const MOCK_TASKS: Task[] = [];

export default function QuickTasks() {
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [showAddTask, setShowAddTask] = useState(false);
  const [isGeneratingTasks, setIsGeneratingTasks] = useState(false);
  const [lastAIUpdate, setLastAIUpdate] = useState<Date | null>(null);
  const { emails, selectedEmail } = useEmail();

  // Check if OpenAI is configured
  const isAIConfigured = !!(
    import.meta.env.VITE_AZURE_OPENAI_API_KEY &&
    import.meta.env.VITE_AZURE_OPENAI_ENDPOINT &&
    import.meta.env.VITE_AZURE_OPENAI_DEPLOYMENT_NAME
  );

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

  // AI-powered task generation from emails
  const generateTasksFromEmails = async () => {
    if (!isAIConfigured || isGeneratingTasks) return;
    
    setIsGeneratingTasks(true);
    try {
      // Get unread/important emails for task analysis
      const importantEmails = emails.filter(email => 
        !email.isRead || email.isImportant || (email.attachments && email.attachments.length > 0)
      ).slice(0, 10); // Limit to prevent overwhelming AI

      if (importantEmails.length === 0) {
        setIsGeneratingTasks(false);
        return;
      }

      const prompt = `Analyze these emails and generate actionable tasks. Focus on:
1. Emails requiring responses
2. Meetings to schedule or attend  
3. Deadlines and urgent items
4. Follow-up actions needed

IMPORTANT: Return ONLY a valid JSON array, no other text. Use this exact format:
[
  {
    "title": "Reply to Jennifer Williams about board meeting",
    "category": "email",
    "priority": "high",
    "dueDate": "Today",
    "emailId": "1"
  },
  {
    "title": "Schedule Q4 financial review meeting",
    "category": "meeting", 
    "priority": "medium",
    "dueDate": "This week"
  }
]

Valid categories: email, meeting, followup, urgent
Valid priorities: high, medium, low

Emails to analyze:
${importantEmails.map(email => `
ID: ${email.id}
From: ${email.sender.name}
Subject: ${email.subject}
Preview: ${email.preview}
Important: ${email.isImportant}
`).join('\n')}`;

      const response = await AzureOpenAIService.emailAssistantChat(prompt, null, emails);
      
      // Try to parse AI response as JSON
      try {
        // Clean the response - remove any markdown formatting or extra text
        let cleanResponse = response.trim();
        
        // Look for JSON array in the response
        const jsonStart = cleanResponse.indexOf('[');
        const jsonEnd = cleanResponse.lastIndexOf(']');
        
        if (jsonStart !== -1 && jsonEnd !== -1) {
          cleanResponse = cleanResponse.substring(jsonStart, jsonEnd + 1);
        }
        
        const aiTasks = JSON.parse(cleanResponse);
        if (Array.isArray(aiTasks) && aiTasks.length > 0) {
          const newTasks: Task[] = aiTasks
            .filter(task => task.title && typeof task.title === 'string')
            .map((task, index) => ({
              id: `ai-${Date.now()}-${index}`,
              title: task.title.trim(),
              category: (task.category as Task['category']) || 'email',
              priority: (task.priority as Task['priority']) || 'medium',
              completed: false,
              dueDate: task.dueDate || 'Today',
              emailId: task.emailId,
              aiGenerated: true
            }));

          if (newTasks.length > 0) {
            // Remove old AI-generated tasks and add new ones
            setTasks(prev => [
              ...newTasks,
              ...prev.filter(task => !task.aiGenerated)
            ]);
            setLastAIUpdate(new Date());
          }
        } else {
          throw new Error('No valid tasks found in AI response');
        }
      } catch (parseError) {
        console.error('Failed to parse AI task response:', parseError);
        console.log('Raw AI response:', response);
        
        // Try to extract meaningful task from the response text
        const cleanTitle = response
          .replace(/^[^a-zA-Z]*/, '') // Remove leading non-letters
          .replace(/json|[\[\]{}]/gi, '') // Remove JSON artifacts
          .split('.')[0] // Take first sentence
          .trim();
          
        if (cleanTitle.length > 10) {
          const fallbackTask: Task = {
            id: `ai-fallback-${Date.now()}`,
            title: cleanTitle.substring(0, 80) + (cleanTitle.length > 80 ? '...' : ''),
            category: 'email',
            priority: 'medium',
            completed: false,
            dueDate: 'Today',
            aiGenerated: true
          };
          setTasks(prev => [fallbackTask, ...prev.filter(task => !task.aiGenerated)]);
          setLastAIUpdate(new Date());
        }
      }
    } catch (error) {
      console.error('Error generating tasks from emails:', error);
    } finally {
      setIsGeneratingTasks(false);
    }
  };

  // AI-powered quick actions
  const handleQuickAction = async (action: string) => {
    if (!isAIConfigured) return;

    switch (action) {
      case 'flag-important':
        await generateTasksFromEmails();
        break;
      case 'find-urgent':
        // Filter and prioritize urgent tasks
        const urgentPrompt = "Identify the most urgent tasks from my current emails that need immediate attention.";
        try {
          const response = await AzureOpenAIService.emailAssistantChat(urgentPrompt, selectedEmail, emails);
          // Could add urgent tasks based on response
        } catch (error) {
          console.error('Error finding urgent items:', error);
        }
        break;
      case 'schedule-followups':
        // Generate follow-up tasks
        const followupPrompt = "Create follow-up tasks for emails that haven't received responses or need scheduling.";
        try {
          await AzureOpenAIService.emailAssistantChat(followupPrompt, selectedEmail, emails);
        } catch (error) {
          console.error('Error scheduling follow-ups:', error);
        }
        break;
      case 'mark-done':
        // Auto-complete tasks based on email status
        setTasks(prev => prev.map(task => 
          task.aiGenerated && task.category === 'email' 
            ? { ...task, completed: true }
            : task
        ));
        break;
    }
  };

  const QUICK_ACTIONS = [
    { icon: Brain, label: 'Generate Tasks', action: 'flag-important' },
    { icon: AlertCircle, label: 'Find Urgent', action: 'find-urgent' },
    { icon: Clock, label: 'Schedule', action: 'schedule-followups' },
    { icon: Flag, label: 'Mark Done', action: 'mark-done' }
  ];

  const getCategoryIcon = (category: Task['category']) => {
    switch (category) {
      case 'email': return '📧';
      case 'meeting': return '📅';
      case 'followup': return '🔄';
      case 'urgent': return '🚨';
      default: return '📝';
    }
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-dark-text-secondary';
    }
  };

  const completedTasks = tasks.filter(task => task.completed);
  const pendingTasks = tasks.filter(task => !task.completed);
  const aiGeneratedTasks = tasks.filter(task => task.aiGenerated);

  return (
    <div className="w-80 bg-dark-secondary border-l border-dark-muted flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-dark-muted">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-dark-text-primary">Quick Tasks</h2>
          <div className="flex space-x-2">
            {isAIConfigured && (
              <button
                onClick={generateTasksFromEmails}
                disabled={isGeneratingTasks}
                className="p-2 bg-dark-accent text-dark-primary rounded-lg hover:bg-dark-accent/90 transition-colors disabled:opacity-50"
                title="Generate tasks from emails using AI"
              >
                {isGeneratingTasks ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Brain className="w-4 h-4" />
                )}
              </button>
            )}
            <button
              onClick={() => setShowAddTask(!showAddTask)}
              className="p-2 bg-dark-muted text-dark-text-primary rounded-lg hover:bg-dark-muted/80 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {/* Task Stats */}
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="bg-dark-muted rounded-lg p-2 text-center">
            <div className="text-dark-accent font-semibold">{pendingTasks.length}</div>
            <div className="text-dark-text-secondary">Pending</div>
          </div>
          <div className="bg-dark-muted rounded-lg p-2 text-center">
            <div className="text-green-400 font-semibold">{completedTasks.length}</div>
            <div className="text-dark-text-secondary">Done</div>
          </div>
          <div className="bg-dark-muted rounded-lg p-2 text-center">
            <div className="text-blue-400 font-semibold">{aiGeneratedTasks.length}</div>
            <div className="text-dark-text-secondary">AI</div>
          </div>
        </div>

        {/* AI Status */}
        {isAIConfigured && lastAIUpdate && (
          <div className="mt-2 text-xs text-dark-text-secondary text-center">
            Last AI update: {lastAIUpdate.toLocaleTimeString()}
          </div>
        )}
        {!isAIConfigured && (
          <div className="mt-2 text-xs text-yellow-400 text-center">
            Configure Azure OpenAI for smart task generation
          </div>
        )}
      </div>

      {/* Add Task Form */}
      {showAddTask && (
        <div className="p-4 bg-dark-muted border-b border-dark-muted">
          <div className="flex gap-2">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Add a new task..."
              className="flex-1 px-3 py-2 bg-dark-primary border border-dark-muted rounded-lg text-dark-text-primary placeholder-dark-text-secondary focus:ring-2 focus:ring-dark-accent focus:border-transparent text-sm"
              onKeyPress={(e) => e.key === 'Enter' && addTask()}
              autoFocus
            />
            <button
              onClick={addTask}
              className="px-3 py-2 bg-dark-accent text-dark-primary rounded-lg hover:bg-dark-accent/90 transition-colors"
            >
              <Check className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="p-4 border-b border-dark-muted">
        <h3 className="text-sm font-medium text-dark-text-primary mb-2">AI Actions</h3>
        <div className="grid grid-cols-2 gap-2">
          {QUICK_ACTIONS.map((action, index) => (
            <button
              key={index}
              onClick={() => handleQuickAction(action.action)}
              disabled={!isAIConfigured && action.action !== 'mark-done'}
              className="flex items-center space-x-2 p-2 bg-dark-muted text-dark-text-primary rounded-lg hover:bg-dark-muted/80 transition-colors text-xs disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <action.icon className="w-3.5 h-3.5" />
              <span className="truncate">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tasks List */}
      <div className="flex-1 overflow-y-auto">
        {/* Pending Tasks */}
        {pendingTasks.length > 0 && (
          <div className="p-4">
            <h3 className="text-sm font-medium text-dark-text-primary mb-3">Pending Tasks</h3>
            <div className="space-y-2">
              {pendingTasks.map(task => (
                <div
                  key={task.id}
                  className="bg-dark-muted rounded-lg p-3 hover:bg-dark-muted/80 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <button
                        onClick={() => toggleTask(task.id)}
                        className="mt-0.5 w-4 h-4 border-2 border-dark-accent rounded-full hover:bg-dark-accent/20 transition-colors"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-dark-text-primary leading-tight">
                          <span className="mr-2">{getCategoryIcon(task.category)}</span>
                          {task.title}
                          {task.aiGenerated && (
                            <span title="AI Generated">
                              <Sparkles className="w-3 h-3 inline ml-1 text-blue-400" />
                            </span>
                          )}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`text-xs ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                          {task.dueDate && (
                            <span className="text-xs text-dark-text-secondary">
                              {task.dueDate}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => removeTask(task.id)}
                      className="text-dark-text-secondary hover:text-red-400 transition-colors ml-2"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Completed Tasks */}
        {completedTasks.length > 0 && (
          <div className="p-4 border-t border-dark-muted">
            <h3 className="text-sm font-medium text-dark-text-secondary mb-3">Completed ({completedTasks.length})</h3>
            <div className="space-y-2">
              {completedTasks.map(task => (
                <div
                  key={task.id}
                  className="bg-dark-muted/50 rounded-lg p-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <button
                        onClick={() => toggleTask(task.id)}
                        className="mt-0.5 w-4 h-4 bg-dark-accent border-2 border-dark-accent rounded-full flex items-center justify-center"
                      >
                        <Check className="w-2.5 h-2.5 text-dark-primary" />
                      </button>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-dark-text-secondary leading-tight line-through">
                          <span className="mr-2 opacity-50">{getCategoryIcon(task.category)}</span>
                          {task.title}
                          {task.aiGenerated && (
                            <span title="AI Generated">
                              <Sparkles className="w-3 h-3 inline ml-1 text-blue-400/50" />
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeTask(task.id)}
                      className="text-dark-text-secondary hover:text-red-400 transition-colors ml-2"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tasks.length === 0 && (
          <div className="p-4 text-center">
            <Brain className="w-12 h-12 mx-auto mb-3 text-dark-text-secondary" />
            <div className="text-dark-text-secondary text-sm mb-2">
              No tasks yet. 
            </div>
            {isAIConfigured ? (
              <button
                onClick={generateTasksFromEmails}
                className="text-xs text-dark-accent hover:text-dark-accent/80 transition-colors"
              >
                Generate tasks from your emails with AI
              </button>
            ) : (
              <div className="text-xs text-dark-text-secondary">
                Add your first task to get started!
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 