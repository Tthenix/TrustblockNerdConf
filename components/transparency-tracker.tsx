"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { ArrowUpRight, ArrowDownLeft, Wallet, Users, ShoppingCart, Building, Truck, HeartPulse, Home, BookOpen, Coffee, FileSpreadsheet } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'

interface Transaction {
  id: string
  date: string
  amount: number
  from?: string
  to?: string
  type: "donation" | "expense"
  purpose?: string
  category?: string
  beneficiaries?: number
  status: "completed" | "pending" | "failed"
}

interface TransparencyTrackerProps {
  transactions: Transaction[]
  totalBudget: number
  spentBudget: number
  donorsCount: number
}

// Datos de ejemplo para el gráfico
const transactionData = [
  { date: '2024-01', amount: 15000, transactions: 45 },
  { date: '2024-02', amount: 25000, transactions: 62 },
  { date: '2024-03', amount: 32000, transactions: 78 },
  { date: '2024-04', amount: 45000, transactions: 95 },
  { date: '2024-05', amount: 52000, transactions: 112 },
  { date: '2024-06', amount: 68000, transactions: 128 },
  { date: '2024-07', amount: 75000, transactions: 145 },
].map(item => ({
  ...item,
  formattedDate: new Date(item.date).toLocaleDateString('es-ES', { month: 'short' })
}))

// Categorías de gastos para iconos
const categoryIcons = {
  "suministros": <ShoppingCart className="h-4 w-4" />,
  "infraestructura": <Building className="h-4 w-4" />,
  "logistica": <Truck className="h-4 w-4" />,
  "salud": <HeartPulse className="h-4 w-4" />,
  "alojamiento": <Home className="h-4 w-4" />,
  "educacion": <BookOpen className="h-4 w-4" />,
  "administrativo": <FileSpreadsheet className="h-4 w-4" />,
  "otros": <Coffee className="h-4 w-4" />,
}

// Colores para las categorías en el gráfico de torta - Paleta ajustada para TrustBlock
const COLORS = [
  '#3b82f6', // azul principal
  '#0ea5e9', // skyblue claro
  '#06b6d4', // cyan
  '#8b5cf6', // violeta
  '#ec4899', // rosa/magenta
  '#f43f5e', // rosa más intenso
  '#6366f1', // indigo
  '#a855f7' // púrpura
];

