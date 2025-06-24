import React from 'react';
import { useEmail } from '../contexts/EmailContext';
import { ViewMode } from '../types/email';

export default function ViewModeSelector() {
  const { currentView, setCurrentView } = useEmail();

  const viewModes: { key: ViewMode; label: string; description: string }[] = [
    { key: 'default', label: 'Default', description: 'Sorted by time' },
    { key: 'priority', label: 'Priority', description: 'AI-ranked importance' },
    { key: 'custom', label: 'Custom', description: 'Action items & urgent' }
  ];

  return (
    <div className="flex bg-gray-100 rounded-lg p-1 mb-2">
      {viewModes.map((mode) => (
        <button
          key={mode.key}
          onClick={() => setCurrentView(mode.key)}
          className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all
            ${currentView === mode.key
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-gray-700 hover:text-blue-600 hover:bg-gray-200'}
          `}
          title={mode.description}
        >
          {mode.label}
        </button>
      ))}
    </div>
  );
}