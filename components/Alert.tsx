'use client';

import { FiX, FiCheckCircle, FiAlertTriangle, FiInfo } from 'react-icons/fi';

interface AlertProps {
  type: 'error' | 'success' | 'warning' | 'info';
  message: string;
  onClose?: () => void;
}

export function Alert({ type, message, onClose }: AlertProps) {
  const styles = {
    error: 'bg-red-50 border border-red-200 text-red-700',
    success: 'bg-green-50 border border-green-200 text-green-700',
    warning: 'bg-yellow-50 border border-yellow-200 text-yellow-700',
    info: 'bg-blue-50 border border-blue-200 text-blue-700',
  };

  return (
    <div className={`p-4 rounded-lg flex items-start gap-3 ${styles[type]}`}>
      <span className="text-xl flex-shrink-0">
        {type === 'error' && <FiX className="w-5 h-5" />}
        {type === 'success' && <FiCheckCircle className="w-5 h-5" />}
        {type === 'warning' && <FiAlertTriangle className="w-5 h-5" />}
        {type === 'info' && <FiInfo className="w-5 h-5" />}
      </span>
      <div className="flex-1">
        <p>{message}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-lg leading-none hover:opacity-70 flex-shrink-0"
        >
          ×
        </button>
      )}
    </div>
  );
}
