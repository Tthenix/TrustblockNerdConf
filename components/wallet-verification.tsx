"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, CheckCircle, AlertCircle, Wallet } from "lucide-react";
import { KYCVerificationModal } from "@/components/kyc-verification-modal";
import { useWalletConnection } from "@/lib/hooks/useWalletConnection";
import { useWeb3 } from "@/components/providers/web3-provider";

export function WalletVerification() {
  const router = useRouter();
  const [showKYCModal, setShowKYCModal] = useState(false);
  const { connectWallet, isConnected } = useWeb3();
  const {
    address,
    isAuthenticated,
    authUser,
    verificationResult
  } = useWalletConnection();

  const isVerified = isAuthenticated && authUser?.isVerified && verificationResult?.status === 'approved';

  useEffect(() => {
    // Automatically open KYC modal if wallet is connected but not verified
    if (isConnected && address && !isVerified) {
      setShowKYCModal(true);
    }
  }, [isConnected, address, isVerified]);

  const handleWalletConnect = async () => {
    try {
      await connectWallet();
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  const handleVerificationComplete = () => {
    setShowKYCModal(false);
    // Redirect back to campaign creation after a delay
    setTimeout(() => {
      router.push('/campaigns/create');
    }, 2000);
  };

  if (!isConnected) {
    return (
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Conectar Wallet
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Primero necesitas conectar tu wallet para proceder con la verificación KYC.
            </p>
            <Button onClick={handleWalletConnect} className="w-full">
              Conectar Wallet
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isVerified) {
    return (
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Verificación Completada
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Tu identidad ha sido verificada exitosamente. Serás redirigido a la creación de campaña.
              </AlertDescription>
            </Alert>
            <p className="text-xs text-muted-foreground">
              Wallet verificada: {address?.slice(0, 6)}...{address?.slice(-4)}
            </p>
            <Button onClick={() => router.push('/campaigns/create')} className="w-full">
              Continuar con la Campaña
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-yellow-600" />
            Verificación KYC Requerida
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Tu wallet está conectada pero necesitas completar la verificación KYC para crear campañas.
            </AlertDescription>
          </Alert>
          <p className="text-xs text-muted-foreground">
            Wallet conectada: {address?.slice(0, 6)}...{address?.slice(-4)}
          </p>
          <Button onClick={() => setShowKYCModal(true)} className="w-full">
            Iniciar Verificación KYC
          </Button>
        </CardContent>
      </Card>

      <KYCVerificationModal
        isOpen={showKYCModal}
        onClose={() => setShowKYCModal(false)}
        onVerificationComplete={handleVerificationComplete}
      />
    </div>
  );
}
