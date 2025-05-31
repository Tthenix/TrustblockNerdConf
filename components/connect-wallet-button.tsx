"use client";

import { useState } from "react";
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

  const connectWallet = async () => {
    // Simulación de conexión a wallet
    try {
      // En una implementación real, aquí se conectaría con polkadot.js
      setTimeout(() => {
        const mockAddress = "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY";
        setAddress(mockAddress);
        setIsConnected(true);
        setIsDialogOpen(false);
      }, 1000);
    } catch (error) {
      console.error("Error al conectar wallet:", error);
    }
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setAddress("");
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
            Conecta tu wallet para interactuar con la plataforma TrustFund DAO
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Button
            onClick={connectWallet}
            className="w-full bg-skyblue hover:bg-skyblue/80 transition-colors"
          >
            Polkadot.js Extension
          </Button>
          <Button
            variant="outline"
            className="w-full border-skyblue/30 hover:bg-skyblue/10 transition-colors"
          >
            SubWallet
          </Button>
          <Button
            variant="outline"
            className="w-full border-skyblue/30 hover:bg-skyblue/10 transition-colors"
          >
            Talisman
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
