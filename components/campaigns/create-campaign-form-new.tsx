// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Label } from "@/components/ui/label";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
// import { VerificationStatus } from "@/components/verification-status";
// import { RewardForm } from "@/components/reward-form";
// import { Upload, Target, Award, Info } from "lucide-react";
// import { toast } from "sonner";
// import { useContracts } from "@/hooks/useContracts";
// import { useWeb3 } from "@/components/providers/web3-provider";
// import Image from "next/image";

// interface StoredCampaign {
//   id: string;
//   title: string;
//   organization: string;
//   description: string;
//   goal: number;
//   image: string;
//   category: string;
//   location: string;
//   website: string;
// }

// export function CreateCampaignForm() {
//   const router = useRouter();
//   const [step, setStep] = useState(1);
//   const [isVerified, setIsVerified] = useState(false);
  
//   // Form states
//   const [title, setTitle] = useState("");
//   const [organization, setOrganization] = useState("");
//   const [description, setDescription] = useState("");
//   const [targetAmount, setTargetAmount] = useState("");
//   const [duration, setDuration] = useState("");
//   const [category, setCategory] = useState("");
//   const [location, setLocation] = useState("");
//   const [website, setWebsite] = useState("");
//   const [image, setImage] = useState("");
//   const [imageFile, setImageFile] = useState<File | null>(null);
//   const [isLoading, setIsLoading] = useState(false);
  
//   const { createCampaign, isConnected } = useContracts();
//   const { connectWallet, account } = useWeb3();

//   const nextStep = () => setStep((prev) => Math.min(prev + 1, 4));
//   const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

//   const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setImageFile(file);
      
//       // Convertir la imagen a base64 para almacenarla
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         const base64String = e.target?.result as string;
//         setImage(base64String);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleCreateCampaign = async () => {
//     if (!isConnected) {
//       await connectWallet();
//       return;
//     }

//     if (!title || !description || !targetAmount || !duration) {
//       toast.error("Error", {
//         description: "Por favor completa todos los campos obligatorios",
//         style: {
//           background: "hsl(222, 13%, 14%)",
//           border: "1px solid hsla(326, 100%, 74%, 0.4)",
//           color: "white",
//           fontWeight: "500",
//         },
//         descriptionClassName: "!text-white",
//         icon: "✕",
//       });
//       return;
//     }

//     setIsLoading(true);
//     try {
//       const txHash = await createCampaign(
//         title,
//         description,
//         targetAmount,
//         parseInt(duration)
//       );

//       // Generar un id único para la campaña
//       const campaigns: StoredCampaign[] = JSON.parse(localStorage.getItem("campaigns") || "[]");
//       const maxId = Math.max(
//         ...campaigns.map((c: StoredCampaign) => parseInt(c.id) || 0),
//         9 // Las campañas hardcodeadas usan IDs del 0-9
//       );
//       const newId = (maxId + 1).toString();
      
//       // Crear la campaña con todos los campos necesarios
//       const newCampaign = {
//         id: newId,
//         title,
//         organization: organization || "Organización Desconocida",
//         description,
//         raised: 0,
//         goal: Number(targetAmount),
//         backers: 0,
//         daysLeft: Number(duration),
//         image: image || "/api/placeholder/600/400",
//         featured: false,
//         verified: true, // Si pasó la verificación
//         category: category || "Sin Categoría",
//         location: location || "Ubicación no especificada",
//         website: website || "",
//         txHash,
//         createdAt: new Date().toISOString(),
//         account,
//         rewards: [
//           {
//             id: "1",
//             title: "Certificado Digital",
//             description: "NFT que certifica tu contribución a la campaña",
//             minDonation: 10,
//             claimed: 0,
//           },
//           {
//             id: "2",
//             title: "Donante Destacado",
//             description: "Reconocimiento en el informe final de la campaña y certificado especial",
//             minDonation: 100,
//             claimed: 0,
//           },
//           {
//             id: "3",
//             title: "Patrocinador Oficial",
//             description: "Reconocimiento prominente, certificado especial y participación en el evento de cierre",
//             minDonation: 500,
//             claimed: 0,
//           },
//         ],
//         updates: [],
//         transactions: [],
//       };

//       campaigns.push(newCampaign);
//       localStorage.setItem("campaigns", JSON.stringify(campaigns));
      
//       // Disparar evento para actualizar la UI
//       window.dispatchEvent(new CustomEvent('campaignsUpdated'));
      
//       toast.success("¡Campaña creada con éxito!", {
//         description: "Tu campaña ha sido creada y está lista para recibir donaciones.",
//         style: {
//           background: "hsl(222, 13%, 14%)",
//           border: "1px solid hsla(190, 95%, 39%, 0.4)",
//           color: "white",
//           fontWeight: "500",
//         },
//         descriptionClassName: "!text-white",
//         icon: "✓",
//       });
      
