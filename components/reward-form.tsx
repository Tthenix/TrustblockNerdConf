"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react"

export function RewardForm() {
  const addReward = () => {
    // En una implementación real, aquí se validarían los datos
    // y se añadiría la recompensa a la lista
    alert("Funcionalidad de añadir recompensa (simulada)")
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="reward-title">Título de la Recompensa</Label>
        <Input id="reward-title" placeholder="Ej: Certificado Digital" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="reward-description">Descripción</Label>
        <Textarea id="reward-description" placeholder="Describe lo que recibirán los donantes..." rows={3} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="reward-amount">Donación Mínima (DOT)</Label>
        <Input id="reward-amount" type="number" min="1" placeholder="Ej: 50" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="reward-limit">Límite de Unidades (opcional)</Label>
        <Input id="reward-limit" type="number" min="1" placeholder="Dejar en blanco para ilimitado" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="reward-nft">¿Es un NFT?</Label>
        <div className="flex items-center space-x-2">
          <input type="checkbox" id="reward-nft" className="rounded border-gray-300" />
          <label htmlFor="reward-nft" className="text-sm text-muted-foreground">
            Esta recompensa incluye un NFT como certificado o coleccionable
          </label>
        </div>
      </div>

      <Button type="button" onClick={addReward} className="w-full">
        <Plus className="mr-2 h-4 w-4" /> Añadir Recompensa
      </Button>
    </div>
  )
}

