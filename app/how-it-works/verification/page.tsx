"use client";

export default function VerificationPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Verificación para Creadores</h1>
        <p className="text-muted-foreground mb-8">
          TrustBlock requiere verificación de identidad solo para creadores de campañas, utilizando
          Sumsub para garantizar la legitimidad de los proyectos. Los donantes pueden participar
          sin verificación.
        </p>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              ¿Por qué verificar solo a creadores?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                <h3 className="font-medium mb-2 text-green-900 dark:text-green-100">Protección a Donantes</h3>
                <p className="text-sm text-green-800 dark:text-green-200">
                  Garantizamos que todas las campañas sean creadas por personas reales y verificadas.
                </p>
              </div>
              <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <h3 className="font-medium mb-2 text-blue-900 dark:text-blue-100">Privacidad de Donantes</h3>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Los donantes mantienen su privacidad y pueden contribuir anónimamente.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              Proceso de Verificación con Sumsub
            </h2>
            <div className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <h3 className="font-medium mb-2">1. Conecta tu Wallet</h3>
                <p className="text-sm text-muted-foreground">
                  Conecta tu wallet de Ethereum para vincular tu identidad verificada con tu dirección.
                </p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <h3 className="font-medium mb-2">2. Verificación KYC</h3>
                <p className="text-sm text-muted-foreground">
                  Completa el proceso de verificación KYC usando la plataforma Sumsub con documentos oficiales.
                </p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <h3 className="font-medium mb-2">3. Aprobación Automática</h3>
                <p className="text-sm text-muted-foreground">
                  Una vez aprobado por Sumsub, podrás crear campañas inmediatamente.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              ¿Qué es Sumsub?
            </h2>
            <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
              <h3 className="font-medium mb-2 text-purple-900 dark:text-purple-100">Plataforma de Verificación Líder</h3>
              <p className="text-sm text-purple-800 dark:text-purple-200 mb-4">
                Sumsub es una plataforma global de verificación de identidad que utiliza IA y aprendizaje automático
                para verificar identidades de forma rápida y segura.
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium text-purple-900 dark:text-purple-100">Verificación Rápida</h4>
                    <p className="text-sm text-purple-700 dark:text-purple-300">Proceso automatizado que toma solo minutos.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium text-purple-900 dark:text-purple-100">Cumplimiento Global</h4>
                    <p className="text-sm text-purple-700 dark:text-purple-300">Cumple con regulaciones KYC/AML internacionales.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium text-purple-900 dark:text-purple-100">Seguridad Máxima</h4>
                    <p className="text-sm text-purple-700 dark:text-purple-300">Tus datos están protegidos con los más altos estándares de seguridad.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              Documentos Requeridos
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-muted/50 rounded-lg text-center">
                <h3 className="font-medium mb-2">Documento de Identidad</h3>
                <p className="text-sm text-muted-foreground">
                  DNI, Pasaporte, Cédula de Identidad u otro documento oficial válido.
                </p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg text-center">
                <h3 className="font-medium mb-2">Comprobante de Domicilio</h3>
                <p className="text-sm text-muted-foreground">
                  Factura de servicios, extracto bancario o contrato de alquiler reciente.
                </p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg text-center">
                <h3 className="font-medium mb-2">Selfie Verificación</h3>
                <p className="text-sm text-muted-foreground">
                  Foto tuya sosteniendo tu documento de identidad para verificar autenticidad.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              Beneficios de la Verificación
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <h3 className="font-medium mb-2">Crear Campañas</h3>
                <p className="text-sm text-muted-foreground">
                  Solo los usuarios verificados pueden crear campañas de crowdfunding en TrustBlock.
                </p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <h3 className="font-medium mb-2">Mayor Confianza</h3>
                <p className="text-sm text-muted-foreground">
                  Los donantes confían más en campañas creadas por usuarios verificados.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
