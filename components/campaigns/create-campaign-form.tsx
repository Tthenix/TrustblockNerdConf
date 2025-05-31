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
  const [description, setDescription] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [duration, setDuration] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { createCampaign, isConnected } = useContracts();
  const { connectWallet, account } = useWeb3();

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
      );
      
      alert(`¡Campaña creada exitosamente! 🎉\n\nHash de transacción: ${txHash}\n\nTu campaña ahora es un smart contract en la blockchain.`);
      
      // Limpiar formulario
      setTitle("");
      setDescription("");
      setTargetAmount("");
      setDuration("");
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
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
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

          <div className="space-y-2">
            <Label htmlFor="targetAmount">Meta de Financiamiento (ETH)</Label>
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