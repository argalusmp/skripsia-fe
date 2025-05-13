'use client'

import ChatInterface from '@/components/chat/chat-interface'
import { useAuth } from '@/lib/auth'

export default function ChatPage() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="w-full h-[calc(100vh-4rem)]">
      <div className="h-full px-2 sm:px-4 py-2 sm:py-4">
        <h1 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-4 px-2 sm:px-0">Chat with AI Assistant</h1>
        <ChatInterface />
      </div>
    </div>
  )
} 