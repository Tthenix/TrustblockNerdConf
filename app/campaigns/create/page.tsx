"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { VerificationStatus } from "@/components/verification-status"
import { RewardForm } from "@/components/reward-form"
import { Upload, Target, Award, Info } from "lucide-react"
import { toast } from "sonner"

export default function CreateCampaignPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isVerified, setIsVerified] = useState(false)

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 4))
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1))
  
  const handleCreateCampaign = () => {
    // Simulación de creación de campaña (aquí iría la lógica real)
    setTimeout(() => {
      // Mostrar toast de éxito con mejor estilo
      toast.success("¡Campaña creada con éxito!", {
        description: "Tu campaña ha sido creada y está lista para recibir donaciones.",
        style: {
          background: "hsl(222, 13%, 14%)", // Mismo color de fondo que la página
          border: "1px solid hsla(190, 95%, 39%, 0.4)",
          color: "white",
          fontWeight: "500", // Texto más claro y legible
        },
        descriptionClassName: "!text-white", // Forzar color blanco
        icon: "✓",
      })
      
      // Redireccionar al inicio
      router.push("/")
    }, 1000) // Simular tiempo de procesamiento
  }

  return (
    <main className="container mx-auto py-12 px-4 md:px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Crear Nueva Campaña</h1>
        <p className="text-muted-foreground mb-8">Completa la información para lanzar tu campaña de crowdfunding</p>

        <div className="mb-8">
          <div className="flex items-center justify-between relative">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col items-center z-10">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                    step >= i
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background border-muted-foreground"
                  }`}
                >
                  {i}
                </div>
                <span className="text-xs mt-2 text-muted-foreground">
                  {i === 1 && "Verificación"}
                  {i === 2 && "Información"}
                  {i === 3 && "Detalles"}
                  {i === 4 && "Recompensas"}
                </span>
              </div>
            ))}
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-muted -z-0"></div>
          </div>
        </div>

        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5 text-primary" />
                Verificación de Identidad
              </CardTitle>
              <CardDescription>
                Para garantizar la confianza en la plataforma, necesitamos verificar tu identidad o la de tu
                organización
              </CardDescription>
            </CardHeader>
            <CardContent>
              <VerificationStatus isVerified={isVerified} onVerify={() => setIsVerified(true)} />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" disabled>
                Anterior
              </Button>
              <Button onClick={nextStep} disabled={!isVerified}>
                Siguiente
              </Button>
            </CardFooter>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5 text-primary" />
                Información Básica
              </CardTitle>
              <CardDescription>Proporciona la información principal de tu campaña</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título de la Campaña</Label>
                  <Input id="title" placeholder="Ej: Reforestación Amazónica" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="organization">Nombre de la Organización</Label>
                  <Input id="organization" placeholder="Ej: EcoFuturo ONG" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Categoría</Label>
                  <Select defaultValue="environment">
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="environment">Medio Ambiente</SelectItem>
                      <SelectItem value="education">Educación</SelectItem>
                      <SelectItem value="technology">Tecnología</SelectItem>
                      <SelectItem value="social">Causas Sociales</SelectItem>
                      <SelectItem value="health">Salud</SelectItem>
                      <SelectItem value="art">Arte y Cultura</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Ubicación</Label>
                  <Input id="location" placeholder="Ej: Amazonía, Brasil" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Sitio Web (opcional)</Label>
                  <Input id="website" placeholder="https://tuorganizacion.org" />
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={prevStep}>
                Anterior
              </Button>
              <Button onClick={nextStep}>Siguiente</Button>
            </CardFooter>
          </Card>
        )}

        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Detalles de la Campaña
              </CardTitle>
              <CardDescription>Define los objetivos y detalles de tu campaña</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe detalladamente tu proyecto y cómo se utilizarán los fondos..."
                    rows={5}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="goal">Meta de Financiamiento (DOT)</Label>
                    <Input id="goal" type="number" min="1" placeholder="Ej: 25000" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duration">Duración (días)</Label>
                    <Input id="duration" type="number" min="1" max="90" placeholder="Ej: 30" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Imagen Principal</Label>
                  <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Arrastra una imagen o haz clic para seleccionar</p>
                    <p className="text-xs text-muted-foreground mt-1">PNG, JPG o GIF (max. 5MB)</p>
                    <Input id="image" type="file" className="hidden" />
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={prevStep}>
                Anterior
              </Button>
              <Button onClick={nextStep}>Siguiente</Button>
            </CardFooter>
          </Card>
        )}

        {step === 4 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                Recompensas (Opcional)
              </CardTitle>
              <CardDescription>Añade recompensas para incentivar las donaciones</CardDescription>
            </CardHeader>
            <CardContent>
              <RewardForm />

              <div className="mt-8 p-4 bg-muted rounded-lg">
                <h3 className="font-medium mb-2">Recompensas Añadidas</h3>
                <p className="text-sm text-muted-foreground">
                  No has añadido ninguna recompensa aún. Las recompensas son opcionales pero pueden aumentar
                  significativamente las donaciones.
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={prevStep}>
                Anterior
              </Button>
              <Button onClick={handleCreateCampaign}>Crear Campaña</Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </main>
  )
}
