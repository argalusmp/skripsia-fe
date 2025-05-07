'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'

export default function Dashboard() {
  const { user, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    } else if (!isLoading && user?.role === 'admin') {
      router.push('/dashboard/admin')
    } else if (!isLoading && user?.role === 'student') {
      router.push('/chat')
    }
  }, [isLoading, isAuthenticated, user, router])

  if (isLoading) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>
  }

  return null
} 