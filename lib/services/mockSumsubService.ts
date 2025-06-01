export interface KYCDocument {
  type: 'PASSPORT' | 'ID_CARD' | 'DRIVERS_LICENSE';
  file: File;
  country: string;
}

export interface KYCApplicant {
  id: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  country: string;
  walletAddress: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

export interface VerificationResult {
  applicantId: string;
  walletAddress: string;
  status: 'pending' | 'approved' | 'rejected' | 'reviewing';
  reviewResult: {
    moderationComment?: string;
    clientComment?: string;
    reviewAnswer: 'GREEN' | 'RED' | 'YELLOW';
  };
  checks: {
    identityVerification: 'passed' | 'failed' | 'pending';
    documentVerification: 'passed' | 'failed' | 'pending';
    addressVerification: 'passed' | 'failed' | 'pending';
    livenessCheck: 'passed' | 'failed' | 'pending';
  };
  verificationLevel: 'none' | 'basic' | 'full';
  createdAt: number;
  updatedAt: number;
}

export interface AuthenticatedUser {
  walletAddress: string;
  sumsubToken: string;
  sessionId: string;
  isVerified: boolean;
  verificationLevel: 'none' | 'basic' | 'full';
  expiresAt: number;
  applicantId?: string;
}

class MockSumsubService {
  private applicants: Map<string, KYCApplicant> = new Map();
  private verificationResults: Map<string, VerificationResult> = new Map();
  private authenticatedUsers: Map<string, AuthenticatedUser> = new Map();
  private walletNonces: Map<string, string> = new Map();

