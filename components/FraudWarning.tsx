'use client';

import { FiInfo, FiAlertCircle, FiAlertTriangle } from 'react-icons/fi';

interface FraudWarningProps {
  amount: number;
  message: string;
  riskLevel: 'none' | 'low' | 'medium' | 'high';
  onDismiss?: () => void;
}

export function FraudWarning({ amount, message, riskLevel, onDismiss }: FraudWarningProps) {
  if (riskLevel === 'none') {
    return null;
  }

  const riskConfig = {
    low: {
      bg: 'bg-blue-50',
      border: 'border-blue-300',
      text: 'text-blue-800',
      icon: 'info',
      label: 'Info',
      message: 'Standard transaction.',
    },
    medium: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-400',
      text: 'text-yellow-800',
      icon: 'caution',
      label: 'Caution',
      message:
        'This transaction matches some common migration patterns. Please verify recipient details.',
    },
    high: {
      bg: 'bg-orange-50',
      border: 'border-orange-400',
      text: 'text-orange-800',
      icon: 'alert',
      label: 'High Risk',
      message:
        'This transaction matches common migration fraud patterns. Please verify all details before proceeding.',
    },
  };

  const config = riskConfig[riskLevel];

  return (
    <div
      className={`${config.bg} border-l-4 ${config.border} p-4 rounded mb-4 flex items-start gap-3 ${config.text}`}
      role="alert"
    >
      <span className="text-xl flex-shrink-0 mt-0.5">
        {config.icon === 'info' && <FiInfo className="w-5 h-5" />}
        {config.icon === 'caution' && <FiAlertCircle className="w-5 h-5" />}
        {config.icon === 'alert' && <FiAlertTriangle className="w-5 h-5" />}
      </span>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm mb-1">
          {config.label}: Fraud Risk Detected
        </p>
        <p className="text-sm mb-2">{config.message}</p>
        <div className="space-y-1 text-xs font-medium">
          {amount > 50000 && (
            <p>• Large transaction amount: {amount} BDT</p>
          )}
          {/agent|visa|job|urgent|wire|western|emergency|accident|hospital|tax|irs|bank|account|verify/i.test(
            message
          ) && <p>• Suspicious keywords detected in message</p>}
        </div>
        <p className="text-xs mt-2 opacity-70">
          ✓ This is just a warning. You can still proceed if you&aposre confident about this transaction.
        </p>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="flex-shrink-0 text-lg leading-none hover:opacity-70 transition"
          aria-label="Dismiss warning"
        >
          ×
        </button>
      )}
    </div>
  );
}
