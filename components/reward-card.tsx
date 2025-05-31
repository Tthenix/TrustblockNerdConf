"use client"; 

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Gift, CheckCircle } from "lucide-react"

interface Reward {
  id: string
  title: string
  description: string
  amount: number
  isAvailable: boolean
  claimedCount: number
  totalCount: number
}

interface RewardCardProps {
  reward: Reward
  onClaim: () => void
}

export function RewardCard({ reward, onClaim }: RewardCardProps) {
  const isFullyClaimed = reward.claimedCount >= reward.totalCount

  return (
    <Card className="border-skyblue/20 hover:border-skyblue/40 transition-colors">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Gift className="h-5 w-5 text-skyblue" />
          <h3 className="text-xl font-bold">{reward.title}</h3>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">{reward.description}</p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-muted-foreground">
            {reward.claimedCount} de {reward.totalCount} recompensas reclamadas
          </div>
          <div className="font-bold text-skyblue">{reward.amount} DOT</div>
        </div>

        <div className="space-y-2">
          {reward.isAvailable && !isFullyClaimed ? (
            <Button 
              className="w-full bg-skyblue hover:bg-skyblue/80 transition-colors"
              onClick={onClaim} // ← EVENTO SOLO FUNCIONA EN CLIENT COMPONENT
            >
              Reclamar Recompensa
            </Button>
          ) : (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle className="h-4 w-4" />
              <span>
                {isFullyClaimed ? "Todas las recompensas han sido reclamadas" : "Recompensa no disponible"}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
