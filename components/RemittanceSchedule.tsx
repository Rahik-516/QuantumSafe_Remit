'use client';

import { FiStar, FiCalendar, FiAlertTriangle } from 'react-icons/fi';

export type RemittanceScheduleType = 'once' | 'monthly' | 'emergency';

interface RemittanceScheduleProps {
  selected: RemittanceScheduleType;
  onChange: (schedule: RemittanceScheduleType) => void;
}

export function RemittanceSchedule({ selected, onChange }: RemittanceScheduleProps) {
  const schedules: { id: RemittanceScheduleType; label: string; description: string; icon: string }[] = [
    {
      id: 'once',
      label: 'One-Time',
      description: 'Send this remittance once',
      icon: 'star',
    },
    {
      id: 'monthly',
      label: 'Monthly',
      description: 'Send same amount every month',
      icon: 'calendar',
    },
    {
      id: 'emergency',
      label: 'Emergency-Only',
      description: 'Send when recipient requests',
      icon: 'alert',
    },
  ];

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-3">
        Remittance Schedule
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {schedules.map((schedule) => (
          <button
            key={schedule.id}
            onClick={() => onChange(schedule.id)}
            className={`p-4 rounded-lg border-2 transition text-left ${
              selected === schedule.id
                ? 'border-indigo-600 bg-indigo-50'
                : 'border-gray-200 bg-white hover:border-indigo-300'
            }`}
            aria-pressed={selected === schedule.id}
          >
            <div className="text-2xl mb-2">
              {schedule.icon === 'star' && <FiStar className="w-6 h-6" />}
              {schedule.icon === 'calendar' && <FiCalendar className="w-6 h-6" />}
              {schedule.icon === 'alert' && <FiAlertTriangle className="w-6 h-6" />}
            </div>
            <div className="font-semibold text-sm text-gray-900">{schedule.label}</div>
            <div className="text-xs text-gray-600 mt-1">{schedule.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
