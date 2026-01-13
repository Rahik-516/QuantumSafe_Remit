'use client';

import { Emotions } from '@/lib/types';
import { getEmotionColor } from '@/lib/utils';

interface EmotionChartProps {
  emotions: Emotions;
}

export function EmotionChart({ emotions }: EmotionChartProps) {
  return (
    <div className="space-y-4">
      {Object.entries(emotions).map(([emotion, score]) => {
        if (score === undefined) return null;
        const percentage = (score * 100).toFixed(0);
        const color = getEmotionColor(emotion);

        return (
          <div key={emotion}>
            <div className="flex justify-between mb-1">
              <span className="capitalize font-medium text-gray-700">{emotion}</span>
              <span className="font-bold" style={{ color }}>
                {percentage}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all"
                style={{ width: `${percentage}%`, backgroundColor: color }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
