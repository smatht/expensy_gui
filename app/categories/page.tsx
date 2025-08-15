"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Tag, Plus, Home, Heart, Coffee, ShoppingCart, X } from "lucide-react"

interface CategoriesPageProps {
  onBack: () => void
}

export default function CategoriesPage({ onBack }: CategoriesPageProps) {
  const [categories, setCategories] = useState([
    { id: 1, name: "Hogar", icon: Home, color: "bg-blue-500" },
    { id: 2, name: "Salud y bienestar", icon: Heart, color: "bg-red-500" },
    { id: 3, name: "Ocio", icon: Coffee, color: "bg-purple-500" },
    { id: 4, name: "Supermercado", icon: ShoppingCart, color: "bg-green-500" },
  ])

  const [showAddForm, setShowAddForm] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState("")

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      const newCategory = {
        id: categories.length + 1,
        name: newCategoryName.trim(),
        icon: Tag,
        color: "bg-gray-500",
      }
      setCategories([...categories, newCategory])
      setNewCategoryName("")
      setShowAddForm(false)
    }
  }

  const handleDeleteCategory = (id: number) => {
    setCategories(categories.filter((category) => category.id !== id))
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-black border-b border-gray-800">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack} className="text-white hover:bg-gray-800">
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div className="flex items-center gap-2">
            <Tag className="h-6 w-6 text-white" />
            <h1 className="text-white text-xl font-semibold">Categorías</h1>
          </div>
        </div>

        <Button
          onClick={() => setShowAddForm(true)}
          className="bg-green-500 hover:bg-green-600 text-white rounded-xl px-4 py-2 flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Agregar Categoría
        </Button>
      </header>

      {/* Main Content */}
      <main className="p-4">
        <Card className="bg-gray-900 border-gray-800 rounded-2xl p-6 max-w-2xl mx-auto">
          <div className="mb-6">
            <h2 className="text-white text-lg font-medium mb-2">Todas las Categorías</h2>
            <p className="text-gray-400 text-sm">{categories.length} categorías disponibles</p>
          </div>

          {/* Categories List */}
          <div className="space-y-3">
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-between p-4 bg-gray-800 rounded-xl hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${category.color} rounded-lg flex items-center justify-center`}>
                    <category.icon className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-white font-medium">{category.name}</span>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteCategory(category.id)}
                  className="text-gray-400 hover:text-red-400 hover:bg-gray-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          {/* Add Category Form */}
          {showAddForm && (
            <div className="mt-6 p-4 bg-gray-800 rounded-xl">
              <div className="mb-4">
                <Label htmlFor="categoryName" className="text-white text-sm font-medium">
                  Nombre de la Categoría
                </Label>
                <Input
                  id="categoryName"
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Ingresa el nombre de la categoría"
                  className="mt-2 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-green-500"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleAddCategory}
                  disabled={!newCategoryName.trim()}
                  className="bg-green-500 hover:bg-green-600 text-white rounded-xl px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Agregar Categoría
                </Button>
                <Button
                  onClick={() => {
                    setShowAddForm(false)
                    setNewCategoryName("")
                  }}
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-700 rounded-xl px-4 py-2"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </Card>
      </main>
    </div>
  )
}
