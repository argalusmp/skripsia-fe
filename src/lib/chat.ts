import { API_BASE_URL, getAuthHeader, handleApiResponse } from './utils'

export type Message = {
  id?: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  conversationId?: string
}

export type Conversation = {
  id: string
  title: string
  createdAt: string
  updatedAt: string
  messages: Message[]
}

export async function sendMessage(content: string, conversationId?: string): Promise<Message> {
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader() as Record<string, string>
  }

  const response = await fetch(`${API_BASE_URL}/chat/send`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      content,
      conversationId
    }),
  })

  return handleApiResponse(response)
}

export async function getConversation(conversationId: string): Promise<Conversation> {
  const headers = getAuthHeader() as Record<string, string>

  const response = await fetch(`${API_BASE_URL}/chat/conversations/${conversationId}`, {
    headers,
  })

  return handleApiResponse(response)
} 