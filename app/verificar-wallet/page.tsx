import { WalletVerification } from "@/components/wallet-verification";

export default function VerificarWalletPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-4">Verificación KYC de Wallet</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Completa el proceso de verificación de identidad (KYC) para tu wallet. 
          Este proceso garantiza la seguridad y confianza en la plataforma TrustBlock.
        </p>
      </div>
      
      <WalletVerification />
    </main>
  );
}
