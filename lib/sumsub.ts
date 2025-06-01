// Sumsub API integration for KYC verification

export interface SumsubConfig {
  apiUrl: string;
  appToken: string;
  secretKey: string;
  flowName: string;
}

export interface SumsubUser {
  id: string;
  externalUserId: string;
  status: 'pending' | 'approved' | 'rejected';
  walletAddress: string;
}

export class SumsubService {
  private config: SumsubConfig;

  constructor(config: SumsubConfig) {
    this.config = config;
  }

  // Generate access token for Sumsub SDK
  async generateAccessToken(userId: string, levelName: string = 'basic-kyc-level'): Promise<string> {
    try {
      const response = await fetch('/api/sumsub/access-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          levelName,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate access token');
      }

      const data = await response.json();
      return data.token;
    } catch (error) {
      console.error('Error generating Sumsub access token:', error);
      throw error;
    }
  }

  // Check verification status
  async getVerificationStatus(userId: string): Promise<SumsubUser | null> {
    try {
      const response = await fetch(`/api/sumsub/status/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error('Failed to get verification status');
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting verification status:', error);
      throw error;
    }
  }

  // Create verification session
  async createVerificationSession(walletAddress: string): Promise<{ userId: string; token: string }> {
    try {
      const userId = `wallet_${walletAddress.toLowerCase()}`;
      const token = await this.generateAccessToken(userId);
      
      return { userId, token };
    } catch (error) {
      console.error('Error creating verification session:', error);
      throw error;
    }
  }
}

// Default configuration (you should move sensitive data to environment variables)
export const sumsubConfig: SumsubConfig = {
  apiUrl: process.env.NEXT_PUBLIC_SUMSUB_API_URL || 'https://api.sumsub.com',
  appToken: process.env.NEXT_PUBLIC_SUMSUB_APP_TOKEN || '',
  secretKey: process.env.SUMSUB_SECRET_KEY || '',
  flowName: process.env.NEXT_PUBLIC_SUMSUB_FLOW_NAME || 'trustblock-kyc',
};

export const sumsubService = new SumsubService(sumsubConfig);
