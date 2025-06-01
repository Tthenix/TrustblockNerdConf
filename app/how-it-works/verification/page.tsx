"use client";

import { VerificationStatus } from "@/components/verification-status";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function VerificationPage() {
  const verificationSteps = [
    {
      title: "Autenticación de Wallet",
      description: "Conecta y autentica tu wallet con firma digital",
      status: "pending" as const,
    },
    {
      title: "Información Personal",
      description: "Proporciona datos personales básicos y de contacto",
      status: "pending" as const,
    },
    {
      title: "Verificación de Documentos",
      description: "Sube documentos oficiales de identidad",
      status: "pending" as const,
    },
  ];

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">
          Verificación KYC (Know Your Customer)
        </h1>
        <p className="text-muted-foreground mb-8">
          TrustBlock utiliza un sistema KYC robusto powered by Sumsub para
          garantizar la seguridad y confianza en todas las transacciones de
          crowdfunding en nuestra plataforma blockchain.
        </p>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              ¿Por qué necesitamos verificación KYC?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <h3 className="font-medium mb-2">Cumplimiento Legal</h3>
                <p className="text-sm text-muted-foreground">
                  Cumplimos con regulaciones internacionales de anti-lavado de
                  dinero (AML) y financiamiento del terrorismo.
                </p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <h3 className="font-medium mb-2">Confianza del Ecosistema</h3>
                <p className="text-sm text-muted-foreground">
                  Los donantes pueden confiar en que su dinero va a causas y
                  personas reales y verificadas.
                </p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <h3 className="font-medium mb-2">Transparencia Blockchain</h3>
                <p className="text-sm text-muted-foreground">
                  Combinamos la transparencia de blockchain con la verificación de
                  identidad para máxima seguridad.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              Proceso de Verificación KYC con Sumsub
            </h2>
            <div className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <h3 className="font-medium mb-2">1. Autenticación de Wallet</h3>
                <p className="text-sm text-muted-foreground">
                  Conecta tu wallet (MetaMask, etc.) y firma un mensaje
                  criptográfico para demostrar que controlas la dirección. Esto
                  vincula tu identidad verificada con tu wallet blockchain.
                </p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <h3 className="font-medium mb-2">2. Información Personal</h3>
                <p className="text-sm text-muted-foreground">
                  Proporciona información básica como nombre completo, fecha de
                  nacimiento, país de residencia y datos de contacto. Esta
                  información se encripta y almacena de forma segura.
                </p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <h3 className="font-medium mb-2">3. Verificación de Documentos</h3>
                <p className="text-sm text-muted-foreground">
                  Sube documentos oficiales (pasaporte, cédula, licencia) que son
                  analizados por IA avanzada de Sumsub para detectar
                  falsificaciones y extraer información automáticamente.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Tecnología Sumsub</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-muted/50 rounded-lg">
                <h3 className="font-medium mb-2">IA y Machine Learning</h3>
                <p className="text-sm text-muted-foreground">
                  Sumsub utiliza inteligencia artificial avanzada para detectar
                  documentos falsificados, deepfakes y otras técnicas de fraude en
                  tiempo real.
                </p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <h3 className="font-medium mb-2">Base de Datos Global</h3>
                <p className="text-sm text-muted-foreground">
                  Acceso a bases de datos globales de documentos, listas de
                  sanciones y PEP (Personas Políticamente Expuestas) para
                  verificación completa.
                </p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <h3 className="font-medium mb-2">Cumplimiento Regulatorio</h3>
                <p className="text-sm text-muted-foreground">
                  Cumple con estándares internacionales como GDPR, CCPA, y
                  regulaciones KYC/AML de diferentes jurisdicciones.
                </p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <h3 className="font-medium mb-2">Velocidad y Precisión</h3>
                <p className="text-sm text-muted-foreground">
                  Procesamiento automático en segundos con alta precisión,
                  reduciendo el tiempo de verificación manual.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Niveles de Verificación</h2>
            <div className="space-y-4 mb-6">
              <div className="p-4 bg-muted/50 rounded-lg border-l-4 border-yellow-500">
                <h3 className="font-medium mb-2">Básico - Solo Donaciones</h3>
                <p className="text-sm text-muted-foreground">
                  Conexión de wallet sin verificación adicional. Permite hacer
                  donaciones pero no crear campañas.
                </p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg border-l-4 border-blue-500">
                <h3 className="font-medium mb-2">
                  Verificado - Creación de Campañas
                </h3>
                <p className="text-sm text-muted-foreground">
                  Verificación KYC completa con Sumsub. Permite crear campañas,
                  recibir donaciones y acceder a todas las funciones.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Seguridad y Privacidad</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-muted/50 rounded-lg">
                <h3 className="font-medium mb-2">Encriptación de Datos</h3>
                <p className="text-sm text-muted-foreground">
                  Todos los datos personales se encriptan usando estándares
                  bancarios (AES-256) y se almacenan de forma segura.
                </p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <h3 className="font-medium mb-2">Minimización de Datos</h3>
                <p className="text-sm text-muted-foreground">
                  Solo recopilamos la información mínima necesaria para la
                  verificación y cumplimiento regulatorio.
                </p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <h3 className="font-medium mb-2">Retención Limitada</h3>
                <p className="text-sm text-muted-foreground">
                  Los datos se conservan solo durante el tiempo requerido por ley
                  y se eliminan de forma segura después.
                </p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <h3 className="font-medium mb-2">Control del Usuario</h3>
                <p className="text-sm text-muted-foreground">
                  Tienes derecho a acceder, corregir o eliminar tus datos
                  personales en cualquier momento.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Estado de Verificación</h2>
            <VerificationStatus
              isVerified={false}
              onVerify={() => {}}
              verificationSteps={verificationSteps}
            />
            
            <div className="mt-6 text-center">
              <Link href="/verificar-identidad" target="_blank">
                <Button size="lg" className="bg-neonpink hover:bg-neonpink/80">
                  Verificar Identidad
                </Button>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