//       // Redireccionar al inicio
//       setTimeout(() => {
//         router.push("/");
//       }, 2000);
//     } catch (error: unknown) {
//       console.error("Error:", error);
      
//       let errorMessage = "Error al crear la campaña. Por favor intenta de nuevo.";
      
//       if (error instanceof Error) {
//         if (error.message?.includes("User rejected")) {
//           errorMessage = "Transacción cancelada por el usuario.";
//         } else if (error.message?.includes("Wallet not connected")) {
//           errorMessage = "Wallet no conectada. Por favor conecta tu wallet.";
//         } else if (error.message?.includes("insufficient funds")) {
//           errorMessage = "Fondos insuficientes para pagar el gas de la transacción.";
//         }
//       }
      
//       toast.error("Error al crear campaña", {
//         description: errorMessage,
//         style: {
//           background: "hsl(222, 13%, 14%)",
//           border: "1px solid hsla(326, 100%, 74%, 0.4)",
//           color: "white",
//           fontWeight: "500",
//         },
//         descriptionClassName: "!text-white",
//         icon: "✕",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <main className="container mx-auto py-12 px-4 md:px-6">
//       <div className="max-w-3xl mx-auto">
//         <h1 className="text-3xl font-bold mb-2">Crear Nueva Campaña</h1>
//         <p className="text-muted-foreground mb-8">Completa la información para lanzar tu campaña de crowdfunding</p>

//         <div className="mb-8">
//           <div className="flex items-center justify-between relative">
//             {[1, 2, 3, 4].map((i) => (
//               <div key={i} className="flex flex-col items-center z-10">
//                 <div
//                   className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
//                     step >= i
//                       ? "bg-primary text-primary-foreground border-primary"
//                       : "bg-background border-muted-foreground"
//                   }`}
//                 >
//                   {i}
//                 </div>
//                 <span className="text-xs mt-2 text-muted-foreground">
//                   {i === 1 && "Verificación"}
//                   {i === 2 && "Información"}
//                   {i === 3 && "Detalles"}
//                   {i === 4 && "Recompensas"}
//                 </span>
//               </div>
//             ))}
//             <div className="absolute top-5 left-0 right-0 h-0.5 bg-muted -z-0"></div>
//           </div>
//         </div>

//         {step === 1 && (
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <Info className="h-5 w-5 text-primary" />
//                 Verificación de Identidad
//               </CardTitle>
//               <CardDescription>
//                 Para garantizar la confianza en la plataforma, necesitamos verificar tu identidad o la de tu
//                 organización
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <VerificationStatus isVerified={isVerified} onVerify={() => setIsVerified(true)} />
//             </CardContent>
//             <CardFooter className="flex justify-between">
//               <Button variant="outline" disabled>
//                 Anterior
//               </Button>
//               <Button onClick={nextStep} disabled={!isVerified}>
//                 Siguiente
//               </Button>
//             </CardFooter>
//           </Card>
//         )}

//         {step === 2 && (
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <Info className="h-5 w-5 text-primary" />
//                 Información Básica
//               </CardTitle>
//               <CardDescription>Proporciona la información principal de tu campaña</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <form className="space-y-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="title">Título de la Campaña</Label>
//                   <Input 
//                     id="title" 
//                     placeholder="Ej: Reforestación Amazónica" 
//                     value={title}
//                     onChange={(e) => setTitle(e.target.value)}
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="organization">Nombre de la Organización</Label>
//                   <Input 
//                     id="organization" 
//                     placeholder="Ej: EcoFuturo ONG" 
//                     value={organization}
//                     onChange={(e) => setOrganization(e.target.value)}
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="category">Categoría</Label>
//                   <Select value={category} onValueChange={setCategory}>
//                     <SelectTrigger>
//                       <SelectValue placeholder="Selecciona una categoría" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="environment">Medio Ambiente</SelectItem>
//                       <SelectItem value="education">Educación</SelectItem>
//                       <SelectItem value="technology">Tecnología</SelectItem>
//                       <SelectItem value="social">Causas Sociales</SelectItem>
//                       <SelectItem value="health">Salud</SelectItem>
//                       <SelectItem value="art">Arte y Cultura</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="location">Ubicación</Label>
//                   <Input 
//                     id="location" 
//                     placeholder="Ej: Amazonía, Brasil" 
//                     value={location}
//                     onChange={(e) => setLocation(e.target.value)}
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="website">Sitio Web (opcional)</Label>
//                   <Input 
//                     id="website" 
//                     placeholder="https://tuorganizacion.org" 
//                     value={website}
//                     onChange={(e) => setWebsite(e.target.value)}
//                   />
//                 </div>
//               </form>
//             </CardContent>
//             <CardFooter className="flex justify-between">
//               <Button variant="outline" onClick={prevStep}>
//                 Anterior
//               </Button>
//               <Button onClick={nextStep}>Siguiente</Button>
//             </CardFooter>
//           </Card>
//         )}

