'use client'

import { RewardCard } from "@/components/reward-card"

// Datos de ejemplo para la página
const mockRewards = [
  {
    id: "1",
    title: "NFT de Agradecimiento",
    description: "Un NFT único que certifica tu contribución al proyecto",
    amount: 100,
    isAvailable: true,
    claimedCount: 5,
    totalCount: 50
  },
  {
    id: "2",
    title: "Acceso VIP",
    description: "Acceso a eventos exclusivos y beneficios especiales",
    amount: 500,
    isAvailable: true,
    claimedCount: 2,
    totalCount: 10
  }
]

export default function RewardsPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Sistema de Recompensas</h1>
        <p className="text-muted-foreground mb-8">
          Reconocemos y agradecemos las contribuciones de nuestros donantes con recompensas exclusivas
          y beneficios especiales.
        </p>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Recompensas Disponibles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockRewards.map((reward) => (
                <RewardCard
                  key={reward.id}
                  reward={reward}
                  onClaim={() => console.log(`Claiming reward ${reward.id}`)}
                />
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Tipos de Recompensas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <h3 className="font-medium mb-2">NFTs Exclusivos</h3>
                <p className="text-sm text-muted-foreground">
                  Recibe NFTs únicos que certifican tu contribución y te dan acceso a beneficios especiales.
                </p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <h3 className="font-medium mb-2">Beneficios VIP</h3>
                <p className="text-sm text-muted-foreground">
                  Acceso a eventos exclusivos, actualizaciones prioritarias y más.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">¿Cómo funciona?</h2>
            <div className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <h3 className="font-medium mb-2">1. Contribuye a una Campaña</h3>
                <p className="text-sm text-muted-foreground">
                  Realiza una donación a una campaña que ofrezca recompensas.
                </p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <h3 className="font-medium mb-2">2. Selecciona tu Recompensa</h3>
                <p className="text-sm text-muted-foreground">
                  Elige la recompensa que deseas recibir según tu nivel de contribución.
                </p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <h3 className="font-medium mb-2">3. Reclama tu Recompensa</h3>
                <p className="text-sm text-muted-foreground">
                  Sigue el proceso para reclamar tu recompensa a través de la blockchain.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
} 