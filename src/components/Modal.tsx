import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-dark-surface rounded-xl shadow-2xl p-6 min-w-[320px] max-w-lg relative animate-fade-in-up">
        <button
          className="absolute top-3 right-3 text-dark-text-secondary hover:text-dark-accent text-2xl font-bold"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        {title && <h2 className="text-lg font-semibold mb-4 text-dark-text-primary">{title}</h2>}
        <div>{children}</div>
      </div>
    </div>
  );
} 