"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useWalletConnection } from "@/lib/hooks/useWalletConnection";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, CheckCircle, AlertCircle, Wallet } from "lucide-react";
import { KYCVerificationModal } from "@/components/kyc-verification-modal";

function WalletVerification() {
  const router = useRouter();
  const [showKYCModal, setShowKYCModal] = useState(false);
  const {
    address,
    isConnected,
    isAuthenticated,
    authUser,
    verificationResult,
    connectWallet
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

function VerificationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { authUser, verificationResult } = useWalletConnection();
  
  // Safely get the returnTo parameter
  const returnTo = searchParams?.get('returnTo') || '/campaigns/create';

  useEffect(() => {
    // Check if verification is completed and redirect back
    if (authUser?.isVerified && verificationResult?.status === 'approved') {
      setTimeout(() => {
        router.push(returnTo);
      }, 2000);
    }
  }, [authUser, verificationResult, router, returnTo]);

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-4">Verificación KYC de Wallet</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Completa el proceso de verificación de identidad (KYC) para tu wallet. 
          Este proceso garantiza la seguridad y confianza en la plataforma TrustBlock.
        </p>
      </div>
      
      <WalletVerification />
    </main>
  );
}

export default function VerificarWalletPage() {
  return (
    <Suspense fallback={
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Cargando verificación...</p>
          </div>
        </div>
      </main>
    }>
      <VerificationContent />
    </Suspense>
  );
}
