"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface Web3ContextType {
  provider: any | null;
  signer: any | null;
  account: string | null;
  isConnected: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  chainId: number | null;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const [provider, setProvider] = useState<any | null>(null);
  const [signer, setSigner] = useState<any | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [chainId, setChainId] = useState<number | null>(null);

  const connectWallet = async () => {
    try {
      if (typeof window !== "undefined" && window.ethereum) {
        // Request access to accounts
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        
        // Get network info
        const chainId = await window.ethereum.request({
          method: "eth_chainId",
        });
        
        setAccount(accounts[0]);
        setIsConnected(true);
        setChainId(parseInt(chainId, 16));

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
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else {
          setAccount(accounts[0]);
        }
      });

      window.ethereum.on("chainChanged", (chainId: string) => {
        setChainId(parseInt(chainId, 16));
      });
    }

    return () => {
      if (typeof window !== "undefined" && window.ethereum) {
        window.ethereum.removeAllListeners("accountsChanged");
        window.ethereum.removeAllListeners("chainChanged");
      }
    };
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