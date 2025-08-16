import { useState, useEffect } from 'react'
import { apiClient, ApiError } from '@/lib/api-client'
import { Category, CreateRecordPayload } from '@/lib/types'

export interface TransactionFormData {
  description: string
  amount: string
  date: string
  category: string
  transactionType: 'expense' | 'income'
}

export function useTransactionForm() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const fetchedCategories = await apiClient.getCategories()
      setCategories(fetchedCategories)
    } catch (err) {
      const errorMessage = err instanceof ApiError ? err.message : 'Failed to fetch categories'
      setError(errorMessage)
      console.error('Error fetching categories:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const createTransaction = async (formData: TransactionFormData): Promise<boolean> => {
    try {
      setIsLoading(true)
      setError(null)
      setIsSuccess(false)

      // Find the category ID from the selected category name
      const selectedCategory = categories.find(cat => cat.name === formData.category)
      if (!selectedCategory) {
        throw new Error('Invalid category selected')
      }

      // Prepare the payload
      const payload: CreateRecordPayload = {
        description: formData.description,
        amount: Number.parseFloat(formData.amount),
        date: formData.date,
        category: selectedCategory.id,
      }

      // Make the API call
      const response = await apiClient.createRecord(payload)
      
      setIsSuccess(true)
      console.log('Transaction created successfully:', response)
      return true
    } catch (err) {
      const errorMessage = err instanceof ApiError ? err.message : 'Failed to create transaction'
      setError(errorMessage)
      console.error('Error creating transaction:', err)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const clearError = () => setError(null)
  const clearSuccess = () => setIsSuccess(false)

  return {
    categories,
    isLoading,
    error,
    isSuccess,
    createTransaction,
    clearError,
    clearSuccess,
    refetchCategories: fetchCategories,
  }
}