export function TransparencyTracker({ 
  transactions, 
  totalBudget,
  spentBudget,
  donorsCount
}: TransparencyTrackerProps) {
  const donations = transactions.filter((tx) => tx.type === "donation")
  const expenses = transactions.filter((tx) => tx.type === "expense")

  const totalDonations = donations.reduce((sum, tx) => sum + tx.amount, 0)
  const totalExpenses = expenses.reduce((sum, tx) => sum + tx.amount, 0)
  const budgetProgress = (spentBudget / totalBudget) * 100

  // Agrupar gastos por categoría para el gráfico de torta
  const expensesByCategory = expenses.reduce((acc, expense) => {
    const category = expense.category || "otros";
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const pieChartData = Object.entries(expensesByCategory).map(([name, value]) => ({
    name,
    value
  }));

  // Función auxiliar para obtener el icono según la categoría
  const getCategoryIcon = (category: string) => {
    const key = category.toLowerCase().replace(/\s+/g, '') as keyof typeof categoryIcons;
    return categoryIcons[key] || categoryIcons.otros;
  };

  return (
    <Tabs defaultValue="list" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="list">Lista de Transacciones</TabsTrigger>
        <TabsTrigger value="expenses">Desglose de Gastos</TabsTrigger>
        <TabsTrigger value="chart">Análisis</TabsTrigger>
      </TabsList>
      <TabsContent value="list">
        <Card className="border-skyblue/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-skyblue" />
              Seguimiento de Fondos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card className="border-skyblue/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <ArrowUpRight className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-muted-foreground">Donaciones Totales</span>
                  </div>
                  <div className="text-2xl font-bold text-green-600">{totalDonations.toLocaleString()} DOT</div>
                </CardContent>
              </Card>

              <Card className="border-skyblue/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <ArrowDownLeft className="h-4 w-4 text-red-500" />
                    <span className="text-sm text-muted-foreground">Gastos Totales</span>
                  </div>
                  <div className="text-2xl font-bold text-red-600">{totalExpenses.toLocaleString()} DOT</div>
                </CardContent>
              </Card>

              <Card className="border-skyblue/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-4 w-4 text-skyblue" />
                    <span className="text-sm text-muted-foreground">Donantes</span>
                  </div>
                  <div className="text-2xl font-bold text-skyblue">{donorsCount}</div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-sm">
                <span>Presupuesto Utilizado</span>
                <span className="font-medium">{spentBudget.toLocaleString()} / {totalBudget.toLocaleString()} DOT</span>
              </div>
              <Progress value={budgetProgress} className="h-2 bg-muted [&>div]:bg-skyblue" />
            </div>

            <div className="space-y-4">
              {transactions.map((tx) => (
                <Card key={tx.id} className="border-skyblue/20">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {tx.type === "donation" ? (
                          <ArrowUpRight className="h-5 w-5 text-green-500" />
                        ) : (
                          <ArrowDownLeft className="h-5 w-5 text-red-500" />
                        )}
                        <div>
                          <h4 className="font-medium">
                            {tx.type === "donation" ? "Donación" : "Gasto"}
                            {tx.category && tx.type === "expense" && (
                              <Badge variant="outline" className="ml-2 text-xs">
                                {tx.category}
                              </Badge>
                            )}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {tx.purpose || "Sin descripción"}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">
                          {tx.type === "donation" ? "+" : "-"}{tx.amount.toLocaleString()} DOT
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(tx.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="expenses">
        <Card>
          <CardHeader>
            <CardTitle>Detalle de Gastos</CardTitle>
            <CardDescription>
              Distribución detallada de los gastos realizados por los organizadores
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-8">
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend />
                    <Tooltip formatter={(value) => `${Number(value).toLocaleString()} DOT`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <h3 className="text-lg font-semibold mb-4">Lista de Gastos por Categoría</h3>
            
            {expenses.length > 0 ? (
              <div className="space-y-6">
                {Object.entries(expensesByCategory).map(([category, total]) => (
                  <div key={category} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(category)}
                        <h4 className="font-medium capitalize">{category}</h4>
                      </div>
                      <span className="font-bold">{total.toLocaleString()} DOT</span>
                    </div>
                    
                    <div className="pl-6 space-y-2">
                      {expenses
                        .filter(exp => (exp.category || "otros") === category)
                        .map(exp => (
                          <div key={exp.id} className="border-l-2 border-muted pl-4 py-2">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium">{exp.purpose || "Gasto sin descripción"}</p>
                                {exp.beneficiaries && (
                                  <p className="text-sm text-muted-foreground">
                                    Beneficiarios: {exp.beneficiaries} personas
                                  </p>
                                )}
                                <p className="text-xs text-muted-foreground">
                                  {new Date(exp.date).toLocaleDateString()}
                                </p>
                              </div>
                              <span className="font-medium text-red-600">-{exp.amount.toLocaleString()} DOT</span>
                            </div>
                          </div>
                        ))
                      }
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                No hay registros de gastos para esta campaña aún.
              </p>
            )}
            
            <div className="mt-8 p-4 bg-muted/30 rounded-lg border border-muted">
              <h4 className="font-medium mb-2">Información de Transparencia</h4>
              <p className="text-sm text-muted-foreground">
                Todos los gastos están registrados en la blockchain y son verificables. 
                Esta información se actualiza en tiempo real a medida que los organizadores 
                utilizan los fondos. Cada transacción tiene un identificador único que puede 
                ser rastreado en la red de Polkadot.
              </p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="chart">
        <Card>
          <CardHeader>
            <CardTitle>Análisis de Fondos</CardTitle>
            <CardDescription>
              Visualización del flujo de fondos y transacciones en la plataforma
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={transactionData}
                  margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorTransactions" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="formattedDate"
                    className="text-muted-foreground text-xs"
                  />
                  <YAxis
                    yAxisId="left"
                    className="text-muted-foreground text-xs"
                    tickFormatter={(value) => `${value.toLocaleString()} DOT`}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    className="text-muted-foreground text-xs"
                    tickFormatter={(value) => `${value} tx`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      borderColor: 'hsl(var(--border))',
                      borderRadius: 'var(--radius)',
                    }}
                    labelStyle={{ color: 'hsl(var(--foreground))' }}
                    formatter={(value, name) => [
                      name === "Monto Total" 
                        ? `${Number(value).toLocaleString()} DOT` 
                        : `${value} transacciones`,
                      name
                    ]}
                  />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="amount"
                    stroke="#8b5cf6"
                    fillOpacity={1}
                    fill="url(#colorAmount)"
                    name="Monto Total"
                  />
                  <Area
                    yAxisId="right"
                    type="monotone"
                    dataKey="transactions"
                    stroke="#ec4899"
                    fillOpacity={1}
                    fill="url(#colorTransactions)"
                    name="Transacciones"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
