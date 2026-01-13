'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { FraudWarning } from '@/components/FraudWarning';
import { RemittanceSchedule, RemittanceScheduleType } from '@/components/RemittanceSchedule';
import { ComplianceBadge } from '@/components/ComplianceBadge';
import { ImpactTraceability } from '@/components/ImpactTraceability';
import { ImpactScore } from '@/components/ImpactScore';
import { detectFraudRisk, calculateImpactScore, getMockProjectName } from '@/lib/utils';
import { FiCpu, FiSearch, FiCheckCircle, FiX, FiSend, FiTarget, FiTrendingUp, FiHeart, FiBarChart2, FiLock, FiBook, FiActivity, FiDroplet, FiAward, FiBriefcase, FiAlertTriangle, FiSun, FiGlobe } from 'react-icons/fi';

// Types for location-based suggestions
type DasporaLocation = 'US' | 'UAE' | 'UK' | 'Canada' | 'Australia' | 'Other';

interface AllocationRecord {
  id: string;
  vault_type: string;
  amount: number;
  allocation_percent: number;
  impact_text: string;
  created_at: string;
  project_name?: string;
}

interface SuccessModal {
  show: boolean;
  message: string;
  encryptedKey?: string;
  schedule?: RemittanceScheduleType;
}

interface ErrorModal {
  show: boolean;
  message: string;
}

interface UserProfile {
  bio: string;
  emotions: {
    pride?: number;
    nostalgia?: number;
    love?: number;
    hope?: number;
    [key: string]: number | undefined;
  };
}

