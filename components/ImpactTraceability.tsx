'use client';

import { useState } from 'react';
import { FiBook, FiActivity, FiZap, FiDroplet, FiAward, FiBriefcase, FiAlertTriangle, FiSun, FiTarget, FiGlobe, FiHeart, FiTrendingUp } from 'react-icons/fi';

interface ImpactRecord {
  id: string;
  vault_type: string;
  amount: number;
  allocation_percent: number;
  impact_text: string;
  created_at: string;
  project_name?: string;
}

interface ImpactTraceabilityProps {
  records: ImpactRecord[];
  isLoading?: boolean;
}

export function ImpactTraceability({ records, isLoading = false }: ImpactTraceabilityProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Mock impact messages for different vault types and amounts
  const generateImpactMessage = (vaultType: string, amount: number): string => {
    const impacts: Record<string, (amount: number) => string> = {
      education: (amt) => {
        const students = Math.floor(amt / 250);
        return `Your contribution supports ${students} student${students !== 1 ? 's' : ''} with scholarships and school supplies`;
      },
      healthcare: (amt) => {
        const clinics = Math.floor(amt / 500);
        return `This allocation provides healthcare to ${clinics} clinic${clinics !== 1 ? 's' : ''} and mobile medical units`;
      },
      energy: (amt) => {
        const households = Math.floor(amt / 300);
        return `Your funds power ${households} household${households !== 1 ? 's' : ''} with solar energy`;
      },
      water: (amt) => {
        const wells = Math.floor(amt / 400);
        return `This supports ${wells} clean water well${wells !== 1 ? 's' : ''} for communities`;
      },
      agriculture: (amt) => {
        const farmers = Math.floor(amt / 350);
        return `Your support reaches ${farmers} farmer${farmers !== 1 ? 's' : ''} with seeds and equipment`;
      },
      livelihood: (amt) => {
        const artisans = Math.floor(amt / 280);
        return `This enables ${artisans} artisan${artisans !== 1 ? 's' : ''} to start sustainable micro-businesses`;
      },
      disaster_relief: (amt) => {
        const families = Math.floor(amt / 320);
        return `Your contribution helps ${families} family${families !== 1 ? 'ies' : ''} rebuild after disaster`;
      },
      solar_energy: (amt) => {
        const households = Math.floor(amt / 300);
        return `Your funds power ${households} household${households !== 1 ? 's' : ''} with solar energy`;
      },
    };

    const generator = impacts[vaultType.toLowerCase()] || impacts['education'];
    return generator(amount);
  };

  const getVaultIcon = (vaultType: string): string => {
    const icons: Record<string, string> = {
      education: 'book',
      healthcare: 'activity',
      energy: 'zap',
      water: 'droplet',
      agriculture: 'award',
      livelihood: 'briefcase',
      disaster_relief: 'alert',
      solar_energy: 'sun',
    };
    return icons[vaultType.toLowerCase()] || 'target';
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6 animate-fade-in-up">
        <div className="flex items-center gap-2 mb-4">
          <FiGlobe className="w-5 h-5" />
          <h2 className="text-xl font-bold">Impact Traceability</h2>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mr-3"></div>
          <p className="text-gray-600">Loading impact records...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6 animate-fade-in-up">
      <div className="flex items-center gap-2 mb-4">
        <FiGlobe className="w-5 h-5" />
        <h2 className="text-xl font-bold">Impact Traceability</h2>
        <span className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-semibold">
          {records.length} allocation{records.length !== 1 ? 's' : ''}
        </span>
      </div>

      {records.length > 0 ? (
        <div className="space-y-3">
          {records.map((record) => {
            const impactMsg = generateImpactMessage(record.vault_type, record.amount);
            const isExpanded = expandedId === record.id;

            return (
              <div
                key={record.id}
                className="border border-gray-200 rounded-lg overflow-hidden hover:border-indigo-400 transition"
              >
                <button
                  onClick={() => setExpandedId(isExpanded ? null : record.id)}
                  className="w-full px-4 py-3 flex items-center justify-between gap-3 hover:bg-gray-50 transition"
                >
                  <div className="flex items-center gap-3 flex-1 text-left min-w-0">
                    <div className="text-2xl flex-shrink-0 text-indigo-600">
                      {(() => {
                        const icon = getVaultIcon(record.vault_type);
                        switch(icon) {
                          case 'book': return <FiBook className="w-6 h-6" />;
                          case 'activity': return <FiActivity className="w-6 h-6" />;
                          case 'zap': return <FiZap className="w-6 h-6" />;
                          case 'droplet': return <FiDroplet className="w-6 h-6" />;
                          case 'award': return <FiAward className="w-6 h-6" />;
                          case 'briefcase': return <FiBriefcase className="w-6 h-6" />;
                          case 'alert': return <FiAlertTriangle className="w-6 h-6" />;
                          case 'sun': return <FiSun className="w-6 h-6" />;
                          default: return <FiTarget className="w-6 h-6" />;
                        }
                      })()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold capitalize text-gray-900 text-sm truncate">
                        {record.vault_type.replace(/_/g, ' ')} Vault
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {new Date(record.created_at).toLocaleDateString()} • <span className="font-semibold text-green-600">{record.amount} BDT</span>
                      </div>
                    </div>
                  </div>
                  <div className={`flex-shrink-0 text-gray-400 transition ${isExpanded ? 'rotate-180' : ''}`}>
                    ▼
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-4 py-3 bg-gradient-to-r from-indigo-50 to-emerald-50 border-t border-gray-200 space-y-3">
                    <div>
                      <p className="text-xs font-semibold text-indigo-900 mb-1">Project</p>
                      <p className="text-sm text-indigo-800">{record.project_name || 'Impact Vault Project'}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-indigo-900 mb-1 flex items-center gap-1"><FiHeart className="w-3 h-3" /> Impact</p>
                      <p className="text-sm text-indigo-800 leading-relaxed">{impactMsg}</p>
                    </div>
                    <div className="flex items-center gap-2 pt-2 border-t border-indigo-200">
                      <div className="w-2 h-2 rounded-full bg-green-600"></div>
                      <p className="text-xs text-indigo-700 font-semibold">Your funds are creating real change</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-gradient-to-br from-indigo-50 to-emerald-50 rounded-lg p-8 text-center border-2 border-dashed border-indigo-200">
          <div className="flex items-center justify-center gap-2 mb-2">
            <FiTrendingUp className="w-5 h-5" />
            <p className="text-gray-600 text-sm font-semibold">No impact allocations yet</p>
          </div>
          <p className="text-gray-500 text-xs mt-2">
            Send remittances and allocate to vaults to start creating transparent, traceable impact
          </p>
        </div>
      )}
    </div>
  );
}
