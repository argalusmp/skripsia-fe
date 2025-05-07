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
    return <div className="h-screen flex items-center justify-center">Loading...</div>
  }

  // Only render register form if not authenticated
  if (isAuthenticated) {
    return null
  }

  return (
    <div className="h-screen flex items-center justify-center p-4 bg-slate-50">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <RegisterForm />
        <div className="mt-6 text-center text-sm">
          Already have an account?{' '}
          <Link href="/login" className="text-primary hover:underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  )
} 