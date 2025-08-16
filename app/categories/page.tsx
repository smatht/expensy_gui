"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Tag, Plus, X, Loader2 } from "lucide-react"
import { useCategories } from "@/hooks/use-categories"
import { 
  Home, 
  Utensils, 
  Heart, 
  ShoppingCart, 
  CreditCard, 
  Wrench, 
  HeartHandshake, 
  GraduationCap, 
  Receipt, 
  Shirt, 
  PiggyBank, 
  PawPrint, 
  MoreHorizontal, 
  Banknote, 
  Settings, 
  ShoppingBag, 
  Car, 
  Plane, 
  Gamepad2, 
  DollarSign, 
  Calendar 
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface CategoriesPageProps {
  onBack: () => void
}

// Available icons for selection
const AVAILABLE_ICONS: { icon: LucideIcon; name: string; color: string }[] = [
  { icon: Home, name: 'Hogar', color: 'bg-blue-500' },
  { icon: Utensils, name: 'Comidas', color: 'bg-orange-500' },
  { icon: Heart, name: 'Salud', color: 'bg-red-500' },
  { icon: ShoppingCart, name: 'Supermercado', color: 'bg-green-500' },
  { icon: CreditCard, name: 'Comisiones', color: 'bg-purple-500' },
  { icon: Wrench, name: 'Servicios', color: 'bg-yellow-500' },
  { icon: HeartHandshake, name: 'Donaciones', color: 'bg-pink-500' },
  { icon: GraduationCap, name: 'Educación', color: 'bg-indigo-500' },
  { icon: Receipt, name: 'Impuestos', color: 'bg-red-600' },
  { icon: Shirt, name: 'Indumentaria', color: 'bg-cyan-500' },
  { icon: PiggyBank, name: 'Inversiones', color: 'bg-emerald-500' },
  { icon: PawPrint, name: 'Mascotas', color: 'bg-amber-500' },
  { icon: MoreHorizontal, name: 'Otros', color: 'bg-gray-500' },
  { icon: Banknote, name: 'Préstamos', color: 'bg-rose-500' },
  { icon: Settings, name: 'Profesionales', color: 'bg-slate-500' },
  { icon: ShoppingBag, name: 'Shopping', color: 'bg-violet-500' },
  { icon: Car, name: 'Transporte', color: 'bg-sky-500' },
  { icon: Plane, name: 'Viajes', color: 'bg-teal-500' },
  { icon: Gamepad2, name: 'Entretenimiento', color: 'bg-fuchsia-500' },
  { icon: DollarSign, name: 'Sueldo', color: 'bg-green-600' },
  { icon: Calendar, name: 'Suscripciones', color: 'bg-blue-600' },
]

export default function CategoriesPage({ onBack }: CategoriesPageProps) {
  const { categories, loading, error, addCategory, deleteCategory, getCategoryIcon, getCategoryColor } = useCategories()
  const [showAddForm, setShowAddForm] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState("")
  const [selectedIcon, setSelectedIcon] = useState<LucideIcon>(Tag)
  const [selectedColor, setSelectedColor] = useState("bg-gray-500")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAddCategory = async () => {
    if (newCategoryName.trim()) {
      try {
        setIsSubmitting(true)
        await addCategory(newCategoryName.trim())
        setNewCategoryName("")
        setSelectedIcon(Tag)
        setSelectedColor("bg-gray-500")
        setShowAddForm(false)
      } catch (error) {
        console.error("Error adding category:", error)
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const handleDeleteCategory = async (id: number) => {
    try {
      await deleteCategory(id)
    } catch (error) {
      console.error("Error deleting category:", error)
    }
  }

  const handleIconSelect = (icon: LucideIcon, color: string) => {
    setSelectedIcon(icon)
    setSelectedColor(color)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-green-500" />
          <p className="text-gray-400">Loading categories...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">Error loading categories: {error}</p>
          <Button onClick={() => window.location.reload()} className="bg-green-500 hover:bg-green-600">
            Try Again
          </Button>
        </div>
      </div>
    )
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
            {categories.length === 0 ? (
              <div className="text-center py-8">
                <Tag className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No categories found</p>
                <p className="text-gray-500 text-sm">Create your first category to get started</p>
              </div>
            ) : (
              categories.map((category) => {
                const IconComponent = getCategoryIcon(category.name)
                const colorClasses = getCategoryColor(category.name)
                
                return (
                  <div
                    key={category.id}
                    className="flex items-center justify-between p-4 bg-gray-800 rounded-xl hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 ${colorClasses} rounded-lg flex items-center justify-center`}>
                        <IconComponent className="h-5 w-5 text-white" />
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
                )
              })
            )}
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
                  disabled={isSubmitting}
                />
              </div>

              {/* Icon Selector */}
              <div className="mb-4">
                <Label className="text-white text-sm font-medium mb-2 block">
                  Selecciona un Icono
                </Label>
                <div className="grid grid-cols-5 gap-2 max-h-32 overflow-y-auto">
                  {AVAILABLE_ICONS.map((iconData, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleIconSelect(iconData.icon, iconData.color)}
                      className={`w-12 h-12 ${iconData.color} rounded-lg flex items-center justify-center transition-all hover:scale-110 ${
                        selectedIcon === iconData.icon ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-800' : ''
                      }`}
                      title={iconData.name}
                    >
                      <iconData.icon className="h-6 w-6 text-white" />
                    </button>
                  ))}
                </div>
                <p className="text-gray-400 text-xs mt-1">
                  Icono seleccionado: {AVAILABLE_ICONS.find(i => i.icon === selectedIcon)?.name || 'Tag'}
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleAddCategory}
                  disabled={!newCategoryName.trim() || isSubmitting}
                  className="bg-green-500 hover:bg-green-600 text-white rounded-xl px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Adding...
                    </>
                  ) : (
                    "Agregar Categoría"
                  )}
                </Button>
                <Button
                  onClick={() => {
                    setShowAddForm(false)
                    setNewCategoryName("")
                    setSelectedIcon(Tag)
                    setSelectedColor("bg-gray-500")
                  }}
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-700 rounded-xl px-4 py-2"
                  disabled={isSubmitting}
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
