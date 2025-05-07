'use client'

import ChatInterface from '@/components/chat/chat-interface'
import { useAuth } from '@/lib/auth'

export default function ChatPage() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="container mx-auto">
      <div className="py-4 px-4">
        <h1 className="text-2xl font-bold mb-4">Chat with AI Assistant</h1>
        <ChatInterface />
      </div>
    </div>
  )
} 