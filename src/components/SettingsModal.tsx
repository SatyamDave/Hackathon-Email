import React, { useState } from 'react';
import Modal from './Modal';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export default function SettingsModal({ isOpen, onClose, onSave }: SettingsModalProps) {
  const [theme, setTheme] = useState('dark');
  const [notifications, setNotifications] = useState(true);

  const handleSave = () => {
    onSave();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Settings">
      <div className="space-y-4">
        <div>
          <label className="block text-dark-text-primary font-medium mb-1">Theme</label>
          <select
            className="w-full px-3 py-2 rounded bg-dark-muted text-dark-text-primary"
            value={theme}
            onChange={e => setTheme(e.target.value)}
          >
            <option value="dark">Dark</option>
            <option value="light">Light</option>
          </select>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={notifications}
            onChange={e => setNotifications(e.target.checked)}
            id="notifications-toggle"
          />
          <label htmlFor="notifications-toggle" className="text-dark-text-primary">Enable notifications</label>
        </div>
        <button
          className="w-full mt-4 py-2 bg-dark-accent text-dark-primary font-semibold rounded-lg hover:bg-dark-accent/90 transition"
          onClick={handleSave}
        >
          Save Settings
        </button>
      </div>
    </Modal>
  );
} 