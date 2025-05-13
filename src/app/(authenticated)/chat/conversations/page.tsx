'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getConversations, deleteConversation } from '@/lib/chat'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth'
import { Trash, MessageSquare } from 'lucide-react'

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
    <div className="w-full px-4 sm:px-6 py-4 sm:py-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-0">
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">Your Conversations</h1>
        <div className="flex items-center gap-2 sm:gap-4">
          <Button onClick={fetchConversations} disabled={isLoading} variant="outline" size="sm" className="text-xs sm:text-sm h-8 sm:h-10">
            Refresh
          </Button>
          <Link href="/chat">
            <Button size="sm" className="text-xs sm:text-sm h-8 sm:h-10 flex items-center gap-1 sm:gap-2">
              <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>New Conversation</span>
            </Button>
          </Link>
        </div>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive p-3 sm:p-4 rounded-md mb-4 sm:mb-6 text-xs sm:text-sm">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-8 sm:py-12 text-sm sm:text-base text-foreground">Loading conversations...</div>
      ) : conversations.length === 0 ? (
        <div className="text-center py-8 sm:py-12 bg-muted rounded-lg">
          <p className="text-sm sm:text-base text-muted-foreground">You don't have any conversations yet.</p>
          <Link href="/chat" className="mt-3 sm:mt-4 inline-block">
            <Button size="sm" className="text-xs sm:text-sm">Start Your First Conversation</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {conversations.map(conversation => (
            <div 
              key={conversation.id} 
              className="border p-3 sm:p-4 rounded-lg hover:bg-accent/50 transition-colors flex justify-between items-center"
            >
              <div className="flex-1 min-w-0">
                <Link 
                  href={`/chat/${conversation.id}`}
                  className="text-base sm:text-lg font-medium hover:text-primary hover:underline block truncate"
                >
                  {conversation.title || `Conversation #${conversation.id}`}
                </Link>
                <div className="text-[10px] sm:text-sm text-muted-foreground mt-1 flex flex-col sm:flex-row sm:items-center gap-0 sm:gap-2">
                  <span>Created: {formatDate(conversation.created_at)}</span>
                  <span className="hidden sm:inline">•</span>
                  <span>Updated: {formatDate(conversation.updated_at)}</span>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="xs" 
                className="ml-2 text-destructive hover:text-destructive hover:bg-destructive/10 h-7 w-7 sm:h-8 sm:w-8 p-0"
                onClick={() => handleDeleteConversation(conversation.id)}
              >
                <Trash className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 