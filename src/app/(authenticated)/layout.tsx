'use client'

import { Navigation } from '@/components/ui/navigation'
import { useAuth } from '@/lib/auth'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !pathname.includes('/login') && !pathname.includes('/register')) {
      router.push('/login')
    }
  }, [isLoading, isAuthenticated, router, pathname])

  if (isLoading) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pb-10">{children}</main>
    </div>
  )
} 