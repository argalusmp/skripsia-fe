import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Base URL for API endpoints
let baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// Ensure the URL is properly formatted (no trailing slash)
if (baseUrl.endsWith('/')) {
  baseUrl = baseUrl.slice(0, -1)
}

// Make sure it's a full URL with protocol
if (!baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
  baseUrl = `http://${baseUrl}`
}


// Base URL for API endpoints
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// Helper function to handle API errors
export async function handleApiResponse(response: Response) {
  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: 'An unknown error occurred'
    }))
    throw new Error(error.message || 'An error occurred while making the request')
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