interface Vault {
  id: string;
  type: string;
  description: string;
  icon?: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    bio: '',
    emotions: {},
  });
  const [bio, setBio] = useState('');
  const [vaults, setVaults] = useState<Vault[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [remitAmount, setRemitAmount] = useState('');
  const [remitRecipient, setRemitRecipient] = useState('');
  const [remitting, setRemitting] = useState(false);
  const [recommended, setRecommended] = useState<Vault[]>([]);
  
  // New state for enhanced features
  const [allocationPercent, setAllocationPercent] = useState(0);
  const [selectedVaultForAllocation, setSelectedVaultForAllocation] = useState<Vault | null>(null);
  const [diasporaLocation, setDiasporaLocation] = useState<DasporaLocation>('US');
  const [allocationHistory, setAllocationHistory] = useState<AllocationRecord[]>([]);
  const [suggestionText, setSuggestionText] = useState('');
  const [successModal, setSuccessModal] = useState<SuccessModal>({ show: false, message: '' });
  const [errorModal, setErrorModal] = useState<ErrorModal>({ show: false, message: '' });
  const [loadingAllocationHistory, setLoadingAllocationHistory] = useState(false);

  // New state for FEATURE 2: Fraud Warning
  const [fraudRiskLevel, setFraudRiskLevel] = useState<'none' | 'low' | 'medium' | 'high'>('none');

  // New state for FEATURE 3: Remittance Scheduling
  const [selectedSchedule, setSelectedSchedule] = useState<RemittanceScheduleType>('once');

  // New state for FEATURE 5: Impact Score
  const [impactScore, setImpactScore] = useState(0);
  const [avgAllocationPercent, setAvgAllocationPercent] = useState(0);

  // Helper function to get vault icon
  const getVaultIcon = (type: string) => {
    const iconClass = "w-10 h-10 text-indigo-600";
    switch (type.toLowerCase()) {
      case 'education':
        return <FiBook className={iconClass} />;
      case 'healthcare':
        return <FiActivity className={iconClass} />;
      case 'solar':
      case 'energy':
        return <FiSun className={iconClass} />;
      case 'water':
        return <FiDroplet className={iconClass} />;
      case 'agriculture':
        return <FiAward className={iconClass} />;
      case 'microfinance':
      case 'business':
        return <FiBriefcase className={iconClass} />;
      case 'emergency':
        return <FiAlertTriangle className={iconClass} />;
      case 'environment':
        return <FiGlobe className={iconClass} />;
      default:
        return <FiTarget className={iconClass} />;
    }
  };

  const calculateAndUpdateImpactScore = useCallback(async (userId: string) => {
    try {
      // Fetch all remittances for this user
      const { data, error } = await supabase
        .from('remittance_history')
        .select('*')
        .eq('user_id', userId)
        .limit(100);

      if (error) {
        console.error('Error loading remittances for impact score:', error);
        return;
      }

      if (data && data.length > 0) {
        const remittanceCount = data.length;
        const allocatedAmounts = data.filter((r: any) => r.amount > 0).map((r: any) => r.amount);
        const avgAllocation = allocatedAmounts.length > 0
          ? Math.round((allocatedAmounts.reduce((a: number, b: number) => a + b, 0) / allocatedAmounts.length / 10000) * 100)
          : 0;

        const score = calculateImpactScore(remittanceCount, Math.min(avgAllocation, 30));
        setImpactScore(score);
        setAvgAllocationPercent(Math.min(avgAllocation, 30));
      }
    } catch (err) {
      console.error('Impact score calculation error:', err);
    }
  }, []);

  const loadAllocationHistory = useCallback(async (userId: string) => {
    try {
      setLoadingAllocationHistory(true);
      const { data, error } = await supabase
        .from('remittance_history')
        .select('*')
        .eq('user_id', userId)
        .filter('recipient', 'like', 'vault:%')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error loading allocation history:', error);
        setAllocationHistory([]);
        return;
      }

      if (data) {
        const records: AllocationRecord[] = data.map((item: any) => ({
          id: item.id,
          vault_type: item.recipient.replace('vault:', ''),
          amount: item.amount || 0,
          allocation_percent: item.amount ? Math.floor(Math.random() * 30) : 0,
          impact_text: `Allocated to ${item.recipient.replace('vault:', '')} vault`,
          created_at: item.created_at,
          project_name: getMockProjectName(item.recipient.replace('vault:', '')),
        }));
        setAllocationHistory(records);
      }
    } catch (err) {
      console.error('Allocation history load error:', err);
      setAllocationHistory([]);
    } finally {
      setLoadingAllocationHistory(false);
    }

    // Calculate impact score
    calculateAndUpdateImpactScore(userId);
  }, [calculateAndUpdateImpactScore]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          router.push('/login');
          return;
        }

        setUser(session.user);
        loadUserProfile(session.user.id);
        loadVaults();
        loadAllocationHistory(session.user.id);
      } catch (err) {
        console.error('Auth check failed:', err);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router, loadAllocationHistory]);

  // FEATURE 2: Detect fraud risk when amount or recipient changes
  useEffect(() => {
    const risk = detectFraudRisk(parseFloat(remitAmount) || 0, remitRecipient);
    setFraudRiskLevel(risk);
  }, [remitAmount, remitRecipient]);

  const loadUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users_profile')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        const code = (error as any)?.code;
        const msg = (error as any)?.message || JSON.stringify(error);

        if (code === 'PGRST116' || /Results contain 0 rows/i.test(msg)) {
          setUserProfile({ bio: '', emotions: {} });
          setBio('');
          return;
        }

        console.error('Error loading profile:', msg, error);
        return;
      }

      if (data) {
        setUserProfile(data);
        setBio(data.bio || '');
      }
    } catch (err) {
      console.error('Profile load error:', err);
    }
  };

  const loadVaults = async () => {
    try {
      const { data, error } = await supabase
        .from('impact_vaults')
        .select('*')
        .limit(6);

      if (error) {
        const msg = (error as any)?.message || JSON.stringify(error);
        console.error('Error loading vaults:', msg, error);
        setVaults([]);
        return;
      }

      setVaults(data ?? []);
    } catch (err) {
      console.error('Vaults load error:', err);
      setVaults([]);
    }
  };

  // compute recommendations based on emotions -> vault mapping with location awareness
  const computeRecommendations = (emotions: UserProfile['emotions']) => {
    if (!vaults || vaults.length === 0) return [];

    // Location-specific suggestions for diaspora users
    const locationVaultMap: Record<DasporaLocation, Record<string, string[]>> = {
      'US': {
        pride: ['education', 'livelihood', 'solar_energy'],
        nostalgia: ['water', 'solar_energy', 'disaster_relief'],
        love: ['healthcare', 'education', 'livelihood'],
        hope: ['solar_energy', 'education', 'disaster_relief'],
      },
      'UAE': {
        pride: ['education', 'livelihood', 'solar_energy'],
        nostalgia: ['water', 'agriculture', 'livelihood'],
        love: ['healthcare', 'education', 'livelihood'],
        hope: ['solar_energy', 'agriculture', 'disaster_relief'],
      },
      'UK': {
        pride: ['education', 'healthcare', 'livelihood'],
        nostalgia: ['water', 'solar_energy', 'agriculture'],
        love: ['healthcare', 'education', 'livelihood'],
        hope: ['education', 'healthcare', 'disaster_relief'],
      },
      'Canada': {
        pride: ['education', 'healthcare', 'livelihood'],
        nostalgia: ['water', 'solar_energy', 'disaster_relief'],
        love: ['education', 'healthcare', 'livelihood'],
        hope: ['education', 'disaster_relief', 'healthcare'],
      },
      'Australia': {
        pride: ['education', 'solar_energy', 'livelihood'],
        nostalgia: ['water', 'agriculture', 'disaster_relief'],
        love: ['education', 'healthcare', 'livelihood'],
        hope: ['agriculture', 'water', 'disaster_relief'],
      },
      'Other': {
        pride: ['education', 'livelihood', 'solar_energy'],
        nostalgia: ['water', 'solar_energy', 'disaster_relief'],
        love: ['healthcare', 'education', 'livelihood'],
        hope: ['solar_energy', 'education', 'disaster_relief'],
      },
    };

    const mapping = locationVaultMap[diasporaLocation] || locationVaultMap['US'];

    // compute a score for each vault type
    const typeScores: Record<string, number> = {};
    const dominantEmotion = Object.entries(emotions).sort(([, a], [, b]) => (b as number) - (a as number))[0];
    
    Object.entries(emotions).forEach(([emotion, val]) => {
      const weight = typeof val === 'number' ? val : 0;
      const preferred = mapping[emotion] || [];
      preferred.forEach((type, idx) => {
        typeScores[type] = (typeScores[type] || 0) + weight * (1 - idx * 0.15);
      });
    });

    // map vaults to score
    const scored = vaults.map((v) => ({
      vault: v,
      score: typeScores[v.type] || 0,
    }));

    scored.sort((a, b) => b.score - a.score);

    // Generate personalized suggestion based on dominant emotion
    if (dominantEmotion && dominantEmotion[1]) {
      const topVault = scored.find(s => s.score > 0);
      if (topVault) {
        const emotionName = dominantEmotion[0];
        const suggestions: Record<string, string> = {
          pride: `High pride detected! Your story suggests strong commitment to education and livelihood. Recommend ${topVault.vault.type} vault for community scholarships.`,
          nostalgia: `Nostalgia detected! Memories matter. Consider supporting water and agriculture projects that connect to your roots in ${diasporaLocation}.`,
          love: `Love and family detected! Healthcare and education vaults help family back home. Perfect for supporting loved ones' wellbeing.`,
          hope: `Hope detected! Inspire change in Bangladesh. Solar and education projects bring sustainable futures to communities.`,
        };
        setSuggestionText(suggestions[emotionName] || 'Based on your emotions, we recommend the above vaults for maximum impact.');
      }
    }

    return scored.filter(s => s.score > 0).slice(0, 3).map(s => s.vault);
  };

  const handleAnalyzeBio = async () => {
    if (!bio.trim()) {
      setErrorModal({ show: true, message: 'Please enter a message to analyze' });
      return;
    }

    setAnalyzing(true);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: bio }),
      });

      const result = await response.json();

      if (!response.ok) {
        const errMsg = result?.error || result?.message || response.statusText || 'Analysis failed';
        setErrorModal({ show: true, message: typeof errMsg === 'string' ? errMsg : JSON.stringify(errMsg) });
        return;
      }

      const emotions = (result && typeof result.emotions === 'object' && result.emotions !== null)
        ? result.emotions
        : {
            pride: 0.5,
            nostalgia: 0.5,
            love: 0.6,
            hope: 0.7,
          };

      const { error } = await supabase
        .from('users_profile')
        .upsert(
          {
            user_id: user.id,
            bio,
            emotions,
          },
          { onConflict: 'user_id' }
        );

      if (error) throw error;

      setUserProfile({ bio, emotions });
      setSuccessModal({ show: true, message: 'Analysis complete! Your emotions have been analyzed.' });

      // Set allocation percent based on dominant emotion (0-30%)
      const maxEmotion = Math.max(...Object.values(emotions).filter(v => typeof v === 'number') as number[]);
      const suggestedAllocation = Math.min(Math.round(maxEmotion * 30), 30);
      setAllocationPercent(suggestedAllocation);

      // compute and show recommendations
      const recs = computeRecommendations(emotions);
      setRecommended(recs);

      // Clear the textarea after successful analysis
      setBio('');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to analyze text. Please try again.';
      setErrorModal({ show: true, message });
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleRemit = async () => {
    setRemitting(true);

    if (!remitAmount || !remitRecipient) {
      setErrorModal({ show: true, message: 'Please fill in amount and recipient' });
      setRemitting(false);
      return;
    }

    if (parseFloat(remitAmount) <= 0) {
      setErrorModal({ show: true, message: 'Amount must be greater than 0' });
      setRemitting(false);
      return;
    }

    try {
      const response = await fetch('/api/remit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseFloat(remitAmount),
          recipient: remitRecipient,
        }),
      });

      const result = await response.json();

      if (!response.ok || result?.error) {
        throw new Error(result?.error || 'Remittance failed');
      }

      // Save main remittance
      const { error } = await supabase
        .from('remittance_history')
        .insert({
          user_id: user.id,
          amount: parseFloat(remitAmount),
          recipient: remitRecipient,
          encrypted_data: result.encryptedData ?? null,
        });

      if (error) throw error;

      // If allocation percentage and vault selected, save allocation record
      if (allocationPercent > 0 && selectedVaultForAllocation) {
        const allocatedAmount = Math.round((parseFloat(remitAmount) * allocationPercent) / 100);
        
        const { error: allocError } = await supabase
          .from('remittance_history')
          .insert({
            user_id: user.id,
            amount: allocatedAmount,
            recipient: `vault:${selectedVaultForAllocation.type}`,
            encrypted_data: `allocated_to:${selectedVaultForAllocation.id}`,
          });

        if (allocError) throw allocError;
      }

      // Show success modal with encrypted key snippet
      const keySnippet = result.publicKey ? result.publicKey.substring(0, 32) + '...' : 'ML-KEM-768';
      let message = `Quantum-safe remittance of ${remitAmount} BDT to ${remitRecipient} complete!`;
      
      if (allocationPercent > 0 && selectedVaultForAllocation) {
        const allocatedAmount = Math.round((parseFloat(remitAmount) * allocationPercent) / 100);
        message += ` ${allocationPercent}% (${allocatedAmount} BDT) allocated to ${selectedVaultForAllocation.type} vault.`;
      }
      
      if (selectedSchedule !== 'once') {
        message += ` (${selectedSchedule})`;
      }

      setSuccessModal({
        show: true,
        message,
        encryptedKey: keySnippet,
        schedule: selectedSchedule,
      });

      // Reset form
      setRemitAmount('');
      setRemitRecipient('');
      setAllocationPercent(0);
      setSelectedVaultForAllocation(null);
      loadAllocationHistory(user.id);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to process remittance. Please try again.';
      setErrorModal({ show: true, message });
      console.error('Remit error:', err);
    } finally {
      setRemitting(false);
    }
  };

  const handleAllocate = async (vault: Vault) => {
    if (!user) {
      setErrorModal({ show: true, message: 'You must be logged in to allocate funds' });
      return;
    }

    // Just select the vault for remittance allocation, don't save yet
    setSelectedVaultForAllocation(vault);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50 to-emerald-50">
      {/* Animated Background */}
      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.6s ease-out; }
      `}</style>

      {/* Success Modal */}
      {successModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 md:p-8 animate-fade-in-up">
            <div className="text-5xl mb-4 text-center flex justify-center"><FiCheckCircle className="w-16 h-16 text-green-600" /></div>
            <h3 className="text-2xl font-bold text-green-600 mb-4 text-center">Success!</h3>
            <p className="text-gray-700 mb-4 text-center leading-relaxed">{successModal.message}</p>
            {successModal.encryptedKey && (
              <div className="bg-gray-100 p-4 rounded-lg mb-4 text-sm font-mono break-all text-gray-600 border border-gray-200">
                <p className="text-xs text-gray-500 mb-2 flex items-center gap-1"><FiLock className="w-3 h-3" /> Encrypted Key:</p>
                {successModal.encryptedKey}
              </div>
            )}
            <button
              type="button"
              onClick={() => setSuccessModal({ show: false, message: '' })}
              className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {errorModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 md:p-8 animate-fade-in-up">
            <div className="text-5xl mb-4 text-center flex justify-center"><FiX className="w-16 h-16 text-red-600" /></div>
            <h3 className="text-2xl font-bold text-red-600 mb-4 text-center">Error</h3>
            <p className="text-gray-700 mb-6 text-center leading-relaxed">{errorModal.message}</p>
            <button
              type="button"
              onClick={() => setErrorModal({ show: false, message: '' })}
              className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 md:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 text-sm sm:text-base mt-1">Welcome, {user?.email}</p>
          </div>
          <div className="flex flex-col gap-3 w-full sm:w-auto">
            <ComplianceBadge />
            <div className="flex flex-col xs:flex-row gap-2">
              <select
                value={diasporaLocation}
                onChange={(e) => setDiasporaLocation(e.target.value as DasporaLocation)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 text-sm bg-white"
                aria-label="Select your diaspora location"
              >
                <option value="US">🇺🇸 United States</option>
                <option value="UAE">🇦🇪 UAE</option>
                <option value="UK">🇬🇧 United Kingdom</option>
                <option value="Canada">🇨🇦 Canada</option>
                <option value="Australia">🇦🇺 Australia</option>
                <option value="Other">🌍 Other</option>
              </select>
              <button
                type="button"
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition whitespace-nowrap font-semibold text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-xl shadow-md p-6 animate-fade-in-up">
              <h2 className="text-xl font-bold mb-4">Your Profile</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio / Message
                  </label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 text-sm resize-none"
                    rows={4}
                    placeholder="Tell us about your family and what matters to you..."
                    aria-label="Bio message"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAnalyzeBio}
                  disabled={analyzing}
                  className="w-full py-2 bg-gradient-to-r from-indigo-600 to-emerald-600 text-white rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50 text-sm sm:text-base"
                  aria-busy={analyzing}
                >
                  {analyzing ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Analyzing...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <FiSearch className="w-4 h-4" />
                      Analyze Text
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Emotion Analysis Card */}
            {Object.keys(userProfile.emotions).length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-6 animate-fade-in-up">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold flex items-center gap-2"><FiCpu className="w-5 h-5" /> Emotion Analysis</h2>
                  <button
                    onClick={() => {
                      setUserProfile({ bio: '', emotions: {} });
                      setSuggestionText('');
                      setRecommended([]);
                    }}
                    className="px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all duration-200 font-medium border border-red-200"
                    title="Clear emotion analysis and reset"
                  >
                    Reset
                  </button>
                </div>
                <div className="space-y-4">
                  {Object.entries(userProfile.emotions).map(([emotion, score]) => (
                    <div key={emotion}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="capitalize font-medium text-gray-700 text-sm">
                          {emotion}
                        </span>
                        <span className="text-indigo-600 font-bold text-sm">
                          {((score as number) * 100).toFixed(0)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-indigo-600 to-emerald-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${(score as number) * 100}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Detected from keywords
                      </p>
                    </div>
