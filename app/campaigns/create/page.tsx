"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ConnectWalletButton } from "@/components/connect-wallet-button";
import { Shield, CheckCircle, AlertCircle, User, FileText, Camera, ArrowRight, RefreshCw, Upload, DollarSign, Calendar, Tag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { sumsubService, SumsubUser, VerificationDocument } from "@/lib/sumsub";

type CampaignStep = 'verification' | 'basic-info' | 'details' | 'funding' | 'review';

export default function CreateCampaignPage() {
  // Wallet and verification states
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'none' | 'documents' | 'processing' | 'approved' | 'rejected'>('none');
  const [isVerifying, setIsVerifying] = useState(false);
  const [sumsubUser, setSumsubUser] = useState<SumsubUser | null>(null);
  
  // Document upload states
  const [uploadedDocs, setUploadedDocs] = useState({
    identity: false,
    address: false,
    selfie: false
  });
  
  // Campaign creation states
  const [currentStep, setCurrentStep] = useState<CampaignStep>('verification');
  const [campaignData, setCampaignData] = useState({
    // Basic Info
    title: '',
    shortDescription: '',
    category: '',
    
    // Details
    fullDescription: '',
    images: [] as File[],
    video: null as File | null,
    
    // Funding
    goal: '',
    minContribution: '',
    duration: '',
    rewards: [{ amount: '', description: '', estimatedDelivery: '' }],
    
    // Additional
    risks: '',
    timeline: '',
    budget: ''
  });

  // Check wallet connection and verification status
  useEffect(() => {
    checkWalletAndVerification();
  }, []);

  // Listen for Sumsub status updates
  useEffect(() => {
    const handleStatusUpdate = (event: CustomEvent) => {
      const { userId, status } = event.detail;
      if (userId === `wallet_${walletAddress.toLowerCase()}`) {
        setVerificationStatus(status);
        setIsVerified(status === 'approved');
        if (status === 'approved') {
          setCurrentStep('basic-info');
        }
        checkVerificationStatus();
      }
    };

    window.addEventListener('sumsubStatusUpdate', handleStatusUpdate as EventListener);
    return () => window.removeEventListener('sumsubStatusUpdate', handleStatusUpdate as EventListener);
  }, [walletAddress]);

  const checkWalletAndVerification = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' }) as string[];
        if (accounts.length > 0) {
          const address = accounts[0];
          setIsConnected(true);
          setWalletAddress(address);
          
          await checkVerificationStatus(address);
        }
      }
    } catch (error) {
      console.error("Error checking wallet and verification:", error);
    }
  };

  const checkVerificationStatus = async (address?: string) => {
    const addr = address || walletAddress;
    if (!addr) return;

    try {
      const userId = `wallet_${addr.toLowerCase()}`;
      const user = await sumsubService.getVerificationStatus(userId);
      
      if (user) {
        setSumsubUser(user);
        setVerificationStatus(user.status === 'pending' ? 'processing' : user.status);
        setIsVerified(user.status === 'approved');
        
        if (user.status === 'approved') {
          setCurrentStep('basic-info');
        }
      }
    } catch (error) {
      console.error("Error checking verification status:", error);
    }
  };

  const handleFileUpload = (docType: 'identity' | 'address' | 'selfie') => {
    setUploadedDocs(prev => ({
      ...prev,
      [docType]: true
    }));
  };

  const startVerification = async () => {
    if (!walletAddress) return;

    setIsVerifying(true);
    setVerificationStatus('documents');
    
    setTimeout(() => {
      setIsVerifying(false);
    }, 1000);
  };

  const submitDocuments = async () => {
    if (!uploadedDocs.identity || !uploadedDocs.address || !uploadedDocs.selfie) {
      alert('Por favor sube todos los documentos requeridos');
      return;
    }

    setIsVerifying(true);
    
    try {
      const userId = `wallet_${walletAddress.toLowerCase()}`;
      const documents: VerificationDocument[] = [
        { type: 'identity', status: 'uploaded', uploadedAt: new Date().toISOString() },
        { type: 'address', status: 'uploaded', uploadedAt: new Date().toISOString() },
        { type: 'selfie', status: 'uploaded', uploadedAt: new Date().toISOString() }
      ];

      const user = await sumsubService.submitDocuments(userId, documents);
      setSumsubUser(user);
      setVerificationStatus('processing');
      
    } catch (error) {
      console.error('Error submitting documents:', error);
      alert('Error al enviar documentos. Por favor intenta de nuevo.');
    } finally {
      setIsVerifying(false);
    }
  };

  const resetVerification = async () => {
    if (!walletAddress) return;
    
    const userId = `wallet_${walletAddress.toLowerCase()}`;
    await sumsubService.resetVerification(userId);
    
    setVerificationStatus('none');
    setIsVerified(false);
    setSumsubUser(null);
    setUploadedDocs({ identity: false, address: false, selfie: false });
    setCurrentStep('verification');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setCampaignData(prev => ({
      ...prev,
      images: [...prev.images, ...files].slice(0, 5) // Max 5 images
    }));
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCampaignData(prev => ({ ...prev, video: file }));
    }
  };

  const addReward = () => {
    setCampaignData(prev => ({
      ...prev,
      rewards: [...prev.rewards, { amount: '', description: '', estimatedDelivery: '' }]
    }));
  };

  const updateReward = (index: number, field: string, value: string) => {
    setCampaignData(prev => ({
      ...prev,
      rewards: prev.rewards.map((reward, i) => 
        i === index ? { ...reward, [field]: value } : reward
      )
    }));
  };

  const removeReward = (index: number) => {
    setCampaignData(prev => ({
      ...prev,
      rewards: prev.rewards.filter((_, i) => i !== index)
    }));
  };

  const nextStep = () => {
    const steps: CampaignStep[] = ['verification', 'basic-info', 'details', 'funding', 'review'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const prevStep = () => {
    const steps: CampaignStep[] = ['verification', 'basic-info', 'details', 'funding', 'review'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const handleCampaignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!campaignData.title || !campaignData.fullDescription || !campaignData.goal) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    console.log('Creating campaign:', campaignData);
    alert('¡Campaña creada exitosamente!');
  };

  // If wallet is not connected, show connection step
  if (!isConnected) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Crear Campaña</h1>
            <p className="text-muted-foreground">
              Para crear una campaña necesitas conectar tu wallet y verificar tu identidad
            </p>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center">
                  1
                </div>
                Conectar Wallet
              </CardTitle>
              <CardDescription>
                Conecta tu wallet para comenzar el proceso
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <ConnectWalletButton />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  // Show verification step if not verified
  if (currentStep === 'verification' && !isVerified) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Crear Campaña</h1>
            <p className="text-muted-foreground">
              Para crear campañas necesitas verificar tu identidad con Sumsub KYC
            </p>
          </div>

          <div className="space-y-6">
            {/* Wallet Connected */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                  Wallet Conectada
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertTitle>Wallet Conectada</AlertTitle>
                  <AlertDescription>
                    Wallet: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* Verification Required */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    verificationStatus === 'approved' ? 'bg-green-500 text-white' :
                    verificationStatus === 'processing' ? 'bg-yellow-500 text-white' :
                    verificationStatus === 'rejected' ? 'bg-red-500 text-white' :
                    verificationStatus === 'documents' ? 'bg-blue-500 text-white' :
                    'bg-blue-500 text-white'
                  }`}>
                    {verificationStatus === 'approved' ? <CheckCircle className="h-4 w-4" /> : '2'}
                  </div>
                  Verificación Sumsub KYC Requerida
                  {process.env.NODE_ENV === 'development' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={resetVerification}
                      className="ml-auto"
                    >
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Reset (Dev)
                    </Button>
                  )}
                </CardTitle>
                <CardDescription>
                  Verifica tu identidad para poder crear campañas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {verificationStatus === 'approved' ? (
                  <div className="space-y-4">
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertTitle>Verificación Completa</AlertTitle>
                      <AlertDescription>
                        Tu identidad ha sido verificada por Sumsub. Ahora puedes crear campañas.
                      </AlertDescription>
                    </Alert>
                    <Button onClick={() => setCurrentStep('basic-info')} className="w-full">
                      Continuar a Crear Campaña
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                ) : verificationStatus === 'processing' ? (
                  <div className="space-y-4">
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Verificación en Proceso</AlertTitle>
                      <AlertDescription>
                        Sumsub está procesando tu verificación. {isVerifying ? "Esto puede tomar unos momentos..." : "Recibirás una notificación cuando esté completa."}
                      </AlertDescription>
                    </Alert>
                    {sumsubUser && (
                      <div className="p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded border text-sm">
                        <p><strong>Estado en Sumsub:</strong> {sumsubUser.status}</p>
                        <p><strong>Enviado:</strong> {sumsubUser.createdAt}</p>
                      </div>
                    )}
                  </div>
                ) : verificationStatus === 'rejected' ? (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Verificación Rechazada</AlertTitle>
                    <AlertDescription>
                      Tu verificación fue rechazada por Sumsub. Por favor, revisa tus documentos y vuelve a intentar.
                    </AlertDescription>
                  </Alert>
                ) : verificationStatus === 'documents' ? (
                  <>
                    <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">
                        Documentos para Sumsub KYC
                      </h3>
                      
                      <div className="space-y-4">
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
                      disabled={isVerifying || !uploadedDocs.identity || !uploadedDocs.address || !uploadedDocs.selfie}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      {isVerifying ? "Enviando a Sumsub..." : "Enviar para Verificación"}
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
                      <div className="flex items-center gap-3 mb-3">
                        <Shield className="h-6 w-6 text-purple-600" />
                        <h3 className="font-semibold text-purple-900 dark:text-purple-100">
                          Verificación Requerida
                        </h3>
                      </div>
                      <p className="text-sm text-purple-800 dark:text-purple-200 mb-4">
                        Para crear campañas necesitas verificar tu identidad con Sumsub. Este proceso es rápido y seguro.
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-purple-700 dark:text-purple-300">
                          <User className="h-4 w-4" />
                          <span>Documento de identidad válido</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-purple-700 dark:text-purple-300">
                          <FileText className="h-4 w-4" />
                          <span>Comprobante de domicilio reciente</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-purple-700 dark:text-purple-300">
                          <Camera className="h-4 w-4" />
                          <span>Selfie con documento</span>
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={startVerification} 
                      disabled={isVerifying}
                      className="w-full bg-purple-600 hover:bg-purple-700"
                    >
                      {isVerifying ? "Iniciando verificación..." : "Iniciar Verificación Sumsub"}
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    );
  }

  // Campaign creation steps
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold">Crear Campaña</h1>
            <div className="flex items-center space-x-2">
              {['Verificación', 'Información Básica', 'Detalles', 'Financiación', 'Revisión'].map((step, index) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                    index === 0 ? 'bg-green-500 text-white' :
                    ['basic-info', 'details', 'funding', 'review'].indexOf(currentStep) >= index - 1 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {index === 0 ? <CheckCircle className="h-4 w-4" /> : index + 1}
                  </div>
                  {index < 4 && <div className="w-8 h-0.5 bg-gray-300 mx-2" />}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Step content */}
        {currentStep === 'basic-info' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Información Básica
              </CardTitle>
              <CardDescription>
                Proporciona la información básica de tu campaña
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Título de la Campaña *</Label>
                <Input
                  id="title"
                  placeholder="Ej: Ayuda para construir escuela rural"
                  value={campaignData.title}
                  onChange={(e) => setCampaignData(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="shortDescription">Descripción Corta *</Label>
                <Textarea
                  id="shortDescription"
                  placeholder="Resumen breve de tu proyecto (máximo 160 caracteres)"
                  value={campaignData.shortDescription}
                  onChange={(e) => setCampaignData(prev => ({ ...prev, shortDescription: e.target.value }))}
                  className="max-h-20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Categoría *</Label>
                <select
                  id="category"
                  value={campaignData.category}
                  onChange={(e) => setCampaignData(prev => ({ ...prev, category: e.target.value }))}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Seleccionar categoría</option>
                  <option value="education">Educación</option>
                  <option value="health">Salud</option>
                  <option value="environment">Medio Ambiente</option>
                  <option value="technology">Tecnología</option>
                  <option value="community">Comunidad</option>
                  <option value="arts">Arte y Cultura</option>
                </select>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" disabled>
                  Anterior
                </Button>
                <Button onClick={nextStep} disabled={!campaignData.title || !campaignData.shortDescription || !campaignData.category}>
                  Siguiente
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === 'details' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Detalles del Proyecto
              </CardTitle>
              <CardDescription>
                Agrega detalles completos, imágenes y video
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="fullDescription">Descripción Completa *</Label>
                <Textarea
                  id="fullDescription"
                  placeholder="Describe detalladamente tu proyecto, objetivos, historia y cómo planeas usar los fondos..."
                  value={campaignData.fullDescription}
                  onChange={(e) => setCampaignData(prev => ({ ...prev, fullDescription: e.target.value }))}
                  className="min-h-[200px]"
                />
              </div>

              <div className="space-y-2">
                <Label>Imágenes del Proyecto (máximo 5)</Label>
                <Input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="cursor-pointer"
                />
                {campaignData.images.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {campaignData.images.map((image, index) => (
                      <div key={index} className="text-sm p-2 bg-muted rounded">
                        {image.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Video de Presentación (opcional)</Label>
                <Input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  className="cursor-pointer"
                />
                {campaignData.video && (
                  <div className="text-sm p-2 bg-muted rounded">
                    {campaignData.video.name}
                  </div>
                )}
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={prevStep}>
                  Anterior
                </Button>
                <Button onClick={nextStep} disabled={!campaignData.fullDescription}>
                  Siguiente
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === 'funding' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Configuración de Financiación
              </CardTitle>
              <CardDescription>
                Establece tu meta de financiación, duración y recompensas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="goal">Meta de Financiación (ETH) *</Label>
                  <Input
                    id="goal"
                    type="number"
                    step="0.01"
                    placeholder="Ej: 10"
                    value={campaignData.goal}
                    onChange={(e) => setCampaignData(prev => ({ ...prev, goal: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="minContribution">Contribución Mínima (ETH)</Label>
                  <Input
                    id="minContribution"
                    type="number"
                    step="0.001"
                    placeholder="Ej: 0.01"
                    value={campaignData.minContribution}
                    onChange={(e) => setCampaignData(prev => ({ ...prev, minContribution: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duración de la Campaña (días) *</Label>
                <Input
                  id="duration"
                  type="number"
                  placeholder="Ej: 30"
                  value={campaignData.duration}
                  onChange={(e) => setCampaignData(prev => ({ ...prev, duration: e.target.value }))}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Recompensas para Donantes</Label>
                  <Button type="button" variant="outline" onClick={addReward}>
                    Agregar Recompensa
                  </Button>
                </div>
                
                {campaignData.rewards.map((reward, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Recompensa {index + 1}</h4>
                      {index > 0 && (
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          onClick={() => removeReward(index)}
                        >
                          Eliminar
                        </Button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label>Cantidad Mínima (ETH)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="Ej: 0.1"
                          value={reward.amount}
                          onChange={(e) => updateReward(index, 'amount', e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Entrega Estimada</Label>
                        <Input
                          type="date"
                          value={reward.estimatedDelivery}
                          onChange={(e) => updateReward(index, 'estimatedDelivery', e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Descripción de la Recompensa</Label>
                      <Textarea
                        placeholder="Describe qué recibirá el donante..."
                        value={reward.description}
                        onChange={(e) => updateReward(index, 'description', e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={prevStep}>
                  Anterior
                </Button>
                <Button onClick={nextStep} disabled={!campaignData.goal || !campaignData.duration}>
                  Siguiente
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === 'review' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Revisión y Envío
              </CardTitle>
              <CardDescription>
                Revisa toda la información antes de crear tu campaña
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Campaign Preview */}
              <div className="border rounded-lg p-6 space-y-4">
                <h3 className="text-xl font-semibold">{campaignData.title}</h3>
                <p className="text-muted-foreground">{campaignData.shortDescription}</p>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Categoría:</span> {campaignData.category}
                  </div>
                  <div>
                    <span className="font-medium">Meta:</span> {campaignData.goal} ETH
                  </div>
                  <div>
                    <span className="font-medium">Duración:</span> {campaignData.duration} días
                  </div>
                  <div>
                    <span className="font-medium">Recompensas:</span> {campaignData.rewards.length}
                  </div>
                </div>
                
                <div>
                  <span className="font-medium">Descripción:</span>
                  <p className="mt-1 text-sm">{campaignData.fullDescription.slice(0, 200)}...</p>
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={prevStep}>
                  Anterior
                </Button>
                <Button onClick={handleCampaignSubmit} className="bg-green-600 hover:bg-green-700">
                  Crear Campaña
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
