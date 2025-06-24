import React from 'react';
import Modal from './Modal';

interface AttachmentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileName: string;
}

export default function AttachmentPreviewModal({ isOpen, onClose, fileName }: AttachmentPreviewModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Attachment Preview">
      <div className="flex flex-col items-center justify-center py-8">
        <div className="w-16 h-16 bg-dark-muted rounded-lg flex items-center justify-center mb-4">
          <span className="text-3xl">📄</span>
        </div>
        <div className="text-dark-text-primary font-medium mb-2">{fileName}</div>
        <div className="text-dark-text-secondary text-sm">Preview not available in demo.</div>
      </div>
    </Modal>
  );
} 