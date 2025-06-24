import React from 'react';
import QuickTasks from './QuickTasks';
import DayPlanner from './DayPlanner';
import AnalyticsDashboard from './AnalyticsDashboard';

export default function RightSidebar() {
  return (
    <div className="flex flex-col h-full w-full p-4 space-y-4 overflow-y-auto">
      <QuickTasks />
      <DayPlanner />
      <AnalyticsDashboard />
    </div>
  );
} 