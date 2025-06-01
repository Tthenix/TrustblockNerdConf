"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CampaignCard } from "@/components/campaign-card";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter } from "lucide-react";
import Link from "next/link";
import { useWeb3 } from "@/components/providers/web3-provider";
import { useBlockchainContracts } from "@/hooks/useBlockchainContracts";

interface Campaign {
  id: string;
  title: string;
  organization: string;
  description: string;
  raised: number;
  goal: number;
  backers: number;
  daysLeft: number;
  image: string;
  featured?: boolean;
  isBlockchain?: boolean;
  address?: string;
}

export default function CampaignsPage() {
  const { isConnected, chainId } = useWeb3();
  const { getAllCampaigns } = useBlockchainContracts();
  
  const [allCampaigns, setAllCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Move mockCampaigns outside component or memoize it to prevent recreation
  const mockCampaigns: Campaign[] = useMemo(() => [
    {
      id: "mock-0",
      title: "Ayuda Urgente: Inundaciones en Bahía Blanca",
      organization: "Cruz Roja Argentina",
      description:
        "Campaña de emergencia para asistir a las familias afectadas por las graves inundaciones en Bahía Blanca y zonas aledañas.",
      raised: 8500,
      goal: 50000,
      backers: 106,
      daysLeft: 10,
      image: "/img/campana/52242f9a-f563-4e47-b21a-83ef501c00e6.jpeg",
      featured: true,
      isBlockchain: true,
      address: "0xCF4A2C47B8B8C4E2FfE8EcD2c4c4B9B4A8B4C4D2E4F"
    },
    {
      id: "mock-1",
      title: "Reforestación Amazónica",
      organization: "EcoFuturo ONG",
      description:
        "Proyecto para plantar 10,000 árboles nativos en zonas deforestadas de la Amazonía.",
      raised: 15000,
      goal: 25000,
      backers: 128,
      daysLeft: 15,
      image: "/img/campana/Reforestación Amazónica.jpeg",
      isBlockchain: true,
      address: "0xA8F5B2E7C3D9F1E4B7A2C5D8F3E6B9A2C5D8F3E6B"
    },
    {
      id: "mock-2",
      title: "Energía Solar para Comunidades",
      organization: "SolarTech",
      description:
        "Instalación de paneles solares en 5 comunidades rurales sin acceso a electricidad.",
      raised: 8500,
      goal: 20000,
      backers: 74,
      daysLeft: 21,
      image: "/img/campana/Energía Solar para Comunidades.jpg",
      isBlockchain: true,
      address: "0xB3F7E9A5C2D8F4B7E1A4C7D0F3B6E9A2C5D8F3E6B"
    }
  ], []);

  // Función para cargar campañas del blockchain
  const loadBlockchainCampaigns = useCallback(async () => {
    if (!isConnected || chainId !== 1287) {
      console.log("⚠️ Not connected to Moonbase Alpha, showing only mock campaigns");
      setAllCampaigns(mockCampaigns);
      return;
    }

    setIsLoading(true);
    try {
      console.log("🔗 Loading blockchain campaigns...");
      const blockchainCampaigns = await getAllCampaigns();
      
      // Convertir campañas blockchain al formato esperado
      const formattedBlockchainCampaigns: Campaign[] = blockchainCampaigns.map((campaign) => ({
        id: campaign.address,
        title: campaign.title,
        organization: campaign.organization || "Organización Blockchain",
        description: campaign.description,
        raised: parseFloat(campaign.raised),
        goal: parseFloat(campaign.goal),
        backers: campaign.backers || 0,
        daysLeft: Math.max(0, Math.floor((campaign.deadline - Date.now()) / (1000 * 60 * 60 * 24))),
        image: campaign.image || "/img/campana/blockchain-campaign.jpg",
        isBlockchain: true,
        address: campaign.address
      }));

      console.log(`✅ Loaded ${formattedBlockchainCampaigns.length} blockchain campaigns`);
      
      // Combinar campañas blockchain con mock campaigns
      // Las campañas blockchain aparecen primero
      setAllCampaigns([...formattedBlockchainCampaigns, ...mockCampaigns]);
      
    } catch (error) {
      console.error("❌ Error loading blockchain campaigns:", error);
      // Si hay error, mostrar solo las mock campaigns
      setAllCampaigns(mockCampaigns);
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, chainId, getAllCampaigns, mockCampaigns]);

  // Cargar campañas al montar el componente
  useEffect(() => {
    loadBlockchainCampaigns();
  }, [loadBlockchainCampaigns]);

  // Escuchar eventos de nuevas campañas
  useEffect(() => {
    const handleCampaignsUpdated = () => {
      console.log("🔄 Campaigns updated event received, reloading...");
      loadBlockchainCampaigns();
    };

    // Escuchar el evento personalizado que se dispara cuando se crea una nueva campaña
    window.addEventListener('campaignsUpdated', handleCampaignsUpdated);
    
    return () => {
      window.removeEventListener('campaignsUpdated', handleCampaignsUpdated);
    };
  }, [loadBlockchainCampaigns]);

  // Obtener campaña destacada (priorizar blockchain)
  const featuredCampaign = allCampaigns.find(c => c.featured) || allCampaigns[0];

  return (
    <main className="container mx-auto py-12 px-4 md:px-6">
      {/* Banner para campaña destacada */}
      {featuredCampaign && (
        <div className="mb-10 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 rounded-lg p-6 border border-blue-500/50">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3">
              <Image 
                src={featuredCampaign.image} 
                alt={featuredCampaign.title}
                width={500}
                height={300}
                className="w-full h-64 object-cover rounded-lg" 
              />
            </div>
            <div className="md:w-2/3 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  {featuredCampaign.featured && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">URGENTE</span>
                  )}
                  <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">DESTACADO</span>
                  {featuredCampaign.isBlockchain && (
                    <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">BLOCKCHAIN</span>
                  )}
                </div>
                <h2 className="text-2xl font-bold mb-2">{featuredCampaign.title}</h2>
                <p className="text-muted-foreground mb-4">{featuredCampaign.description}</p>
                
                {/* ✅ Mostrar información del contrato si es blockchain */}
                {featuredCampaign.isBlockchain && featuredCampaign.address && (
                  <div className="mb-4 p-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-md border border-purple-500/20">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Contrato:</span>
                      <div className="flex items-center gap-2">
                        <code className="text-sm font-mono bg-background px-2 py-1 rounded border">
                          {featuredCampaign.address.slice(0, 6)}...{featuredCampaign.address.slice(-4)}
                        </code>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 px-2 text-xs hover:bg-purple-500/20"
                          onClick={(e) => {
                            e.preventDefault();
                            navigator.clipboard.writeText(featuredCampaign.address!);
                          }}
                          title="Copiar dirección completa"
                        >
                          📋
                        </Button>
                        <a
                          href={`https://moonbase.moonscan.io/address/${featuredCampaign.address}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-purple-400 hover:text-purple-300"
                        >
                          Ver en Explorer ↗
                        </a>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex gap-4 mb-4">
                  <div>
                    <p className="text-lg font-bold">
                      {featuredCampaign.isBlockchain ? `${featuredCampaign.raised} DOT` : `$${featuredCampaign.raised.toLocaleString()}`}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      recaudados de {featuredCampaign.isBlockchain ? `${featuredCampaign.goal} DOT` : `$${featuredCampaign.goal.toLocaleString()}`}
                    </p>
                  </div>
                  <div>
                    <p className="text-lg font-bold">{featuredCampaign.backers}</p>
                    <p className="text-sm text-muted-foreground">donantes</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold">{featuredCampaign.daysLeft}</p>
                    <p className="text-sm text-muted-foreground">días restantes</p>
                  </div>
                </div>
              </div>
              <Button 
                asChild
                size="lg" 
                className="w-full md:w-auto"
              >
                <Link href={`/campaigns/${featuredCampaign.id}`}>
                  Donar Ahora
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Explora Campañas</h1>
          <p className="text-muted-foreground">
            Descubre proyectos innovadores y causas sociales que necesitan tu apoyo
          </p>
          {isConnected && chainId === 1287 && (
            <p className="text-sm text-green-600 mt-1">
              ✅ Conectado a Moonbase Alpha - Mostrando campañas del blockchain
            </p>
          )}
          {(!isConnected || chainId !== 1287) && (
            <p className="text-sm text-orange-600 mt-1">
              ⚠️ Conecta a Moonbase Alpha para ver campañas del blockchain
            </p>
          )}
        </div>
        <Button asChild>
          <Link href="/campaigns/create">Crear Campaña</Link>
        </Button>
      </div>

      {/* Filtros y búsqueda */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input placeholder="Buscar campañas..." className="pl-10" />
        </div>
        <div className="flex gap-4">
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las categorías</SelectItem>
              <SelectItem value="environment">Medio Ambiente</SelectItem>
              <SelectItem value="education">Educación</SelectItem>
              <SelectItem value="technology">Tecnología</SelectItem>
              <SelectItem value="social">Causas Sociales</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="newest">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Más recientes</SelectItem>
              <SelectItem value="popular">Más populares</SelectItem>
              <SelectItem value="funded">Mayor financiamiento</SelectItem>
              <SelectItem value="ending">Finalizan pronto</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Cargando campañas del blockchain...</p>
        </div>
      )}

      {/* Lista de campañas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {allCampaigns.map((campaign) => (
          <CampaignCard key={campaign.id} campaign={campaign} />
        ))}
      </div>

      {/* Empty state */}
      {!isLoading && allCampaigns.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold mb-2">No hay campañas disponibles</h3>
          <p className="text-muted-foreground mb-4">
            {!isConnected || chainId !== 1287 
              ? "Conecta tu wallet a Moonbase Alpha para ver campañas del blockchain"
              : "Sé el primero en crear una campaña"
            }
          </p>
          <Button asChild>
            <Link href="/campaigns/create">Crear Primera Campaña</Link>
          </Button>
        </div>
      )}
    </main>
  );
}