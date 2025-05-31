"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, CheckCircle, AlertCircle, Clock } from "lucide-react"

interface VerificationStatusProps {
  isVerified: boolean
  onVerify: () => void
  verificationSteps?: Array<{
    title: string
    description: string
    status: "pending" | "completed" | "failed"
  }>
}

export function VerificationStatus({ isVerified, onVerify, verificationSteps }: VerificationStatusProps) {
  const [isVerifying, setIsVerifying] = useState(false)

  const handleVerify = async () => {
    setIsVerifying(true)
    onVerify()
    // Simular un delay de verificación
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsVerifying(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Estado de Verificación
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isVerified ? (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>Verificado</AlertTitle>
            <AlertDescription>
              Tu identidad ha sido verificada exitosamente.
            </AlertDescription>
          </Alert>
        ) : (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No Verificado</AlertTitle>
            <AlertDescription>
              Necesitas verificar tu identidad para acceder a todas las funcionalidades.
            </AlertDescription>
          </Alert>
        )}

        {verificationSteps && (
          <div className="space-y-4">
            {verificationSteps.map((step, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className={`mt-1 h-6 w-6 rounded-full flex items-center justify-center ${
                  step.status === "completed" ? "bg-green-500" :
                  step.status === "failed" ? "bg-red-500" :
                  "bg-gray-300"
                }`}>
                  {step.status === "completed" ? (
                    <CheckCircle className="h-4 w-4 text-white" />
                  ) : step.status === "failed" ? (
                    <AlertCircle className="h-4 w-4 text-white" />
                  ) : (
                    <Clock className="h-4 w-4 text-white" />
                  )}
                </div>
                <div>
                  <h4 className="font-medium">{step.title}</h4>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isVerified && (
          <Button
            onClick={handleVerify}
            disabled={isVerifying}
            className="w-full"
          >
            {isVerifying ? "Verificando..." : "Iniciar Verificación"}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

