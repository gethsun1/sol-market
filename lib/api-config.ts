/**
 * API Configuration for Frontend → Backend communication
 * 
 * This file centralizes all API calls to support the split architecture:
 * - Frontend: Static site on cPanel (makenadao.com)
 * - Backend: Node.js API on VPS (api.makenadao.com)
 */

// API base URL - change this based on environment
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

/**
 * Generic API request wrapper
 * Handles common error cases and adds default headers
 */
export async function apiRequest<T = any>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }))
      throw new Error(error.error || `API Error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`API Request failed for ${endpoint}:`, error)
    throw error
  }
}

/**
 * GET request helper
 */
export async function apiGet<T = any>(endpoint: string): Promise<T> {
  return apiRequest<T>(endpoint, { method: 'GET' })
}

/**
 * POST request helper
 */
export async function apiPost<T = any>(
  endpoint: string,
  data?: any
): Promise<T> {
  return apiRequest<T>(endpoint, {
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  })
}

/**
 * PUT request helper
 */
export async function apiPut<T = any>(
  endpoint: string,
  data?: any
): Promise<T> {
  return apiRequest<T>(endpoint, {
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  })
}

/**
 * DELETE request helper
 */
export async function apiDelete<T = any>(endpoint: string): Promise<T> {
  return apiRequest<T>(endpoint, { method: 'DELETE' })
}

/**
 * Upload file helper (for image uploads)
 */
export async function apiUpload(
  endpoint: string,
  file: File,
  additionalData?: Record<string, string>
): Promise<any> {
  const url = `${API_BASE_URL}${endpoint}`
  
  const formData = new FormData()
  formData.append('file', file)
  
  if (additionalData) {
    Object.entries(additionalData).forEach(([key, value]) => {
      formData.append(key, value)
    })
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
      // Don't set Content-Type header - browser will set it with boundary
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Upload failed' }))
      throw new Error(error.error || `Upload Error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`Upload failed for ${endpoint}:`, error)
    throw error
  }
}

/**
 * Get the current API base URL (useful for debugging)
 */
export function getApiBaseUrl(): string {
  return API_BASE_URL
}

/**
 * Check if API is reachable
 */
export async function checkApiHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`, {
      method: 'GET',
    })
    return response.ok
  } catch {
    return false
  }
}

// Export the base URL for use in other contexts
export { API_BASE_URL }


