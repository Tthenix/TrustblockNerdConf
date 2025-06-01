"use client"

import { CreateCampaignForm } from "@/components/campaigns/create-campaign-form";
import { WalletStatus } from "@/components/wallet/wallet-status";

export default function CreateCampaignPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Crear Nueva Campaña</h1>
        <p className="text-xl text-muted-foreground">
          Crea una campaña de crowdfunding como smart contract en blockchain
        </p>
      </div>
      
      <div className="grid lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2">
          <CreateCampaignForm />
        </div>
        <div>
          <WalletStatus />
        </div>
      </div>
      
      <div className="mt-12 max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">¿Cómo funciona?</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 border rounded-lg">
            <h3 className="font-semibold mb-2">1. Smart Contract</h3>
            <p className="text-sm text-muted-foreground">
              Tu campaña se despliega como un smart contract en blockchain, garantizando transparencia total.
            </p>
          </div>
          <div className="p-6 border rounded-lg">
            <h3 className="font-semibold mb-2">2. Contribuciones Seguras</h3>
            <p className="text-sm text-muted-foreground">
              Los fondos se almacenan de forma segura en el contrato hasta que se alcance la meta.
            </p>
          </div>
          <div className="p-6 border rounded-lg">
            <h3 className="font-semibold mb-2">3. Retiro Automático</h3>
            <p className="text-sm text-muted-foreground">
              Si no se alcanza la meta, los contribuyentes pueden reclamar reembolsos automáticamente.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
