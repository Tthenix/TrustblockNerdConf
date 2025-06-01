"use client"

import { useEffect, useState } from "react"
import { useBlockchainContracts } from "@/hooks/useBlockchainContracts"
import { ethers } from "ethers"
import { ExternalLink } from "lucide-react"
import { Button } from "./ui/button"

interface Transaction {
  hash: string
  from: string
  value: string
  timestamp: number
  blockNumber: number
}

interface TransactionsListProps {
  campaignAddress: string
}

interface Log {
  transactionHash: string
  blockNumber: number
}

// Función nativa para formatear tiempo transcurrido
function formatTimeAgo(timestamp: number): string {
  const now = Date.now()
  const diff = now - timestamp
  
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const months = Math.floor(days / 30)
  const years = Math.floor(days / 365)
  
  if (years > 0) return `hace ${years} año${years > 1 ? 's' : ''}`
  if (months > 0) return `hace ${months} mes${months > 1 ? 'es' : ''}`
  if (days > 0) return `hace ${days} día${days > 1 ? 's' : ''}`
  if (hours > 0) return `hace ${hours} hora${hours > 1 ? 's' : ''}`
  if (minutes > 0) return `hace ${minutes} minuto${minutes > 1 ? 's' : ''}`
  return 'hace un momento'
}

export function TransactionsList({ campaignAddress }: TransactionsListProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const { provider } = useBlockchainContracts()

  useEffect(() => {
    const loadTransactions = async () => {
      if (!provider) return

      try {
        setLoading(true)
        // Obtener el bloque actual
        const currentBlock = await provider.getBlockNumber()
        
        // Buscar solo en los últimos 1000 bloques para evitar el error de rango
        const fromBlock = Math.max(0, currentBlock - 1000)
        
        const filter = {
          address: campaignAddress,
          topics: [
            ethers.id("ContributionMade(address,uint256)") // Evento ContributionMade
          ],
          fromBlock,
          toBlock: currentBlock
        }

        const logs = await provider.getLogs(filter)
        console.log("Found logs:", logs)

        const transactionsData = await Promise.all(
          logs.map(async (log: Log) => {
            try {
              const tx = await provider.getTransaction(log.transactionHash)
              const block = await provider.getBlock(log.blockNumber)
              
              return {
                hash: log.transactionHash,
                from: tx?.from || "Unknown",
                value: ethers.formatEther(tx?.value || 0),
                timestamp: block?.timestamp || 0,
                blockNumber: log.blockNumber
              }
            } catch (error) {
              console.error(`Error processing transaction ${log.transactionHash}:`, error)
              return null
            }
          })
        )

        // Filtrar transacciones nulas y ordenar por timestamp
        const validTransactions = transactionsData
          .filter((tx): tx is Transaction => tx !== null)
          .sort((a, b) => b.timestamp - a.timestamp)

        console.log("Processed transactions:", validTransactions)
        setTransactions(validTransactions)
      } catch (error) {
        console.error("Error loading transactions:", error)
      } finally {
        setLoading(false)
      }
    }

    loadTransactions()

    // Suscribirse a nuevos eventos
    if (provider) {
      const filter = {
        address: campaignAddress,
        topics: [ethers.id("ContributionMade(address,uint256)")]
      }

      provider.on(filter, async (log: Log) => {
        try {
          const tx = await provider.getTransaction(log.transactionHash)
          const block = await provider.getBlock(log.blockNumber)
          
          const newTransaction = {
            hash: log.transactionHash,
            from: tx?.from || "Unknown",
            value: ethers.formatEther(tx?.value || 0),
            timestamp: block?.timestamp || 0,
            blockNumber: log.blockNumber
          }

          // Actualizar transacciones evitando duplicados
          setTransactions(prev => {
            // Crear un Set con los hashes existentes
            const existingHashes = new Set(prev.map(t => t.hash))
            
            // Si la nueva transacción ya existe, no la añadimos
            if (existingHashes.has(newTransaction.hash)) {
              return prev
            }
            
            // Añadir la nueva transacción al principio
            return [newTransaction, ...prev]
          })
        } catch (error) {
          console.error("Error processing new transaction:", error)
        }
      })

      return () => {
        provider.removeAllListeners()
      }
    }
  }, [campaignAddress, provider])

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
        <p className="text-muted-foreground">Cargando transacciones...</p>
      </div>
    )
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-muted-foreground">No hay transacciones aún</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Historial de Donaciones</h3>
      <div className="space-y-2">
        {transactions.map((tx) => (
          <div
            key={tx.hash}
            className="flex items-center justify-between p-4 rounded-lg bg-card border border-skyblue/20"
          >
            <div className="space-y-1">
              <p className="text-sm font-medium">
                {tx.from.slice(0, 6)}...{tx.from.slice(-4)}
              </p>
              <p className="text-sm text-muted-foreground">
                {formatTimeAgo(tx.timestamp * 1000)}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <p className="font-medium text-neonpink">{tx.value} DEV</p>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => window.open(`https://moonbase.moonscan.io/tx/${tx.hash}`, '_blank')}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 