  async generateNonce(walletAddress: string): Promise<string> {
    await this.delay(300);
    const nonce = `nonce_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.walletNonces.set(walletAddress, nonce);
    return nonce;
  }

  async authenticateWallet(walletAddress: string, signature: string, nonce: string): Promise<AuthenticatedUser> {
    await this.delay(1000);
    
    // Validate nonce
    const expectedNonce = this.walletNonces.get(walletAddress);
    if (!expectedNonce || expectedNonce !== nonce) {
      throw new Error('Invalid nonce');
    }

    // Mock signature validation
    if (!signature || signature.length < 10) {
      throw new Error('Invalid signature');
    }

    // Generate Sumsub-like token
    const sumsubToken = `smsb_${walletAddress.slice(0, 8)}_${Date.now()}`;
    const sessionId = `session_${Math.random().toString(36).substr(2, 16)}`;
    
    // Check if user has existing verification
    const existingVerification = Array.from(this.verificationResults.values())
      .find(result => result.walletAddress === walletAddress);
    
    const authenticatedUser: AuthenticatedUser = {
      walletAddress,
      sumsubToken,
      sessionId,
      isVerified: existingVerification?.status === 'approved' || false,
      verificationLevel: existingVerification?.verificationLevel || 'none',
      expiresAt: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
      applicantId: existingVerification?.applicantId
    };

    this.authenticatedUsers.set(walletAddress, authenticatedUser);
    this.walletNonces.delete(walletAddress); // Consume nonce
    
    return authenticatedUser;
  }

  async getAuthenticatedUser(walletAddress: string): Promise<AuthenticatedUser | null> {
    const user = this.authenticatedUsers.get(walletAddress);
    if (!user || user.expiresAt < Date.now()) {
      this.authenticatedUsers.delete(walletAddress);
      return null;
    }
    return user;
  }

  async createApplicantForWallet(walletAddress: string, applicantData: Omit<KYCApplicant, 'id' | 'walletAddress'>): Promise<string> {
    // Check if user is authenticated
    const authUser = await this.getAuthenticatedUser(walletAddress);
    if (!authUser) {
      throw new Error('User not authenticated');
    }

    await this.delay(1000);
    
    const applicantId = `applicant_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const applicant: KYCApplicant = {
      ...applicantData,
      id: applicantId,
      walletAddress,
      email: applicantData.email || `${walletAddress.slice(0, 8)}@wallet.user`
    };
    
    this.applicants.set(applicantId, applicant);
    
    // Initialize verification result
    const verificationResult: VerificationResult = {
      applicantId,
      walletAddress,
      status: 'pending',
      reviewResult: {
        reviewAnswer: 'YELLOW'
      },
      checks: {
        identityVerification: 'pending',
        documentVerification: 'pending',
        addressVerification: 'pending',
        livenessCheck: 'pending'
      },
      verificationLevel: 'none',
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    
    this.verificationResults.set(applicantId, verificationResult);
    
    // Update authenticated user
    authUser.applicantId = applicantId;
    this.authenticatedUsers.set(walletAddress, authUser);
    
    return applicantId;
  }

  async uploadDocument(applicantId: string, document: KYCDocument): Promise<boolean> {
    await this.delay(2000);
    
    if (!this.applicants.has(applicantId)) {
      throw new Error('Applicant not found');
    }

    const isValid = Math.random() > 0.1; // 90% success rate
    
    const result = this.verificationResults.get(applicantId)!;
    result.checks.documentVerification = isValid ? 'passed' : 'failed';
    result.checks.identityVerification = isValid ? 'passed' : 'failed';
    result.updatedAt = Date.now();
    
    this.verificationResults.set(applicantId, result);
    
    return isValid;
  }

  async performLivenessCheck(applicantId: string): Promise<boolean> {
    await this.delay(3000);
    
    if (!this.applicants.has(applicantId)) {
      throw new Error('Applicant not found');
    }

    const isPassed = Math.random() > 0.05; // 95% success rate
    
    const result = this.verificationResults.get(applicantId)!;
    result.checks.livenessCheck = isPassed ? 'passed' : 'failed';
    result.updatedAt = Date.now();
    
    this.verificationResults.set(applicantId, result);
    
    return isPassed;
  }

  async getVerificationStatus(applicantId: string): Promise<VerificationResult> {
    await this.delay(500);
    
    const result = this.verificationResults.get(applicantId);
    if (!result) {
      throw new Error('Verification not found');
    }

    // Update overall status based on individual checks
    const checks = result.checks;
    const allPassed = Object.values(checks).every(status => status === 'passed');
    const anyFailed = Object.values(checks).some(status => status === 'failed');
    const anyPending = Object.values(checks).some(status => status === 'pending');

    if (allPassed) {
      result.status = 'approved';
      result.verificationLevel = 'full';
      result.reviewResult.reviewAnswer = 'GREEN';
      result.reviewResult.moderationComment = 'All verification checks passed successfully';
    } else if (anyFailed) {
      result.status = 'rejected';
      result.verificationLevel = 'none';
      result.reviewResult.reviewAnswer = 'RED';
      result.reviewResult.moderationComment = 'One or more verification checks failed';
    } else if (anyPending) {
      result.status = 'reviewing';
      result.verificationLevel = 'basic';
      result.reviewResult.reviewAnswer = 'YELLOW';
      result.reviewResult.moderationComment = 'Verification in progress';
    }

    result.updatedAt = Date.now();
    return result;
  }

  async finalizeVerification(applicantId: string): Promise<VerificationResult> {
    await this.delay(1000);
    
    const result = this.verificationResults.get(applicantId);
    if (!result) {
      throw new Error('Verification not found');
    }

    // Simulate address verification completion
    result.checks.addressVerification = Math.random() > 0.1 ? 'passed' : 'failed';
    
    // Final status update
    const finalResult = await this.getVerificationStatus(applicantId);
    this.verificationResults.set(applicantId, finalResult);
    
    // Update authenticated user verification status
    const authUser = this.authenticatedUsers.get(finalResult.walletAddress);
    if (authUser) {
      authUser.isVerified = finalResult.status === 'approved';
      authUser.verificationLevel = finalResult.verificationLevel;
      this.authenticatedUsers.set(finalResult.walletAddress, authUser);
    }
    
    return finalResult;
  }

  async getVerificationByWallet(walletAddress: string): Promise<VerificationResult | null> {
    const verification = Array.from(this.verificationResults.values())
      .find(result => result.walletAddress === walletAddress);
    return verification || null;
  }

  async revokeAuthentication(walletAddress: string): Promise<void> {
    this.authenticatedUsers.delete(walletAddress);
    this.walletNonces.delete(walletAddress);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const mockSumsubService = new MockSumsubService();
