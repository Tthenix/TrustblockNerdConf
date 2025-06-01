"use client";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { DonationForm } from "@/components/donation-form";
import { Clock, Users, Award, Shield, ExternalLink, Copy, Share2 } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { useBlockchainContracts } from "@/hooks/useBlockchainContracts";
import { useWeb3 } from "@/components/providers/web3-provider";
import { TransactionsList } from "@/components/transactions-list";

interface Reward {
  id: string;
  title: string;
  description: string;
  minDonation: number;
  claimed: number;
}

interface Update {
  id: string;
  date: string;
  title: string;
  content: string;
}

interface Transaction {
  id: string;
  date: string;
  amount: number;
  type: "donation" | "expense";
  status: "completed" | "pending" | "failed";
  from?: string;
  purpose?: string;
  category?: string;
  beneficiaries?: number;
  to?: string;
}

interface Campaign {
  id: string;
  title: string;
  organization: string;
  description: string;
  raised: string;
  goal: string;
  backers: number;
  daysLeft: number;
  image: string;
  featured?: boolean;
  verified?: boolean;
  category: string;
  location: string;
  website: string;
  rewards: Reward[];
  updates: Update[];
  transactions: Transaction[];
}

export default function CampaignDetailPage() {
  const params = useParams();
  const campaignId = params?.id as string;
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { getCampaignDetails } = useBlockchainContracts();
  const { isConnected, chainId } = useWeb3();

  const loadCampaign = useCallback(async () => {
    // Si es un address de blockchain, buscar en el contrato
    if (campaignId && campaignId.startsWith("0x") && campaignId.length === 42) {
      // Verificar que estamos conectados y en la red correcta
      if (!isConnected) {
        console.log("⚠️ Wallet not connected for blockchain campaign");
        setCampaign(null);
        setIsLoading(false);
        return;
      }
      
      if (chainId !== 1287) {
        console.log(`⚠️ Wrong network (${chainId}). Expected Moonbase Alpha (1287)`);
        setCampaign(null);
        setIsLoading(false);
        return;
      }

      try {
        console.log("🔍 Loading blockchain campaign:", campaignId);
        const data = await getCampaignDetails(campaignId);
        if (data) {
          // Mapear los datos del contrato al formato Campaign
          setCampaign({
            id: data.id,
            title: data.title,
            organization: data.organization || `Creador: ${data.creator?.slice(0, 6)}...${data.creator?.slice(-4)}`,
            description: data.description,
            raised: data.raised,
            goal: data.goal,
            backers: data.backers,
            daysLeft: data.daysLeft,
            image: data.image || "/img/campana/blockchain-campaign.jpg",
            featured: false,
            verified: true,
            category: "Blockchain",
            location: "Descentralizada",
            website: data.website || `https://moonbase.moonscan.io/address/${campaignId}`,
            rewards: [],
            updates: [],
            transactions: [],
          });
        } else {
          console.log("❌ Campaign not found on blockchain");
          setCampaign(null);
        }
      } catch (error) {
        console.error("❌ Error loading blockchain campaign:", error);
        setCampaign(null);
      }
      setIsLoading(false);
      return;
    }

    // Obtener campañas del localStorage
    const savedCampaigns = JSON.parse(localStorage.getItem("campaigns") || "[]");
    
    // Buscar campaña hardcodeada
    const hardcodedCampaigns = [
      {
        id: "hardcoded-0",
        title: "Ayuda Urgente: Inundaciones en Bahía Blanca",
        organization: "Cruz Roja Argentina",
        description: "Campaña de emergencia para asistir a las familias afectadas por las graves inundaciones en Bahía Blanca y zonas aledañas.",
        raised: "8500",
        goal: "50000",
        backers: 106,
        daysLeft: 10,
        image: "/img/campana/52242f9a-f563-4e47-b21a-83ef501c00e6.jpeg",
        featured: true,
        verified: true,
        category: "Ayuda Humanitaria",
        location: "Bahía Blanca, Argentina",
        website: "https://cruzroja.org.ar",
        rewards: [],
        updates: [],
        transactions: [],
      },
      // Puedes agregar más campañas hardcodeadas aquí si es necesario
    ];

    // Buscar en savedCampaigns y hardcodedCampaigns
    const allCampaigns = [...savedCampaigns, ...hardcodedCampaigns];
    const foundCampaign = allCampaigns.find(c => c.id === campaignId);

    if (foundCampaign) {
      setCampaign(foundCampaign);
    } else {
      console.log("❌ Campaign not found in localStorage or hardcoded campaigns");
      setCampaign(null);
    }
    setIsLoading(false);
  }, [campaignId, isConnected, chainId, getCampaignDetails]);

  useEffect(() => {
    loadCampaign();
  }, [loadCampaign]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-12 px-4 md:px-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Cargando campaña...</p>
        </div>
      </div>
    );
  }

  // Si es una campaña blockchain pero no está conectada la wallet
  if (campaignId && campaignId.startsWith("0x") && campaignId.length === 42 && !isConnected) {
    return (
      <div className="container mx-auto py-12 px-4 md:px-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Wallet no conectada</h1>
          <p className="text-muted-foreground mb-4">
            Para ver los detalles de esta campaña blockchain, necesitas conectar tu wallet.
          </p>
          <Button onClick={() => window.location.href = '/'}>
            Volver al inicio
          </Button>
        </div>
      </div>
    );
  }

  // Si está conectada pero en la red incorrecta
  if (campaignId && campaignId.startsWith("0x") && campaignId.length === 42 && isConnected && chainId !== 1287) {
    return (
      <div className="container mx-auto py-12 px-4 md:px-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Red incorrecta</h1>
          <p className="text-muted-foreground mb-4">
            Esta campaña está en Moonbase Alpha. Por favor cambia a la red correcta (chainId 1287).
          </p>
          <Button onClick={() => window.location.href = '/'}>
            Volver al inicio
          </Button>
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="container mx-auto py-12 px-4 md:px-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Campaña no encontrada</h1>
          <p className="text-muted-foreground mb-4">
            La campaña que buscas no existe o no se pudo cargar.
          </p>
          <Button onClick={() => window.location.href = '/'}>
            Volver al inicio
          </Button>
        </div>
      </div>
    );
  }

  const progress = Math.min(
    Math.round((parseFloat(campaign.raised) / parseFloat(campaign.goal)) * 100),
    100
  );

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="rounded-lg overflow-hidden">
            <Image
              src={campaign.image || "/placeholder.svg"}
              alt={campaign.title}
              width={1200}
              height={600}
              className="w-full h-auto object-cover"
            />
          </div>

          <div>
            <div className="flex items-center gap-3 mb-2">
              <Badge variant="outline" className="bg-primary/10 text-primary">
                {campaign.category}
              </Badge>
              {campaign.verified && (
                <Badge variant="outline" className="bg-green-500/10 text-green-500">
                  <Shield className="h-3 w-3 mr-1" />
                  Verificado
                </Badge>
              )}
              {campaign.id === "0" && (
                <Badge variant="outline" className="bg-red-500/10 text-red-500">
                  URGENTE
                </Badge>
              )}
            </div>

            <h1 className="text-4xl font-bold mb-4">{campaign.title}</h1>
            <div className="flex items-center gap-1 text-muted-foreground mb-6">
              <span className="font-medium text-foreground">
                Por {campaign.organization}
              </span>
              {campaign.location && (
                <>
                  <span className="mx-2">•</span>
                  <span>{campaign.location}</span>
                </>
              )}
              {campaign.website && (
                <>
                  <span className="mx-2">•</span>
                  <a
                    href={campaign.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center hover:text-primary"
                  >
                    Sitio web <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </>
              )}
            </div>

            <Tabs defaultValue="about" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="about">Acerca de</TabsTrigger>
                <TabsTrigger value="updates">Actualizaciones</TabsTrigger>
                <TabsTrigger value="transactions">Transacciones</TabsTrigger>
              </TabsList>
              <TabsContent value="about" className="space-y-4 py-4">
                <div className="whitespace-pre-line">{campaign.description}</div>

                {campaign.rewards && campaign.rewards.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-xl font-bold mb-4 flex items-center">
                      <Award className="h-5 w-5 mr-2" />
                      Recompensas por tu apoyo
                    </h3>
                    <div className="space-y-4">
                      {campaign.rewards.map((reward: Reward) => (
                        <div
                          key={reward.id}
                          className="border border-border rounded-lg p-4 transition-colors hover:bg-accent hover:text-white group"
                        >
                          <div className="flex justify-between mb-2">
                            <h4 className="font-bold">{reward.title}</h4>
                            <span className="text-sm font-medium group-hover:text-white">
                              Donación mínima: {reward.minDonation} {campaignId && campaignId.startsWith("0x") && campaignId.length === 42 ? 'DEV' : 'USD'}
                            </span>
                          </div>
                          <p className="text-muted-foreground mb-2 group-hover:text-white">
                            {reward.description}
                          </p>
                          <div className="text-sm text-muted-foreground group-hover:text-white">
                            {reward.claimed} personas ya lo han reclamado
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="updates" className="space-y-4 py-4">
                {campaign.updates && campaign.updates.length > 0 ? (
                  <div className="space-y-6">
                    {campaign.updates.map((update: Update) => (
                      <div key={update.id} className="border-b border-border pb-6 last:border-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-medium text-muted-foreground">
                            {update.date}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold mb-2">{update.title}</h3>
                        <p className="text-muted-foreground">{update.content}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    No hay actualizaciones disponibles para esta campaña.
                  </p>
                )}
              </TabsContent>
              <TabsContent value="transactions" className="space-y-4">
                <TransactionsList campaignAddress={campaignId} />
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-20 space-y-6">
            <div className="border border-border rounded-lg p-6 bg-card">
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold mb-1">
                    {campaignId && campaignId.startsWith("0x") && campaignId.length === 42 
                      ? `${parseFloat(campaign.raised).toLocaleString(undefined, { maximumFractionDigits: 4 })} DEV`
                      : `$${parseFloat(campaign.raised).toLocaleString()}`
                    }
                  </h3>
                  <p className="text-muted-foreground">
                    recaudados de {campaignId && campaignId.startsWith("0x") && campaignId.length === 42 
                      ? `${parseFloat(campaign.goal).toLocaleString(undefined, { maximumFractionDigits: 4 })} DEV`
                      : `$${parseFloat(campaign.goal).toLocaleString()}`
                    }
                  </p>
                </div>

                <Progress value={progress} className="h-2" />

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="font-bold">{campaign.backers}</span>
                    </div>
                    <p className="text-muted-foreground">Donantes</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="font-bold">{campaign.daysLeft}</span>
                    </div>
                    <p className="text-muted-foreground">Días restantes</p>
                  </div>
                </div>

                <DonationForm campaignId={campaignId} />
              </div>
            </div>

            <div className="border border-border rounded-lg p-6 bg-card">
              <h3 className="font-bold mb-4">Comparte esta campaña</h3>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      navigator.clipboard.writeText(window.location.href);
                      // Aquí podríamos mostrar una notificación de éxito
                    }
                  }}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copiar enlace
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => {
                    if (typeof window !== 'undefined' && navigator.share) {
                      navigator.share({
                        title: campaign?.title,
                        text: 'Ayuda a financiar esta campaña',
                        url: window.location.href,
                      });
                    }
                  }}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Compartir
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
