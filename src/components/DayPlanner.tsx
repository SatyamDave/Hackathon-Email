import React, { useState } from 'react';
import { useEmail } from '../contexts/EmailContext';

interface Task {
  id: number;
  text: string;
  done: boolean;
}

export default function DayPlanner() {
  const { addToast } = useEmail();
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, text: 'Check urgent emails', done: false },
    { id: 2, text: 'Review meeting requests', done: false },
    { id: 3, text: 'Plan lunch with Alex', done: false },
  ]);
  const [input, setInput] = useState('');

  const handleAdd = () => {
    if (!input.trim()) return;
    setTasks([...tasks, { id: Date.now(), text: input, done: false }]);
    addToast('Task added!', 'success');
    setInput('');
  };

  const handleToggle = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const handleRemove = (id: number) => {
    setTasks(tasks.filter(t => t.id !== id));
    addToast('Task removed!', 'info');
  };

  return (
    <div className="p-4 bg-dark-surface rounded-lg shadow flex flex-col h-full">
      <h3 className="text-dark-text-primary font-semibold mb-2">Day Planner</h3>
      <div className="flex mb-3">
        <input
          className="flex-1 px-3 py-2 rounded-l bg-dark-muted text-dark-text-primary"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Add a task..."
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
        />
        <button
          className="px-4 py-2 bg-dark-accent text-dark-primary rounded-r font-medium hover:bg-dark-accent/90 transition"
          onClick={handleAdd}
        >
          Add
        </button>
      </div>
      <ul className="flex-1 overflow-y-auto space-y-2">
        {tasks.map(task => (
          <li key={task.id} className="flex items-center justify-between bg-dark-muted rounded px-3 py-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={task.done}
                onChange={() => handleToggle(task.id)}
              />
              <span className={task.done ? 'line-through text-dark-text-secondary' : 'text-dark-text-primary'}>{task.text}</span>
            </label>
            <button
              className="text-red-400 hover:text-red-600 text-lg font-bold ml-2"
              onClick={() => handleRemove(task.id)}
              aria-label="Remove"
            >
              ×
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}