import { Emotions } from './types';

/**
 * Get vault recommendations based on emotion analysis
 */
export function getVaultRecommendations(emotions: Emotions): string[] {
  const recommendations: string[] = [];

  if ((emotions.pride ?? 0) > 0.7) {
    recommendations.push('Education');
  }

  if ((emotions.nostalgia ?? 0) > 0.7) {
    recommendations.push('Agriculture');
  }

  if ((emotions.love ?? 0) > 0.7) {
    recommendations.push('Healthcare');
  }

  if ((emotions.hope ?? 0) > 0.7) {
    recommendations.push('Solar Farms');
  }

  // If no strong emotions, suggest all vaults
  if (recommendations.length === 0) {
    recommendations.push('Solar Farms', 'Education', 'Healthcare');
  }

  return recommendations;
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
  }).format(amount);
}

/**
 * Format date for display
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-BD', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Get emotion color for visualization
 */
export function getEmotionColor(emotion: string): string {
  const colors: { [key: string]: string } = {
    pride: '#6366f1',
    nostalgia: '#8b5cf6',
    love: '#ec4899',
    hope: '#10b981',
    joy: '#f59e0b',
    gratitude: '#06b6d4',
  };

  return colors[emotion] || '#6366f1';
}

/**
 * Calculate recommended allocation percentage based on emotion score
 */
export function calculateAllocationPercentage(_emotion: string, score: number): number {
  return Math.round(score * 100);
}

/**
 * Generate a transaction ID
 */
export function generateTransactionId(): string {
  return `QSR-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
}

/**
 * Encrypt text using base64 (for demo purposes only)
 */
export function encryptDemo(text: string): string {
  return Buffer.from(text).toString('base64');
}

/**
 * Decrypt text using base64 (for demo purposes only)
 */
export function decryptDemo(text: string): string {
  return Buffer.from(text, 'base64').toString('utf-8');
}

/**
 * Detect fraud risk based on amount and message content
 * Returns: 'none' | 'low' | 'medium' | 'high'
 */
export function detectFraudRisk(amount: number, message: string = ''): 'none' | 'low' | 'medium' | 'high' {
  let riskScore = 0;

  // High amount check (> 50,000 BDT is suspicious)
  if (amount > 50000) {
    riskScore += 2;
  }

  // Fraud-related keywords
  const fraudKeywords = [
    'agent',
    'visa',
    'job',
    'urgent',
    'emergency',
    'wire',
    'western',
    'verify',
    'account',
    'bank',
    'tax',
    'irs',
    'accident',
    'hospital',
    'police',
  ];

  const messageContent = message.toLowerCase();
  let keywordMatches = 0;
  for (const keyword of fraudKeywords) {
    if (messageContent.includes(keyword)) {
      keywordMatches++;
    }
  }

  if (keywordMatches >= 2) {
    riskScore += 2;
  } else if (keywordMatches === 1) {
    riskScore += 1;
  }

  // Determine risk level
  if (riskScore === 0) return 'none';
  if (riskScore === 1) return 'low';
  if (riskScore === 2) return 'medium';
  return 'high';
}

/**
 * Calculate impact score based on remittance count and allocation percentage
 * Score ranges from 0-100
 */
export function calculateImpactScore(
  remittanceCount: number,
  avgAllocationPercent: number
): number {
  // Base score from remittance count (max 50 points)
  // Every 5 remittances = 10 points
  const countScore = Math.min((remittanceCount / 5) * 10, 50);

  // Allocation percentage score (max 50 points)
  // Higher allocation = higher score
  const allocationScore = (avgAllocationPercent / 30) * 50;

  // Total score
  const total = Math.round(countScore + allocationScore);

  return Math.min(total, 100);
}

/**
 * Generate mock project names for impact vaults
 */
export function getMockProjectName(vaultType: string): string {
  const projects: Record<string, string[]> = {
    education: [
      'School Scholarship Fund - Dhaka',
      'Digital Literacy Initiative',
      'Girl Child Education Program',
      'Rural School Infrastructure',
      'STEM Education Grants',
    ],
    healthcare: [
      'Mobile Health Clinics',
      'Maternal Care Initiative',
      'Community Health Centers',
      'Emergency Medical Fund',
      'Disease Prevention Program',
    ],
    energy: [
      'Solar Power Distribution',
      'Renewable Energy Grid',
      'Community Solar Project',
      'Clean Energy Access',
      'LED Efficiency Program',
    ],
    water: [
      'Clean Water Well Network',
      'Water Purification Plants',
      'Rainwater Harvesting',
      'Tube Well Installation',
      'Water Safety Program',
    ],
    agriculture: [
      'Farmer Training Initiative',
      'Sustainable Farming Program',
      'Seed Distribution Fund',
      'Agricultural Equipment Loan',
      'Organic Farming Cooperative',
    ],
    livelihood: [
      'Microfinance for Artisans',
      'Women Entrepreneurship Program',
      'Skills Training Center',
      'Small Business Startup Fund',
      'Digital Skills Initiative',
    ],
    disaster_relief: [
      'Emergency Relief Fund',
      'Disaster Recovery Housing',
      'Flood Relief Program',
      'Emergency Supply Distribution',
      'Community Resilience Fund',
    ],
    solar_energy: [
      'Household Solar Installation',
      'Community Solar Gardens',
      'Solar Micro-grid Project',
      'Solar Pump Initiative',
      'Solar School Program',
    ],
  };

  const projectList = projects[vaultType.toLowerCase()] || projects['education'];
  return projectList[Math.floor(Math.random() * projectList.length)];
}
