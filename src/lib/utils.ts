import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Get the API URL from environment variables
// In production: https://vidimarpaung.tech
// In development: http://localhost:8000 (or whatever your local API URL is)
let apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// Clean up the URL (remove trailing slash)
if (apiUrl.endsWith('/')) {
  apiUrl = apiUrl.slice(0, -1)
}

// Export the cleaned API URL
export const API_BASE_URL = apiUrl

export async function handleApiResponse(response: Response) {
  if (!response.ok) {
    let errorMessage = 'An error occurred while making the request'
    
    try {
      const errorData = await response.json()
      
      // Check different possible error message fields
      if (errorData.detail) {
        errorMessage = errorData.detail
      } else if (errorData.message) {
        errorMessage = errorData.message
      } else if (errorData.error) {
        errorMessage = errorData.error
      } else if (typeof errorData === 'string') {
        errorMessage = errorData
      }
      
      // Specific handling for common HTTP status codes
      if (response.status === 401) {
        errorMessage = 'Invalid username or password'
      } else if (response.status === 404) {
        errorMessage = 'Service not found'
      } else if (response.status === 500) {
        errorMessage = 'Server error occurred'
      }
      
    } catch (parseError) {
      // Fallback based on status code if JSON parsing fails
      if (response.status === 401) {
        errorMessage = 'Invalid username or password'
      } else if (response.status === 404) {
        errorMessage = 'Service not found'
      } else if (response.status === 500) {
        errorMessage = 'Server error occurred'
      } else {
        errorMessage = `HTTP ${response.status}: ${response.statusText}`
      }
    }
    
    throw new Error(errorMessage)
  }
  
  return response.json()
}

// Function to get authorization header
export function getAuthHeader() {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token')
    return token ? { Authorization: `Bearer ${token}` } : {}
  }
  return {}
}