'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { KnowledgeSourceList } from '@/components/student/knowledge-source-list'

export default function KnowledgeSourcesPage() {
  const { user, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isLoading, isAuthenticated, router])

  if (isLoading) {
    return <div className="h-screen flex items-center justify-center text-foreground">Loading...</div>
  }

  if (!user) {
    return null
  }

  return (
    <div className="w-full max-w-full px-4 sm:px-6 py-4 sm:py-8">
      <h1 className="text-xl sm:text-3xl font-bold mb-4 sm:mb-8 text-foreground">Knowledge Sources</h1>
      <div>
        <KnowledgeSourceList />
      </div>
    </div>
  )
} 