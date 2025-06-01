import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { DIDManager } from '../services/didManager';
import { DIDAuthService } from '../services/didAuth';
import { DIDUser, DIDDocument, DIDAuthChallenge, DIDResolutionResult } from '../types';

interface UseDIDProps {
  provider?: ethers.Provider;
  signer?: ethers.Signer;
}

interface UseDIDReturn {
  // State
  didUser: DIDUser | null;
  loading: boolean;
  error: string | null;
  authChallenge: DIDAuthChallenge | null;
  
  // Actions
  createDID: () => Promise<DIDUser | null>;
  resolveDID: (did: string) => Promise<DIDResolutionResult | null>;
  updateDIDDocument: (did: string, updates: Partial<DIDDocument>) => Promise<boolean>;
  generateChallenge: (address: string) => DIDAuthChallenge | null;
  authenticateWithSignature: (did: string, signature: string, address: string) => Promise<boolean>;
  verifyOwnership: (did: string, address: string) => Promise<boolean>;
  clearError: () => void;
}

export const useDID = ({ provider, signer }: UseDIDProps = {}): UseDIDReturn => {
  const [didUser, setDidUser] = useState<DIDUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authChallenge, setAuthChallenge] = useState<DIDAuthChallenge | null>(null);

  // Initialize services
  const [didManager, setDIDManager] = useState<DIDManager | null>(null);
  const [authService, setAuthService] = useState<DIDAuthService | null>(null);

  useEffect(() => {
    if (provider) {
      const manager = new DIDManager(provider);
      const auth = new DIDAuthService(manager);
      auth.startChallengeCleanup();
      
      setDIDManager(manager);
      setAuthService(auth);
    }
  }, [provider]);

  const createDID = useCallback(async (): Promise<DIDUser | null> => {
    if (!didManager || !signer) {
      setError('DID Manager or signer not available');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const newDIDUser = await didManager.createDID(signer);
      setDidUser(newDIDUser);
      return newDIDUser;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create DID';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [didManager, signer]);

  const resolveDID = useCallback(async (did: string): Promise<DIDResolutionResult | null> => {
    if (!didManager) {
      setError('DID Manager not available');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await didManager.resolveDID(did);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to resolve DID';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [didManager]);

  const updateDIDDocument = useCallback(async (
    did: string, 
    updates: Partial<DIDDocument>
  ): Promise<boolean> => {
    if (!didManager || !signer) {
      setError('DID Manager or signer not available');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const success = await didManager.updateDIDDocument(did, updates, signer);
      if (success && didUser?.did === did) {
        // Update local state if we updated the current user's DID
        const updatedUser = {
          ...didUser,
          document: { ...didUser.document, ...updates },
          updatedAt: new Date()
        };
        setDidUser(updatedUser);
      }
      return success;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update DID document';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [didManager, signer, didUser]);

  const generateChallenge = useCallback((address: string): DIDAuthChallenge | null => {
    if (!authService) {
      setError('Auth service not available');
      return null;
    }

    try {
      const challenge = authService.generateAuthChallenge(address);
      setAuthChallenge(challenge);
      return challenge;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate challenge';
      setError(errorMessage);
      return null;
    }
  }, [authService]);

  const authenticateWithSignature = useCallback(async (
    did: string, 
    signature: string, 
    address: string
  ): Promise<boolean> => {
    if (!authService) {
      setError('Auth service not available');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const isAuthenticated = await authService.authenticateWithDID(did, signature, address);
      if (isAuthenticated) {
        setAuthChallenge(null); // Clear challenge on successful auth
      }
      return isAuthenticated;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Authentication failed';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [authService]);

  const verifyOwnership = useCallback(async (did: string, address: string): Promise<boolean> => {
    if (!authService) {
      setError('Auth service not available');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const isOwner = await authService.verifyDIDOwnership(did, address);
      return isOwner;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ownership verification failed';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [authService]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    didUser,
    loading,
    error,
    authChallenge,
    createDID,
    resolveDID,
    updateDIDDocument,
    generateChallenge,
    authenticateWithSignature,
    verifyOwnership,
    clearError
  };
};