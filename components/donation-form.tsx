"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"

interface DonationFormProps {
  campaignId: string
}

export function DonationForm({ campaignId }: DonationFormProps) {
  const [amount, setAmount] = useState("")
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isWalletConnected, setIsWalletConnected] = useState(false)
  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!amount) return

    setIsSubmitting(true)

    try {
      // Simulación de transacción blockchain
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Aquí iría la lógica real de transacción con Polkadot.js
      console.log(`Donación de ${amount} DOT a la campaña ${campaignId}`)      // Actualizar la campaña en localStorage
      const campaigns = JSON.parse(localStorage.getItem("campaigns") || "[]")
      const campaignIndex = campaigns.findIndex((c: any) => c.id === campaignId)
      
      if (campaignIndex !== -1) {
        // Campaña existe en localStorage - actualizar directamente
        campaigns[campaignIndex].raised = (campaigns[campaignIndex].raised || 0) + parseFloat(amount)
        campaigns[campaignIndex].backers = (campaigns[campaignIndex].backers || 0) + 1
        
        // Agregar transacción de donación
        const newTransaction = {
          id: `tx_${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          amount: parseFloat(amount),
          type: "donation" as const,
          status: "completed" as const,
          from: isAnonymous ? "Donante Anónimo" : "Donante",
          purpose: "Donación a la campaña"
        }
        
        if (!campaigns[campaignIndex].transactions) {
          campaigns[campaignIndex].transactions = []
        }
        campaigns[campaignIndex].transactions.push(newTransaction)
        
        // Guardar cambios
        localStorage.setItem("campaigns", JSON.stringify(campaigns))
      } else {
        // Campaña hardcodeada - crear entrada en localStorage para las donaciones
        const hardcodedCampaignDonations = JSON.parse(localStorage.getItem("hardcodedCampaignDonations") || "{}")
        
        if (!hardcodedCampaignDonations[campaignId]) {
          hardcodedCampaignDonations[campaignId] = {
            raised: 0,
            backers: 0,
            transactions: []
          }
        }
        
        hardcodedCampaignDonations[campaignId].raised += parseFloat(amount)
        hardcodedCampaignDonations[campaignId].backers += 1
        
        const newTransaction = {
          id: `tx_${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          amount: parseFloat(amount),
          type: "donation" as const,
          status: "completed" as const,
          from: isAnonymous ? "Donante Anónimo" : "Donante",
          purpose: "Donación a la campaña"
        }
        
        hardcodedCampaignDonations[campaignId].transactions.push(newTransaction)
        localStorage.setItem("hardcodedCampaignDonations", JSON.stringify(hardcodedCampaignDonations))
      }
        
      // Disparar evento para actualizar la UI
      window.dispatchEvent(new CustomEvent('campaignsUpdated'))
      window.dispatchEvent(new CustomEvent('campaignDonationUpdated', { 
        detail: { campaignId, amount: parseFloat(amount) } 
      }))

      // Resetear formulario
      setAmount("")
      setIsAnonymous(false)

      // Mostrar toast de éxito con mejor estilo
      toast.success("¡Donación realizada con éxito!", {
        description: `Has donado ${amount} DOT a esta campaña. ¡Gracias por tu apoyo!`,
        style: {
          background: "hsl(222, 13%, 14%)", // Mismo color de fondo que la página
          border: "1px solid hsla(190, 95%, 39%, 0.4)",
          color: "white",
          fontWeight: "500", // Texto más claro y legible
        },
        descriptionClassName: "!text-white", // Forzar color blanco
        icon: "✓",
      })
    } catch (error) {
      console.error("Error al procesar donación:", error)
      
      // Mostrar toast de error con mejor estilo
      toast.error("Error al procesar donación", {
        description: "Hubo un problema al procesar tu donación. Por favor intenta de nuevo.",
        style: {
          background: "hsl(222, 13%, 14%)", // Mismo color de fondo que la página
          border: "1px solid hsla(326, 100%, 74%, 0.4)",
          color: "white",
          fontWeight: "500", // Texto más claro y legible
        },
        descriptionClassName: "!text-white", // Forzar color blanco
        icon: "✕",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const presetAmounts = [1, 5, 10, 15]

  // Simulación de wallet conectado para demo
  const handleConnectWallet = () => {
    setIsWalletConnected(true)
  }

  if (!isWalletConnected) {
    return (
      <div className="text-center">
        <p className="mb-4 text-muted-foreground">Conecta tu wallet para donar a este proyecto</p>
        <Button
          onClick={handleConnectWallet}
          className="w-full bg-skyblue hover:bg-skyblue/80 transition-colors hover-scale"
        >
          Conectar Wallet
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleDonate}>
      <div className="space-y-4">
        <div>
          <Label htmlFor="amount">Cantidad a donar (DOT)</Label>
          <Input
            id="amount"
            type="number"
            min="1"
            step="1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Ingresa la cantidad"
            required
            className="mt-1 bg-card border-skyblue/20 focus:border-skyblue"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {presetAmounts.map((preset) => (
            <Button
              key={preset}
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setAmount(preset.toString())}
              className="border-skyblue/30 hover:bg-skyblue/10 transition-colors"
            >
              {preset} DOT
            </Button>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="anonymous"
            checked={isAnonymous}
            onCheckedChange={(checked) => setIsAnonymous(checked === true)}
            className="border-skyblue/30 data-[state=checked]:bg-neonpink data-[state=checked]:border-neonpink"
          />
          <Label htmlFor="anonymous" className="text-sm">
            Donar anónimamente
          </Label>
        </div>

        <Button
          type="submit"
          className="w-full bg-neonpink hover:bg-neonpink/80 transition-colors hover-scale"
          disabled={isSubmitting || !amount}
        >
          {isSubmitting ? "Procesando..." : "Donar Ahora"}
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          Tu donación quedará registrada en la blockchain para garantizar transparencia
        </p>
      </div>
    </form>
  )
}
