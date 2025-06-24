import React from 'react';

interface ToastProps {
  toasts: { id: number; message: string; type?: 'success' | 'error' | 'info' }[];
  removeToast: (id: number) => void;
}

const typeStyles: Record<string, string> = {
  success: 'bg-green-50 text-green-800 border-green-200',
  error: 'bg-red-50 text-red-800 border-red-200',
  info: 'bg-blue-50 text-blue-800 border-blue-200',
};

export default function Toast({ toasts, removeToast }: ToastProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col space-y-3 items-end">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`px-4 py-3 rounded-lg shadow-lg min-w-[220px] flex items-center space-x-2 animate-fade-in-up border ${typeStyles[toast.type || 'info']}`}
          onClick={() => removeToast(toast.id)}
        >
          <span className="font-medium flex-1 text-sm">{toast.message}</span>
          <button className="ml-2 text-gray-500 hover:text-gray-700 transition-colors" aria-label="Dismiss">×</button>
        </div>
      ))}
    </div>
  );
} 