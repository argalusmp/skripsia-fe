'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { KnowledgeUpload } from '@/components/admin/knowledge-upload'
import { KnowledgeList } from '@/components/admin/knowledge-list'

export default function AdminDashboard() {
  const { user, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    } else if (!isLoading && user?.role !== 'admin') {
      router.push('/dashboard')
    }
  }, [isLoading, isAuthenticated, user, router])

  if (isLoading) {
    return <div className="h-screen flex items-center justify-center text-foreground">Loading...</div>
  }

  if (!user || user.role !== 'admin') {
    return null
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-foreground">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 gap-8 mb-8">
        <KnowledgeUpload />
      </div>
      
      <div>
        <KnowledgeList />
      </div>
    </div>
  )
} 