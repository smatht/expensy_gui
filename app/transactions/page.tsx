"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Search, Filter, ShoppingCart, Briefcase, Play, Receipt, Plus, Minus } from "lucide-react"

interface Transaction {
  id: string
  name: string
  time: string
  amount: string
  icon: any
  bgColor: string
  isNegative: boolean
  category: string
}

interface TransactionsPageProps {
  onBack: () => void
  initialFilter?: "all" | "income" | "expense"
}

export default function TransactionsPage({ onBack, initialFilter = "all" }: TransactionsPageProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">(initialFilter)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)

  // Mock transaction data generator
  const generateMockTransactions = (pageNum: number, count = 20): Transaction[] => {
    const mockData = [
      { name: "Compra Apple Store", icon: ShoppingCart, category: "Ocio", isNegative: true },
      { name: "Depósito de Salario", icon: Briefcase, category: "Hogar", isNegative: false },
      { name: "Suscripción Netflix", icon: Play, category: "Ocio", isNegative: true },
      { name: "Supermercado", icon: ShoppingCart, category: "Supermercado", isNegative: true },
      { name: "Pago Freelance", icon: Briefcase, category: "Hogar", isNegative: false },
      { name: "Consulta Médica", icon: Receipt, category: "Salud y bienestar", isNegative: true },
      { name: "Suscripción Supabase", icon: Receipt, category: "Ocio", isNegative: true },
      { name: "Suscripción Vercel", icon: Receipt, category: "Ocio", isNegative: true },
    ]

    return Array.from({ length: count }, (_, index) => {
      const baseIndex = (pageNum - 1) * count + index
      const template = mockData[baseIndex % mockData.length]
      const amount = template.isNegative
        ? `-$${(Math.random() * 500 + 10).toFixed(2)}`
        : `+$${(Math.random() * 2000 + 100).toFixed(2)}`

      return {
        id: `transaction-${baseIndex}`,
        name: `${template.name} ${baseIndex > 7 ? `#${baseIndex - 7}` : ""}`,
        time: `hace ${Math.floor(Math.random() * 30) + 1} días`,
        amount,
        icon: template.icon,
        bgColor: "bg-gray-700",
        isNegative: template.isNegative,
        category: template.category,
      }
    })
  }

  // Load initial transactions
  useEffect(() => {
    const initialTransactions = generateMockTransactions(1)
    setTransactions(initialTransactions)
    setFilteredTransactions(initialTransactions)
  }, [])

  // Filter and search transactions
  useEffect(() => {
    let filtered = transactions

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (transaction) =>
          transaction.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          transaction.category.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply type filter
    if (filterType === "income") {
      filtered = filtered.filter((transaction) => !transaction.isNegative)
    } else if (filterType === "expense") {
      filtered = filtered.filter((transaction) => transaction.isNegative)
    }

    setFilteredTransactions(filtered)
  }, [transactions, searchTerm, filterType])

  // Load more transactions (infinite scroll)
  const loadMoreTransactions = useCallback(() => {
    if (loading || !hasMore) return

    setLoading(true)

    // Simulate API delay
    setTimeout(() => {
      const newPage = page + 1
      const newTransactions = generateMockTransactions(newPage)

      if (newPage >= 10) {
        // Stop loading after 10 pages
        setHasMore(false)
      }

      setTransactions((prev) => [...prev, ...newTransactions])
      setPage(newPage)
      setLoading(false)
    }, 1000)
  }, [loading, hasMore, page])

  // Infinite scroll handler
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 1000) {
        loadMoreTransactions()
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [loadMoreTransactions])

  useEffect(() => {
    setFilterType(initialFilter)
  }, [initialFilter])

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-black border-b border-gray-800">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack} className="text-white hover:bg-gray-800">
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-white text-xl font-semibold">Transacciones</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4">
        <Card className="bg-gray-900 border-gray-800 rounded-2xl p-6">
          {/* Search and Filter Section */}
          <div className="mb-6 space-y-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar transacciones..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400 rounded-xl"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-2">
              <Button
                variant={filterType === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType("all")}
                className={`rounded-xl ${
                  filterType === "all"
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700"
                }`}
              >
                <Filter className="h-4 w-4 mr-2" />
                Todas
              </Button>
              <Button
                variant={filterType === "income" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType("income")}
                className={`rounded-xl ${
                  filterType === "income"
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700"
                }`}
              >
                <Plus className="h-4 w-4 mr-2" />
                Facturas (+)
              </Button>
              <Button
                variant={filterType === "expense" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType("expense")}
                className={`rounded-xl ${
                  filterType === "expense"
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700"
                }`}
              >
                <Minus className="h-4 w-4 mr-2" />
                Pagos (-)
              </Button>
            </div>
          </div>

          {/* Transactions List */}
          <div className="space-y-4">
            {filteredTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 bg-gray-800 rounded-xl hover:bg-gray-750 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 ${transaction.bgColor} rounded-xl flex items-center justify-center`}>
                    <transaction.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-medium">{transaction.name}</p>
                    <p className="text-gray-400 text-sm">{transaction.time}</p>
                    <p className="text-gray-500 text-xs">{transaction.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold text-lg ${transaction.isNegative ? "text-red-400" : "text-green-400"}`}>
                    {transaction.amount}
                  </p>
                </div>
              </div>
            ))}

            {/* Loading Indicator */}
            {loading && (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            )}

            {/* No More Data Indicator */}
            {!hasMore && filteredTransactions.length > 0 && (
              <div className="text-center py-8">
                <p className="text-gray-400">No hay más transacciones para cargar</p>
              </div>
            )}

            {/* No Results */}
            {filteredTransactions.length === 0 && !loading && (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">No se encontraron transacciones</p>
                <p className="text-gray-500 text-sm mt-2">Intenta ajustar tu búsqueda o criterios de filtro</p>
              </div>
            )}
          </div>
        </Card>
      </main>
    </div>
  )
}
