"use client";

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Users } from "lucide-react"

interface Campaign {
  id: string
  title: string
  organization: string
  description: string
  raised: number
  goal: number
  backers: number
  daysLeft: number
  image: string
  // ✅ Propiedades opcionales para campañas blockchain
  verified?: boolean
  category?: string
  address?: string // Dirección del contrato
  isBlockchain?: boolean // ✅ Agregar propiedad isBlockchain
}

interface CampaignCardProps {
  campaign: Campaign
}

export function CampaignCard({ campaign }: CampaignCardProps) {
  const progress = Math.min(Math.round((campaign.raised / campaign.goal) * 100), 100)

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-neonpink/20 border border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader className="p-0">
        <div className="overflow-hidden">
          <Image
            src={campaign.image || "/placeholder.svg"}
            alt={campaign.title}
            width={400}
            height={192}
            className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-medium text-skyblue">{campaign.organization}</div>
          {campaign.verified && (
            <Badge variant="secondary" className="text-xs">
              ✓ Verificado
            </Badge>
          )}
        </div>
        
        {/* 🆕 Mostrar dirección del contrato si es una campaña blockchain */}
        {(campaign.category === "Blockchain" || campaign.isBlockchain) && campaign.address && (
          <div className="mb-3 p-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-md border border-purple-500/20">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs bg-purple-500/20 border-purple-500/50">
                  🔗 Blockchain
                </Badge>
              </div>
              <a
                href={`https://moonbase.moonscan.io/address/${campaign.address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-purple-400 hover:text-purple-300"
                onClick={(e) => e.stopPropagation()}
              >
                Ver en Explorer ↗
              </a>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Contrato:</span>
              <div className="flex items-center gap-2">
                <code className="text-xs font-mono bg-background px-2 py-1 rounded border">
                  {campaign.address.slice(0, 6)}...{campaign.address.slice(-4)}
                </code>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 px-2 text-xs hover:bg-purple-500/20"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    navigator.clipboard.writeText(campaign.address!);
                  }}
                  title="Copiar dirección completa"
                >
                  📋
                </Button>
              </div>
            </div>
          </div>
        )}
        
        <h3 className="text-xl font-bold mb-2 line-clamp-1">{campaign.title}</h3>
        <p className="text-muted-foreground mb-4 line-clamp-2">{campaign.description}</p>

        <div className="space-y-4">
          <Progress 
            value={progress} 
            className="h-2 bg-muted [&>div]:bg-neonpink" 
          />

          <div className="flex justify-between text-sm">
            <div>
              <div className="font-bold text-skyblue">{campaign.raised.toLocaleString()} DOT</div>
              <div className="text-muted-foreground">de {campaign.goal.toLocaleString()} DOT</div>
            </div>
            <div className="text-right">
              <div className="font-bold text-neonpink">{progress}%</div>
              <div className="text-muted-foreground">Completado</div>
            </div>
          </div>

          <div className="flex justify-between text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{campaign.backers} donantes</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{campaign.daysLeft} días restantes</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Button asChild className="w-full bg-skyblue hover:bg-skyblue/80 transition-colors">
          <Link href={`/campaigns/${campaign.id}`}>
            Donar Ahora
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
