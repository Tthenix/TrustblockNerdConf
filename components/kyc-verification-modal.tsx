"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  Upload, 
  Shield, 
  AlertCircle, 
  User,
  FileText,
  Eye
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useWalletConnection } from '@/lib/hooks/useWalletConnection';
import { mockSumsubService, KYCDocument } from '@/lib/services/mockSumsubService';

interface KYCVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerificationComplete: () => void;
}

const steps = [
  { id: 1, title: 'Información Personal', icon: User },
  { id: 2, title: 'Subir Documentos', icon: FileText },
  { id: 3, title: 'Revisión Final', icon: Eye }
];

export function KYCVerificationModal({ isOpen, onClose, onVerificationComplete }: KYCVerificationModalProps) {
  const {
    address,
    isAuthenticated,
    authUser,
    verificationResult,
    authenticateWithSumsub,
    refreshVerificationStatus
  } = useWalletConnection();

  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [applicantId, setApplicantId] = useState<string>('');
  
  const [personalInfo, setPersonalInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    country: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: ''
    }
  });

  const [document, setDocument] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState<'PASSPORT' | 'ID_CARD' | 'DRIVERS_LICENSE'>('ID_CARD');

  // Check if already verified
  React.useEffect(() => {
    if (authUser?.isVerified && verificationResult?.status === 'approved') {
      onVerificationComplete();
      onClose();
    }
  }, [authUser, verificationResult, onVerificationComplete, onClose]);

  const handleStartVerification = async () => {
    if (!address) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      if (!isAuthenticated) {
        await authenticateWithSumsub();
        // Refresh verification status after authentication
        await refreshVerificationStatus();
      }
      setCurrentStep(1);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al iniciar verificación');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePersonalInfoSubmit = async () => {
    if (!isAuthenticated || !address) {
      setError('Debe autenticarse con su wallet primero');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      const id = await mockSumsubService.createApplicantForWallet(address, personalInfo);
      setApplicantId(id);
      setCurrentStep(2);
      await refreshVerificationStatus();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al crear el perfil del solicitante');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDocumentUpload = async () => {
    if (!document || !applicantId) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const kycDocument: KYCDocument = {
        type: documentType,
        file: document,
        country: personalInfo.country
      };
      
      const success = await mockSumsubService.uploadDocument(applicantId, kycDocument);
      if (success) {
        setCurrentStep(3);
        await refreshVerificationStatus();
      } else {
        setError('Error en la verificación del documento');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al subir el documento');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLivenessCheck = async () => {
    if (!applicantId) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const success = await mockSumsubService.performLivenessCheck(applicantId);
      if (success) {
        setCurrentStep(3);
        await refreshVerificationStatus();
      } else {
        setError('Error en la verificación biométrica');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error en la verificación de vida');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinalizeVerification = async () => {
    if (!applicantId) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const result = await mockSumsubService.finalizeVerification(applicantId);
      await refreshVerificationStatus();
      
      if (result.status === 'approved') {
        onVerificationComplete();
        onClose();
      } else {
        setError('La verificación no pudo completarse. Por favor, revisa los datos proporcionados.');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al finalizar la verificación');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  // Initial screen - not authenticated
  if (!isAuthenticated) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-yellow-500" />
              Verificación KYC Requerida
            </DialogTitle>
            <DialogDescription>
              Para crear campañas en TrustBlock, necesitas completar la verificación de identidad (KYC).
            </DialogDescription>
          </DialogHeader>
          
          <div className="text-center py-6">
            <Shield className="h-16 w-16 mx-auto mb-4 text-yellow-500" />
            <p className="text-sm text-muted-foreground mb-6">
              Wallet conectada: {address?.slice(0, 6)}...{address?.slice(-4)}
            </p>
            
            {error && (
              <Alert className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-3">
              <Button 
                onClick={handleStartVerification} 
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? 'Iniciando...' : 'Iniciar Verificación KYC'}
              </Button>
              <Button 
                variant="outline" 
                onClick={onClose}
                className="w-full"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Main verification flow
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Verificación KYC</DialogTitle>
          <DialogDescription>
            Complete el proceso de verificación de identidad para crear campañas.
          </DialogDescription>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = step.id === currentStep;
              const isCompleted = step.id < currentStep;
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                    isCompleted ? 'bg-green-500 border-green-500 text-white' :
                    isActive ? 'border-skyblue text-skyblue' : 'border-gray-300 text-gray-300'
                  }`}>
                    {isCompleted ? <CheckCircle className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-12 h-0.5 ml-2 ${
                      isCompleted ? 'bg-green-500' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
          <div className="text-center">
            <h3 className="font-semibold text-sm">{steps[currentStep - 1].title}</h3>
            <Progress value={(currentStep / steps.length) * 100} className="mt-2" />
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Step Content */}
        <div>
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">Nombre</Label>
                  <Input
                    id="firstName"
                    value={personalInfo.firstName}
                    onChange={(e) => setPersonalInfo({...personalInfo, firstName: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Apellido</Label>
                  <Input
                    id="lastName"
                    value={personalInfo.lastName}
                    onChange={(e) => setPersonalInfo({...personalInfo, lastName: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={personalInfo.email}
                    onChange={(e) => setPersonalInfo({...personalInfo, email: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    value={personalInfo.phone}
                    onChange={(e) => setPersonalInfo({...personalInfo, phone: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="dateOfBirth">Fecha de Nacimiento</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={personalInfo.dateOfBirth}
                    onChange={(e) => setPersonalInfo({...personalInfo, dateOfBirth: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="country">País</Label>
                  <Select
                    value={personalInfo.country}
                    onValueChange={(value) => setPersonalInfo({...personalInfo, country: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar país" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AR">Argentina</SelectItem>
                      <SelectItem value="BR">Brasil</SelectItem>
                      <SelectItem value="CL">Chile</SelectItem>
                      <SelectItem value="CO">Colombia</SelectItem>
                      <SelectItem value="MX">México</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end">
                <Button
                  onClick={handlePersonalInfoSubmit}
                  disabled={isLoading || !personalInfo.firstName || !personalInfo.lastName}
                >
                  {isLoading ? 'Procesando...' : 'Continuar'}
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Document Upload */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="documentType">Tipo de Documento</Label>
                <Select
                  value={documentType}
                  onValueChange={(value: 'PASSPORT' | 'ID_CARD' | 'DRIVERS_LICENSE') => setDocumentType(value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ID_CARD">Cédula de Identidad</SelectItem>
                    <SelectItem value="PASSPORT">Pasaporte</SelectItem>
                    <SelectItem value="DRIVERS_LICENSE">Licencia de Conducir</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => setDocument(e.target.files?.[0] || null)}
                  className="hidden"
                  id="document-upload"
                />
                <label htmlFor="document-upload" className="cursor-pointer">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm font-medium">
                    {document ? document.name : 'Seleccionar archivo'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Formatos aceptados: JPG, PNG, PDF
                  </p>
                </label>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={async () => {
                    await handleDocumentUpload();
                    // Automatically proceed to final step after document upload
                    if (applicantId) {
                      await handleLivenessCheck();
                    }
                  }}
                  disabled={isLoading || !document}
                >
                  {isLoading ? 'Verificando...' : 'Subir Documento'}
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Final Review */}
          {currentStep === 3 && (
            <div className="space-y-4 text-center">
              <Eye className="h-16 w-16 mx-auto mb-4 text-skyblue" />
              <p className="text-sm text-muted-foreground mb-6">
                Finaliza el proceso de verificación KYC.
              </p>

              <Button
                onClick={handleFinalizeVerification}
                disabled={isLoading}
                size="lg"
              >
                {isLoading ? 'Finalizando...' : 'Finalizar Verificación'}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
