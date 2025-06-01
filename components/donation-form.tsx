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
  const [isLoading, setIsLoading] = useState(false)
  const { donateToBlockchainCampaign } = useBlockchainContracts()
  const { isConnected, account } = useWeb3()

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Por favor ingresa un monto válido")
      return
    }

    if (!isConnected) {
      toast.error("Por favor conecta tu wallet")
      return
    }

    setIsLoading(true)
    
    try {
      const tx = await donateToBlockchainCampaign(campaignId, amount)
      console.log("Donation transaction:", tx)
      
      toast.success("¡Donación exitosa!", {
        description: `Has donado ${amount} DOT a esta campaña`,
      })

      // Limpiar formulario
      setAmount("")
      setIsAnonymous(false)
      
      // Disparar evento para actualizar las campañas
      window.dispatchEvent(new CustomEvent('campaignDonationUpdated'))
      
    } catch (error: unknown) {
      console.error("Error donating:", error)
      toast.error("Error al procesar la donación", {
        description: error instanceof Error ? error.message : "Error desconocido"
      })
    } finally {
      setIsLoading(false)
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

  if (account !== "0x0000000000000000000000000000000000000000") {
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
          disabled={isLoading || !amount}
        >
          {isLoading ? "Procesando..." : "Donar Ahora"}
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          Tu donación quedará registrada en la blockchain para garantizar transparencia
        </p>
      </div>
    </form>
  )
}
