import { Card, CardContent } from "@/components/ui/card"
import { Users, Globe, Heart, Shield } from "lucide-react"

export function AboutSection() {
  return (
    <section className="py-16 px-4 md:px-6 bg-gradient-to-b from-background to-background/95">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-4">Sobre TrustBlock</h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Nuestra misión es democratizar el acceso a la financiación de proyectos sociales y ambientales
          utilizando la tecnología blockchain para garantizar transparencia y confianza.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card className="border-skyblue/20 hover:border-skyblue/40 transition-colors">
            <CardContent className="p-6">
              <Globe className="h-12 w-12 text-skyblue mb-4" />
              <h3 className="text-xl font-bold mb-2">Impacto Global</h3>
              <p className="text-muted-foreground">
                Conectamos inversores con empresas, startups y proyectos innovadores en todo el mundo.
              </p>
            </CardContent>
          </Card>

          <Card className="border-skyblue/20 hover:border-skyblue/40 transition-colors">
            <CardContent className="p-6">
              <Shield className="h-12 w-12 text-skyblue mb-4" />
              <h3 className="text-xl font-bold mb-2">Seguridad Garantizada</h3>
              <p className="text-muted-foreground">
                Utilizamos tecnología blockchain para asegurar que cada donación llegue a su destino.
              </p>
            </CardContent>
          </Card>

          <Card className="border-skyblue/20 hover:border-skyblue/40 transition-colors">
            <CardContent className="p-6">
              <Users className="h-12 w-12 text-skyblue mb-4" />
              <h3 className="text-xl font-bold mb-2">Comunidad Activa</h3>
              <p className="text-muted-foreground">
                Fomentamos una comunidad participativa donde todos pueden contribuir al cambio.
              </p>
            </CardContent>
          </Card>

          <Card className="border-skyblue/20 hover:border-skyblue/40 transition-colors">
            <CardContent className="p-6">
              <Heart className="h-12 w-12 text-skyblue mb-4" />
              <h3 className="text-xl font-bold mb-2">Impacto Social</h3>
              <p className="text-muted-foreground">
                Nos enfocamos en proyectos que generan un impacto positivo en la sociedad.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
} 