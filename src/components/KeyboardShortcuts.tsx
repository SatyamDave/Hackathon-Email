import React from 'react';
import Modal from './Modal';

interface KeyboardShortcutsProps {
  isOpen: boolean;
  onClose: () => void;
}

const shortcuts = [
  { key: 'Ctrl + N', description: 'Compose new email' },
  { key: 'Ctrl + R', description: 'Reply to selected email' },
  { key: 'Ctrl + F', description: 'Forward selected email' },
  { key: 'Ctrl + A', description: 'Select all emails' },
  { key: 'Ctrl + S', description: 'Save draft' },
  { key: 'Ctrl + Enter', description: 'Send email' },
  { key: 'Ctrl + Shift + A', description: 'Mark as read/unread' },
  { key: 'Ctrl + Shift + I', description: 'Mark as important' },
  { key: 'Ctrl + Shift + M', description: 'Move to folder' },
  { key: 'Ctrl + Shift + D', description: 'Delete email' },
  { key: 'Ctrl + K', description: 'Search emails' },
  { key: 'Ctrl + 1', description: 'Switch to Inbox' },
  { key: 'Ctrl + 2', description: 'Switch to Important' },
  { key: 'Ctrl + 3', description: 'Switch to Sent' },
  { key: 'Ctrl + 4', description: 'Switch to Drafts' },
  { key: 'Ctrl + 5', description: 'Switch to Archive' },
  { key: 'Ctrl + /', description: 'Show keyboard shortcuts' },
  { key: 'Ctrl + ,', description: 'Open settings' },
  { key: 'Esc', description: 'Close modal/cancel action' },
  { key: 'Space', description: 'Mark as read/unread' },
  { key: 'Enter', description: 'Open selected email' }
];

export default function KeyboardShortcuts({ isOpen, onClose }: KeyboardShortcutsProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Keyboard Shortcuts">
      <div className="space-y-4">
        <p className="text-sm text-dark-text-secondary mb-4">
          Use these keyboard shortcuts to navigate and interact with your emails more efficiently.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {shortcuts.map((shortcut, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-dark-muted rounded-lg">
              <span className="text-sm text-dark-text-primary">{shortcut.description}</span>
              <kbd className="px-2 py-1 text-xs font-mono bg-dark-surface text-dark-accent rounded border border-dark-border">
                {shortcut.key}
              </kbd>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-3 bg-dark-accent/10 rounded-lg">
          <p className="text-xs text-dark-text-secondary">
            <strong>Tip:</strong> You can also use these shortcuts while composing emails or viewing email details.
          </p>
        </div>
      </div>
    </Modal>
  );
} 