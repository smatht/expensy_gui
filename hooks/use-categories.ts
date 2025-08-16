import { useState, useEffect } from 'react'
import { Category } from '@/lib/types'
import { apiClient } from '@/lib/api-client'
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

// Icon mapping for Spanish category names
const ICON_MAP: Record<string, LucideIcon> = {
  // Categorías en español
  'hogar': Home,
  'comidas y bebidas': Utensils,
  'salud y cuidado personal': Heart,
  'supermercado': ShoppingCart,
  'comisiones y cargos': CreditCard,
  'cuentas y servicios': Wrench,
  'donaciones': HeartHandshake,
  'educación': GraduationCap,
  'impuestos': Receipt,
  'indumentaria': Shirt,
  'inversiones': PiggyBank,
  'mascotas': PawPrint,
  'otros': MoreHorizontal,
  'préstamos y financiación': Banknote,
  'servicios profesionales': Settings,
  'shopping': ShoppingBag,
  'transporte': Car,
  'viajes': Plane,
  'entretenimiento': Gamepad2,
  'amistades y familia': HeartHandshake,
  'sueldo': DollarSign,
  'suscripciones': Calendar,
  // Fallbacks para variaciones
  'comidas': Utensils,
  'bebidas': Utensils,
  'salud': Heart,
  'cuidado personal': Heart,
  'comisiones': CreditCard,
  'cargos': CreditCard,
  'cuentas': Wrench,
  'servicios': Wrench,
  'educacion': GraduationCap,
  'prestamos': Banknote,
  'financiacion': Banknote,
  'profesionales': Settings,
  'amistades': HeartHandshake,
  'familia': HeartHandshake,
  // Default fallback
  'default': MoreHorizontal
}

// Color schemes for Spanish categories
const COLOR_SCHEMES: Record<string, string> = {
  // Categorías en español
  'hogar': 'bg-blue-500 hover:bg-blue-600',
  'comidas y bebidas': 'bg-orange-500 hover:bg-orange-600',
  'salud y cuidado personal': 'bg-red-500 hover:bg-red-600',
  'supermercado': 'bg-green-500 hover:bg-green-600',
  'comisiones y cargos': 'bg-purple-500 hover:bg-purple-600',
  'cuentas y servicios': 'bg-yellow-500 hover:bg-yellow-600',
  'donaciones': 'bg-pink-500 hover:bg-pink-600',
  'educación': 'bg-indigo-500 hover:bg-indigo-600',
  'impuestos': 'bg-red-600 hover:bg-red-700',
  'indumentaria': 'bg-cyan-500 hover:bg-cyan-600',
  'inversiones': 'bg-emerald-500 hover:bg-emerald-600',
  'mascotas': 'bg-amber-500 hover:bg-amber-600',
  'otros': 'bg-gray-500 hover:bg-gray-600',
  'préstamos y financiación': 'bg-rose-500 hover:bg-rose-600',
  'servicios profesionales': 'bg-slate-500 hover:bg-slate-600',
  'shopping': 'bg-violet-500 hover:bg-violet-600',
  'transporte': 'bg-sky-500 hover:bg-sky-600',
  'viajes': 'bg-teal-500 hover:bg-teal-600',
  'entretenimiento': 'bg-fuchsia-500 hover:bg-fuchsia-600',
  'amistades y familia': 'bg-pink-500 hover:bg-pink-600',
  'sueldo': 'bg-green-600 hover:bg-green-700',
  'suscripciones': 'bg-blue-600 hover:bg-blue-700',
  // Fallbacks para variaciones
  'comidas': 'bg-orange-500 hover:bg-orange-600',
  'bebidas': 'bg-orange-500 hover:bg-orange-600',
  'salud': 'bg-red-500 hover:bg-red-600',
  'cuidado personal': 'bg-red-500 hover:bg-red-600',
  'comisiones': 'bg-purple-500 hover:bg-purple-600',
  'cargos': 'bg-purple-500 hover:bg-purple-600',
  'cuentas': 'bg-yellow-500 hover:bg-yellow-600',
  'servicios': 'bg-yellow-500 hover:bg-yellow-600',
  'donaciones': 'bg-pink-500 hover:bg-pink-600',
  'educacion': 'bg-indigo-500 hover:bg-indigo-600',
  'indumentaria': 'bg-cyan-500 hover:bg-cyan-600',
  'inversiones': 'bg-emerald-500 hover:bg-emerald-600',
  'mascotas': 'bg-amber-500 hover:bg-amber-600',
  'prestamos': 'bg-rose-500 hover:bg-rose-600',
  'financiacion': 'bg-rose-500 hover:bg-rose-600',
  'profesionales': 'bg-slate-500 hover:bg-slate-600',
  'transporte': 'bg-sky-500 hover:bg-sky-600',
  'viajes': 'bg-teal-500 hover:bg-teal-600',
  'entretenimiento': 'bg-fuchsia-500 hover:bg-fuchsia-600',
  'amistades': 'bg-pink-500 hover:bg-pink-600',
  'familia': 'bg-pink-500 hover:bg-pink-600',
  'sueldo': 'bg-green-600 hover:bg-green-700',
  'suscripciones': 'bg-blue-600 hover:bg-blue-700',
  // Default fallback
  'default': 'bg-gray-500 hover:bg-gray-600'
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCategories = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await apiClient.getCategories()
      setCategories(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error loading categories'
      setError(errorMessage)
      console.error('Error fetching categories:', err)
    } finally {
      setLoading(false)
    }
  }

  const addCategory = async (name: string) => {
    try {
      // For now, we'll add locally since the API doesn't have createCategory method
      // TODO: Implement createCategory in API client when available
      const newCategory: Category = {
        id: Date.now(), // Temporary ID
        name: name.trim(),
      }
      setCategories(prev => [...prev, newCategory])
      return newCategory
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error adding category'
      setError(errorMessage)
      throw err
    }
  }

  const deleteCategory = async (id: number) => {
    try {
      // For now, we'll delete locally since the API doesn't have deleteCategory method
      // TODO: Implement deleteCategory in API client when available
      setCategories(prev => prev.filter(category => category.id !== id))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error deleting category'
      setError(errorMessage)
      throw err
    }
  }

  const getCategoryIcon = (categoryName: string): LucideIcon => {
    const normalizedName = categoryName.toLowerCase().trim()
    return ICON_MAP[normalizedName] || ICON_MAP.default
  }

  const getCategoryColor = (categoryName: string): string => {
    const normalizedName = categoryName.toLowerCase().trim()
    return COLOR_SCHEMES[normalizedName] || COLOR_SCHEMES.default
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  return {
    categories,
    loading,
    error,
    fetchCategories,
    addCategory,
    deleteCategory,
    getCategoryIcon,
    getCategoryColor,
  }
}
