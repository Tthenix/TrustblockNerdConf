import { ethers } from 'ethers';
import { DIDManager } from './didManager';
import { DIDAuthChallenge } from '../types';
import { DID_CONFIG } from '../config/did.config';

export class DIDAuthService {
  private didManager: DIDManager;
  private challenges: Map<string, DIDAuthChallenge> = new Map();

  constructor(didManager: DIDManager) {
    this.didManager = didManager;
  }

  generateAuthChallenge(address: string): DIDAuthChallenge {
    const timestamp = Date.now();
    const nonce = Math.random().toString(36).substring(7);
    const challenge = `TrustBlock DID Authentication Challenge
Address: ${address}
Timestamp: ${timestamp}
Nonce: ${nonce}
Network: ${DID_CONFIG.network}`;

    const authChallenge: DIDAuthChallenge = {
      challenge,
      timestamp,
      expiresAt: timestamp + (15 * 60 * 1000), // 15 minutes
      nonce
    };

    this.challenges.set(address, authChallenge);
    return authChallenge;
  }

  async authenticateWithDID(
    did: string, 
    signature: string, 
    address: string
  ): Promise<boolean> {
    try {
      // Get stored challenge
      const storedChallenge = this.challenges.get(address);
      if (!storedChallenge) {
        console.error('No challenge found for address');
        return false;
      }

      // Check if challenge is expired
      if (Date.now() > storedChallenge.expiresAt) {
        this.challenges.delete(address);
        console.error('Challenge has expired');
        return false;
      }

      // Resolve DID document
      const resolutionResult = await this.didManager.resolveDID(did);
      if (!resolutionResult.didDocument) {
        console.error('DID not found');
        return false;
      }

      // Verify DID belongs to the address
      const extractedAddress = this.didManager.extractAddressFromDID(did);
      if (extractedAddress?.toLowerCase() !== address.toLowerCase()) {
        console.error('DID does not match address');
        return false;
      }

      // Verify signature
      const messageHash = ethers.hashMessage(storedChallenge.challenge);
      const recoveredAddress = ethers.recoverAddress(messageHash, signature);
      
      if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
        console.error('Signature verification failed');
        return false;
      }

      // Clean up used challenge
      this.challenges.delete(address);
      return true;

    } catch (error) {
      console.error('DID authentication failed:', error);
      return false;
    }
  }

  async verifyDIDOwnership(did: string, address: string): Promise<boolean> {
    try {
      // Check if DID format is valid
      if (!this.didManager.validateDIDFormat(did)) {
        return false;
      }

      // Extract address from DID
      const extractedAddress = this.didManager.extractAddressFromDID(did);
      if (!extractedAddress) {
        return false;
      }

      // Verify address matches
      if (extractedAddress.toLowerCase() !== address.toLowerCase()) {
        return false;
      }

      // Check if user is the owner in the registry
      return await this.didManager.isDIDOwner(did, address);

    } catch (error) {
      console.error('Error verifying DID ownership:', error);
      return false;
    }
  }

  getChallengeForAddress(address: string): DIDAuthChallenge | null {
    return this.challenges.get(address) || null;
  }

  clearExpiredChallenges(): void {
    const now = Date.now();
    for (const [address, challenge] of this.challenges.entries()) {
      if (now > challenge.expiresAt) {
        this.challenges.delete(address);
      }
    }
  }

  // Clean up expired challenges every 5 minutes
  startChallengeCleanup(): void {
    setInterval(() => {
      this.clearExpiredChallenges();
    }, 5 * 60 * 1000);
  }
}