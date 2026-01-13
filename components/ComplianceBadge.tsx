'use client';

import { useState } from 'react';
import { FiCheckCircle, FiLock, FiCheck } from 'react-icons/fi';

interface ComplianceBadgeProps {
  tooltipDelay?: number;
}

export function ComplianceBadge({ tooltipDelay = 200 }: ComplianceBadgeProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipTimeout, setTooltipTimeout] = useState<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    const timeout = setTimeout(() => {
      setShowTooltip(true);
    }, tooltipDelay);
    setTooltipTimeout(timeout);
  };

  const handleMouseLeave = () => {
    if (tooltipTimeout) {
      clearTimeout(tooltipTimeout);
    }
    setShowTooltip(false);
  };

  return (
    <div className="relative inline-block">
      <div
        className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-50 to-blue-50 px-4 py-2 rounded-full border border-emerald-200 text-sm font-semibold text-emerald-700 hover:shadow-md transition cursor-help"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <FiCheckCircle className="w-5 h-5" />
        <span>Compliance-Ready Mode</span>
      </div>

      {showTooltip && (
        <div className="absolute top-full left-0 mt-2 bg-gray-800 text-white text-xs rounded-lg shadow-lg p-3 w-max max-w-xs z-40 border border-gray-700 animate-fade-in-up">
          <p className="font-semibold mb-2 flex items-center gap-2"><FiLock className="w-4 h-4" /> Security Features:</p>
          <ul className="space-y-1 text-gray-100">
            <li className="flex items-center gap-2"><FiCheck className="w-3 h-3" /> KYC (Know Your Customer) ready</li>
            <li className="flex items-center gap-2"><FiCheck className="w-3 h-3" /> AML (Anti-Money Laundering) checks enabled</li>
            <li className="flex items-center gap-2"><FiCheck className="w-3 h-3" /> Transaction audit logging</li>
            <li className="flex items-center gap-2"><FiCheck className="w-3 h-3" /> Regulatory compliance framework</li>
          </ul>
          <p className="text-gray-400 text-xs mt-2 pt-2 border-t border-gray-600">
            Full compliance capabilities available in production deployment.
          </p>
          <div className="absolute bottom-full left-4 w-2 h-2 bg-gray-800 transform rotate-45 border-t border-l border-gray-700"></div>
        </div>
      )}
    </div>
  );
}
