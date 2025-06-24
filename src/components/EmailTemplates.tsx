import React, { useState } from 'react';
import Modal from './Modal';
import { useEmail } from '../contexts/EmailContext';

interface EmailTemplatesProps {
  isOpen: boolean;
  onClose: () => void;
  onUseTemplate: (subject: string, body: string) => void;
}

const templates = [
  {
    name: 'Follow-up',
    subject: 'Following up on our conversation',
    body: 'Hi [Name],\n\nI wanted to follow up on our recent conversation about [topic]. Please let me know if you have any updates or if there\'s anything I can help with.\n\nBest regards,\n[Your name]'
  },
  {
    name: 'Thank You',
    subject: 'Thank you for your time',
    body: 'Hi [Name],\n\nThank you for taking the time to [meet/discuss/etc.] with me today. I really appreciate your insights and look forward to our continued collaboration.\n\nBest regards,\n[Your name]'
  },
  {
    name: 'Meeting Request',
    subject: 'Meeting Request',
    body: 'Hi [Name],\n\nI hope this email finds you well. I would like to schedule a meeting to discuss [topic]. Would you be available for a 30-minute call this week?\n\nPlease let me know what times work best for you.\n\nBest regards,\n[Your name]'
  },
  {
    name: 'Project Update',
    subject: 'Project Update - [Project Name]',
    body: 'Hi [Name],\n\nI wanted to provide you with an update on [Project Name]. Here\'s what we\'ve accomplished:\n\n• [Achievement 1]\n• [Achievement 2]\n• [Achievement 3]\n\nNext steps:\n• [Next step 1]\n• [Next step 2]\n\nPlease let me know if you have any questions or feedback.\n\nBest regards,\n[Your name]'
  }
];

export default function EmailTemplates({ isOpen, onClose, onUseTemplate }: EmailTemplatesProps) {
  const { addToast } = useEmail();
  const [selectedTemplate, setSelectedTemplate] = useState<typeof templates[0] | null>(null);

  const handleUseTemplate = () => {
    if (!selectedTemplate) return;
    onUseTemplate(selectedTemplate.subject, selectedTemplate.body);
    addToast('Template applied!', 'success');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Email Templates">
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-3">
          {templates.map((template, index) => (
            <div
              key={index}
              onClick={() => setSelectedTemplate(template)}
              className={`p-3 rounded-lg border cursor-pointer transition-all ${
                selectedTemplate?.name === template.name
                  ? 'border-dark-accent bg-dark-accent/10'
                  : 'border-dark-border hover:border-dark-accent/50'
              }`}
            >
              <h3 className="font-medium text-dark-text-primary mb-1">{template.name}</h3>
              <p className="text-sm text-dark-text-secondary mb-2">{template.subject}</p>
              <p className="text-xs text-dark-text-secondary line-clamp-2">{template.body}</p>
            </div>
          ))}
        </div>
        <div className="flex space-x-2 pt-2">
          <button
            onClick={handleUseTemplate}
            disabled={!selectedTemplate}
            className="flex-1 py-2 bg-dark-accent text-dark-primary font-semibold rounded-lg hover:bg-dark-accent/90 transition disabled:opacity-50"
          >
            Use Template
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-dark-muted text-dark-text-primary rounded-lg hover:bg-dark-muted/80 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
} 