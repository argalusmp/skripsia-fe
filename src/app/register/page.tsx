'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { RegisterForm } from '@/components/auth/register-form'
import { useAuth } from '@/lib/auth'

export default function RegisterPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return <div className="h-screen flex items-center justify-center bg-background text-foreground">Loading...</div>
  }

  if (isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-600 dark:bg-blue-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Create Account</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Join us and start your journey</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-8">
            <RegisterForm />
            <div className="mt-6 text-center text-gray-600 dark:text-gray-400 text-sm">
              Already have an account?{' '}
              <Link href="/login" className="text-blue-600 dark:text-blue-400 font-medium hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
                Login here
              </Link>
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center text-gray-600 dark:text-gray-400 text-sm">
          © {new Date().getFullYear()} SkripsiA. All rights reserved.
        </div>
      </div>
    </div>
  )
} 