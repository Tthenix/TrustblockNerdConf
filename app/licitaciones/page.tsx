"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Search, Calendar, DollarSign, Building, Truck, Wrench, Laptop, Hammer, ChefHat, Clock, MapPin, FileText } from "lucide-react";
import Link from "next/link";

// Sample data for licitaciones with enhanced details
const licitacionesData = [
	{
		id: "1",
		title: "Adquisición de vehículos para la flota municipal",
		category: "Vehículos",
		deadline: "2025-04-15",
		budget: "450,000 DOT",
		description:
			"Licitación para la compra de 5 vehículos tipo SUV para uso oficial de la municipalidad. Se requieren vehículos nuevos, modelo 2025 con garantía extendida.",
		location: "Municipalidad Central",
		bidders: 8,
		urgency: "Media",
		status: "Abierta",
	},
	{
		id: "2",
		title: "Suministro de materiales de limpieza para hospitales",
		category: "Suministros",
		deadline: "2025-03-30",
		budget: "120,000 DOT",
		description:
			"Adquisición de productos de limpieza, incluyendo lavandina, desinfectantes, jabón líquido y otros insumos para hospitales del distrito.",
		location: "Red Hospitalaria Provincial",
		bidders: 12,
		urgency: "Alta",
		status: "Abierta",
	},
	{
		id: "3",
		title: "Mantenimiento de infraestructura de agua potable",
		category: "Servicios",
		deadline: "2025-04-10",
		budget: "380,000 DOT",
		description:
			"Servicios de mantenimiento preventivo y correctivo para la red de distribución de agua potable, incluyendo sustitución de componentes dañados.",
		location: "Zona Norte y Centro",
		bidders: 6,
		urgency: "Alta",
		status: "Abierta",
	},
	{
		id: "4",
		title: "Equipamiento informático para escuelas públicas",
		category: "Tecnología",
		deadline: "2025-05-01",
		budget: "250,000 DOT",
		description:
			"Provisión de computadoras, proyectores y equipamiento de red para 10 escuelas públicas del distrito. Incluye instalación y capacitación inicial.",
		location: "Distrito Educativo #3",
		bidders: 15,
		urgency: "Media",
		status: "Abierta",
	},
	{
		id: "5",
		title: "Construcción de parque recreativo",
		category: "Construcción",
		deadline: "2025-04-22",
		budget: "780,000 DOT",
		description:
			"Licitación para la construcción de un parque recreativo de 2 hectáreas, incluyendo áreas verdes, juegos infantiles, canchas deportivas y mobiliario urbano.",
		location: "Barrio Las Flores",
		bidders: 4,
		urgency: "Baja",
		status: "Abierta",
	},
	{
		id: "6",
		title: "Servicio de catering para eventos municipales",
		category: "Servicios",
		deadline: "2025-03-25",
		budget: "85,000 DOT",
		description:
			"Contratación de servicios de catering para eventos oficiales durante el año 2025. Se requiere variedad de menús y atención para aproximadamente 15 eventos.",
		location: "Centro de Convenciones",
		bidders: 9,
		urgency: "Baja",
		status: "Cerrada",
	},
	{
		id: "7",
		title: "Modernización del sistema de semáforos",
		category: "Tecnología",
		deadline: "2025-05-15",
		budget: "320,000 DOT",
		description:
			"Actualización e instalación de semáforos inteligentes con tecnología LED y sistemas de control automatizado para mejorar el tráfico urbano.",
		location: "Avenida Principal",
		bidders: 7,
		urgency: "Media",
		status: "Abierta",
	},
	{
		id: "8",
		title: "Reparación de caminos rurales",
		category: "Construcción",
		deadline: "2025-04-05",
		budget: "540,000 DOT",
		description:
			"Bacheo, nivelación y mejoramiento de 15 km de caminos rurales para facilitar el acceso a zonas productivas del municipio.",
		location: "Zona Rural Sur",
		bidders: 5,
		urgency: "Alta",
		status: "Abierta",
	},
];

const categories = [
	"Todas",
	"Vehículos",
	"Suministros",
	"Servicios",
	"Tecnología",
	"Construcción",
];

const getCategoryIcon = (category: string) => {
	switch (category) {
		case "Vehículos":
			return <Truck className="h-5 w-5" />;
		case "Suministros":
			return <Building className="h-5 w-5" />;
		case "Servicios":
			return <Wrench className="h-5 w-5" />;
		case "Tecnología":
			return <Laptop className="h-5 w-5" />;
		case "Construcción":
			return <Hammer className="h-5 w-5" />;
		default:
			return <FileText className="h-5 w-5" />;
	}
};

