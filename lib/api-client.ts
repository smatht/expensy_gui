import { Category, CreateRecordPayload, ApiResponse, PaginatedResponse } from './types'
import { config } from './config'

const API_BASE_URL = config.api.baseUrl

class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public details?: any
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`
        
        try {
          const errorData = await response.json()
          errorMessage = errorData.message || errorData.error || errorMessage
        } catch {
          // If we can't parse the error response, use the status text
          errorMessage = response.statusText || errorMessage
        }
        
        throw new ApiError(errorMessage, response.status)
      }
      
      // Handle empty responses
      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        return await response.json()
      }
      
      return {} as T
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        console.log(error)
        throw new ApiError('Network error: Unable to connect to the server', 0)
      }
      
      throw new ApiError(`Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async getCategories(): Promise<Category[]> {
    try {
      const response = await this.request<PaginatedResponse<Category>>('/categories/')
      const categories = response.results || []
      return categories
    } catch (error) {
      console.error('Error fetching categories:', error)
      throw error
    }
  }

  async createRecord(payload: CreateRecordPayload): Promise<{ id: number }> {
    try {
      // Add the fixed source parameter
      const payloadWithSource = {
        ...payload,
        source: "ingreso manual"
      }
      
      const response = await this.request<{ id: number }>('/records/', {
        method: 'POST',
        body: JSON.stringify(payloadWithSource),
      })
      return response
    } catch (error) {
      console.error('Error creating record:', error)
      throw error
    }
  }
}

export const apiClient = new ApiClient()
export { ApiError }
