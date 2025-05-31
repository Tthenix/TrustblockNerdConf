import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Github, Twitter, Linkedin, Mail } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-darkblue/90 py-12 px-4 md:px-6 text-white/90">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold gradient-text">TrustBlock</span>
              {/* <span className="font-bold">DAO</span> */}
            </Link>
            <p className="mt-4 text-gray-400">
              Plataforma de crowdfunding Web3 con identidad digital verificada en blockchain.
            </p>
            <div className="flex space-x-4 mt-6">
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="text-gray-400 hover:text-skyblue transition-colors"
              >
                <a href="#" aria-label="Twitter">
                  <Twitter className="h-5 w-5" />
                </a>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="text-gray-400 hover:text-skyblue transition-colors"
              >
                <a href="#" aria-label="GitHub">
                  <Github className="h-5 w-5" />
                </a>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="text-gray-400 hover:text-skyblue transition-colors"
              >
                <a href="#" aria-label="LinkedIn">
                  <Linkedin className="h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-lg mb-4 text-skyblue">Plataforma</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/campaigns" className="text-gray-400 hover:text-white transition-colors">
                  Explorar Campañas
                </Link>
              </li>
              <li>
                <Link href="/campaigns/create" className="text-gray-400 hover:text-white transition-colors">
                  Crear Campaña
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-gray-400 hover:text-white transition-colors">
                  Cómo Funciona
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                  Acerca de
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-lg mb-4 text-skyblue">Recursos</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/docs" className="text-gray-400 hover:text-white transition-colors">
                  Documentación
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-white transition-colors">
                  Preguntas Frecuentes
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-gray-400 hover:text-white transition-colors">
                  Soporte
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-lg mb-4 text-skyblue">Suscríbete</h3>
            <p className="text-gray-400 mb-4">Recibe las últimas noticias y actualizaciones sobre TrustFund DAO.</p>
            <div className="flex space-x-2">
              <Input placeholder="Tu email" type="email" className="bg-darkblue/50 border-skyblue/20" />
              <Button className="bg-neonpink hover:bg-neonpink/80 transition-colors">
                <Mail className="h-4 w-4 mr-2" />
                Suscribir
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} TrustBlock . Todos los derechos reservados.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacy" className="text-sm text-gray-500 hover:text-skyblue transition-colors">
              Privacidad
            </Link>
            <Link href="/terms" className="text-sm text-gray-500 hover:text-skyblue transition-colors">
              Términos
            </Link>
            <Link href="/legal" className="text-sm text-gray-500 hover:text-skyblue transition-colors">
              Legal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

