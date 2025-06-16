import React, { useState } from 'react';
import { Calendar, CheckSquare, ToggleLeft, ToggleRight } from 'lucide-react';
import DayPlanner from './DayPlanner';
import QuickTasks from './QuickTasks';

type SidebarView = 'planner' | 'tasks';

export default function RightSidebar() {
  const [activeView, setActiveView] = useState<SidebarView>('planner');

  const toggleView = () => {
    setActiveView(prev => prev === 'planner' ? 'tasks' : 'planner');
  };

  return (
    <div className="w-80 bg-dark-secondary border-l border-dark-muted flex flex-col h-full">
      {/* Toggle Header */}
      <div className="p-4 border-b border-dark-muted bg-dark-primary">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-dark-text-primary">
            {activeView === 'planner' ? 'Day Planner' : 'Quick Tasks'}
          </h2>
          <button
            onClick={toggleView}
            className="flex items-center space-x-2 px-3 py-1.5 bg-dark-muted text-dark-text-primary rounded-lg hover:bg-dark-muted/80 transition-all duration-200"
          >
            {activeView === 'planner' ? (
              <>
                <CheckSquare className="w-4 h-4" />
                <span className="text-sm">Tasks</span>
              </>
            ) : (
              <>
                <Calendar className="w-4 h-4" />
                <span className="text-sm">Planner</span>
              </>
            )}
          </button>
        </div>
        
        {/* Toggle Switch Visual */}
        <div className="flex items-center justify-center space-x-2 text-xs text-dark-text-secondary">
          <span className={activeView === 'planner' ? 'text-dark-accent font-medium' : ''}>
            Planner
          </span>
          <button onClick={toggleView} className="text-dark-accent">
            {activeView === 'planner' ? 
              <ToggleLeft className="w-5 h-5" /> : 
              <ToggleRight className="w-5 h-5" />
            }
          </button>
          <span className={activeView === 'tasks' ? 'text-dark-accent font-medium' : ''}>
            Tasks
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden">
        {activeView === 'planner' ? (
          <div className="h-full overflow-y-auto">
            <DayPlanner />
          </div>
        ) : (
          <QuickTasks />
        )}
      </div>
    </div>
  );
} 