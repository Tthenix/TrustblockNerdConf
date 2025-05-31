"use client";

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
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
}

interface CampaignCardProps {
  campaign: Campaign
}

export function CampaignCard({ campaign }: CampaignCardProps) {
  const progress = Math.min(Math.round((campaign.raised / campaign.goal) * 100), 100)

  return (
    <Card className="overflow-hidden hover-scale card-transition border border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader className="p-0">
        <div className="overflow-hidden">
          <Image
            src={campaign.image || "/placeholder.svg"}
            alt={campaign.title}
            width={400}
            height={192}
            className="w-full h-48 object-cover transition-transform duration-500 hover:scale-110"
          />
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="mb-2 text-sm font-medium text-skyblue">{campaign.organization}</div>
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
