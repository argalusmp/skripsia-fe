'use client'

import { useState, useEffect } from 'react'
import { API_BASE_URL, getAuthHeader } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'

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
  const [isDeleting, setIsDeleting] = useState<number | null>(null)

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

  const handleDeleteKnowledge = async (id: number, title: string) => {
    // Show confirmation dialog
    const isConfirmed = window.confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)
    
    if (!isConfirmed) {
      return
    }
    
    setIsDeleting(id)
    setError(null)

    try {
      const headers = getAuthHeader() as Record<string, string>
      
      const response = await fetch(`${API_BASE_URL}/knowledge/${id}`, {
        method: 'DELETE',
        headers,
      })

      if (!response.ok) {
        throw new Error('Failed to delete knowledge item')
      }

      // Remove deleted item from state to avoid full reload
      setKnowledgeItems(prevItems => prevItems.filter(item => item.id !== id))
      setTotal(prevTotal => prevTotal - 1)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete knowledge item')
    } finally {
      setIsDeleting(null)
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
        return <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 rounded-full text-[10px] sm:text-xs">Processing</span>
      case 'completed':
        return <span className="px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-full text-[10px] sm:text-xs">Completed</span>
      case 'failed':
        return <span className="px-2 py-1 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-full text-[10px] sm:text-xs">Failed</span>
      default:
        return <span className="px-2 py-1 bg-muted text-muted-foreground rounded-full text-[10px] sm:text-xs">{status}</span>
    }
  }

  return (
    <div className="p-4 sm:p-6 bg-card text-card-foreground rounded-lg shadow-md">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-0">
        <h2 className="text-lg sm:text-xl font-bold">Knowledge Base</h2>
        <Button 
          onClick={fetchKnowledgeItems} 
          disabled={isLoading}
          size="sm"
          className="text-xs sm:text-sm"
        >
          {isLoading ? 'Loading...' : 'Refresh'}
        </Button>
      </div>

      {error && (
        <div className="mb-4 p-3 sm:p-4 bg-destructive/10 text-destructive text-xs sm:text-sm rounded-md">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-6 sm:py-8 text-sm sm:text-base text-foreground">Loading knowledge items...</div>
      ) : knowledgeItems.length === 0 ? (
        <div className="text-center py-6 sm:py-8 text-sm sm:text-base text-muted-foreground">
          No knowledge items found. Add some using the form above.
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {knowledgeItems.map((item) => (
            <div 
              key={item.id} 
              className="border border-border rounded-lg p-3 sm:p-4 hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-2 sm:space-x-3">
                  <div className="text-xl sm:text-2xl">{getTypeIcon(item.file_type)}</div>
                  <div>
                    <h3 className="font-medium text-sm sm:text-base text-foreground truncate max-w-[180px] sm:max-w-md">{item.title}</h3>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-1 sm:mt-2 text-[10px] sm:text-xs text-muted-foreground">
                      <span>Type: {item.file_type}</span>
                      <span>Created: {formatDate(item.created_at)}</span>
                      {getStatusBadge(item.status)}
                    </div>
                  </div>
                </div>
                <Button
                  variant="destructive"
                  size="xs"
                  onClick={() => handleDeleteKnowledge(item.id, item.title)}
                  disabled={isDeleting === item.id}
                  className="h-7 w-7 sm:h-8 sm:w-8 p-0 flex-shrink-0"
                  title="Delete knowledge"
                >
                  {isDeleting === item.id ? (
                    <span className="h-3 w-3 sm:h-4 sm:w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  ) : (
                    <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {total > limit && (
        <div className="flex justify-between items-center mt-4 sm:mt-6 text-xs sm:text-sm">
          <Button 
            onClick={() => setPage(p => Math.max(0, p - 1))} 
            disabled={page === 0 || isLoading}
            variant="outline"
            size="sm"
            className="text-xs"
          >
            Previous
          </Button>
          <span className="text-xs sm:text-sm text-foreground">
            Page {page + 1} of {Math.ceil(total / limit)}
          </span>
          <Button 
            onClick={() => setPage(p => p + 1)} 
            disabled={(page + 1) * limit >= total || isLoading}
            variant="outline"
            size="sm"
            className="text-xs"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
} 