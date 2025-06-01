"use client";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { DonationForm } from "@/components/donation-form";
import { TransparencyTracker } from "@/components/transparency-tracker";
import { Clock, Users, Award, Shield, ExternalLink, Copy, Share2 } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
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

  const loadCampaign = async () => {
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

    // Datos de campañas (en una implementación real, estos vendrían de una API o blockchain)
    const campaignsData: Campaign[] = [
      {
        id: "0",
        title: "Ayuda Urgente: Inundaciones en Bahía Blanca",
        organization: "Cruz Roja Argentina",
        description:
          "Campaña de emergencia para asistir a las familias afectadas por las graves inundaciones en Bahía Blanca y zonas aledañas. Los fondos recaudados se utilizarán para:\n\n- Proporcionar kits de emergencia con alimentos, agua potable y artículos de higiene.\n- Habilitar refugios temporales para personas desplazadas.\n- Brindar asistencia médica y psicológica a los afectados.\n- Apoyar en las labores de limpieza y reconstrucción.\n\nLa situación es crítica y muchas familias lo han perdido todo. Con tu ayuda podemos llevar asistencia rápida y efectiva a quienes más lo necesitan en este momento de emergencia.",
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
        rewards: [
          {
            id: "1",
            title: "Certificado Digital de Ayuda",
            description:
              "NFT que certifica tu contribución a la campaña de ayuda",
            minDonation: 30,
            claimed: 62,
          },
          {
            id: "2",
            title: "Donante Destacado",
            description:
              "Reconocimiento en el informe final de la campaña y certificado especial",
            minDonation: 200,
            claimed: 18,
          },
          {
            id: "3",
            title: "Patrocinador Oficial",
            description:
              "Reconocimiento prominente, certificado especial y participación en el evento de cierre",
            minDonation: 500,
            claimed: 7,
          },
        ],
        updates: [
          {
            id: "1",
            date: "2025-03-10",
            title: "¡Lanzamiento de la campaña de emergencia!",
            content:
              "Hemos lanzado esta campaña de emergencia para ayudar a las familias afectadas por las inundaciones en Bahía Blanca.",
          },
          {
            id: "2",
            date: "2025-03-12",
            title: "Primeros kits de emergencia entregados",
            content:
              "Gracias a las primeras donaciones, hemos podido entregar 50 kits de emergencia a familias afectadas.",
          },
          {
            id: "3",
            date: "2025-03-14",
            title: "Habilitación de refugio temporal",
            content:
              "Hemos habilitado un refugio temporal que ya alberga a 80 personas que han perdido sus hogares.",
          },
        ],
        transactions: [
          {
            id: "tx1",
            date: "2025-03-10",
            amount: 2000,
            from: "5GrwvaEF...utQY",
            type: "donation",
            status: "completed",
          },
          {
            id: "tx2",
            date: "2025-03-11",
            amount: 1500,
            from: "5FHneW46...v3VPc",
            type: "donation",
            status: "completed",
          },
          {
            id: "tx3",
            date: "2025-03-13",
            amount: 5000,
            from: "0x742d35...e7e6",
            type: "donation",
            status: "completed",
          },
          {
            id: "tx4",
            date: "2025-03-14",
            amount: 1200,
            type: "expense",
            purpose: "Compra de kits de emergencia con alimentos y artículos básicos",
            category: "Suministros",
            beneficiaries: 50,
            to: "Proveedor Local de Suministros",
            status: "completed",
          },
          {
            id: "tx5",
            date: "2025-03-14",
            amount: 800,
            type: "expense",
            purpose: "Habilitación de refugio temporal (materiales y acondicionamiento)",
            category: "Infraestructura",
            beneficiaries: 80,
            to: "Centro Comunitario Municipal",
            status: "completed",
          },
          {
            id: "tx6",
            date: "2025-03-15",
            amount: 500,
            type: "expense",
            purpose: "Transporte de voluntarios y suministros a zonas afectadas",
            category: "Logistica",
            beneficiaries: 120,
            to: "Empresa de Transporte Local",
            status: "completed",
          },
          {
            id: "tx7",
            date: "2025-03-16",
            amount: 1500,
            type: "expense",
            purpose: "Medicamentos y atención médica para afectados",
            category: "Salud",
            beneficiaries: 35,
            to: "Farmacia Comunitaria",
            status: "completed",
          },
          {
            id: "tx8",
            date: "2025-03-17",
            amount: 300,
            type: "expense",
            purpose: "Materiales educativos para niños en refugios",
            category: "Educacion",
            beneficiaries: 22,
            to: "Librería Educativa",
            status: "completed",
          }
        ],
      },
      {
        id: "1",
        title: "Reforestación Amazónica",
        organization: "EcoFuturo ONG",
        description:
          "Proyecto para plantar 10,000 árboles nativos en zonas deforestadas de la Amazonía. Este proyecto busca restaurar ecosistemas degradados, proteger la biodiversidad y combatir el cambio climático a través de la reforestación con especies nativas.\n\nLos fondos recaudados se utilizarán para:\n- Adquisición de semillas y plántulas nativas\n- Capacitación de comunidades locales en técnicas de reforestación\n- Monitoreo y mantenimiento de las áreas reforestadas\n- Educación ambiental para prevenir la deforestación futura",
        raised: "15000",
        goal: "25000",
        backers: 128,
        daysLeft: 15,
        image: "/img/campana/Reforestación Amazónica.jpeg",
        verified: true,
        category: "Medio Ambiente",
        location: "Amazonía, Brasil",
        website: "https://ecofuturo.org",
        rewards: [
          {
            id: "1",
            title: "Certificado Digital",
            description:
              "NFT que certifica tu contribución a la plantación de un árbol",
            minDonation: 50,
            claimed: 87,
          },
          {
            id: "2",
            title: "Árbol Dedicado",
            description:
              "Un árbol plantado con tu nombre y coordenadas GPS para que puedas visitarlo",
            minDonation: 200,
            claimed: 32,
          },
          {
            id: "3",
            title: "Patrocinador Oficial",
            description:
              "Tu nombre/logo en nuestro sitio web y materiales promocionales + 10 árboles plantados",
            minDonation: 1000,
            claimed: 5,
          },
        ],
        updates: [
          {
            id: "1",
            date: "2023-10-15",
            title: "¡Comenzamos la campaña!",
            content:
              "Hoy lanzamos oficialmente nuestra campaña de reforestación. Gracias a todos por su apoyo inicial.",
          },
          {
            id: "2",
            date: "2023-10-28",
            title: "Primera meta alcanzada",
            content:
              "Hemos alcanzado el 25% de nuestra meta. Ya hemos comenzado a adquirir las primeras semillas.",
          },
          {
            id: "3",
            date: "2023-11-10",
            title: "Preparación del terreno",
            content:
              "El equipo ha comenzado a preparar las primeras hectáreas para la plantación que comenzará el próximo mes.",
          },
        ],
        transactions: [
          {
            id: "tx1",
            date: "2023-10-15",
            amount: 1000,
            from: "5GrwvaEF...utQY",
            type: "donation",
            status: "completed",
          },
          {
            id: "tx2",
            date: "2023-10-16",
            amount: 500,
            from: "5FHneW46...v3VPc",
            type: "donation",
            status: "completed",
          },
          {
            id: "tx3",
            date: "2023-10-20",
            amount: 250,
            from: "0x742d35...e7e6",
            type: "donation",
            status: "completed",
          },
          {
            id: "tx4",
            date: "2023-10-25",
            amount: 400,
            type: "expense",
            purpose: "Compra de semillas nativas para reforestación",
            category: "Suministros",
            beneficiaries: 0,
            to: "Banco de Semillas Amazónicas",
            status: "completed",
          },
          {
            id: "tx5",
            date: "2023-11-01",
            amount: 300,
            type: "expense",
            purpose: "Equipamiento para preparación del terreno",
            category: "Infraestructura",
            beneficiaries: 0,
            to: "Ferretería Ecológica",
            status: "completed",
          },
          {
            id: "tx6",
            date: "2023-11-05",
            amount: 250,
            type: "expense",
            purpose: "Capacitación a comunidades locales en técnicas de reforestación",
            category: "Educacion",
            beneficiaries: 15,
            to: "Consultores Ambientales",
            status: "completed",
          },
          {
            id: "tx7",
            date: "2023-11-10",
            amount: 180,
            type: "expense",
            purpose: "Transporte de materiales y personal a la zona de plantación",
            category: "Logistica",
            beneficiaries: 8,
            to: "Transportes Amazónicos",
            status: "completed",
          },
          {
            id: "tx8",
            date: "2023-11-15",
            amount: 120,
            type: "expense",
            purpose: "Material informativo sobre conservación para comunidades",
            category: "Administrativo",
            beneficiaries: 45,
            to: "Imprenta Sostenible",
            status: "completed",
          }
        ],
      },
      // Aquí irían las demás campañas...
    ];

    // Obtener donaciones adicionales para campañas hardcodeadas
    const hardcodedDonations = JSON.parse(localStorage.getItem("hardcodedCampaignDonations") || "{}");

    // Actualizar campañas hardcodeadas con donaciones adicionales
    const updatedCampaignsData = campaignsData.map(campaign => {
      const donations = hardcodedDonations[campaign.id];
      if (donations) {
        return {
          ...campaign,
          raised: (parseFloat(campaign.raised) + donations.raised).toString(),
          backers: campaign.backers + donations.backers,
          transactions: [...(campaign.transactions || []), ...donations.transactions]
        };
      }
      return campaign;
    });

    // Combinar campañas hardcodeadas con las guardadas en localStorage
    const allCampaigns = [...savedCampaigns, ...updatedCampaignsData];

    const campaign = allCampaigns.find((c) => c.id === campaignId) || campaignsData[0];
    setCampaign(campaign);
    setIsLoading(false);
  };

  useEffect(() => {
    // Cargar campaña inicialmente
    loadCampaign();

    // Escuchar eventos de donación para actualizar en tiempo real
    const handleDonationUpdate = () => {
      console.log("🔄 Actualizando datos de la campaña después de donación");
      loadCampaign();
    };

    window.addEventListener('campaignDonationUpdated', handleDonationUpdate);

    return () => {
      window.removeEventListener('campaignDonationUpdated', handleDonationUpdate);
    };
  }, [campaignId, isConnected, chainId]);

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
                              Donación mínima: {reward.minDonation} DOT
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
                    {parseFloat(campaign.raised).toLocaleString(undefined, { maximumFractionDigits: 4 })} DOT
                  </h3>
                  <p className="text-muted-foreground">
                    recaudados de {parseFloat(campaign.goal).toLocaleString(undefined, { maximumFractionDigits: 4 })} DOT
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
