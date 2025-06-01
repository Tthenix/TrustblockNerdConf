"use client";

import { useState, useEffect, useCallback } from 'react';
import { mockSumsubService, AuthenticatedUser, VerificationResult } from '../services/mockSumsubService';

interface WalletState {
  isConnected: boolean;
  address: string | null;
  isAuthenticated: boolean;
  authUser: AuthenticatedUser | null;
  verificationResult: VerificationResult | null;
  isLoading: boolean;
  error: string | null;
}

export const useWalletConnection = () => {
  const [walletState, setWalletState] = useState<WalletState>({
    isConnected: false,
    address: null,
    isAuthenticated: false,
    authUser: null,
    verificationResult: null,
    isLoading: false,
    error: null
  });

  const checkWalletConnection = useCallback(async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' }) as string[];
        if (accounts.length > 0) {
          const address = accounts[0];
          setWalletState(prev => ({
            ...prev,
            isConnected: true,
            address
          }));

          // Check if user is already authenticated with Sumsub
          try {
            const authUser = await mockSumsubService.getAuthenticatedUser(address);
            if (authUser) {
              const verificationResult = await mockSumsubService.getVerificationByWallet(address);
              setWalletState(prev => ({
                ...prev,
                isAuthenticated: true,
                authUser,
                verificationResult
              }));
            }
          } catch (error) {
            console.error('Error checking authentication:', error);
          }
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error);
      }
    }
  }, []);

  const connectWallet = async () => {
    setWalletState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      if (typeof window === 'undefined' || !window.ethereum) {
        throw new Error('MetaMask no está instalado. Por favor instala MetaMask para continuar.');
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      }) as string[];

      if (accounts.length === 0) {
        throw new Error('No se pudo acceder a ninguna cuenta');
      }

      const address = accounts[0];
      
      setWalletState(prev => ({
        ...prev,
        isConnected: true,
        address,
        isLoading: false
      }));

      return address;
    } catch (error: any) {
      let errorMessage = 'Error al conectar wallet';
      
      if (error.code === 4001) {
        errorMessage = 'Conexión rechazada por el usuario';
      } else if (error.message) {
        errorMessage = error.message;
      }

      setWalletState(prev => ({
        ...prev,
        error: errorMessage,
        isLoading: false
      }));
      throw error;
    }
  };

  const authenticateWithSumsub = async () => {
    if (!walletState.address) {
      throw new Error('Wallet not connected');
    }

    setWalletState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      if (typeof window === 'undefined' || !window.ethereum) {
        throw new Error('MetaMask no está disponible');
      }

      // Generate nonce
      const nonce = await mockSumsubService.generateNonce(walletState.address);
      
      // Request signature from MetaMask
      const message = `Verify identity with TrustBlock\nNonce: ${nonce}\nTimestamp: ${new Date().toISOString()}`;
      
      const signature = await window.ethereum.request({
        method: 'personal_sign',
        params: [message, walletState.address],
      }) as string;

      const authUser = await mockSumsubService.authenticateWallet(
        walletState.address,
        signature,
        nonce
      );

      // Check for existing verification
      const verificationResult = await mockSumsubService.getVerificationByWallet(walletState.address);
      
      setWalletState(prev => ({
        ...prev,
        isAuthenticated: true,
        authUser,
        verificationResult,
        isLoading: false
      }));

      return authUser;
    } catch (error: any) {
      let errorMessage = 'Error en autenticación';
      
      if (error.code === 4001) {
        errorMessage = 'Firma rechazada por el usuario';
      } else if (error.message) {
        errorMessage = error.message;
      }

      setWalletState(prev => ({
        ...prev,
        error: errorMessage,
        isLoading: false
      }));
      throw error;
    }
  };

  const disconnectWallet = async () => {
    if (walletState.address) {
      await mockSumsubService.revokeAuthentication(walletState.address);
    }
    
    setWalletState({
      isConnected: false,
      address: null,
      isAuthenticated: false,
      authUser: null,
      verificationResult: null,
      isLoading: false,
      error: null
    });
  };

  const refreshVerificationStatus = async () => {
    if (!walletState.authUser?.applicantId) return;

    try {
      const verificationResult = await mockSumsubService.getVerificationStatus(walletState.authUser.applicantId);
      setWalletState(prev => ({
        ...prev,
        verificationResult,
        authUser: prev.authUser ? {
          ...prev.authUser,
          isVerified: verificationResult.status === 'approved',
          verificationLevel: verificationResult.verificationLevel
        } : null
      }));
    } catch (error) {
      console.error('Error refreshing verification status:', error);
    }
  };

  // Listen for account changes
  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      const handleAccountsChanged = (...args: unknown[]) => {
        const accounts = args[0] as string[];
        if (accounts.length === 0) {
          disconnectWallet();
        } else {
          setWalletState(prev => ({
            ...prev,
            address: accounts[0],
            isConnected: true,
            // Reset authentication state when account changes
            isAuthenticated: false,
            authUser: null,
            verificationResult: null
          }));
        }
      };

      const handleChainChanged = (...args: unknown[]) => {
        // Reload the page when chain changes
        window.location.reload();
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        if (window.ethereum?.removeListener) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
          window.ethereum.removeListener('chainChanged', handleChainChanged);
        }
      };
    }
  }, [disconnectWallet]);

  useEffect(() => {
    checkWalletConnection();
  }, [checkWalletConnection]);

  return {
    ...walletState,
    connectWallet,
    disconnectWallet,
    authenticateWithSumsub,
    refreshVerificationStatus
  };
};
