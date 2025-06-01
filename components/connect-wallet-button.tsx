"use client";

import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import { useWalletConnection } from "@/lib/hooks/useWalletConnection";
import { useWeb3 } from "@/components/providers/web3-provider";

export function ConnectWalletButton() {
  const { isConnected, account, connectWallet } = useWeb3();
  const {
    authUser,
  } = useWalletConnection();

  const handleConnect = async () => {
    try {
      await connectWallet();
    } catch (error) {
      console.error('Error connecting wallet:', error);
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
          <div className="bg-green-100 text-green-800 border border-green-200 rounded-full px-2 py-1 text-sm">
            Verificado KYC
          </div>
        )}
        <Button
          variant="outline"
          size="lg"
          className="border-skyblue/50 text-skyblue hover:bg-skyblue/10 hover:text-skyblue transition-colors"
        >
          <Wallet className="mr-2 h-4 w-4" />
          {formatAddress(account!)}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {isMetaMaskInstalled() ? (
        <Button
          onClick={handleConnect}
          className="w-full bg-skyblue hover:bg-skyblue/80 transition-colors"
        >
          MetaMask
        </Button>
      ) : (
        <Button
          variant="outline"
          className="w-full border-skyblue/30 hover:bg-skyblue/10 transition-colors"
          onClick={() => window.open("https://metamask.io/download/", "_blank")}
        >
          Instalar MetaMask
        </Button>
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
  );
}
