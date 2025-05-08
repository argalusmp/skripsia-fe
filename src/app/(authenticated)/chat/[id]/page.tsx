'use client'

import { useParams } from 'next/navigation'
import ChatInterface from '@/components/chat/chat-interface'
import { useAuth } from '@/lib/auth'

export default function ChatPage() {
  const { user, isLoading } = useAuth()
  const params = useParams()
  const conversationId = params.id ? parseInt(params.id as string) : undefined

  if (isLoading) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="container mx-auto">
      <div className="py-4 px-4">
        <ChatInterface conversation_id={conversationId} />
      </div>
    </div>
  )
} 