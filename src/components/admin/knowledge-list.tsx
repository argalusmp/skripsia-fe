'use client'

import { useState, useEffect } from 'react'
import { API_BASE_URL, getAuthHeader } from '@/lib/utils'
import { Button } from '@/components/ui/button'

type KnowledgeItem = {
  id: number
  title: string
  file_type: 'document' | 'image' | 'audio'
  status: 'processing' | 'completed' | 'failed'
  created_at: string
}

type KnowledgeResponse = {
  items: KnowledgeItem[]
  total: number
}

export function KnowledgeList() {
  const [knowledgeItems, setKnowledgeItems] = useState<KnowledgeItem[]>([])
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(0)
  const limit = 10

  const fetchKnowledgeItems = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const headers = getAuthHeader() as Record<string, string>
      
      const response = await fetch(`${API_BASE_URL}/knowledge/?skip=${page * limit}&limit=${limit}`, {
        headers,
      })

      if (!response.ok) {
        throw new Error('Failed to fetch knowledge items')
      }

      const data = await response.json() as KnowledgeResponse
      setKnowledgeItems(data.items)
      setTotal(data.total)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchKnowledgeItems()
  }, [page])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'document':
        return '📄'
      case 'image':
        return '🖼️'
      case 'audio':
        return '🎤'
      default:
        return '📄'
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'processing':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs">Processing</span>
      case 'completed':
        return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">Completed</span>
      case 'failed':
        return <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">Failed</span>
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">{status}</span>
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
                  <div className="text-2xl">{getTypeIcon(item.file_type)}</div>
                  <div>
                    <h3 className="font-medium">{item.title}</h3>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                      <span>Type: {item.file_type}</span>
                      <span>Created: {formatDate(item.created_at)}</span>
                      {getStatusBadge(item.status)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {total > limit && (
        <div className="flex justify-between items-center mt-6">
          <Button 
            onClick={() => setPage(p => Math.max(0, p - 1))} 
            disabled={page === 0 || isLoading}
            variant="outline"
          >
            Previous
          </Button>
          <span className="text-sm">
            Page {page + 1} of {Math.ceil(total / limit)}
          </span>
          <Button 
            onClick={() => setPage(p => p + 1)} 
            disabled={(page + 1) * limit >= total || isLoading}
            variant="outline"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
} 