//         {step === 3 && (
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <Target className="h-5 w-5 text-primary" />
//                 Detalles de la Campaña
//               </CardTitle>
//               <CardDescription>Define los objetivos y detalles de tu campaña</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <form className="space-y-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="description">Descripción</Label>
//                   <Textarea
//                     id="description"
//                     placeholder="Describe detalladamente tu proyecto y cómo se utilizarán los fondos..."
//                     rows={5}
//                     value={description}
//                     onChange={(e) => setDescription(e.target.value)}
//                   />
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="goal">Meta de Financiamiento (DOT)</Label>
//                     <Input 
//                       id="goal" 
//                       type="number" 
//                       min="1" 
//                       placeholder="Ej: 25000" 
//                       value={targetAmount}
//                       onChange={(e) => setTargetAmount(e.target.value)}
//                     />
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="duration">Duración (días)</Label>
//                     <Input 
//                       id="duration" 
//                       type="number" 
//                       min="1" 
//                       max="90" 
//                       placeholder="Ej: 30" 
//                       value={duration}
//                       onChange={(e) => setDuration(e.target.value)}
//                     />
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <Label>Imagen Principal</Label>
//                   <div className="space-y-3">
//                     <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors">
//                       <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
//                       <p className="text-sm text-muted-foreground">Arrastra una imagen o haz clic para seleccionar</p>
//                       <p className="text-xs text-muted-foreground mt-1">PNG, JPG o GIF (max. 5MB)</p>
//                       <Input 
//                         type="file" 
//                         className="hidden" 
//                         accept="image/*"
//                         onChange={handleImageFileChange}
//                       />
//                     </div>
                    
//                     <div className="flex items-center space-x-2">
//                       <div className="flex-1 h-px bg-border"></div>
//                       <span className="text-xs text-muted-foreground">O</span>
//                       <div className="flex-1 h-px bg-border"></div>
//                     </div>
                    
//                     <div>
//                       <Input
//                         type="url"
//                         value={imageFile ? "" : image}
//                         onChange={(e) => {
//                           if (!imageFile) {
//                             setImage(e.target.value);
//                           }
//                         }}
//                         placeholder="https://ejemplo.com/imagen.jpg"
//                         disabled={!!imageFile}
//                       />
//                     </div>
//                   </div>

//                   {image && (
//                     <div className="mt-3">
//                       <p className="text-sm text-muted-foreground mb-2">Vista previa:</p>
//                       <Image 
//                         src={image} 
//                         alt="Vista previa" 
//                         width={400}
//                         height={192}
//                         className="w-full max-w-md h-48 object-cover rounded-lg border"
//                         onError={(e) => {
//                           (e.target as HTMLImageElement).style.display = 'none';
//                         }}
//                       />
//                       {imageFile && (
//                         <Button
//                           type="button"
//                           variant="outline"
//                           size="sm"
//                           className="mt-2"
//                           onClick={() => {
//                             setImageFile(null);
//                             setImage("");
//                           }}
//                         >
//                           Quitar imagen
//                         </Button>
//                       )}
//                     </div>
//                   )}
//                 </div>
//               </form>
//             </CardContent>
//             <CardFooter className="flex justify-between">
//               <Button variant="outline" onClick={prevStep}>
//                 Anterior
//               </Button>
//               <Button onClick={nextStep}>Siguiente</Button>
//             </CardFooter>
//           </Card>
//         )}

//         {step === 4 && (
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <Award className="h-5 w-5 text-primary" />
//                 Recompensas (Opcional)
//               </CardTitle>
//               <CardDescription>Añade recompensas para incentivar las donaciones</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <RewardForm />

//               <div className="mt-8 p-4 bg-muted rounded-lg">
//                 <h3 className="font-medium mb-2">Recompensas Añadidas</h3>
//                 <p className="text-sm text-muted-foreground">
//                   No has añadido ninguna recompensa aún. Las recompensas son opcionales pero pueden aumentar
//                   significativamente las donaciones.
//                 </p>
//               </div>
//             </CardContent>
//             <CardFooter className="flex justify-between">
//               <Button variant="outline" onClick={prevStep}>
//                 Anterior
//               </Button>
//               <Button 
//                 onClick={handleCreateCampaign} 
//                 disabled={isLoading || !isConnected}
//               >
//                 {isLoading ? "Creando Campaña..." : "Crear Campaña"}
//               </Button>
//             </CardFooter>
//           </Card>
//         )}
//       </div>
//     </main>
//   );
// }
