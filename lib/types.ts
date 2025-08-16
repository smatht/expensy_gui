export interface Category {
  id: number
  name: string
  alt_name?: string
}

export interface CreateRecordPayload {
  description: string
  amount: number
  date: string
  category: number
  source?: string
}

export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

export interface ApiError {
  message: string
  status?: number
  details?: any
}
