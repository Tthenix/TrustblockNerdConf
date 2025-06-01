"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

// Declaración global para window.ethereum
declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}

// Interfaces para definir los tipos de Ethereum
interface EthereumProvider {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on: (event: string, callback: (...args: unknown[]) => void) => void;
  removeListener: (event: string, callback: (...args: unknown[]) => void) => void;
  removeAllListeners?: (event?: string) => void;
}

interface Web3ContextType {
  provider: EthereumProvider | null;
  signer: unknown | null;
  account: string | null;
  isConnected: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  chainId: number | null;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const [provider, setProvider] = useState<EthereumProvider | null>(null);
  const [signer, setSigner] = useState<unknown | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [chainId, setChainId] = useState<number | null>(null);

  const connectWallet = async () => {
    try {
      if (typeof window !== "undefined" && window.ethereum) {
        // Request access to accounts
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        }) as string[];
        
        // Get network info
        const chainIdResult = await window.ethereum.request({
          method: "eth_chainId",
        }) as string;
        
        setAccount(accounts[0]);
        setIsConnected(true);
        setChainId(parseInt(chainIdResult, 16));

        // Store connection state
        localStorage.setItem("walletConnected", "true");
      } else {
        console.error("MetaMask not detected");
        alert("Por favor instala MetaMask para usar esta aplicación");
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  const disconnectWallet = () => {
    setProvider(null);
    setSigner(null);
    setAccount(null);
    setIsConnected(false);
    setChainId(null);
    localStorage.removeItem("walletConnected");
  };
  useEffect(() => {
    // Auto-connect if previously connected
    const wasConnected = localStorage.getItem("walletConnected");
    if (wasConnected && typeof window !== "undefined" && window.ethereum) {
      connectWallet();
    }

    // Listen for account changes
    if (typeof window !== "undefined" && window.ethereum) {
      const handleAccountsChanged = (accounts: unknown) => {
        const accountsArray = accounts as string[];
        if (accountsArray.length === 0) {
          disconnectWallet();
        } else {
          setAccount(accountsArray[0]);
        }
      };

      const handleChainChanged = (chainId: unknown) => {
        const chainIdString = chainId as string;
        setChainId(parseInt(chainIdString, 16));
      };

      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);

      return () => {
        if (typeof window !== "undefined" && window.ethereum) {
          window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
          window.ethereum.removeListener("chainChanged", handleChainChanged);
        }
      };
    }
  }, []);

  return (
    <Web3Context.Provider
      value={{
        provider,
        signer,
        account,
        isConnected,
        connectWallet,
        disconnectWallet,
        chainId,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
}

export function useWeb3() {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error("useWeb3 must be used within a Web3Provider");
  }
  return context;
}