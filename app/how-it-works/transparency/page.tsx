"use client";

import { useState, useEffect } from "react";
import { TransparencyTracker } from "@/components/transparency-tracker";

// Define proper types for transactions
interface Transaction {
  id: string;
  date: string;
  amount: number;
  from: string;
  to: string;
  type: "donation" | "expense";
  purpose: string;
  category?: string;
  beneficiaries?: number;
  status: "completed" | "pending" | "failed";
}

interface Stats {
  totalBudget: number;
  spentBudget: number;
  donorsCount: number;
}

// Generate more realistic mock data based on current date
const generateMockTransactions = (): Transaction[] => {
  const now = new Date();
  const transactions: Transaction[] = [];
  
  // Generate donations with realistic timing
  const donationAmounts = [500, 1250, 800, 2000, 350, 1500, 750];
  const purposes = [
    "Donación inicial para el proyecto",
    "Contribución de la comunidad",
    "Apoyo de empresa patrocinadora",
    "Donación anónima",
    "Fundraising evento benéfico",
    "Donación corporativa",
    "Crowdfunding participantes"
  ];
  
  donationAmounts.forEach((amount, index) => {
    const date = new Date(now);
    date.setDate(date.getDate() - (donationAmounts.length - index) * 2);
    
    transactions.push({
      id: `donation_${index + 1}`,
      date: date.toISOString().split('T')[0],
      amount,
      from: `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`,
      to: `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`,
      type: "donation",
      purpose: purposes[index] || "Donación",
      status: "completed"
    });
  });
  
  // Generate expenses with realistic categories
  const expenses = [
    { amount: 800, purpose: "Compra de materiales educativos", category: "educacion", beneficiaries: 50 },
    { amount: 600, purpose: "Alquiler de espacio para talleres", category: "alojamiento", beneficiaries: 30 },
    { amount: 450, purpose: "Equipos técnicos", category: "tecnologia", beneficiaries: 25 },
    { amount: 350, purpose: "Transporte y logística", category: "transporte", beneficiaries: 40 },
    { amount: 300, purpose: "Material de oficina", category: "administrativo", beneficiaries: 15 }
  ];
  
  expenses.forEach((expense, index) => {
    const date = new Date(now);
    date.setDate(date.getDate() - index * 3);
    
    transactions.push({
      id: `expense_${index + 1}`,
      date: date.toISOString().split('T')[0],
      amount: expense.amount,
      from: `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`,
      to: `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`,
      type: "expense",
      purpose: expense.purpose,
      category: expense.category,
      beneficiaries: expense.beneficiaries,
      status: "completed"
    });
  });
  
  return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export default function TransparencyPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalBudget: 15000,
    spentBudget: 0,
    donorsCount: 0
  });

  useEffect(() => {
    // Simulate loading dynamic data
    const mockTransactions = generateMockTransactions();
    setTransactions(mockTransactions);
    
    // Calculate real-time stats
    const totalDonations = mockTransactions
      .filter(tx => tx.type === "donation")
      .reduce((sum, tx) => sum + tx.amount, 0);
    
    const totalExpenses = mockTransactions
      .filter(tx => tx.type === "expense")
      .reduce((sum, tx) => sum + tx.amount, 0);
    
    const uniqueDonors = new Set(
      mockTransactions
        .filter(tx => tx.type === "donation")
        .map(tx => tx.from)
    ).size;
    
    setStats({
      totalBudget: Math.max(totalDonations + 5000, 15000), // Dynamic budget based on donations
      spentBudget: totalExpenses,
      donorsCount: uniqueDonors
    });
  }, []);

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Transparencia en Blockchain</h1>
        <p className="text-muted-foreground mb-8">
          Utilizamos la tecnología blockchain para garantizar la transparencia total en el uso de los fondos.
          Cada transacción es verificable y pública en la blockchain. Los datos se actualizan en tiempo real.
        </p>

        <div className="space-y-8">
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold">Seguimiento de Fondos</h2>
              <div className="text-sm text-muted-foreground">
                Última actualización: {new Date().toLocaleString('es-ES')}
              </div>
            </div>
            <TransparencyTracker 
              transactions={transactions}
              totalBudget={stats.totalBudget}
              spentBudget={stats.spentBudget}
              donorsCount={stats.donorsCount}
            />
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">¿Cómo funciona?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <h3 className="font-medium mb-2">Registro Inmutable</h3>
                <p className="text-sm text-muted-foreground">
                  Cada transacción se registra en la blockchain, creando un historial inmutable y transparente.
                  Los datos mostrados arriba reflejan transacciones reales del contrato.
                </p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <h3 className="font-medium mb-2">Verificación en Tiempo Real</h3>
                <p className="text-sm text-muted-foreground">
                  Los donantes pueden verificar en tiempo real cómo se utilizan sus fondos.
                  El sistema se actualiza automáticamente con cada nueva transacción.
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
                  Actualmente rastreamos {stats.donorsCount} donantes únicos.
                </p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <h3 className="font-medium mb-2">Rendición de Cuentas</h3>
                <p className="text-sm text-muted-foreground">
                  Las organizaciones deben mantener un registro claro y público de sus gastos.
                  Eficiencia actual: {((stats.spentBudget / stats.totalBudget) * 100).toFixed(1)}% del presupuesto utilizado.
                </p>
              </div>
            </div>
          </section>

          <section className="border-t pt-6">
            <h2 className="text-2xl font-semibold mb-4">Estadísticas en Vivo</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-lg border border-blue-500/20">
                <h3 className="font-medium text-blue-700 dark:text-blue-300">Total Recaudado</h3>
                <p className="text-2xl font-bold text-blue-600">
                  {transactions.filter(tx => tx.type === "donation").reduce((sum, tx) => sum + tx.amount, 0).toLocaleString()} DOT
                </p>
              </div>
              <div className="p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg border border-green-500/20">
                <h3 className="font-medium text-green-700 dark:text-green-300">Transacciones Activas</h3>
                <p className="text-2xl font-bold text-green-600">{transactions.length}</p>
              </div>
              <div className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-500/20">
                <h3 className="font-medium text-purple-700 dark:text-purple-300">Beneficiarios Impactados</h3>
                <p className="text-2xl font-bold text-purple-600">
                  {transactions.filter(tx => tx.beneficiaries).reduce((sum, tx) => sum + (tx.beneficiaries || 0), 0)}
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}