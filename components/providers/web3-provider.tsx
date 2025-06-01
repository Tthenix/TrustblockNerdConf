"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { ethers } from "ethers";

// Declaración global para window.ethereum
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      send: (method: string, params: unknown[]) => Promise<string[]>;
      on(event: 'accountsChanged', callback: (accounts: string[]) => void): void;
      on(event: 'chainChanged', callback: (chainId: string) => void): void;
      on(event: string, callback: (...args: unknown[]) => void): void;
      removeListener: (event: string, callback: (...args: unknown[]) => void) => void;
    };
  }
}

interface Web3ContextType {
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
  account: string | null;
  chainId: number | null;
  isConnected: boolean;
  connectWallet: () => Promise<void>;
  switchToMoonbase: () => Promise<void>;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

const MOONBASE_ALPHA = {
  chainId: '0x507', // 1287 en hex
  chainName: 'Moonbase Alpha',
  nativeCurrency: {
    name: 'DEV',
    symbol: 'DEV',
    decimals: 18,
  },
  rpcUrls: ['https://rpc.api.moonbase.moonbeam.network'],
  blockExplorerUrls: ['https://moonbase.moonscan.io/'],
};

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);

  const connectWallet = async () => {
    if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
      try {
        const browserProvider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await browserProvider.send("eth_requestAccounts", []);
        const walletSigner = await browserProvider.getSigner();
        const network = await browserProvider.getNetwork();
        
        setProvider(browserProvider);
        setSigner(walletSigner);
        setAccount(accounts[0]);
        setChainId(Number(network.chainId));
        
        console.log("Wallet connected:", accounts[0]);
      } catch (error) {
        console.error("Error connecting wallet:", error);
      }
    } else {
      // Fallback para demo sin MetaMask
      console.log("MetaMask not found, using demo mode");
      setAccount("0x5eDA6c65a643fB4CEd205Df007eB99dBF9419216");
    }
  };

  const switchToMoonbase = async () => {
    if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: MOONBASE_ALPHA.chainId }],
        });
      } catch (switchError: unknown) {
        // Check if error has code property indicating chain not added
        if (switchError && typeof switchError === 'object' && 'code' in switchError && switchError.code === 4902) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [MOONBASE_ALPHA],
            });
          } catch (addError) {
            console.error("Error adding Moonbase network:", addError);
          }
        }
      }
    }
  };

  useEffect(() => {
    // Auto-conectar
    connectWallet();

    if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        setAccount(accounts[0] || null);
      });
      
      window.ethereum.on('chainChanged', (chainId: string) => {
        setChainId(parseInt(chainId, 16));
      });
    }
  }, []);

  const value = {
    provider,
    signer,
    account,
    chainId,
    isConnected: !!account,
    connectWallet,
    switchToMoonbase,
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
}

export function useWeb3() {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error("useWeb3 must be used within a Web3Provider");
  }
  return context;
}