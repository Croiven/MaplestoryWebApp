export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T = any> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface ApiError {
  message: string
  code?: string
  details?: any
}

export interface ValidationError {
  field: string
  message: string
  value?: any
}

export interface ApiErrorResponse {
  error: string
  message: string
  details?: ValidationError[]
  timestamp: string
  path: string
}
