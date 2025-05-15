'use client'

import ChatInterface from '@/components/chat/chat-interface'
import { useAuth } from '@/lib/auth'

export default function ChatPage() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="h-full">
      <div className="h-full px-2 sm:px-4 sm:py-4">
        <h1 className="text-xl sm:text-2xl font-bold px-2 sm:px-0">Chat with AI Assistant</h1>
        <div className="h-full relative -top-10">
          <ChatInterface />
        </div>
      </div>
    </div>
  )
} 