"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Users, Wallet, LineChart } from "lucide-react";
import { HeroSection } from "@/components/hero-section";
import { FeatureCard } from "@/components/feature-card";
import { CampaignCard } from "@/components/campaign-card";

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
  verified?: boolean;
  category?: string;
  location?: string;
  website?: string;
}

export default function Home() {
  const [allCampaigns, setAllCampaigns] = useState<Campaign[]>([]);  const loadCampaigns = () => {
    // Datos de ejemplo hardcodeados
    const featuredCampaigns = [
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
        featured: true
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
    ];

    // Obtener campañas del localStorage
    const savedCampaigns = JSON.parse(localStorage.getItem("campaigns") || "[]");
    
    // Obtener donaciones adicionales para campañas hardcodeadas
    const hardcodedDonations = JSON.parse(localStorage.getItem("hardcodedCampaignDonations") || "{}");
    
    // Actualizar campañas hardcodeadas con donaciones adicionales
    const updatedFeaturedCampaigns = featuredCampaigns.map(campaign => {
      const donations = hardcodedDonations[campaign.id];
      if (donations) {
        return {
          ...campaign,
          raised: campaign.raised + donations.raised,
          backers: campaign.backers + donations.backers
        };
      }
      return campaign;
    });
    
    // Combinar campañas guardadas primero (más recientes) con las hardcodeadas actualizadas
    const combinedCampaigns = [...savedCampaigns, ...updatedFeaturedCampaigns];
    
    // Tomar solo las primeras 6 para mostrar en el home
    setAllCampaigns(combinedCampaigns.slice(0, 6));
  };

  useEffect(() => {
    loadCampaigns();

    // Escuchar cambios en localStorage para actualizar automáticamente
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'campaigns') {
        loadCampaigns();
      }
    };

    // Escuchar eventos de storage para cambios desde otras pestañas
    window.addEventListener('storage', handleStorageChange);

    // Escuchar evento customizado para cambios en la misma pestaña
    const handleCustomStorageChange = () => {
      loadCampaigns();
    };
    window.addEventListener('campaignsUpdated', handleCustomStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('campaignsUpdated', handleCustomStorageChange);
    };
  }, []);

  return (
    <main className="flex min-h-screen flex-col">
      <HeroSection />

      {/* Sección de características */}
      <section className="py-16 px-4 md:px-6 bg-gradient-to-b from-background to-background/95">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">
            ¿Cómo funciona TrustBlock?
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-3xl mx-auto">
            Resolvemos el problema de la desconfianza en las donaciones. Muchas personas dudan en donar
            porque no saben si sus fondos llegarán al destino correcto. TrustBlock usa tecnología avanzada 
            de Polkadot que garantiza que cada donación sea rastreable, verificable y segura.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<Shield className="h-10 w-10" />}
              title="Identidad Verificada"
              description="Verificamos la identidad real de cada organización, garantizando que son quienes dicen ser antes de poder recaudar fondos."
            />
            <FeatureCard
              icon={<Users className="h-10 w-10" />}
              title="Total Transparencia"
              description="Podrás ver exactamente cómo se utiliza cada peso donado, con informes detallados y actualizaciones en tiempo real."
            />
            <FeatureCard
              icon={<Wallet className="h-10 w-10" />}
              title="Donaciones Seguras"
              description="Utilizamos la red Polkadot para procesar donaciones, ofreciendo máxima seguridad y mínimas comisiones."
            />
            <FeatureCard
              icon={<LineChart className="h-10 w-10" />}
              title="Seguimiento Completo"
              description="Cada centavo es rastreable desde el momento de la donación hasta su uso final en el proyecto que apoyas."
            />
          </div>
        </div>
      </section>

      {/* Sección de campañas destacadas */}
      <section className="py-16 px-4 md:px-6 bg-gradient-to-b from-background/95 to-background">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Campañas Destacadas</h2>
            <Link href="/campaigns" passHref>
              <Button
                variant="outline"
                className="flex items-center gap-2 border-skyblue/30 hover:bg-skyblue/10 transition-colors"
              >
                Ver todas <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allCampaigns.map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        </div>
      </section>

      {/* Sección CTA */}
      <section className="py-16 px-4 md:px-6 bg-gradient-to-br from-darkblue via-darkblue to-darkblue/90 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-neonpink/20 via-transparent to-transparent"></div>
        <div className="container mx-auto text-center relative z-10">
          <h2 className="text-3xl font-bold mb-4">
            ¿Listo para impulsar tu proyecto?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-gray-300">
            Únete a TrustBlock y haz crecer tu empresa, startup o proyecto con el respaldo de nuestra 
            plataforma de confianza. Comienza a recaudar fondos de manera transparente, 
            atrayendo inversores que pueden ver en tiempo real el progreso y utilización de sus contribuciones.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-neonpink hover:bg-neonpink/80 text-white transition-colors hover-scale"
            >
              <Link href="/campaigns/create">
                Crear Campaña
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-skyblue/50 text-skyblue hover:bg-skyblue/10 hover:text-skyblue transition-colors"
            >
              <Link href="/campaigns">
                Explorar Proyectos
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
