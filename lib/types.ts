export interface Emotions {
  pride?: number;
  nostalgia?: number;
  love?: number;
  hope?: number;
  [key: string]: number | undefined;
}

export interface UserProfile {
  user_id: string;
  bio: string;
  emotions: Emotions;
  created_at: string;
  updated_at: string;
}

export interface Vault {
  id: string;
  type: string;
  description: string;
  icon?: string;
}

export interface RemittanceRecord {
  id: string;
  user_id: string;
  amount: number;
  recipient: string;
  encrypted_data: string;
  created_at: string;
}

export interface AnalysisResponse {
  emotions: Emotions;
}

export interface RemittanceResponse {
  success: boolean;
  message: string;
  publicKey: string;
  encryptedData: string;
  amount: number;
  recipient: string;
}
