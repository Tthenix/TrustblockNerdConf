"use client";

import { useState, useEffect } from "react";
import { KYCVerificationModal } from "@/components/kyc-verification-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, CheckCircle, AlertCircle } from "lucide-react";
import { useWalletConnection } from "@/lib/hooks/useWalletConnection";

export default function VerificarIdentidadPage() {
  const [isKYCModalOpen, setIsKYCModalOpen] = useState(false);
  const { 
    isConnected, 
    authUser, 
    verificationResult, 
    refreshVerificationStatus,
    isAuthenticated,
    address
  } = useWalletConnection();

  // Refresh verification status when component mounts or when auth state changes
  useEffect(() => {
    if (isAuthenticated && address) {
      refreshVerificationStatus();
    }
  }, [isAuthenticated, address, refreshVerificationStatus]);

  const handleVerificationComplete = async () => {
    setIsKYCModalOpen(false);
    // Refresh verification status after completion
    await refreshVerificationStatus();
  };

  const getVerificationStatus = () => {
    if (!isConnected) return "not-connected";
    if (!authUser) return "not-authenticated";
    if (authUser.isVerified) return "verified";
    if (verificationResult?.status === "pending" || verificationResult?.status === "reviewing") return "pending";
    if (verificationResult?.status === "rejected") return "rejected";
    return "not-started";
  };

  const status = getVerificationStatus();

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Verificación de Identidad KYC</h1>
          <p className="text-muted-foreground">
            Completa el proceso de verificación de identidad para crear campañas en TrustBlock.
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Estado de Verificación
            </CardTitle>
          </CardHeader>
          <CardContent>
            {status === "not-connected" && (
              <div className="text-center py-6">
                <AlertCircle className="h-12 w-12 mx-auto mb-4 text-orange-500" />
                <h3 className="font-semibold mb-2">Wallet No Conectada</h3>
                <p className="text-muted-foreground mb-4">
                  Necesitas conectar tu wallet para comenzar el proceso de verificación.
                </p>
                <Button 
                  onClick={() => window.open("/", "_self")}
                  variant="outline"
                >
                  Ir a Conectar Wallet
                </Button>
              </div>
            )}

            {status === "not-authenticated" && (
              <div className="text-center py-6">
                <AlertCircle className="h-12 w-12 mx-auto mb-4 text-yellow-500" />
                <h3 className="font-semibold mb-2">Autenticación Requerida</h3>
                <p className="text-muted-foreground mb-4">
                  Tu wallet está conectada. Necesitas autenticar tu identidad para proceder con la verificación KYC.
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  Wallet: {address?.slice(0, 6)}...{address?.slice(-4)}
                </p>
                <Button 
                  onClick={() => setIsKYCModalOpen(true)}
                  className="bg-skyblue hover:bg-skyblue/80"
                >
                  Iniciar Verificación
                </Button>
              </div>
            )}

            {status === "not-started" && (
              <div className="text-center py-6">
                <Shield className="h-12 w-12 mx-auto mb-4 text-blue-500" />
                <h3 className="font-semibold mb-2">Listo para Verificar</h3>
                <p className="text-muted-foreground mb-4">
                  Tu wallet está autenticada. Puedes comenzar el proceso de verificación KYC.
                </p>
                <Button 
                  onClick={() => setIsKYCModalOpen(true)}
                  className="bg-neonpink hover:bg-neonpink/80"
                >
                  Comenzar Verificación KYC
                </Button>
              </div>
            )}

            {status === "pending" && (
              <div className="text-center py-6">
                <AlertCircle className="h-12 w-12 mx-auto mb-4 text-yellow-500" />
                <h3 className="font-semibold mb-2">Verificación en Proceso</h3>
                <p className="text-muted-foreground mb-4">
                  Tu verificación está siendo procesada. Esto puede tomar unos minutos.
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Verificación de Identidad:</span>
                    <span className={`font-medium ${
                      verificationResult?.checks.identityVerification === 'passed' ? 'text-green-600' :
                      verificationResult?.checks.identityVerification === 'failed' ? 'text-red-600' :
                      'text-yellow-600'
                    }`}>
                      {verificationResult?.checks.identityVerification === 'passed' ? 'Aprobada' :
                       verificationResult?.checks.identityVerification === 'failed' ? 'Rechazada' :
                       'Pendiente'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Verificación de Documentos:</span>
                    <span className={`font-medium ${
                      verificationResult?.checks.documentVerification === 'passed' ? 'text-green-600' :
                      verificationResult?.checks.documentVerification === 'failed' ? 'text-red-600' :
                      'text-yellow-600'
                    }`}>
                      {verificationResult?.checks.documentVerification === 'passed' ? 'Aprobada' :
                       verificationResult?.checks.documentVerification === 'failed' ? 'Rechazada' :
                       'Pendiente'}
                    </span>
                  </div>
                </div>
                <Button 
                  onClick={() => setIsKYCModalOpen(true)}
                  variant="outline"
                  className="mt-4"
                >
                  Continuar Verificación
                </Button>
              </div>
            )}

            {status === "verified" && (
              <div className="text-center py-6">
                <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                <h3 className="font-semibold mb-2">Verificación Completada</h3>
                <p className="text-muted-foreground mb-4">
                  ¡Felicitaciones! Tu identidad ha sido verificada exitosamente. 
                  Ahora puedes crear campañas en TrustBlock.
                </p>
                <Button 
                  onClick={() => window.open("/campaigns/create", "_self")}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Crear Mi Primera Campaña
                </Button>
              </div>
            )}

            {status === "rejected" && (
              <div className="text-center py-6">
                <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
                <h3 className="font-semibold mb-2">Verificación Rechazada</h3>
                <p className="text-muted-foreground mb-4">
                  Tu verificación no pudo ser completada. Por favor, revisa la información 
                  y documentos proporcionados e intenta nuevamente.
                </p>
                <p className="text-sm text-red-600 mb-4">
                  {verificationResult?.reviewResult.moderationComment}
                </p>
                <Button 
                  onClick={() => setIsKYCModalOpen(true)}
                  variant="outline"
                >
                  Intentar Nuevamente
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Información del Proceso</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-muted/50 rounded-lg">
                <h4 className="font-medium mb-1">Tiempo de Verificación</h4>
                <p className="text-sm text-muted-foreground">
                  Normalmente 2-5 minutos para verificación automática
                </p>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <h4 className="font-medium mb-1">Documentos Aceptados</h4>
                <p className="text-sm text-muted-foreground">
                  Pasaporte, Cédula de Identidad, Licencia de Conducir
                </p>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <h4 className="font-medium mb-1">Seguridad</h4>
                <p className="text-sm text-muted-foreground">
                  Encriptación bancaria y eliminación automática de datos
                </p>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <h4 className="font-medium mb-1">Privacidad</h4>
                <p className="text-sm text-muted-foreground">
                  Cumplimiento GDPR y derecho al olvido
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <KYCVerificationModal
          isOpen={isKYCModalOpen}
          onClose={() => setIsKYCModalOpen(false)}
          onVerificationComplete={handleVerificationComplete}
        />
      </div>
    </main>
  );
}
