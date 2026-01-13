'use client';

import { FiSend, FiTrendingUp, FiStar, FiTrendingDown, FiTarget } from 'react-icons/fi';

interface ImpactScoreProps {
  score: number;
  totalRemittances: number;
  avgAllocationPercent: number;
  countryFocus?: string;
}

export function ImpactScore({
  score,
  totalRemittances,
  avgAllocationPercent,
  countryFocus = 'Bangladesh',
}: ImpactScoreProps) {
  // Determine score level and messaging
  const getScoreLevel = (s: number): { level: string; color: string; icon: string; message: string } => {
    if (s >= 80) {
      return {
        level: 'Impact Hero',
        color: 'from-purple-600 to-pink-600',
        icon: 'send',
        message: 'You are making extraordinary impact on communities',
      };
    } else if (s >= 60) {
      return {
        level: 'Impact Advocate',
        color: 'from-indigo-600 to-emerald-600',
        icon: 'trending',
        message: 'Your contributions are significantly helping communities',
      };
    } else if (s >= 40) {
      return {
        level: 'Impact Supporter',
        color: 'from-blue-600 to-cyan-600',
        icon: 'star',
        message: 'You are supporting positive change in communities',
      };
    } else {
      return {
        level: 'Impact Contributor',
        color: 'from-cyan-600 to-green-600',
        icon: 'trending-down',
        message: 'Every contribution helps create lasting change',
      };
    }
  };

  const scoreData = getScoreLevel(score);
  const scorePercent = Math.min((score / 100) * 100, 100);

  return (
    <div className="bg-white rounded-xl shadow-md p-6 animate-fade-in-up">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Your Impact Score</h2>
        <span className="text-sm font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full flex items-center gap-2">
          {scoreData.icon === 'send' && <FiSend className="w-4 h-4" />}
          {scoreData.icon === 'trending' && <FiTrendingUp className="w-4 h-4" />}
          {scoreData.icon === 'star' && <FiStar className="w-4 h-4" />}
          {scoreData.icon === 'trending-down' && <FiTrendingDown className="w-4 h-4" />}
          {scoreData.level}
        </span>
      </div>

      <div className="space-y-6">
        {/* Score Display */}
        <div className={`bg-gradient-to-r ${scoreData.color} rounded-lg p-6 text-white relative overflow-hidden`}>
          <div className="absolute top-0 right-0 opacity-10 text-6xl">
            {scoreData.icon === 'send' && <FiSend className="w-24 h-24" />}
            {scoreData.icon === 'trending' && <FiTrendingUp className="w-24 h-24" />}
            {scoreData.icon === 'star' && <FiStar className="w-24 h-24" />}
            {scoreData.icon === 'trending-down' && <FiTrendingDown className="w-24 h-24" />}
          </div>
          <div className="relative z-10">
            <p className="text-sm font-semibold opacity-90 mb-1">Impact Score</p>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-5xl font-bold">{score}</span>
              <span className="text-xl opacity-80">/100</span>
            </div>
            <p className="text-sm leading-relaxed">{scoreData.message}</p>
          </div>
        </div>

        {/* Score Bar */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-gray-700">Overall Progress</span>
            <span className="text-xs text-gray-500">{scorePercent.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${scoreData.color} transition-all duration-500 rounded-full`}
              style={{ width: `${scorePercent}%` }}
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg p-4 border border-indigo-200">
            <p className="text-xs text-gray-600 font-semibold mb-1">Total Remittances</p>
            <p className="text-3xl font-bold text-indigo-600">{totalRemittances}</p>
            <p className="text-xs text-gray-500 mt-1">transactions sent</p>
          </div>

          <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-lg p-4 border border-emerald-200">
            <p className="text-xs text-gray-600 font-semibold mb-1">Impact Allocation</p>
            <p className="text-3xl font-bold text-emerald-600">{avgAllocationPercent}%</p>
            <p className="text-xs text-gray-500 mt-1">avg to vaults</p>
          </div>
        </div>

        {/* Impact Message */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-4 border border-amber-200">
          <p className="text-sm font-semibold text-amber-900 mb-2 flex items-center gap-2"><FiSend className="w-4 h-4" /> Your Impact in {countryFocus}</p>
          <p className="text-sm text-amber-800 leading-relaxed">
            You&aposve supported education and healthcare initiatives reaching hundreds of families.
            Through {totalRemittances} smart remittances, you&aposre building sustainable futures in {countryFocus}.
          </p>
        </div>

        {/* CTA */}
        <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200 text-center">
          <p className="text-xs text-indigo-700 font-semibold mb-2 flex items-center justify-center gap-2">
            <FiTarget className="w-4 h-4" /> Keep growing your impact
          </p>
          <p className="text-xs text-indigo-600">
            Continue sending remittances and allocating to impact vaults to increase your score
          </p>
        </div>
      </div>
    </div>
  );
}
