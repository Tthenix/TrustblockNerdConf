"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { VerificationStatus } from "@/components/verification-status";
import { RewardForm } from "@/components/reward-form";
import { Upload, Target, Award, Info } from "lucide-react";
import { toast } from "sonner";
import { useBlockchainContracts } from "@/hooks/useBlockchainContracts";
import { useWeb3 } from "@/components/providers/web3-provider";
import { useWalletConnection } from "@/lib/hooks/useWalletConnection";
import { ethers } from "ethers";
import Image from "next/image";

interface StoredCampaign {
  id: string;
  title: string;
  organization: string;
  description: string;
  goal: number;
  image: string;
  category: string;
  location: string;
  website: string;
}

export function CreateCampaignForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  
  // Form states
  const [title, setTitle] = useState("");
  const [organization, setOrganization] = useState("");
  const [description, setDescription] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [duration, setDuration] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [website, setWebsite] = useState("");
  const [image, setImage] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { createCampaign, isConnected } = useContracts();
 
  // Add KYC verification state
  const {
    address,
    isAuthenticated,
    authUser,
    verificationResult
  } = useWalletConnection();

  // Check if user is verified
  const isVerified = isAuthenticated && authUser?.isVerified && verificationResult?.status === 'approved';
  const { createCampaignOnBlockchain, isConnected } = useBlockchainContracts();
  const { connectWallet, account, chainId } = useWeb3();


  // Debug logging
  console.log("Component state:", { isConnected, account, isLoading, step, isVerified, isAuthenticated });

  // Handle wallet connection and KYC check
  useEffect(() => {
    if (isConnected && address && !isAuthenticated) {
      // Wallet connected but not authenticated, redirect to verification
      router.push('/verificar-wallet');
    }
  }, [isConnected, address, isAuthenticated, router]);

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      
      // Convertir la imagen a base64 para almacenarla
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target?.result as string;
        setImage(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const isValidImageUrl = (url: string) => {
    return /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp|svg|avif)$/i.test(url);
  };

  const handleCreateCampaign = async () => {
    if (!isConnected) {
      try {
        toast.info("Conectando wallet...", {
          description: "Por favor conecta tu wallet para continuar",
          style: {
            background: "hsl(222, 13%, 14%)",
            border: "1px solid hsla(190, 95%, 39%, 0.4)",
            color: "white",
            fontWeight: "500",
          },
          descriptionClassName: "!text-white",
          icon: "🔗",        });
        await connectWallet();
        return;
      } catch {
        toast.error("Error de conexión", {
          description: "No se pudo conectar la wallet. Por favor intenta de nuevo.",
          style: {
            background: "hsl(222, 13%, 14%)",
            border: "1px solid hsla(326, 100%, 74%, 0.4)",
            color: "white",
            fontWeight: "500",
          },
          descriptionClassName: "!text-white",
          icon: "✕",
        });
        return;
      }
    }

    if (!title || !description || !targetAmount || !duration) {
      toast.error("Error", {
        description: "Por favor completa todos los campos obligatorios",
        style: {
          background: "hsl(222, 13%, 14%)",
          border: "1px solid hsla(326, 100%, 74%, 0.4)",
          color: "white",
          fontWeight: "500",
        },
        descriptionClassName: "!text-white",
        icon: "✕",
      });
      return;
    }

    setIsLoading(true);
    try {
      // 🚀 Crear campaña en el blockchain
      console.log("Creating blockchain campaign with data:", {
        title,
        description,
        image,
        goal: targetAmount,
        durationDays: Number(duration)
      });

      const receipt = await createCampaignOnBlockchain({
        title,
        description,
        image,
        goal: targetAmount,
        durationDays: Number(duration)
      });

      console.log("✅ Blockchain campaign created:", receipt);

      // Obtener dirección de la nueva campaña del evento
      const campaignCreatedEvent = receipt.logs.find((log: any) => {
        try {
          // Buscar el evento CampaignCreated
          return log.topics[0] === "0x37bb6c1f723b45d67f1e74f38d0317e27d160a58f9efcf0dfd9b9d42c78eef5c";
        } catch {
          return false;
        }
      });

      let newCampaignAddress = "";
      if (campaignCreatedEvent) {
        // Decodificar el evento para obtener la dirección
        const iface = new ethers.Interface([
          "event CampaignCreated(address campaignAddress, address creator, string title)"
        ]);
        const decoded = iface.parseLog(campaignCreatedEvent);
        newCampaignAddress = decoded?.args.campaignAddress || "";
        console.log("📦 New campaign address:", newCampaignAddress);
      }

      // ✅ NO guardar en localStorage - la campaña aparecerá automáticamente desde el blockchain
      // Las campañas blockchain se cargan directamente del contrato, no necesitan localStorage
      
      // Disparar evento para que el home recargue las campañas desde blockchain
      window.dispatchEvent(new CustomEvent('campaignsUpdated'));
      
      toast.success("¡Campaña creada en Blockchain!", {
        description: `Contrato desplegado: ${newCampaignAddress ? newCampaignAddress.slice(0, 6) + '...' + newCampaignAddress.slice(-4) : 'Procesando...'}. Aparecerá automáticamente en el home.`,
        style: {
          background: "hsl(222, 13%, 14%)",
          border: "1px solid hsla(190, 95%, 39%, 0.4)",
          color: "white",
          fontWeight: "500",
        },
        descriptionClassName: "!text-white",
        icon: "✓",
      });
      
      // Redireccionar al inicio
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (error: unknown) {
      console.error("Error:", error);
      
      let errorMessage = "Error al crear la campaña. Por favor intenta de nuevo.";
      
      if (error instanceof Error) {
        if (error.message?.includes("User rejected")) {
          errorMessage = "Transacción cancelada por el usuario.";
        } else if (error.message?.includes("Wallet not connected")) {
          errorMessage = "Wallet no conectada. Por favor conecta tu wallet.";
        } else if (error.message?.includes("insufficient funds")) {
          errorMessage = "Fondos insuficientes para pagar el gas de la transacción.";
        }
      }
      
      toast.error("Error al crear campaña", {
        description: errorMessage,
        style: {
          background: "hsl(222, 13%, 14%)",
          border: "1px solid hsla(326, 100%, 74%, 0.4)",
          color: "white",
          fontWeight: "500",
        },
        descriptionClassName: "!text-white",
        icon: "✕",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerificationRedirect = () => {
    if (!isConnected) {
      // Connect wallet first, then redirect
      connectWallet().then(() => {
        router.push('/verificar-wallet');
      }).catch(() => {
        toast.error("Error de conexión", {
          description: "No se pudo conectar la wallet. Por favor intenta de nuevo.",
          style: {
            background: "hsl(222, 13%, 14%)",
            border: "1px solid hsla(326, 100%, 74%, 0.4)",
            color: "white",
            fontWeight: "500",
          },
          descriptionClassName: "!text-white",
          icon: "✕",
        });
      });
    } else {
      // Wallet already connected, go to verification
      router.push('/verificar-wallet');
    }
  };

  return (
    <main className="container mx-auto py-12 px-4 md:px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Crear Nueva Campaña</h1>
        <p className="text-muted-foreground mb-8">Completa la información para lanzar tu campaña de crowdfunding</p>

        <div className="mb-8">
          <div className="flex items-center justify-between relative">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col items-center z-10">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                    step >= i
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background border-muted-foreground"
                  }`}
                >
                  {i}
                </div>
                <span className="text-xs mt-2 text-muted-foreground">
                  {i === 1 && "Verificación"}
                  {i === 2 && "Información"}
                  {i === 3 && "Detalles"}
                  {i === 4 && "Recompensas"}
                </span>
              </div>
            ))}
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-muted -z-0"></div>
          </div>
        </div>

        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5 text-primary" />
                Verificación de Identidad
              </CardTitle>
              <CardDescription>
                Para garantizar la confianza en la plataforma, necesitamos verificar tu identidad o la de tu
                organización
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {!isConnected ? (
                <div className="text-center p-6 border rounded-lg bg-muted/50">
                  <Info className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-medium mb-2">Conecta tu Wallet</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Primero necesitas conectar tu wallet para proceder con la verificación KYC
                  </p>
                  <Button onClick={handleVerificationRedirect}>
                    Conectar Wallet
                  </Button>
                </div>
              ) : !isAuthenticated ? (
                <div className="text-center p-6 border rounded-lg bg-yellow-50 dark:bg-yellow-950/20">
                  <Info className="h-12 w-12 mx-auto mb-4 text-yellow-600" />
                  <h3 className="font-medium mb-2">Verificación Requerida</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Tu wallet está conectada pero necesitas completar la verificación KYC
                  </p>
                  <Button onClick={handleVerificationRedirect}>
                    Ir a Verificación KYC
                  </Button>
                </div>
              ) : isVerified ? (
                <div className="text-center p-6 border rounded-lg bg-green-50 dark:bg-green-950/20">
                  <div className="h-12 w-12 mx-auto mb-4 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                    <Info className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-medium mb-2 text-green-800 dark:text-green-200">Verificación Completada</h3>
                  <p className="text-sm text-green-600 dark:text-green-400 mb-2">
                    Tu identidad ha sido verificada exitosamente
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Wallet: {address?.slice(0, 6)}...{address?.slice(-4)}
                  </p>
                </div>
              ) : (
                <div className="text-center p-6 border rounded-lg bg-yellow-50 dark:bg-yellow-950/20">
                  <Info className="h-12 w-12 mx-auto mb-4 text-yellow-600" />
                  <h3 className="font-medium mb-2">Verificación Pendiente</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Tu verificación KYC está en proceso. Por favor complétala para continuar.
                  </p>
                  <Button onClick={handleVerificationRedirect} variant="outline">
                    Completar Verificación
                  </Button>
                </div>
              )}

            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" disabled>
                Anterior
              </Button>
              <Button onClick={nextStep} disabled={!isVerified}>
                Siguiente
              </Button>
            </CardFooter>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5 text-primary" />
                Información Básica
              </CardTitle>
              <CardDescription>Proporciona la información principal de tu campaña</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título de la Campaña</Label>
                  <Input 
                    id="title" 
                    placeholder="Ej: Reforestación Amazónica" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="organization">Nombre de la Organización</Label>
                  <Input 
                    id="organization" 
                    placeholder="Ej: EcoFuturo ONG" 
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Categoría</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="environment">Medio Ambiente</SelectItem>
                      <SelectItem value="education">Educación</SelectItem>
                      <SelectItem value="technology">Tecnología</SelectItem>
                      <SelectItem value="social">Causas Sociales</SelectItem>
                      <SelectItem value="health">Salud</SelectItem>
                      <SelectItem value="art">Arte y Cultura</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Ubicación</Label>
                  <Input 
                    id="location" 
                    placeholder="Ej: Amazonía, Brasil" 
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Sitio Web (opcional)</Label>
                  <Input 
                    id="website" 
                    placeholder="https://tuorganizacion.org" 
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                  />
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={prevStep}>
                Anterior
              </Button>
              <Button onClick={nextStep}>Siguiente</Button>
            </CardFooter>
          </Card>
        )}

        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Detalles de la Campaña
              </CardTitle>
              <CardDescription>Define los objetivos y detalles de tu campaña</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe detalladamente tu proyecto y cómo se utilizarán los fondos..."
                    rows={5}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="goal">Meta de Financiamiento (DOT)</Label>
                    <Input 
                      id="goal" 
                      type="number" 
                      min="1" 
                      placeholder="Ej: 25000" 
                      value={targetAmount}
                      onChange={(e) => setTargetAmount(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duration">Duración (días)</Label>
                    <Input 
                      id="duration" 
                      type="number" 
                      min="1" 
                      max="90" 
                      placeholder="Ej: 30" 
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Imagen Principal</Label>
                  <div className="space-y-3">
                    <label htmlFor="imageFile" className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors block">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Arrastra una imagen o haz clic para seleccionar</p>
                      <p className="text-xs text-muted-foreground mt-1">PNG, JPG o GIF (max. 5MB)</p>
                      <Input 
                        id="imageFile"
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={handleImageFileChange}
                      />
                    </label>
                    
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 h-px bg-border"></div>
                      <span className="text-xs text-muted-foreground">O</span>
                      <div className="flex-1 h-px bg-border"></div>
                    </div>
                    
                    <div>
                      <Input
                        type="url"
                        value={imageFile ? "" : image}
                        onChange={(e) => {
                          const url = e.target.value;
                          setImage(url);
                          if (url && !isValidImageUrl(url)) {
                            toast.error("El link debe ser directo a una imagen (.jpg, .png, etc.)");
                          }
                        }}
                        placeholder="https://ejemplo.com/imagen.jpg"
                        disabled={!!imageFile}
                      />
                    </div>
                  </div>

                  {image && isValidImageUrl(image) && (
                    <div className="mt-3">
                      <p className="text-sm text-muted-foreground mb-2">Vista previa:</p>
                      <Image 
                        src={image} 
                        alt="Vista previa" 
                        width={400}
                        height={192}
                        className="w-full max-w-md h-48 object-cover rounded-lg border"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                      {imageFile && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={() => {
                            setImageFile(null);
                            setImage("");
                            // Limpiar el input file
                            const fileInput = document.getElementById('imageFile') as HTMLInputElement;
                            if (fileInput) fileInput.value = '';
                          }}
                        >
                          Quitar imagen
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={prevStep}>
                Anterior
              </Button>
              <Button onClick={nextStep}>Siguiente</Button>
            </CardFooter>
          </Card>
        )}

        {step === 4 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                Recompensas (Opcional)
              </CardTitle>
              <CardDescription>Añade recompensas para incentivar las donaciones</CardDescription>
            </CardHeader>            <CardContent>
              <RewardForm />

              <div className="mt-8 p-4 bg-muted rounded-lg">
                <h3 className="font-medium mb-2">Recompensas Añadidas</h3>
                <p className="text-sm text-muted-foreground">
                  No has añadido ninguna recompensa aún. Las recompensas son opcionales pero pueden aumentar
                  significativamente las donaciones.
                </p>
              </div>

              {!isConnected && (
                <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <h3 className="font-medium mb-2 text-yellow-700 dark:text-yellow-300">Wallet no conectada</h3>
                  <p className="text-sm text-yellow-600 dark:text-yellow-400">
                    Necesitas conectar tu wallet para crear la campaña. El botón te permitirá conectar automáticamente.
                  </p>
                </div>
              )}              {isConnected && account && chainId === 1287 && (
                <div className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <h3 className="font-medium mb-2 text-green-700 dark:text-green-300">✅ Wallet conectada</h3>
                  <p className="text-sm text-green-600 dark:text-green-400">
                    Conectado con: {account.slice(0, 6)}...{account.slice(-4)} en Moonbase Alpha
                  </p>
                </div>
              )}

              {isConnected && account && chainId !== 1287 && (
                <div className="mt-4 p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                  <h3 className="font-medium mb-2 text-orange-700 dark:text-orange-300">⚠️ Red incorrecta</h3>
                  <p className="text-sm text-orange-600 dark:text-orange-400">
                    Conectado a chainId {chainId}. Necesitas cambiar a Moonbase Alpha (1287) para crear campañas.
                  </p>
                </div>
              )}

              {/* <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg text-xs">
                <strong>Debug:</strong> isConnected: {isConnected.toString()}, account: {account || "none"}, isLoading: {isLoading.toString()}
              </div> */}
            </CardContent><CardFooter className="flex justify-between">
              <Button variant="outline" onClick={prevStep}>
                Anterior
              </Button>
              <Button 
                onClick={handleCreateCampaign} 
                disabled={isLoading || (isConnected && chainId !== 1287)}
              >
                {isLoading ? "Creando Campaña..." : 
                 !isConnected ? "Conectar Wallet y Crear" :
                 chainId !== 1287 ? "⚠️ Red incorrecta" :
                 "Crear Campaña"}
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </main>
  );
}