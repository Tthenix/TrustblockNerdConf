"use client";

import { useState } from "react";
import { useContracts } from "@/hooks/useContracts";
import { useWeb3 } from "@/components/providers/web3-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export function CreateCampaignForm() {
  const [title, setTitle] = useState("");
  const [organization, setOrganization] = useState("");
  const [description, setDescription] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [duration, setDuration] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");  const [website, setWebsite] = useState("");  const [image, setImage] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { createCampaign, isConnected } = useContracts();
  const { connectWallet, account } = useWeb3();
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected) {
      await connectWallet();
      return;
    }

    if (!title || !description || !targetAmount || !duration) {
      alert("Por favor completa todos los campos");
      return;
    }

    setIsLoading(true);
    try {
      const txHash = await createCampaign(
        title,
        description,
        targetAmount,
        parseInt(duration)
      );      // Generar un id único para la campaña
      const campaigns = JSON.parse(localStorage.getItem("campaigns") || "[]");
      // Generar ID único considerando que las campañas hardcodeadas van del 0 al 9
      const maxId = Math.max(
        ...campaigns.map((c: any) => parseInt(c.id) || 0),
        9 // Las campañas hardcodeadas usan IDs del 0-9
      );
      const newId = (maxId + 1).toString();
      
      // Crear la campaña con todos los campos necesarios
      const newCampaign = {
        id: newId,
        title,
        organization: organization || "Organización Desconocida",
        description,
        raised: 0,
        goal: Number(targetAmount),
        backers: 0,
        daysLeft: Number(duration),
        image: image || "/api/placeholder/600/400", // Imagen proporcionada o por defecto
        featured: false,
        verified: false,
        category: category || "Sin Categoría",
        location: location || "Ubicación no especificada",
        website: website || "",
        txHash,
        createdAt: new Date().toISOString(),
        account,
        rewards: [
          {
            id: "1",
            title: "Certificado Digital",
            description: "NFT que certifica tu contribución a la campaña",
            minDonation: 10,
            claimed: 0,
          },
          {
            id: "2",
            title: "Donante Destacado",
            description: "Reconocimiento en el informe final de la campaña y certificado especial",
            minDonation: 100,
            claimed: 0,
          },
          {
            id: "3",
            title: "Patrocinador Oficial",
            description: "Reconocimiento prominente, certificado especial y participación en el evento de cierre",
            minDonation: 500,
            claimed: 0,
          },
        ],
        updates: [],
        transactions: [],
      };      campaigns.push(newCampaign);
      localStorage.setItem("campaigns", JSON.stringify(campaigns));
      
      // Disparar evento para actualizar la UI
      window.dispatchEvent(new CustomEvent('campaignsUpdated'));
      
      alert(`¡Campaña creada exitosamente! 🎉\n\nHash de transacción: ${txHash}\n\nTu campaña ahora es un smart contract en la blockchain.`);      // Limpiar formulario
      setTitle("");
      setOrganization("");
      setDescription("");
      setTargetAmount("");
      setDuration("");
      setCategory("");
      setLocation("");
      setWebsite("");
      setImage("");
      setImageFile(null);
      // Limpiar el input file
      const fileInput = document.getElementById('imageFile') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (error: any) {
      console.error("Error:", error);
      
      let errorMessage = "Error al crear la campaña. Por favor intenta de nuevo.";
      
      if (error.message?.includes("User rejected")) {
        errorMessage = "Transacción cancelada por el usuario.";
      } else if (error.message?.includes("Wallet not connected")) {
        errorMessage = "Wallet no conectada. Por favor conecta tu wallet.";
      } else if (error.message?.includes("insufficient funds")) {
        errorMessage = "Fondos insuficientes para pagar el gas de la transacción.";
      }
      
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Crear Nueva Campaña</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">          <div className="space-y-2">
            <Label htmlFor="title">Título de la Campaña</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ingresa el título de tu campaña"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="organization">Organización</Label>
            <Input
              id="organization"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              placeholder="Nombre de tu organización"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe tu proyecto..."
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Categoría</Label>
              <Input
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Ej: Medio Ambiente, Educación"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Ubicación</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Ciudad, País"
              />
            </div>
          </div>          <div className="space-y-2">
            <Label htmlFor="website">Sitio Web (opcional)</Label>
            <Input
              id="website"
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://tu-organizacion.com"
            />
          </div>          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="image">Imagen de la Campaña</Label>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="imageFile" className="text-sm font-medium">Subir archivo de imagen</Label>
                  <Input
                    id="imageFile"
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="mt-1"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 h-px bg-border"></div>
                  <span className="text-xs text-muted-foreground">O</span>
                  <div className="flex-1 h-px bg-border"></div>
                </div>
                <div>
                  <Label htmlFor="imageUrl" className="text-sm font-medium">URL de imagen</Label>
                  <Input
                    id="imageUrl"
                    type="url"
                    value={imageFile ? "" : image}
                    onChange={(e) => {
                      if (!imageFile) {
                        setImage(e.target.value);
                      }
                    }}
                    placeholder="https://ejemplo.com/imagen.jpg"
                    disabled={!!imageFile}
                    className="mt-1"
                  />
                </div>
              </div>
              {image && (
                <div className="mt-3">
                  <p className="text-sm text-muted-foreground mb-2">Vista previa:</p>
                  <img 
                    src={image} 
                    alt="Vista previa" 
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
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="targetAmount">Meta de Financiamiento (DOT)</Label>
              <Input
                id="targetAmount"
                type="number"
                step="0.01"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                placeholder="0.00"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duración (días)</Label>
              <Input
                id="duration"
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="30"
                required
              />
            </div>
          </div>

          {!isConnected ? (
            <Button type="button" onClick={connectWallet} className="w-full">
              Conectar Wallet para Crear Campaña
            </Button>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Conectado como: {account?.slice(0, 6)}...{account?.slice(-4)}
              </p>
              <Button 
                type="submit" 
                disabled={isLoading} 
                className="w-full"
              >
                {isLoading ? "Creando Campaña..." : "Crear Campaña (Smart Contract)"}
              </Button>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}