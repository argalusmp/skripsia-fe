'use client'

import { useState, useEffect } from 'react'
import { API_BASE_URL, getAuthHeader } from '@/lib/utils'
import { Button } from '@/components/ui/button'

type KnowledgeItem = {
  id: string
  title: string
  description: string
  type: 'text' | 'file' | 'voice'
  createdAt: string
  updatedAt: string
}

export function KnowledgeList() {
  const [knowledgeItems, setKnowledgeItems] = useState<KnowledgeItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchKnowledgeItems = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const headers = getAuthHeader() as Record<string, string>
      
      const response = await fetch(`${API_BASE_URL}/knowledge`, {
        headers,
      })

      if (!response.ok) {
        throw new Error('Failed to fetch knowledge items')
      }

      const data = await response.json()
      setKnowledgeItems(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchKnowledgeItems()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'text':
        return '📄'
      case 'file':
        return '📁'
      case 'voice':
        return '🎤'
      default:
        return '📄'
    }
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Knowledge Base</h2>
        <Button onClick={fetchKnowledgeItems} disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Refresh'}
        </Button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-500 rounded-md">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-8">Loading knowledge items...</div>
      ) : knowledgeItems.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No knowledge items found. Add some using the form above.
        </div>
      ) : (
        <div className="space-y-4">
          {knowledgeItems.map((item) => (
            <div 
              key={item.id} 
              className="border rounded-lg p-4 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">{getTypeIcon(item.type)}</div>
                  <div>
                    <h3 className="font-medium">{item.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {item.description}
                    </p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                      <span>Type: {item.type}</span>
                      <span>Created: {formatDate(item.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 