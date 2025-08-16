"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Plus, Minus, ChevronDown, AlertCircle, CheckCircle } from "lucide-react"
import { useTransactionForm } from "@/hooks/use-transaction-form"

interface NewTransactionPageProps {
  onBack: () => void
}

export default function NewTransactionPage({ onBack }: NewTransactionPageProps) {
  const [transactionType, setTransactionType] = useState<"expense" | "income">("expense")
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState("")
  const [date, setDate] = useState("")
  const [category, setCategory] = useState("")

  const {
    categories,
    isLoading,
    error,
    isSuccess,
    createTransaction,
    clearError,
    clearSuccess,
  } = useTransactionForm()

  const handleTransactionTypeChange = (type: "expense" | "income") => {
    setTransactionType(type)

    if (amount) {
      const numericValue = Math.abs(Number.parseFloat(amount))
      if (type === "expense") {
        setAmount(`-${numericValue}`)
      } else {
        setAmount(numericValue.toString())
      }
    }
  }

  const handleAmountChange = (value: string) => {
    if (value === "" || value === "-") {
      setAmount(value)
      return
    }

    const numericValue = Math.abs(Number.parseFloat(value))
    if (!isNaN(numericValue)) {
      if (transactionType === "expense") {
        setAmount(`-${numericValue}`)
      } else {
        setAmount(numericValue.toString())
      }
    }
  }

  const setTodayDate = () => {
    const today = new Date()
    const formattedDate = today.toISOString().split("T")[0]
    setDate(formattedDate)
  }

  const handleClear = () => {
    setDescription("")
    setAmount("")
    setDate("")
    setCategory("")
    setTransactionType("expense")
  }

  const handleSave = async () => {
    const success = await createTransaction({
      description,
      amount,
      date,
      category,
      transactionType,
    })
    
    if (success) {
      // Clear form and show success message
      handleClear()
      setTimeout(() => {
        clearSuccess()
        onBack()
      }, 2000)
    }
  }

  const handleSaveAndSync = async () => {
    const success = await createTransaction({
      description,
      amount,
      date,
      category,
      transactionType,
    })
    
    if (success) {
      // Clear form and show success message
      handleClear()
      setTimeout(() => {
        clearSuccess()
        onBack()
      }, 2000)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-black border-b border-gray-800">
        <Button variant="ghost" size="icon" onClick={onBack} className="text-white hover:bg-gray-800">
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-white text-lg font-semibold">Nueva Transacción</h1>
        <div className="w-10" /> {/* Spacer for centering */}
      </header>

      {/* Main Content */}
      <main className="p-4 flex justify-center">
        <Card className="bg-gray-900 border-gray-800 rounded-2xl p-6 w-full max-w-md">
          <div className="space-y-6">
            {/* Error Alert */}
            {error && (
              <Alert className="bg-red-900/20 border-red-800 text-red-200">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  {error}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearError}
                    className="ml-2 h-auto p-1 text-red-300 hover:text-red-100 hover:bg-red-800/30"
                  >
                    ×
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            {/* Success Alert */}
            {isSuccess && (
              <Alert className="bg-green-900/20 border-green-800 text-green-200">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  Transaction saved successfully!
                </AlertDescription>
              </Alert>
            )}
            {/* Description Field */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-white text-sm font-medium">
                Descripción
              </Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ingresa una descripción"
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 focus:border-gray-600"
              />
            </div>

            {/* Transaction Type Toggle */}
            <div className="space-y-2">
              <Label className="text-white text-sm font-medium">Tipo</Label>
              <div className="flex bg-gray-800 rounded-lg p-1">
                <Button
                  variant={transactionType === "expense" ? "default" : "ghost"}
                  className={`flex-1 rounded-md transition-colors ${
                    transactionType === "expense"
                      ? "bg-red-500 text-white hover:bg-red-600"
                      : "text-gray-400 hover:text-white hover:bg-gray-700"
                  }`}
                  onClick={() => handleTransactionTypeChange("expense")}
                >
                  <Minus className="h-4 w-4 mr-2" />
                  Gasto
                </Button>
                <Button
                  variant={transactionType === "income" ? "default" : "ghost"}
                  className={`flex-1 rounded-md transition-colors ${
                    transactionType === "income"
                      ? "bg-green-500 text-white hover:bg-green-600"
                      : "text-gray-400 hover:text-white hover:bg-gray-700"
                  }`}
                  onClick={() => handleTransactionTypeChange("income")}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ingreso
                </Button>
              </div>
            </div>

            {/* Amount Field */}
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-white text-sm font-medium">
                Monto
              </Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => handleAmountChange(e.target.value)}
                placeholder="0.00"
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 focus:border-gray-600"
              />
            </div>

            {/* Date Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="date" className="text-white text-sm font-medium">
                  Fecha
                </Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={setTodayDate}
                  className="text-blue-400 hover:text-blue-300 hover:bg-gray-800 text-xs px-2 py-1 h-auto"
                >
                  Hoy
                </Button>
              </div>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white focus:border-gray-600"
              />
            </div>

            {/* Category Field */}
            <div className="space-y-2">
              <Label className="text-white text-sm font-medium">Categoría</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-full bg-gray-800 border-gray-700 text-white focus:border-gray-600">
                  <SelectValue placeholder={isLoading ? "Loading categories..." : "Selecciona una categoría"} />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {isLoading ? (
                    <div className="p-2 text-center text-gray-400 text-sm">Loading categories...</div>
                  ) : categories.length > 0 ? (
                    categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.name} className="text-white hover:bg-gray-700 focus:bg-gray-700">
                        {cat.name}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="p-2 text-center text-gray-400 text-sm">No categories available</div>
                  )}
                </SelectContent>
              </Select>
              {error && categories.length === 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.location.reload()}
                  className="text-blue-400 hover:text-blue-300 text-xs p-0 h-auto"
                >
                  Retry loading categories
                </Button>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                className="flex-1 bg-transparent border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
                onClick={handleClear}
                disabled={isLoading}
              >
                Limpiar
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    className="flex-1 bg-blue-600 text-white hover:bg-blue-700 flex items-center justify-center gap-2"
                    disabled={!description || !amount || !date || !category || isLoading}
                  >
                    {isLoading ? "Guardando..." : "Guardar"}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-gray-800 border-gray-700" align="end">
                  <DropdownMenuItem
                    onClick={handleSave}
                    className="text-white hover:bg-gray-700 focus:bg-gray-700 cursor-pointer"
                    disabled={isLoading}
                  >
                    {isLoading ? "Guardando..." : "Guardar"}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleSaveAndSync}
                    className="text-white hover:bg-gray-700 focus:bg-gray-700 cursor-pointer"
                    disabled={isLoading}
                  >
                    {isLoading ? "Guardando..." : "Guardar y sincronizar"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </Card>
      </main>
    </div>
  )
}
