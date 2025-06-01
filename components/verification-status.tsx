"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, CheckCircle, AlertCircle, Clock } from "lucide-react"

interface VerificationStatusProps {
  isVerified: boolean
  onVerify: () => void
  verificationSteps: Array<{
    title: string
    description: string
    status: "completed" | "pending" | "current"
  }>
}

export function VerificationStatus({ isVerified, onVerify, verificationSteps }: VerificationStatusProps) {
  const [isVerifying, setIsVerifying] = useState(false)

  const handleVerify = async () => {
    setIsVerifying(true)
    try {
      await onVerify()
    } finally {
      setIsVerifying(false)
    }
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
              Tu identidad ha sido verificada exitosamente. Puedes acceder a todas las funcionalidades.
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

        {!isVerified && (
          <div className="space-y-3">
            {verificationSteps.map((step, index) => (
              <div key={index} className="flex items-center gap-3 p-3 rounded-lg border">
                <div className="flex-shrink-0">
                  {step.status === "completed" ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : step.status === "current" ? (
                    <Clock className="h-4 w-4 text-blue-500" />
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
      </CardContent>
    </Card>
  )
}

