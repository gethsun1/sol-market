import { NextResponse } from "next/server"

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export class ValidationError extends ApiError {
  constructor(message: string) {
    super(message, 400, 'VALIDATION_ERROR')
  }
}

export class NotFoundError extends ApiError {
  constructor(resource: string) {
    super(`${resource} not found`, 404, 'NOT_FOUND')
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message: string = 'Unauthorized') {
    super(message, 401, 'UNAUTHORIZED')
  }
}

export class ForbiddenError extends ApiError {
  constructor(message: string = 'Forbidden') {
    super(message, 403, 'FORBIDDEN')
  }
}

export class ConflictError extends ApiError {
  constructor(message: string) {
    super(message, 409, 'CONFLICT')
  }
}

export class RateLimitError extends ApiError {
  constructor(message: string = 'Rate limit exceeded') {
    super(message, 429, 'RATE_LIMIT_EXCEEDED')
  }
}

/**
 * Standard API response format
 */
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: {
    message: string
    code?: string
    details?: any
  }
  meta?: {
    timestamp: string
    requestId?: string
    pagination?: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }
}

/**
 * Create success response
 */
export function createSuccessResponse<T>(
  data: T,
  meta?: Partial<ApiResponse<T>['meta']>
): NextResponse<ApiResponse<T>> {
  return NextResponse.json({
    success: true,
    data,
    meta: {
      timestamp: new Date().toISOString(),
      ...meta
    }
  })
}

/**
 * Create error response
 */
export function createErrorResponse(
  error: Error | ApiError,
  requestId?: string
): NextResponse<ApiResponse> {
  if (error instanceof ApiError) {
    return NextResponse.json({
      success: false,
      error: {
        message: error.message,
        code: error.code,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      meta: {
        timestamp: new Date().toISOString(),
        requestId
      }
    }, { status: error.statusCode })
  }

  // Handle unexpected errors
  console.error('Unexpected API error:', error)
  return NextResponse.json({
    success: false,
    error: {
      message: 'Internal server error',
      code: 'INTERNAL_ERROR',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    },
    meta: {
      timestamp: new Date().toISOString(),
      requestId
    }
  }, { status: 500 })
}

/**
 * Async wrapper to handle errors in API routes
 */
export function withErrorHandler<T extends any[], R>(
  handler: (...args: T) => Promise<R>
) {
  return async (...args: T): Promise<R> => {
    try {
      return await handler(...args)
    } catch (error) {
      throw error
    }
  }
}

/**
 * Validate request body
 */
export function validateRequestBody<T>(
  body: any,
  requiredFields: (keyof T)[]
): T {
  if (!body || typeof body !== 'object') {
    throw new ValidationError('Invalid request body')
  }

  const missing = requiredFields.filter(field => !(field in body))
  if (missing.length > 0) {
    throw new ValidationError(`Missing required fields: ${missing.join(', ')}`)
  }

  return body as T
}

/**
 * Validate query parameters
 */
export function validateQueryParams<T>(
  searchParams: URLSearchParams,
  requiredParams: string[],
  optionalParams: Record<string, (value: string) => any> = {}
): T {
  const params: any = {}

  // Check required parameters
  for (const param of requiredParams) {
    const value = searchParams.get(param)
    if (!value) {
      throw new ValidationError(`Missing required query parameter: ${param}`)
    }
    params[param] = value
  }

  // Process optional parameters
  for (const [param, transformer] of Object.entries(optionalParams)) {
    const value = searchParams.get(param)
    if (value !== null) {
      try {
        params[param] = transformer(value)
      } catch (error) {
        throw new ValidationError(`Invalid ${param} parameter`)
      }
    }
  }

  return params as T
}

/**
 * Common validation transformers
 */
export const transformers = {
  number: (value: string) => {
    const num = Number(value)
    if (isNaN(num)) throw new Error('Not a number')
    return num
  },
  boolean: (value: string) => {
    return value.toLowerCase() === 'true'
  },
  array: (value: string) => {
    return value.split(',').map(s => s.trim()).filter(Boolean)
  },
  date: (value: string) => {
    const date = new Date(value)
    if (isNaN(date.getTime())) throw new Error('Invalid date')
    return date
  }
}
