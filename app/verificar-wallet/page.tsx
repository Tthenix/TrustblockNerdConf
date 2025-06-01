"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ConnectWalletButton } from "@/components/connect-wallet-button";
import { Shield, CheckCircle, AlertCircle, User, FileText, CreditCard, Upload, Camera } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function VerificarWalletPage() {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'none' | 'documents' | 'processing' | 'approved' | 'rejected'>('none');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedDocs, setUploadedDocs] = useState({
    identity: false,
    address: false,
    selfie: false
  });

  // Check wallet connection and verification status
  useEffect(() => {
    checkWalletAndVerification();
  }, []);

  const checkWalletAndVerification = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' }) as string[];
        if (accounts.length > 0) {
          const address = accounts[0];
          setIsConnected(true);
          setWalletAddress(address);
          
          // Check verification status with local storage
          const storedStatus = localStorage.getItem(`verification_${address.toLowerCase()}`);
          if (storedStatus) {
            setVerificationStatus(storedStatus as any);
            setIsVerified(storedStatus === 'approved');
          }
        }
      }
    } catch (error) {
      console.error("Error checking wallet and verification:", error);
    }
  };

  const handleFileUpload = (docType: 'identity' | 'address' | 'selfie') => {
    // Mock file upload - in reality this would handle actual file uploads
    setUploadedDocs(prev => ({
      ...prev,
      [docType]: true
    }));
  };

  const startVerification = async () => {
    if (!walletAddress) return;

    setIsLoading(true);
    setVerificationStatus('documents');
    
    // Mock verification process
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const submitDocuments = async () => {
    if (!uploadedDocs.identity || !uploadedDocs.address || !uploadedDocs.selfie) {
      alert('Por favor sube todos los documentos requeridos');
      return;
    }

    setIsLoading(true);
    setVerificationStatus('processing');
    localStorage.setItem(`verification_${walletAddress.toLowerCase()}`, 'processing');
    
    // Mock processing time (3 seconds)
    setTimeout(() => {
      // Mock approval (90% chance of approval for demo)
      const approved = Math.random() > 0.1;
      
      if (approved) {
        setVerificationStatus('approved');
        setIsVerified(true);
        localStorage.setItem(`verification_${walletAddress.toLowerCase()}`, 'approved');
      } else {
        setVerificationStatus('rejected');
        localStorage.setItem(`verification_${walletAddress.toLowerCase()}`, 'rejected');
      }
      
      setIsLoading(false);
    }, 3000);
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Verificación para Creadores</h1>
          <p className="text-muted-foreground">
            Verifica tu identidad para poder crear campañas en TrustBlock. Este proceso es requerido solo para creadores de campañas.
          </p>
        </div>

        <div className="space-y-6">
          {/* Step 1: Connect Wallet */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  isConnected ? 'bg-green-500 text-white' : 'bg-muted text-muted-foreground'
                }`}>
                  {isConnected ? <CheckCircle className="h-4 w-4" /> : '1'}
                </div>
                Conectar Wallet
              </CardTitle>
              <CardDescription>
                Conecta tu wallet para comenzar el proceso de verificación
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <ConnectWalletButton />
              </div>
              {isConnected && (
                <Alert className="mt-4">
                  <CheckCircle className="h-4 w-4" />
                  <AlertTitle>Wallet Conectada</AlertTitle>
                  <AlertDescription>
                    Wallet conectada: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Step 2: Verification Process */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  verificationStatus === 'approved' ? 'bg-green-500 text-white' :
                  verificationStatus === 'processing' ? 'bg-yellow-500 text-white' :
                  verificationStatus === 'rejected' ? 'bg-red-500 text-white' :
                  verificationStatus === 'documents' ? 'bg-blue-500 text-white' :
                  isConnected ? 'bg-blue-500 text-white' : 'bg-muted text-muted-foreground'
                }`}>
                  {verificationStatus === 'approved' ? <CheckCircle className="h-4 w-4" /> : '2'}
                </div>
                Verificación de Identidad
              </CardTitle>
              <CardDescription>
                Proceso de verificación KYC para creadores de campañas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isConnected ? (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Wallet Requerida</AlertTitle>
                  <AlertDescription>
                    Primero necesitas conectar tu wallet para continuar.
                  </AlertDescription>
                </Alert>
              ) : verificationStatus === 'approved' ? (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertTitle>Verificación Aprobada</AlertTitle>
                  <AlertDescription>
                    Tu identidad ha sido verificada exitosamente. Ahora puedes crear campañas en TrustBlock.
                  </AlertDescription>
                </Alert>
              ) : verificationStatus === 'processing' ? (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Verificación en Proceso</AlertTitle>
                  <AlertDescription>
                    {isLoading ? "Procesando tu verificación..." : "Tu verificación está siendo revisada. Recibirás una notificación cuando esté completa."}
                  </AlertDescription>
                </Alert>
              ) : verificationStatus === 'rejected' ? (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Verificación Rechazada</AlertTitle>
                  <AlertDescription>
                    Tu verificación fue rechazada. Por favor, revisa tus documentos y vuelve a intentar.
                  </AlertDescription>
                </Alert>
              ) : verificationStatus === 'documents' ? (
                <>
                  <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">
                      Subir Documentos Requeridos
                    </h3>
                    
                    <div className="space-y-4">
                      {/* Identity Document */}
                      <div className="border border-dashed border-gray-300 rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <User className="h-5 w-5 text-blue-600" />
                          <h4 className="font-medium">Documento de Identidad</h4>
                          {uploadedDocs.identity && <CheckCircle className="h-4 w-4 text-green-500" />}
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          DNI, Pasaporte, Cédula de Identidad
                        </p>
                        <Input
                          type="file"
                          accept="image/*,.pdf"
                          onChange={() => handleFileUpload('identity')}
                          className="cursor-pointer"
                        />
                      </div>

                      {/* Address Proof */}
                      <div className="border border-dashed border-gray-300 rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <FileText className="h-5 w-5 text-blue-600" />
                          <h4 className="font-medium">Comprobante de Domicilio</h4>
                          {uploadedDocs.address && <CheckCircle className="h-4 w-4 text-green-500" />}
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          Factura de servicios, extracto bancario (máximo 3 meses)
                        </p>
                        <Input
                          type="file"
                          accept="image/*,.pdf"
                          onChange={() => handleFileUpload('address')}
                          className="cursor-pointer"
                        />
                      </div>

                      {/* Selfie */}
                      <div className="border border-dashed border-gray-300 rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <Camera className="h-5 w-5 text-blue-600" />
                          <h4 className="font-medium">Selfie con Documento</h4>
                          {uploadedDocs.selfie && <CheckCircle className="h-4 w-4 text-green-500" />}
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          Foto tuya sosteniendo tu documento de identidad
                        </p>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={() => handleFileUpload('selfie')}
                          className="cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={submitDocuments} 
                    disabled={isLoading || !uploadedDocs.identity || !uploadedDocs.address || !uploadedDocs.selfie}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    {isLoading ? "Enviando documentos..." : "Enviar para Verificación"}
                  </Button>
                </>
              ) : (
                <>
                  <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">
                      Documentos Requeridos
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
                        <User className="h-4 w-4" />
                        <span>Documento de identidad válido (DNI, Pasaporte, etc.)</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
                        <FileText className="h-4 w-4" />
                        <span>Comprobante de domicilio reciente</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
                        <Camera className="h-4 w-4" />
                        <span>Selfie con documento en mano</span>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={startVerification} 
                    disabled={isLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    {isLoading ? "Iniciando verificación..." : "Iniciar Verificación KYC"}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
          <h3 className="font-semibold text-amber-900 dark:text-amber-100 mb-2">
            ⚠️ Solo para Creadores de Campañas
          </h3>
          <p className="text-sm text-amber-800 dark:text-amber-200">
            La verificación de identidad solo es requerida para usuarios que desean crear campañas de crowdfunding. 
            Los donantes pueden participar sin verificación.
          </p>
        </div>

        {verificationStatus === 'approved' && (
          <div className="mt-8 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
            <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">
              🎉 ¡Verificación Completa!
            </h3>
            <p className="text-sm text-green-800 dark:text-green-200 mb-3">
              Tu identidad ha sido verificada exitosamente. Ahora puedes:
            </p>
            <ul className="text-sm text-green-800 dark:text-green-200 space-y-1">
              <li>• ✅ Crear campañas de crowdfunding</li>
              <li>• 🚀 Acceder a herramientas premium</li>
              <li>• 🏆 Obtener insignia de creador verificado</li>
              <li>• 📈 Mayor visibilidad en búsquedas</li>
            </ul>
          </div>
        )}
      </div>
    </main>
  );
}
