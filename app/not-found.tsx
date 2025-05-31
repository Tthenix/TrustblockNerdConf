import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-darkblue text-white px-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="w-64 h-64 mx-auto mb-8 relative">
          {/* Círculo de signos de interrogación */}
          <svg
            viewBox="0 0 200 200"
            className="w-full h-full absolute animate-spin-slow"
            style={{ animationDuration: '30s' }}
          >
            {[...Array(24)].map((_, i) => (
              <text
                key={i}
                x="100"
                y="100"
                fill="currentColor"
                className="text-skyblue text-xs"
                textAnchor="middle"
                transform={`rotate(${i * 15} 100 100) translate(0, -60)`}
              >
                ?
              </text>
            ))}
          </svg>
          
          {/* Círculo de rectángulos */}
          <svg
            viewBox="0 0 200 200"
            className="w-full h-full absolute animate-spin-slow"
            style={{ animationDuration: '20s', animationDirection: 'reverse' }}
          >
            {[...Array(18)].map((_, i) => (
              <rect
                key={i}
                x="98"
                y="40"
                width="4"
                height="12"
                fill="currentColor"
                className="text-neonpink"
                transform={`rotate(${i * 20} 100 100)`}
              />
            ))}
          </svg>
          
          {/* Número 404 en el centro */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl font-bold gradient-text">404</span>
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="gradient-text">Oops!</span> - Página no encontrada
        </h1>
        
        <p className="text-xl text-gray-300 mb-8">
          Lo sentimos, la página que estás buscando no existe o ha sido movida.
        </p>

        <div className="space-y-4">
          <Link href="/" className="inline-block">
            <Button size="lg" className="bg-neonpink hover:bg-neonpink/80 text-white">
              Volver al Inicio
            </Button>
          </Link>
          
          <p className="text-sm text-gray-400">
            ¿Necesitas ayuda? {" "}
            <Link href="/contact" className="text-skyblue hover:text-skyblue/80 underline">
              Contáctanos
            </Link>
          </p>
        </div>

        <div className="mt-12 p-4 bg-darkblue/40 backdrop-blur-sm rounded-xl border border-skyblue/20">
          <p className="text-sm text-gray-300">
            Sugerencias:
          </p>
          <ul className="mt-2 space-y-2 text-sm text-gray-400">
            <li>• Verifica que la URL esté escrita correctamente</li>
            <li>• Regresa a la página anterior</li>
            <li>• Explora nuestras campañas activas</li>
          </ul>
        </div>
      </div>
    </div>
  )
} 