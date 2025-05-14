import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

let baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

if (baseUrl.endsWith('/')) {
  baseUrl = baseUrl.slice(0, -1)
}


if (!baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
  baseUrl = `http://${baseUrl}`
}

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

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