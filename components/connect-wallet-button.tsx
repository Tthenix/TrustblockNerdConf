"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Wallet, Shield, CheckCircle, ExternalLink } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useWalletConnection } from "@/lib/hooks/useWalletConnection";
import { Badge } from "@/components/ui/badge";

export function ConnectWalletButton() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const {
    isConnected,
    address,
    isAuthenticated,
    authUser,
    isLoading,
    error,
    connectWallet,
    disconnectWallet,
    authenticateWithSumsub,
  } = useWalletConnection();

  const handleConnectWallet = async () => {
    try {
      await connectWallet();
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error connecting wallet:", error);
      // Error is already handled in the hook
    }
  };

  const handleAuthenticateWithSumsub = async () => {
    try {
      await authenticateWithSumsub();
    } catch (error) {
      console.error("Error authenticating with Sumsub:", error);
    }
  };

  const formatAddress = (addr: string) => {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const isMetaMaskInstalled = () => {
    return typeof window !== "undefined" && window.ethereum;
  };

  if (isConnected) {
    return (
      <div className="flex items-center gap-2">
        {authUser?.isVerified && (
          <Badge
            variant="secondary"
            className="bg-green-100 text-green-800 border-green-200"
          >
            <CheckCircle className="mr-1 h-3 w-3" />
            Verificado KYC
          </Badge>
        )}
        <Button
          variant="outline"
          size="lg"
          className="border-skyblue/50 text-skyblue hover:bg-skyblue/10 hover:text-skyblue transition-colors"
          onClick={disconnectWallet}
        >
          <Wallet className="mr-2 h-4 w-4" />
          {formatAddress(address!)}
        </Button>
      </div>
    );
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="lg"
          className="border-skyblue/50 text-skyblue hover:bg-skyblue/10 hover:text-skyblue transition-colors"
          disabled={isLoading}
        >
          <Wallet className="mr-2 h-4 w-4" />
          {isLoading ? "Conectando..." : "Conectar Wallet"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md border border-skyblue/20 bg-card/95 backdrop-blur-md">
        <DialogHeader>
          <DialogTitle>Conectar Wallet</DialogTitle>
          <DialogDescription>
            Conecta tu wallet para interactuar con la plataforma TrustBlock. La
            verificación KYC solo es necesaria para crear campañas.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="grid gap-4 py-4">
          {isMetaMaskInstalled() ? (
            <Button
              onClick={handleConnectWallet}
              disabled={isLoading}
              className="w-full bg-skyblue hover:bg-skyblue/80 transition-colors"
            >
              {isLoading ? "Conectando..." : "MetaMask"}
            </Button>
          ) : (
            <div className="space-y-3">
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-sm text-yellow-600">MetaMask no está instalado</p>
              </div>
              <Button
                variant="outline"
                className="w-full border-skyblue/30 hover:bg-skyblue/10 transition-colors"
                onClick={() => window.open("https://metamask.io/download/", "_blank")}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Instalar MetaMask
              </Button>
            </div>
          )}

          <Button
            variant="outline"
            className="w-full border-skyblue/30 hover:bg-skyblue/10 transition-colors"
            disabled
          >
            Polkadot.js (Próximamente)
          </Button>
          <Button
            variant="outline"
            className="w-full border-skyblue/30 hover:bg-skyblue/10 transition-colors"
            disabled
          >
            SubWallet (Próximamente)
          </Button>
          <Button
            variant="outline"
            className="w-full border-skyblue/30 hover:bg-skyblue/10 transition-colors"
            disabled
          >
            Talisman (Próximamente)
          </Button>
        </div>

        <div className="text-xs text-muted-foreground text-center">
          Al conectar, aceptas nuestros términos de servicio y política de
          privacidad.
        </div>
      </DialogContent>
    </Dialog>
  );
}
