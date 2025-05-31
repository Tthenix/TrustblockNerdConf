import Link from "next/link";
import { CalendarDays, Target, TrendingUp } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Acerca de TrustBlock</h1>
        <p className="text-muted-foreground mb-8">
          TrustBlock es una plataforma revolucionaria que combina la
          transparencia de la tecnología blockchain con el poder del
          crowdfunding para impulsar empresas, startups y proyectos innovadores.
        </p>

        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Nuestra Misión</h2>
            <p className="text-muted-foreground">
              Nuestro objetivo es democratizar el acceso a la financiación de
              empresas y proyectos innovadores, eliminando las barreras
              tradicionales y creando un ecosistema transparente y confiable.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Nuestros Valores</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <h3 className="font-medium mb-2">Transparencia</h3>
                <p className="text-sm text-muted-foreground">
                  Creemos en la transparencia total en todas las operaciones y
                  el uso de fondos.
                </p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <h3 className="font-medium mb-2">Innovación</h3>
                <p className="text-sm text-muted-foreground">
                  Nos enfocamos en proyectos que impulsan la innovación y el crecimiento económico.
                </p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <h3 className="font-medium mb-2">Emprendimiento</h3>
                <p className="text-sm text-muted-foreground">
                  Fomentamos el espíritu emprendedor y el desarrollo de nuevas empresas.
                </p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <h3 className="font-medium mb-2">Comunidad</h3>
                <p className="text-sm text-muted-foreground">
                  Fomentamos una comunidad activa y participativa que apoye a las empresas y proyectos innovadores.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Nuestro Impacto</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-muted/50 rounded-lg text-center">
                <div className="text-3xl font-bold text-skyblue mb-2">100+</div>
                <p className="text-sm text-muted-foreground">
                  Empresas Financiadas
                </p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg text-center">
                <div className="text-3xl font-bold text-skyblue mb-2">50K+</div>
                <p className="text-sm text-muted-foreground">
                  Inversores Activos
                </p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg text-center">
                <div className="text-3xl font-bold text-skyblue mb-2">1M+</div>
                <p className="text-sm text-muted-foreground">Fondos Recaudados</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Modelo de Negocio</h2>
            <p className="text-muted-foreground mb-4">
              TrustBlock posee dos medios principales para generar ingresos sostenibles mientras
              mantiene la accesibilidad para empresas y proyectos innovadores:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="p-6 bg-muted/50 rounded-lg border border-border">
                <h3 className="text-xl font-medium mb-2 text-skyblue">Regalías por Transacciones</h3>
                <p className="text-muted-foreground">
                  TrustBlock aplica una comisión de entre 2% y 3% del total recaudado en campañas con fines
                  de lucro (emprendimientos y recaudaciones independientes). Las campañas de empresas y proyectos
                  innovadores tienen comisiones reducidas o nulas.
                </p>
              </div>
              <div className="p-6 bg-muted/50 rounded-lg border border-border">
                <h3 className="text-xl font-medium mb-2 text-skyblue">Suscripción PRO</h3>
                <p className="text-muted-foreground">
                  Ofrecemos un nivel premium a $9.99 USD mensuales que proporciona a las empresas y proyectos
                  un certificado de verificación extra y posicionamiento destacado en la plataforma.
                  Incluye herramientas adicionales de análisis y marketing.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-6">Nuestro Roadmap</h2>
            <div className="space-y-12">
              {/* Fase 1: Corto Plazo */}
              <div className="relative">
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-skyblue/30"></div>
                <div className="pl-6 relative">
                  <div className="absolute left-0 top-0 w-4 h-4 rounded-full bg-skyblue -translate-x-1.5"></div>
                  <div className="mb-4">
                    <span className="inline-flex items-center rounded-full bg-skyblue/20 px-2.5 py-1 text-sm font-medium text-skyblue mb-2">
                      <CalendarDays className="mr-1 h-3 w-3" />
                      Corto Plazo (0-6 meses)
                    </span>
                    <h3 className="text-xl font-semibold">Atraer los primeros usuarios</h3>
                  </div>
                  <div className="mb-6">
                    <h4 className="text-lg font-medium mb-2 flex items-center">
                      <Target className="mr-2 h-4 w-4 text-neonpink" />
                      Acciones clave
                    </h4>
                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                      <li>Implementación de comisión en campañas con fines de lucro (2-3%).</li>
                      <li>Activación del modelo de suscripción mensual con beneficios de verificación y campañas destacadas.</li>
                      <li>Alianzas con empresas y proyectos innovadores locales para generar confianza y casos de éxito.</li>
                      <li>Prueba piloto con el gobierno o municipalidades para demostrar el uso del sistema en fondos públicos.</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium mb-2 flex items-center">
                      <TrendingUp className="mr-2 h-4 w-4 text-neonpink" />
                      KPIs
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-3 bg-background border border-border/40 rounded-lg text-center">
                        <div className="text-2xl font-bold text-skyblue">1,000</div>
                        <p className="text-xs text-muted-foreground">Usuarios activos</p>
                      </div>
                      <div className="p-3 bg-background border border-border/40 rounded-lg text-center">
                        <div className="text-2xl font-bold text-skyblue">50+</div>
                        <p className="text-xs text-muted-foreground">Campañas creadas</p>
                      </div>
                      <div className="p-3 bg-background border border-border/40 rounded-lg text-center">
                        <div className="text-2xl font-bold text-skyblue">10</div>
                        <p className="text-xs text-muted-foreground">Campañas con plan PRO</p>
                      </div>
                      <div className="p-3 bg-background border border-border/40 rounded-lg text-center">
                        <div className="text-2xl font-bold text-skyblue">$10K</div>
                        <p className="text-xs text-muted-foreground">En transacciones</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Fase 2: Medio Plazo */}
              <div className="relative">
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-neonpink/30"></div>
                <div className="pl-6 relative">
                  <div className="absolute left-0 top-0 w-4 h-4 rounded-full bg-neonpink -translate-x-1.5"></div>
                  <div className="mb-4">
                    <span className="inline-flex items-center rounded-full bg-neonpink/20 px-2.5 py-1 text-sm font-medium text-neonpink mb-2">
                      <CalendarDays className="mr-1 h-3 w-3" />
                      Medio Plazo (6-12 meses)
                    </span>
                    <h3 className="text-xl font-semibold">Escalar y aumentar la liquidez</h3>
                  </div>
                  <div className="mb-6">
                    <h4 className="text-lg font-medium mb-2 flex items-center">
                      <Target className="mr-2 h-4 w-4 text-skyblue" />
                      Acciones clave
                    </h4>
                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                      <li>Desarrollo de NFTs como certificados de donación y recompensas.</li>
                      <li>Lanzamiento de un token nativo de TrustBlock en la blockchain de Polkadot.</li>
                      <li>Asociaciones con más empresas y proyectos innovadores para generar más campañas y adopción.</li>
                      <li>Exploración de grants en el ecosistema Polkadot/Kusama para poder seguir financiando el proyecto.</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium mb-2 flex items-center">
                      <TrendingUp className="mr-2 h-4 w-4 text-skyblue" />
                      KPIs
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-3 bg-background border border-border/40 rounded-lg text-center">
                        <div className="text-2xl font-bold text-neonpink">5,000</div>
                        <p className="text-xs text-muted-foreground">Usuarios activos</p>
                      </div>
                      <div className="p-3 bg-background border border-border/40 rounded-lg text-center">
                        <div className="text-2xl font-bold text-neonpink">$100K</div>
                        <p className="text-xs text-muted-foreground">En transacciones</p>
                      </div>
                      <div className="p-3 bg-background border border-border/40 rounded-lg text-center">
                        <div className="text-2xl font-bold text-neonpink">500</div>
                        <p className="text-xs text-muted-foreground">Holders del token</p>
                      </div>
                      <div className="p-3 bg-background border border-border/40 rounded-lg text-center">
                        <div className="text-2xl font-bold text-neonpink">30</div>
                        <p className="text-xs text-muted-foreground">Suscripciones activas</p>
                      </div>
                      <div className="p-3 bg-background border border-border/40 rounded-lg text-center">
                        <div className="text-2xl font-bold text-neonpink">2+</div>
                        <p className="text-xs text-muted-foreground">Alianzas gubernamentales</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Fase 3: Largo Plazo */}
              <div className="relative">
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-green-500/30"></div>
                <div className="pl-6 relative">
                  <div className="absolute left-0 top-0 w-4 h-4 rounded-full bg-green-500 -translate-x-1.5"></div>
                  <div className="mb-4">
                    <span className="inline-flex items-center rounded-full bg-green-500/20 px-2.5 py-1 text-sm font-medium text-green-500 mb-2">
                      <CalendarDays className="mr-1 h-3 w-3" />
                      Largo Plazo (12-24 meses)
                    </span>
                    <h3 className="text-xl font-semibold">Seguir escalando y adopción masiva</h3>
                  </div>
                  <div className="mb-6">
                    <h4 className="text-lg font-medium mb-2 flex items-center">
                      <Target className="mr-2 h-4 w-4 text-neonpink" />
                      Acciones clave
                    </h4>
                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                      <li>Optimización del tokenomics: integración con stablecoins para estabilidad en donaciones.</li>
                      <li>Asegurar un slot de parachain en Polkadot para optimizar costos y velocidad.</li>
                      <li>Expansión regional: integrar más países y partners estratégicos.</li>
                      <li>Modelo de financiación híbrido: permitir campañas con fondos en FIAT a través de stablecoins oficiales.</li>
                      <li>Programa de grants para incentivar la creación de campañas con impacto económico.</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium mb-2 flex items-center">
                      <TrendingUp className="mr-2 h-4 w-4 text-neonpink" />
                      KPIs
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-3 bg-background border border-border/40 rounded-lg text-center">
                        <div className="text-2xl font-bold text-green-500">50,000+</div>
                        <p className="text-xs text-muted-foreground">Usuarios activos</p>
                      </div>
                      <div className="p-3 bg-background border border-border/40 rounded-lg text-center">
                        <div className="text-2xl font-bold text-green-500">$1M+</div>
                        <p className="text-xs text-muted-foreground">En transacciones</p>
                      </div>
                      <div className="p-3 bg-background border border-border/40 rounded-lg text-center">
                        <div className="text-2xl font-bold text-green-500">300</div>
                        <p className="text-xs text-muted-foreground">Suscripciones activas</p>
                      </div>
                      <div className="p-3 bg-background border border-border/40 rounded-lg text-center">
                        <div className="text-2xl font-bold text-green-500">5,000+</div>
                        <p className="text-xs text-muted-foreground">Holders del token</p>
                      </div>
                      <div className="p-3 bg-background border border-border/40 rounded-lg text-center">
                        <div className="text-2xl font-bold text-green-500">5+</div>
                        <p className="text-xs text-muted-foreground">Alianzas gubernamentales</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Únete a Nosotros</h2>
            <div className="p-6 bg-muted/50 rounded-lg">
              <p className="text-muted-foreground mb-4">
                ¿Tienes un proyecto que quieres impulsar? ¿O quieres contribuir
                a proyectos innovadores? Únete a nuestra comunidad y sé parte del
                cambio.
              </p>
              <div className="flex gap-4">
                <Link
                  href="/campaigns/create"
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-neonpink text-white hover:bg-neonpink/80 h-10 px-4 py-2"
                >
                  Crear Campaña
                </Link>
                <Link
                  href="/campaigns"
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                >
                  Explorar Proyectos
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
