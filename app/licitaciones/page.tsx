"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

// Sample data for licitaciones
const licitacionesData = [
  {
    id: "1",
    title: "Adquisición de vehículos para la flota municipal",
    category: "Vehículos",
    deadline: "2025-04-15",
    budget: "450,000 DOT",
    description: "Licitación para la compra de 5 vehículos tipo SUV para uso oficial de la municipalidad. Se requieren vehículos nuevos, modelo 2025 con garantía extendida.",
    image: "/img/licitaciones/vehiculos.jpg",
    status: "Abierta"
  },
  {
    id: "2",
    title: "Suministro de materiales de limpieza para hospitales",
    category: "Suministros",
    deadline: "2025-03-30",
    budget: "120,000 DOT",
    description: "Adquisición de productos de limpieza, incluyendo lavandina, desinfectantes, jabón líquido y otros insumos para hospitales del distrito.",
    image: "/img/licitaciones/limpieza.jpg",
    status: "Abierta"
  },
  {
    id: "3",
    title: "Mantenimiento de infraestructura de agua potable",
    category: "Servicios",
    deadline: "2025-04-10",
    budget: "380,000 DOT",
    description: "Servicios de mantenimiento preventivo y correctivo para la red de distribución de agua potable, incluyendo sustitución de componentes dañados.",
    image: "/img/licitaciones/agua.jpg",
    status: "Abierta"
  },
  {
    id: "4",
    title: "Equipamiento informático para escuelas públicas",
    category: "Tecnología",
    deadline: "2025-05-01",
    budget: "250,000 DOT",
    description: "Provisión de computadoras, proyectores y equipamiento de red para 10 escuelas públicas del distrito. Incluye instalación y capacitación inicial.",
    image: "/img/licitaciones/informatica.jpg",
    status: "Abierta"
  },
  {
    id: "5",
    title: "Construcción de parque recreativo",
    category: "Construcción",
    deadline: "2025-04-22",
    budget: "780,000 DOT",
    description: "Licitación para la construcción de un parque recreativo de 2 hectáreas, incluyendo áreas verdes, juegos infantiles, canchas deportivas y mobiliario urbano.",
    image: "/img/licitaciones/parque.jpg",
    status: "Abierta"
  },
  {
    id: "6",
    title: "Servicio de catering para eventos municipales",
    category: "Servicios",
    deadline: "2025-03-25",
    budget: "85,000 DOT",
    description: "Contratación de servicios de catering para eventos oficiales durante el año 2025. Se requiere variedad de menús y atención para aproximadamente 15 eventos.",
    image: "/img/licitaciones/catering.jpg",
    status: "Cerrada"
  }
];

const categories = [
  "Todas",
  "Vehículos",
  "Suministros",
  "Servicios",
  "Tecnología",
  "Construcción"
];

export default function LicitacionesPage() {
  const [activeCategory, setActiveCategory] = useState("Todas");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredLicitaciones = licitacionesData.filter(item => {
    const matchesCategory = activeCategory === "Todas" || item.category === activeCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <main className="container py-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">Licitaciones Públicas</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Explora las licitaciones públicas disponibles. Todas las transacciones y procesos son 
          transparentes y verificables a través de blockchain.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full md:w-auto">
          <TabsList className="grid grid-cols-3 md:grid-cols-6 w-full md:w-auto">
            {categories.map((category) => (
              <TabsTrigger key={category} value={category}>
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        
        <div className="w-full md:w-1/3">
          <Input
            placeholder="Buscar licitaciones..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLicitaciones.map((licitacion) => (
          <Card key={licitacion.id} className="overflow-hidden border border-border/40 bg-background/80 backdrop-blur-md relative">
            <div className="absolute top-4 right-4 z-10">
              <Badge variant={licitacion.status === "Abierta" ? "default" : "secondary"}>
                {licitacion.status}
              </Badge>
            </div>
            <div className="relative h-48 w-full">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
              <div className="w-full h-full relative">
                {/* Placeholder image - in production these would be actual images */}
                <div className="w-full h-full bg-gradient-to-r from-skyblue/20 to-neonpink/20 flex items-center justify-center">
                  <span className="text-sm text-muted-foreground">{licitacion.category}</span>
                </div>
              </div>
            </div>
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge variant="outline">{licitacion.category}</Badge>
                <span className="text-sm text-muted-foreground">
                  Vence: {new Date(licitacion.deadline).toLocaleDateString()}
                </span>
              </div>
              <CardTitle className="line-clamp-2 mt-2">{licitacion.title}</CardTitle>
              <CardDescription className="line-clamp-2">
                {licitacion.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="font-semibold text-lg">{licitacion.budget}</div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" asChild>
                <Link href={`/licitaciones/${licitacion.id}`}>Ver detalles</Link>
              </Button>
              {licitacion.status === "Abierta" && (
                <Button className="bg-neonpink hover:bg-neonpink/80 transition-colors" asChild>
                  <Link href={`/licitaciones/${licitacion.id}/participar`}>Participar</Link>
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      {filteredLicitaciones.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium">No se encontraron licitaciones</h3>
          <p className="text-muted-foreground">
            Intenta con otros criterios de búsqueda o revisa más tarde
          </p>
        </div>
      )}
    </main>
  );
}
