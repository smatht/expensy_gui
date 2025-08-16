"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Menu,
  Bell,
  Moon,
  Sun,
  CreditCard,
  BarChart3,
  Receipt,
  FileText,
  CreditCardIcon as PaymentIcon,
  Settings,
  HelpCircle,
  X,
  ShoppingCart,
  Briefcase,
  Play,
  ArrowRight,
  Plus,
  Tag,
} from "lucide-react"
import NewTransactionPage from "./new-transaction/page" // Import new transaction page
import CategoriesPage from "./categories/page" // Added import for categories page
import TransactionsPage from "./transactions/page" // Added import for transactions page

export default function BankingApp() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(true)
  const [currentPage, setCurrentPage] = useState("dashboard") // Added page state management
  const [transactionFilter, setTransactionFilter] = useState<"all" | "income" | "expense">("all") // Added filter state for transactions page

  const accounts = [
    {
      name: "Ahorros Principal",
      description: "Ahorros personales",
      amount: "$8,459.45",
      icon: "🟢",
      bgColor: "bg-green-500",
    },
    {
      name: "Cuenta Corriente",
      description: "Gastos diarios",
      amount: "$2,850.00",
      icon: "🔵",
      bgColor: "bg-blue-500",
    },
    {
      name: "Cartera de Inversión",
      description: "Acciones y ETFs",
      amount: "$15,230.80",
      icon: "🟣",
      bgColor: "bg-purple-500",
    },
    {
      name: "Tarjeta de Crédito",
      description: "Cargos pendientes",
      amount: "$1,200.00",
      icon: "🔴",
      bgColor: "bg-red-500",
    },
    {
      name: "Cuenta de Ahorros",
      description: "Fondo de emergencia",
      amount: "$3,000.00",
      icon: "🟢",
      bgColor: "bg-green-500",
    },
  ]

  const recentTransactions = [
    {
      name: "Compra Apple Store",
      time: "Hoy, 2:45 PM",
      amount: "-$999.00",
      icon: ShoppingCart,
      bgColor: "bg-gray-700",
      isNegative: true,
    },
    {
      name: "Depósito de Salario",
      time: "Hoy, 9:00 AM",
      amount: "+$4,500.00",
      icon: Briefcase,
      bgColor: "bg-gray-700",
      isNegative: false,
    },
    {
      name: "Suscripción Netflix",
      time: "Ayer",
      amount: "-$15.99",
      icon: Play,
      bgColor: "bg-gray-700",
      isNegative: true,
    },
    {
      name: "Compra Apple Store",
      time: "Hoy, 2:45 PM",
      amount: "-$999.00",
      icon: ShoppingCart,
      bgColor: "bg-gray-700",
      isNegative: true,
    },
    {
      name: "Suscripción Supabase",
      time: "Ayer",
      amount: "-$15.99",
      icon: Receipt,
      bgColor: "bg-gray-700",
      isNegative: true,
    },
    {
      name: "Suscripción Vercel",
      time: "Ayer",
      amount: "-$15.99",
      icon: Receipt,
      bgColor: "bg-gray-700",
      isNegative: true,
    },
  ]

  const sidebarItems = {
    overview: [
      { name: "Panel Principal", icon: BarChart3, page: "dashboard" }, // Kept only Dashboard in overview
      {
        name: "Analista",
        icon: BarChart3,
        page: "analyst",
        external: true,
        url: "https://lookerstudio.google.com/u/0/reporting/d557a80a-c6dd-495a-94f6-2698d79b9c64/page/p_t11cae6cud",
      }, // Added Analyst option that opens external link
    ],
    finance: [
      { name: "Transacciones", icon: Receipt, page: "transactions" },
      { name: "Facturas", icon: FileText, page: "invoices" },
      { name: "Pagos", icon: PaymentIcon, page: "payments" },
      { name: "Categorías", icon: Tag, page: "categories" }, // Added Categories option
      { name: "Nueva transacción", icon: Plus, page: "new-transaction" },
    ],
    footer: [
      { name: "Configuración", icon: Settings, page: "settings" },
      { name: "Ayuda", icon: HelpCircle, page: "help" },
    ],
  }

  const handleNavigation = (page: string) => {
    if (page === "invoices") {
      setTransactionFilter("income")
      setCurrentPage("transactions")
    } else if (page === "payments") {
      setTransactionFilter("expense")
      setCurrentPage("transactions")
    } else {
      setTransactionFilter("all")
      setCurrentPage(page)
    }
    setSidebarOpen(false)
  }

  const handleExternalLink = (url: string) => {
    window.open(url, "_blank")
    setSidebarOpen(false)
  }

  if (currentPage === "new-transaction") {
    return <NewTransactionPage onBack={() => setCurrentPage("dashboard")} />
  }

  if (currentPage === "categories") {
    return <CategoriesPage onBack={() => setCurrentPage("dashboard")} />
  }

  if (currentPage === "transactions") {
    return <TransactionsPage onBack={() => setCurrentPage("dashboard")} initialFilter={transactionFilter} />
  }

  return (
    <div className={`min-h-screen ${darkMode ? "dark" : ""}`}>
      <div className="bg-black text-white min-h-screen">
        {/* Top Bar */}
        <header className="flex items-center justify-between p-4 bg-black border-b border-gray-800">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
            className="text-white hover:bg-gray-800"
          >
            <Menu className="h-6 w-6" />
          </Button>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-white hover:bg-gray-800">
              <Bell className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-gray-800"
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Avatar className="h-8 w-8">
              <AvatarImage src="/user-profile-illustration.png" />
              <AvatarFallback className="bg-red-500 text-white">U</AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Sidebar Overlay */}
        <div
          className={`fixed inset-0 z-50 transition-opacity duration-300 ${
            sidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 transition-opacity duration-300"
            onClick={() => setSidebarOpen(false)}
          />

          {/* Sidebar */}
          <div
            className={`fixed left-0 top-0 h-full w-80 bg-black border-r border-gray-800 transform transition-transform duration-300 ease-in-out ${
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="p-6 overflow-y-auto h-full">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm transform rotate-340">E</span>
                  </div>
                  <span className="text-white font-semibold text-lg">Expensy</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSidebarOpen(false)}
                  className="text-white hover:bg-gray-800"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Overview Section */}
              <div className="mb-6">
                <h3 className="text-gray-400 text-sm font-medium mb-3 uppercase tracking-wider">Resumen</h3>
                <div className="space-y-1">
                  {sidebarItems.overview.map((item) => (
                    <Button
                      key={item.name}
                      variant="ghost"
                      className="w-full justify-start text-gray-300 hover:bg-gray-800 hover:text-white transition-colors duration-200"
                      onClick={() => (item.external ? handleExternalLink(item.url!) : handleNavigation(item.page))}
                    >
                      <item.icon className="h-4 w-4 mr-3" />
                      {item.name}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Finance Section */}
              <div className="mb-8">
                <h3 className="text-gray-400 text-sm font-medium mb-3 uppercase tracking-wider">Finanzas</h3>
                <div className="space-y-1">
                  {sidebarItems.finance.map((item) => (
                    <Button
                      key={item.name}
                      variant="ghost"
                      className="w-full justify-start text-gray-300 hover:bg-gray-800 hover:text-white transition-colors duration-200"
                      onClick={() => handleNavigation(item.page)}
                    >
                      <item.icon className="h-4 w-4 mr-3" />
                      {item.name}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Footer Section */}
              <div className="border-t border-gray-800 pt-4">
                <div className="space-y-1">
                  {sidebarItems.footer.map((item) => (
                    <Button
                      key={item.name}
                      variant="ghost"
                      className="w-full justify-start text-gray-300 hover:bg-gray-800 hover:text-white transition-colors duration-200"
                      onClick={() => handleNavigation(item.page)}
                    >
                      <item.icon className="h-4 w-4 mr-3" />
                      {item.name}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="p-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Accounts Card */}
            <Card className="bg-gray-900 border-gray-800 rounded-2xl p-6">
              {/* Accounts Header */}
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="h-5 w-5 text-white" />
                <h1 className="text-white text-xl font-semibold">Categorías</h1>
              </div>

              {/* Total Balance */}
              <div className="mb-4">
                <p className="text-gray-400 text-sm mb-2">Gasto por categoría</p>
                <p className="text-white text-3xl font-bold">$-26,540.25</p>
              </div>

              {/* Your Accounts */}
              <div className="mb-8">
                <h2 className="text-white text-lg font-medium mb-4">Categorías relevantes</h2>
                <div className="space-y-4">
                  {accounts.map((account, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 ${account.bgColor} rounded-lg flex items-center justify-center`}>
                          <span className="text-white text-sm">
                            {account.name === "Cuenta Corriente"
                              ? "••"
                              : account.name === "Cartera de Inversión"
                                ? "▲"
                                : account.name === "Tarjeta de Crédito"
                                  ? "▬"
                                  : "■"}
                          </span>
                        </div>
                        <div>
                          <p className="text-white font-medium">{account.name}</p>
                          <p className="text-gray-400 text-sm">{account.description}</p>
                        </div>
                      </div>
                      <p className="text-white font-medium">{account.amount}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6">
                <Button className="w-full bg-gray-800 text-white hover:bg-gray-700 rounded-xl py-3 flex items-center justify-center gap-2">
                  Ver Todas las Categorías
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </Card>

            <Card className="bg-gray-900 border-gray-800 rounded-2xl p-6">
              {/* Recent Transactions Header */}
              <div className="flex items-center gap-2 mb-6">
                <Receipt className="h-5 w-5 text-white" />
                <h1 className="text-white text-xl font-semibold">Transacciones Recientes</h1>
              </div>

              {/* Recent Activity Header */}
              <div className="mb-6">
                <p className="text-white text-lg font-medium">Actividad Reciente</p>
                <p className="text-gray-400 text-sm">(23 transacciones) Este Mes</p>
              </div>

              {/* Transactions List */}
              <div className="space-y-4 mb-6">
                {recentTransactions.map((transaction, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 ${transaction.bgColor} rounded-lg flex items-center justify-center`}>
                        <transaction.icon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-white font-medium">{transaction.name}</p>
                        <p className="text-gray-400 text-sm">{transaction.time}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className={`font-medium ${transaction.isNegative ? "text-red-400" : "text-green-400"}`}>
                        {transaction.amount}
                      </p>
                      <ArrowRight className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <Button
                  className="bg-gray-200 text-black hover:bg-gray-300 rounded-xl py-3 flex items-center justify-center gap-2"
                  onClick={() => handleNavigation("new-transaction")}
                >
                  <Plus className="h-4 w-4" />
                  Agregar transacción
                </Button>
                <Button className="bg-gray-800 text-white hover:bg-gray-700 rounded-xl py-3 flex items-center justify-center gap-2">
                  Ver Todas las Transacciones
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
