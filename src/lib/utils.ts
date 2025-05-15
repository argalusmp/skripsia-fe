import { type ClassValue, clsx } from "clsx"
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