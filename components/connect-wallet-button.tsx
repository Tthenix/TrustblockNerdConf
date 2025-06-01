"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function ConnectWalletButton() {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check if already connected on component mount
  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  const checkIfWalletIsConnected = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' }) as string[];
        if (accounts.length > 0) {
          setAddress(accounts[0]);
          setIsConnected(true);
        }
      }
    } catch (error) {
      console.error("Error checking wallet connection:", error);
    }
  };

  const connectMetaMask = async () => {
    if (!window.ethereum) {
      alert("MetaMask no está instalado. Por favor instala MetaMask para continuar.");
      return;
    }

    setIsLoading(true);
    try {
      // Request account access
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      }) as string[];
      
      if (accounts.length > 0) {
        setAddress(accounts[0]);
        setIsConnected(true);
        setIsDialogOpen(false);
        
        // Listen for account changes
        window.ethereum.on('accountsChanged', (accounts: unknown) => {
          const accountsArray = accounts as string[];
          if (accountsArray.length > 0) {
            setAddress(accountsArray[0]);
            setIsConnected(true);
          } else {
            disconnectWallet();
          }
        });
      }
    } catch (error) {
      console.error("Error connecting to MetaMask:", error);
      alert("Error al conectar con MetaMask. Por favor intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setAddress("");
    // Remove event listeners
    if (window.ethereum && window.ethereum.removeAllListeners) {
      window.ethereum.removeAllListeners('accountsChanged');
    }
  };

  const formatAddress = (addr: string) => {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (isConnected) {
    return (
      <Button
        variant="outline"
        size="lg"
        className="border-skyblue/50 text-skyblue hover:bg-skyblue/10 hover:text-skyblue transition-colors"
        onClick={disconnectWallet}
      >
        <Wallet className="mr-2 h-4 w-4" />
        {formatAddress(address)}
      </Button>
    );
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="lg"
          className="border-skyblue/50 text-skyblue hover:bg-skyblue/10 hover:text-skyblue transition-colors"
        >
          <Wallet className="mr-2 h-4 w-4" />
          Conectar Wallet
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md border border-skyblue/20 bg-card/95 backdrop-blur-md">
        <DialogHeader>
          <DialogTitle>Conectar Wallet</DialogTitle>
          <DialogDescription>
            Conecta tu wallet para interactuar con la plataforma TrustBlock
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Button
            onClick={connectMetaMask}
            disabled={isLoading}
            className="w-full bg-skyblue hover:bg-skyblue/80 transition-colors disabled:opacity-50"
          >
            {isLoading ? "Conectando..." : "MetaMask"}
          </Button>
          <Button
            variant="outline"
            className="w-full border-skyblue/30 hover:bg-skyblue/10 transition-colors"
            disabled
          >
            Polkadot.js Extension (Próximamente)
          </Button>
          <Button
            variant="outline"
            className="w-full border-skyblue/30 hover:bg-skyblue/10 transition-colors"
            disabled
          >
            SubWallet (Próximamente)
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
