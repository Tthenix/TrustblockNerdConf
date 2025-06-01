"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import { useWeb3 } from "@/components/providers/web3-provider"
import { useBlockchainContracts } from "@/hooks/useBlockchainContracts"

interface DonationFormProps {
  campaignId: string
}

export function DonationForm({ campaignId }: DonationFormProps) {
  const [amount, setAmount] = useState("")
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { isConnected, chainId } = useWeb3()
  const { donateToBlockchainCampaign } = useBlockchainContracts()
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!amount) return

    try {
      setIsSubmitting(true)
      setError(null)

      // Verificar que estamos en la red correcta
      if (chainId !== 1287) {
        toast.error("Red incorrecta", {
          description: "Por favor, conéctate a Moonbase Alpha para realizar donaciones",
          style: {
            background: "hsl(222, 13%, 14%)",
            border: "1px solid hsla(326, 100%, 74%, 0.4)",
            color: "white",
            fontWeight: "500",
          },
          descriptionClassName: "!text-white",
          icon: "✕",
        })
        return
      }

      // Verificar que el monto sea válido
      const donationAmount = parseFloat(amount)
      if (isNaN(donationAmount) || donationAmount <= 0) {
        toast.error("Monto inválido", {
          description: "Por favor, ingresa un monto válido mayor a 0",
          style: {
            background: "hsl(222, 13%, 14%)",
            border: "1px solid hsla(326, 100%, 74%, 0.4)",
            color: "white",
            fontWeight: "500",
          },
          descriptionClassName: "!text-white",
          icon: "✕",
        })
        return
      }

      // Realizar la donación en el contrato
      const tx = await donateToBlockchainCampaign(campaignId, amount)
      console.log("Transaction sent:", tx.hash)
      
      // Esperar la confirmación de la transacción
      const receipt = await tx.wait()
      console.log("Transaction confirmed:", receipt)

      // Emitir evento de donación completada
      window.dispatchEvent(new Event('campaignDonationUpdated'))
      
      // Resetear formulario
      setAmount("")
      setIsAnonymous(false)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)

      // Mostrar toast de éxito
      toast.success("¡Donación realizada con éxito!", {
        description: `Has donado ${amount} DOT a esta campaña. ¡Gracias por tu apoyo!`,
        style: {
          background: "hsl(222, 13%, 14%)",
          border: "1px solid hsla(190, 95%, 39%, 0.4)",
          color: "white",
          fontWeight: "500",
        },
        descriptionClassName: "!text-white",
        icon: "✓",
      })
    } catch (error: any) {
      console.error("Error donating:", error)
      setError(error.message || "Error al procesar la donación")
    } finally {
      setIsSubmitting(false)
    }
  }

  const presetAmounts = [0.1, 0.5, 1, 5]

  if (!isConnected) {
    return (
      <div className="text-center">
        <p className="mb-4 text-muted-foreground">Conecta tu wallet para donar a este proyecto</p>
        <Button
          onClick={() => window.ethereum?.request({ method: 'eth_requestAccounts' })}
          className="w-full bg-skyblue hover:bg-skyblue/80 transition-colors hover-scale"
        >
          Conectar Wallet
        </Button>
      </div>
    )
  }

  if (chainId !== 1287) {
    return (
      <div className="text-center">
        <p className="mb-4 text-muted-foreground">Por favor, cambia a la red Moonbase Alpha para realizar donaciones</p>
        <Button
          onClick={() => window.ethereum?.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x507' }], // 1287 en hexadecimal
          })}
          className="w-full bg-skyblue hover:bg-skyblue/80 transition-colors hover-scale"
        >
          Cambiar a Moonbase Alpha
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
            min="0.01"
            step="0.01"
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
