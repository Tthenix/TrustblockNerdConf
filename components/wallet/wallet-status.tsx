"use client";

import { useWeb3 } from "@/components/providers/web3-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function WalletStatus() {
  const { account, isConnected, connectWallet, disconnectWallet, chainId } = useWeb3();

  const getNetworkName = (chainId: number | null) => {
    switch (chainId) {
      case 1:
        return "Ethereum Mainnet";
      case 11155111:
        return "Sepolia Testnet";
      case 1337:
        return "Localhost";
      default:
        return chainId ? `Chain ID: ${chainId}` : "Unknown";
    }
  };

  if (!isConnected) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Conectar Wallet</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Conecta tu wallet para crear campañas de crowdfunding como smart contracts.
          </p>
          <Button onClick={connectWallet} className="w-full">
            Conectar MetaMask
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Wallet Conectada</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium">Dirección:</p>
          <p className="text-sm text-muted-foreground font-mono">
            {account?.slice(0, 6)}...{account?.slice(-4)}
          </p>
        </div>
        
        <div>
          <p className="text-sm font-medium">Red:</p>
          <Badge variant="outline">
            {getNetworkName(chainId)}
          </Badge>
        </div>
        
        <Button 
          onClick={disconnectWallet} 
          variant="outline" 
          className="w-full"
        >
          Desconectar
        </Button>
      </CardContent>
    </Card>
  );
}