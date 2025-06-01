// Mock Sumsub service for demonstration purposes

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
  createdAt: string;
  updatedAt: string;
}

export interface VerificationDocument {
  type: 'identity' | 'address' | 'selfie';
  status: 'uploaded' | 'processing' | 'approved' | 'rejected';
  uploadedAt: string;
}

export class SumsubService {
  private config: SumsubConfig;

  constructor(config: SumsubConfig) {
    this.config = config;
  }

  // Mock: Generate access token for Sumsub SDK
  async generateAccessToken(userId: string, levelName: string = 'basic-kyc-level'): Promise<string> {
    // In production, this would call your backend API
    // For mock, we return a fake token
    return `mock_token_${userId}_${Date.now()}`;
  }

  // Mock: Check verification status
  async getVerificationStatus(userId: string): Promise<SumsubUser | null> {
    try {
      const storedStatus = localStorage.getItem(`sumsub_status_${userId}`);
      if (!storedStatus) return null;

      return JSON.parse(storedStatus);
    } catch (error) {
      console.error('Error getting verification status:', error);
      return null;
    }
  }

  // Mock: Create verification session
  async createVerificationSession(walletAddress: string): Promise<{ userId: string; token: string }> {
    const userId = `wallet_${walletAddress.toLowerCase()}`;
    const token = await this.generateAccessToken(userId);
    
    return { userId, token };
  }

  // Mock: Submit documents for verification
  async submitDocuments(userId: string, documents: VerificationDocument[]): Promise<SumsubUser> {
    const user: SumsubUser = {
      id: userId,
      externalUserId: userId,
      status: 'pending',
      walletAddress: userId.replace('wallet_', ''),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Store in localStorage for mock persistence
    localStorage.setItem(`sumsub_status_${userId}`, JSON.stringify(user));
    localStorage.setItem(`sumsub_documents_${userId}`, JSON.stringify(documents));

    // Simulate processing time and auto-approval for demo
    setTimeout(() => {
      const approvedUser = { ...user, status: 'approved' as const, updatedAt: new Date().toISOString() };
      localStorage.setItem(`sumsub_status_${userId}`, JSON.stringify(approvedUser));
      
      // Dispatch custom event for UI updates
      window.dispatchEvent(new CustomEvent('sumsubStatusUpdate', { 
        detail: { userId, status: 'approved' } 
      }));
    }, 3000);

    return user;
  }

  // Mock: Get submitted documents
  async getDocuments(userId: string): Promise<VerificationDocument[]> {
    try {
      const storedDocs = localStorage.getItem(`sumsub_documents_${userId}`);
      return storedDocs ? JSON.parse(storedDocs) : [];
    } catch (error) {
      console.error('Error getting documents:', error);
      return [];
    }
  }

  // Mock: Delete verification data (for testing)
  async resetVerification(userId: string): Promise<void> {
    localStorage.removeItem(`sumsub_status_${userId}`);
    localStorage.removeItem(`sumsub_documents_${userId}`);
  }
}

// Mock configuration
export const sumsubConfig: SumsubConfig = {
  apiUrl: 'https://api.sumsub.com', // Not used in mock
  appToken: 'mock_app_token',
  secretKey: 'mock_secret_key',
  flowName: 'trustblock-kyc',
};

export const sumsubService = new SumsubService(sumsubConfig);
