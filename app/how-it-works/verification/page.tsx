"use client";

export default function VerificationPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Verificación con Sumsub</h1>
        <p className="text-muted-foreground mb-8">
          TrustBlock utiliza Sumsub, una plataforma líder en verificación de identidad, 
          para verificar a los creadores de campañas. Este proceso garantiza la legitimidad 
          de todos los proyectos en nuestra plataforma.
        </p>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              Proceso de Verificación Sumsub
            </h2>
            <div className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <h3 className="font-medium mb-2">1. Conecta tu Wallet</h3>
                <p className="text-sm text-muted-foreground">
                  Conecta tu wallet de Ethereum para vincular tu identidad verificada con tu dirección blockchain.
                </p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <h3 className="font-medium mb-2">2. Sube Documentos</h3>
                <p className="text-sm text-muted-foreground">
                  Proporciona documentos oficiales que serán procesados por la IA de Sumsub para verificación automática.
                </p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <h3 className="font-medium mb-2">3. Verificación Automática</h3>
                <p className="text-sm text-muted-foreground">
                  Sumsub verifica automáticamente tus documentos usando IA y tecnología de reconocimiento facial.
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
                para verificar identidades de forma rápida y segura, utilizada por más de 2000 empresas en todo el mundo.
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium text-purple-900 dark:text-purple-100">Verificación con IA</h4>
                    <p className="text-sm text-purple-700 dark:text-purple-300">Análisis automático de documentos usando inteligencia artificial avanzada.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium text-purple-900 dark:text-purple-100">Cumplimiento Global</h4>
                    <p className="text-sm text-purple-700 dark:text-purple-300">Cumple con regulaciones KYC/AML internacionales y estándares GDPR.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium text-purple-900 dark:text-purple-100">Seguridad Máxima</h4>
                    <p className="text-sm text-purple-700 dark:text-purple-300">Certificaciones SOC 2 Type II e ISO 27001 para máxima protección de datos.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium text-purple-900 dark:text-purple-100">Procesamiento Rápido</h4>
                    <p className="text-sm text-purple-700 dark:text-purple-300">Verificación en tiempo real con resultados en minutos, no días.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              Documentos Requeridos por Sumsub
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-muted/50 rounded-lg text-center">
                <h3 className="font-medium mb-2">Documento de Identidad</h3>
                <p className="text-sm text-muted-foreground">
                  DNI, Pasaporte, Cédula de Identidad u otro documento oficial válido procesado por IA de Sumsub.
                </p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg text-center">
                <h3 className="font-medium mb-2">Comprobante de Domicilio</h3>
                <p className="text-sm text-muted-foreground">
                  Factura de servicios, extracto bancario o contrato reciente verificado automáticamente.
                </p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg text-center">
                <h3 className="font-medium mb-2">Verificación Biométrica</h3>
                <p className="text-sm text-muted-foreground">
                  Selfie con documento usando reconocimiento facial de Sumsub para prevenir fraude.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              Ventajas de Sumsub en TrustBlock
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <h3 className="font-medium mb-2 text-blue-900 dark:text-blue-100">Para Creadores</h3>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Verificación rápida y profesional que aumenta la confianza de los donantes en tus proyectos.
                </p>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                <h3 className="font-medium mb-2 text-green-900 dark:text-green-100">Para Donantes</h3>
                <p className="text-sm text-green-800 dark:text-green-200">
                  Garantía de que apoyas proyectos de personas reales verificadas por tecnología líder.
                </p>
              </div>
              <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
                <h3 className="font-medium mb-2 text-orange-900 dark:text-orange-100">Prevención de Fraude</h3>
                <p className="text-sm text-orange-800 dark:text-orange-200">
                  IA avanzada de Sumsub detecta documentos falsos y previene identidades sintéticas.
                </p>
              </div>
              <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
                <h3 className="font-medium mb-2 text-purple-900 dark:text-purple-100">Cumplimiento Legal</h3>
                <p className="text-sm text-purple-800 dark:text-purple-200">
                  Cumple automáticamente con regulaciones KYC globales y protección de datos.
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
                <h3 className="font-medium mb-2">Crear Campañas Verificadas</h3>
                <p className="text-sm text-muted-foreground">
                  Solo los usuarios verificados por Sumsub pueden crear campañas, garantizando legitimidad.
                </p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <h3 className="font-medium mb-2">Insignia de Confianza</h3>
                <p className="text-sm text-muted-foreground">
                  Obtén una insignia visible que muestra que tu identidad fue verificada por Sumsub.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              Privacidad y Seguridad
            </h2>
            <div className="p-4 bg-gray-50 dark:bg-gray-950/20 rounded-lg border border-gray-200 dark:border-gray-800">
              <h3 className="font-medium mb-2 text-gray-900 dark:text-gray-100">Protección de Datos</h3>
              <p className="text-sm text-gray-800 dark:text-gray-200 mb-3">
                Sumsub procesa tus datos bajo los más altos estándares de seguridad:
              </p>
              <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                <li>• 🔒 Encriptación end-to-end de todos los documentos</li>
                <li>• 🛡️ Cumplimiento GDPR y protección de privacidad</li>
                <li>• 🗑️ Eliminación automática de datos según regulaciones</li>
                <li>• 🔐 Acceso restringido solo a personal autorizado</li>
                <li>• 📋 Auditorías de seguridad regulares y certificaciones</li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