const getUrgencyColor = (urgency: string) => {
	switch (urgency) {
		case "Alta":
			return "bg-red-500/10 text-red-600 border-red-500/20";
		case "Media":
			return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
		case "Baja":
			return "bg-green-500/10 text-green-600 border-green-500/20";
		default:
			return "bg-gray-500/10 text-gray-600 border-gray-500/20";
	}
};

const getDaysLeft = (deadline: string) => {
	const today = new Date();
	const deadlineDate = new Date(deadline);
	const diffTime = deadlineDate.getTime() - today.getTime();
	const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
	return diffDays;
};

export default function LicitacionesPage() {
	const [activeCategory, setActiveCategory] = useState("Todas");
	const [searchQuery, setSearchQuery] = useState("");

	const filteredLicitaciones = licitacionesData.filter((item) => {
		const matchesCategory =
			activeCategory === "Todas" || item.category === activeCategory;
		const matchesSearch =
			item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
			item.location.toLowerCase().includes(searchQuery.toLowerCase());
		return matchesCategory && matchesSearch;
	});

	return (
		<main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
			{/* Hero Section */}
			<div className="relative overflow-hidden bg-gradient-to-r from-darkblue via-darkblue/90 to-darkblue text-white">
				<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-skyblue/20 via-transparent to-neonpink/10"></div>
				<div className="relative container py-16 space-y-6">
					<div className="text-center space-y-4 max-w-4xl mx-auto">
						<div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-sm">
							<Building className="h-4 w-4" />
							Sistema de Licitaciones Transparente
						</div>
						<h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-skyblue to-neonpink bg-clip-text text-transparent">
							Licitaciones Públicas
						</h1>
						<p className="text-xl text-gray-200 max-w-3xl mx-auto">
							Explora las licitaciones públicas disponibles. Todas las
							transacciones y procesos son transparentes y verificables a través
							de blockchain, garantizando integridad total.
						</p>
						<div className="flex items-center justify-center gap-8 pt-4">
							<div className="text-center">
								<div className="text-2xl font-bold text-skyblue">
									{licitacionesData.filter((l) => l.status === "Abierta")
										.length}
								</div>
								<div className="text-sm text-gray-300">
									Licitaciones Activas
								</div>
							</div>
							<div className="text-center">
								<div className="text-2xl font-bold text-neonpink">
									{licitacionesData.reduce(
										(sum, l) => sum + l.bidders,
										0
									)}
								</div>
								<div className="text-sm text-gray-300">
									Participantes Totales
								</div>
							</div>
							<div className="text-center">
								<div className="text-2xl font-bold text-green-400">
									{licitacionesData.reduce(
										(sum, l) =>
											sum +
											parseInt(l.budget.replace(/[^\d]/g, "")),
										0
									).toLocaleString()}
								</div>
								<div className="text-sm text-gray-300">
									DOT en Licitaciones
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="container py-12 space-y-8">
				{/* Filters and Search */}
				<div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6">
					<div className="w-full lg:w-auto">
						<Tabs
							value={activeCategory}
							onValueChange={setActiveCategory}
							className="w-full"
						>
							<TabsList className="grid grid-cols-3 lg:grid-cols-6 w-full lg:w-auto bg-muted/50 p-1">
								{categories.map((category) => (
									<TabsTrigger
										key={category}
										value={category}
										className="data-[state=active]:bg-skyblue data-[state=active]:text-white transition-all"
									>
										{category}
									</TabsTrigger>
								))}
							</TabsList>
						</Tabs>
					</div>

					<div className="relative w-full lg:w-96">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
						<Input
							placeholder="Buscar por título, descripción o ubicación..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="pl-10 bg-background/80 border-border/50 focus:border-skyblue transition-colors"
						/>
					</div>
				</div>

				{/* Licitaciones Grid */}
				<div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
					{filteredLicitaciones.map((licitacion) => {
						const daysLeft = getDaysLeft(licitacion.deadline);
						return (
							<Card
								key={licitacion.id}
								className="group overflow-hidden border border-border/40 bg-card/80 backdrop-blur-md hover:shadow-xl hover:shadow-skyblue/10 transition-all duration-300 hover:-translate-y-1"
							>
								<div className="relative">
									{/* Status Badge */}
									<div className="absolute top-4 right-4 z-10">
										<Badge
											variant={
												licitacion.status === "Abierta"
													? "default"
													: "secondary"
											}
											className={
												licitacion.status === "Abierta"
													? "bg-green-500 hover:bg-green-600"
													: ""
											}
										>
											{licitacion.status}
										</Badge>
									</div>

									{/* Urgency Badge */}
									<div className="absolute top-4 left-4 z-10">
										<Badge
											variant="outline"
											className={getUrgencyColor(licitacion.urgency)}
										>
											{licitacion.urgency}
										</Badge>
									</div>

									{/* Image/Category Section */}
									<div className="relative h-48 w-full bg-gradient-to-br from-skyblue/20 via-neonpink/10 to-darkblue/20 flex flex-col items-center justify-center">
										<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
										<div className="relative z-10 text-center text-white">
											<div className="mb-2 p-3 bg-white/20 backdrop-blur-sm rounded-full inline-flex">
												{getCategoryIcon(licitacion.category)}
											</div>
											<span className="text-sm font-medium">
												{licitacion.category}
											</span>
										</div>
									</div>
								</div>

								<CardHeader className="space-y-3">
									<div className="flex items-center justify-between text-sm text-muted-foreground">
										<div className="flex items-center gap-1">
											<Calendar className="h-4 w-4" />
											<span>
												{daysLeft > 0
													? `${daysLeft} días restantes`
													: "Vencida"}
											</span>
										</div>
										<div className="flex items-center gap-1">
											<MapPin className="h-4 w-4" />
											<span className="truncate max-w-[120px]">
												{licitacion.location}
											</span>
										</div>
									</div>

									<CardTitle className="line-clamp-2 group-hover:text-skyblue transition-colors">
										{licitacion.title}
									</CardTitle>

									<CardDescription className="line-clamp-3 text-sm">
										{licitacion.description}
									</CardDescription>
								</CardHeader>

								<CardContent className="space-y-4">
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-2">
											<DollarSign className="h-4 w-4 text-green-600" />
											<span className="font-bold text-lg text-green-600">
												{licitacion.budget}
											</span>
										</div>
										<div className="text-right">
											<div className="text-sm text-muted-foreground">
												Participantes
											</div>
											<div className="font-semibold text-skyblue">
												{licitacion.bidders}
											</div>
										</div>
									</div>

									{daysLeft <= 7 && daysLeft > 0 && (
										<div className="flex items-center gap-2 p-2 bg-red-500/10 border border-red-500/20 rounded-lg">
											<Clock className="h-4 w-4 text-red-600" />
											<span className="text-sm text-red-600 font-medium">
												¡Solo quedan {daysLeft} días!
											</span>
										</div>
									)}
								</CardContent>

								<CardFooter className="flex gap-3 pt-0">
									<Button
										variant="outline"
										asChild
										className="flex-1 border-skyblue/30 hover:bg-skyblue/10"
									>
										<Link href={`/licitaciones/${licitacion.id}`}>
											<FileText className="h-4 w-4 mr-2" />
											Ver detalles
										</Link>
									</Button>
									{licitacion.status === "Abierta" && (
										<Button
											className="flex-1 bg-gradient-to-r from-neonpink to-neonpink/80 hover:from-neonpink/90 hover:to-neonpink/70 transition-all"
											asChild
										>
											<Link href={`/licitaciones/${licitacion.id}/participar`}>
												Participar
											</Link>
										</Button>
									)}
								</CardFooter>
							</Card>
						);
					})}
				</div>

				{/* No Results State */}
				{filteredLicitaciones.length === 0 && (
					<div className="text-center py-16 space-y-4">
						<div className="mx-auto w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center">
							<Search className="h-8 w-8 text-muted-foreground" />
						</div>
						<h3 className="text-2xl font-semibold">No se encontraron licitaciones</h3>
						<p className="text-muted-foreground max-w-md mx-auto">
							Intenta con otros criterios de búsqueda o revisa más tarde para ver
							nuevas oportunidades
						</p>
						<Button
							onClick={() => {
								setSearchQuery("");
								setActiveCategory("Todas");
							}}
							variant="outline"
							className="mt-4"
						>
							Limpiar filtros
						</Button>
					</div>
				)}

				{/* Info Section */}
				<div className="mt-16 bg-gradient-to-r from-skyblue/10 via-neonpink/5 to-darkblue/10 rounded-2xl p-8 border border-border/30">
					<div className="text-center space-y-4">
						<h3 className="text-2xl font-bold">Transparencia Garantizada</h3>
						<p className="text-muted-foreground max-w-2xl mx-auto">
							Todas las licitaciones en TrustBlock utilizan tecnología blockchain
							para garantizar transparencia total en el proceso. Cada participación y
							decisión queda registrada de forma inmutable y verificable.
						</p>
						<div className="flex flex-wrap justify-center gap-4 pt-4">
							<Badge
								variant="outline"
								className="border-skyblue/30 text-skyblue"
							>
								<Building className="h-3 w-3 mr-1" />
								Procesos Públicos
							</Badge>
							<Badge
								variant="outline"
								className="border-neonpink/30 text-neonpink"
							>
								<FileText className="h-3 w-3 mr-1" />
								Documentación Completa
							</Badge>
							<Badge
								variant="outline"
								className="border-green-500/30 text-green-600"
							>
								<DollarSign className="h-3 w-3 mr-1" />
								Pagos Verificables
							</Badge>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
}
