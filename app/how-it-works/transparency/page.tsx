import { TransparencyTracker } from "@/components/transparency-tracker"

// Datos de ejemplo para la página
const mockTransactions = [
  {
    id: "1",
    date: "2024-03-15",
    amount: 1000,
    from: "0x1234...5678",
    to: "0x8765...4321",
    type: "donation" as const,
    purpose: "Donación inicial",
    status: "completed" as const
  },
  {
    id: "2",
    date: "2024-03-16",
    amount: 500,
    from: "0x8765...4321",
    to: "0x9876...5432",
    type: "expense" as const,
    purpose: "Compra de materiales",
    status: "completed" as const
  }
]

export default function TransparencyPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Transparencia en Blockchain</h1>
        <p className="text-muted-foreground mb-8">
          Utilizamos la tecnología blockchain para garantizar la transparencia total en el uso de los fondos.
          Cada transacción es verificable y pública en la blockchain.
        </p>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Seguimiento de Fondos</h2>
            <TransparencyTracker 
              transactions={mockTransactions}
              totalBudget={10000}
              spentBudget={500}
              donorsCount={1}
            />
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">¿Cómo funciona?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <h3 className="font-medium mb-2">Registro Inmutable</h3>
                <p className="text-sm text-muted-foreground">
                  Cada transacción se registra en la blockchain, creando un historial inmutable y transparente.
                </p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <h3 className="font-medium mb-2">Verificación en Tiempo Real</h3>
                <p className="text-sm text-muted-foreground">
                  Los donantes pueden verificar en tiempo real cómo se utilizan sus fondos.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Beneficios</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <h3 className="font-medium mb-2">Confianza Total</h3>
                <p className="text-sm text-muted-foreground">
                  La transparencia en blockchain genera confianza entre donantes y organizaciones.
                </p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <h3 className="font-medium mb-2">Rendición de Cuentas</h3>
                <p className="text-sm text-muted-foreground">
                  Las organizaciones deben mantener un registro claro y público de sus gastos.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
} 