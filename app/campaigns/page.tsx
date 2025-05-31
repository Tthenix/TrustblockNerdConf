"use client";

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

export default function CampaignsPage() {
  // Datos de ejemplo para campañas
  const campaigns = [
    {
      id: "0",
      title: "Ayuda Urgente: Inundaciones en Bahía Blanca",
      organization: "Cruz Roja Argentina",
      description:
        "Campaña de emergencia para asistir a las familias afectadas por las graves inundaciones en Bahía Blanca y zonas aledañas.",
      raised: 8500,
      goal: 50000,
      backers: 106,
      daysLeft: 10,
      image: "/img/campana/52242f9a-f563-4e47-b21a-83ef501c00e6.jpeg",
      featured: true // Marcada como destacada
    },
    {
      id: "1",
      title: "Reforestación Amazónica",
      organization: "EcoFuturo ONG",
      description:
        "Proyecto para plantar 10,000 árboles nativos en zonas deforestadas de la Amazonía.",
      raised: 15000,
      goal: 25000,
      backers: 128,
      daysLeft: 15,
      image: "/img/campana/Reforestación Amazónica.jpeg",
    },
    {
      id: "2",
      title: "Energía Solar para Comunidades",
      organization: "SolarTech",
      description:
        "Instalación de paneles solares en 5 comunidades rurales sin acceso a electricidad.",
      raised: 8500,
      goal: 20000,
      backers: 74,
      daysLeft: 21,
      image: "/img/campana/Energía Solar para Comunidades.jpg",
    },
    {
      id: "3",
      title: "Educación Digital Inclusiva",
      organization: "FuturoDigital",
      description:
        "Programa de capacitación en tecnología para jóvenes de bajos recursos.",
      raised: 12000,
      goal: 15000,
      backers: 95,
      daysLeft: 7,
      image: "/img/campana/Educación Digital Inclusiva.jpg",
    },
    {
      id: "4",
      title: "Agua Potable para Todos",
      organization: "AguaVida",
      description:
        "Construcción de pozos de agua potable en comunidades rurales sin acceso a agua limpia.",
      raised: 5000,
      goal: 12000,
      backers: 42,
      daysLeft: 30,
      image: "/img/campana/Agua Potable para Todos.jpg",
    },
    {
      id: "5",
      title: "Emprendimiento Juvenil",
      organization: "FuturoJoven",
      description:
        "Programa de mentoría y financiamiento para jóvenes emprendedores en zonas vulnerables.",
      raised: 7500,
      goal: 10000,
      backers: 63,
      daysLeft: 12,
      image: "/img/campana/Emprendimiento Juvenil.jpg",
    },
    {
      id: "6",
      title: "Conservación Marina",
      organization: "OcéanoVivo",
      description:
        "Proyecto para la limpieza y conservación de arrecifes de coral en peligro.",
      raised: 18000,
      goal: 30000,
      backers: 152,
      daysLeft: 25,
      image: "/img/campana/Conservación Marina.jpg",
    },
  ];

  return (
    <main className="container mx-auto py-12 px-4 md:px-6">
      {/* Banner para campaña destacada */}
      {campaigns.find(c => c.featured) && (
        <div className="mb-10 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 rounded-lg p-6 border border-blue-500/50">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3">
              <Image 
                src={campaigns.find(c => c.featured)?.image || ""} 
                alt={campaigns.find(c => c.featured)?.title || "Campaña destacada"}
                width={500}
                height={300}
                className="w-full h-64 object-cover rounded-lg" 
              />
            </div>
            <div className="md:w-2/3 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">URGENTE</span>
                  <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">DESTACADO</span>
                </div>
                <h2 className="text-2xl font-bold mb-2">{campaigns.find(c => c.featured)?.title}</h2>
                <p className="text-muted-foreground mb-4">{campaigns.find(c => c.featured)?.description}</p>
                <div className="flex gap-4 mb-4">
                  <div>
                    <p className="text-lg font-bold">${campaigns.find(c => c.featured)?.raised.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">recaudados de ${campaigns.find(c => c.featured)?.goal.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold">{campaigns.find(c => c.featured)?.backers}</p>
                    <p className="text-sm text-muted-foreground">donantes</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold">{campaigns.find(c => c.featured)?.daysLeft}</p>
                    <p className="text-sm text-muted-foreground">días restantes</p>
                  </div>
                </div>
              </div>
              <Button 
                asChild
                size="lg" 
                className="w-full md:w-auto"
              >
                <Link href={`/campaigns/${campaigns.find(c => c.featured)?.id}`}>
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
            Descubre proyectos innovadores y causas sociales que necesitan tu
            apoyo
          </p>
        </div>
        <Button>Crear Campaña</Button>
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

      {/* Lista de campañas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {campaigns.map((campaign) => (
          <CampaignCard key={campaign.id} campaign={campaign} />
        ))}
      </div>
    </main>
  );
}
