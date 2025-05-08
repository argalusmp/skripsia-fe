'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getConversations, deleteConversation } from '@/lib/chat'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth'
import { Trash } from 'lucide-react'

export default function ConversationsPage() {
  const { user, isLoading: authLoading } = useAuth()
  const [conversations, setConversations] = useState<Array<{
    id: number
    title: string
    created_at: string
    updated_at: string
  }>>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchConversations = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getConversations()
      setConversations(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch conversations')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!authLoading && user) {
      fetchConversations()
    }
  }, [authLoading, user])

  const handleDeleteConversation = async (id: number) => {
    try {
      await deleteConversation(id)
      // Remove from the list
      setConversations(prev => prev.filter(conv => conv.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete conversation')
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  if (authLoading) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Conversations</h1>
        <div className="space-x-4">
          <Button onClick={fetchConversations} disabled={isLoading} variant="outline">
            Refresh
          </Button>
          <Link href="/chat">
            <Button>Start New Conversation</Button>
          </Link>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-12">Loading conversations...</div>
      ) : conversations.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-lg">
          <p className="text-muted-foreground">You don't have any conversations yet.</p>
          <Link href="/chat" className="mt-4 inline-block">
            <Button>Start Your First Conversation</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {conversations.map(conversation => (
            <div 
              key={conversation.id} 
              className="border p-4 rounded-lg hover:bg-slate-50 transition-colors flex justify-between items-center"
            >
              <div>
                <Link 
                  href={`/chat/${conversation.id}`}
                  className="text-lg font-medium hover:text-primary hover:underline"
                >
                  {conversation.title || `Conversation #${conversation.id}`}
                </Link>
                <div className="text-sm text-muted-foreground mt-1">
                  Created: {formatDate(conversation.created_at)}
                  <span className="mx-2">•</span>
                  Last Updated: {formatDate(conversation.updated_at)}
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                onClick={() => handleDeleteConversation(conversation.id)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 