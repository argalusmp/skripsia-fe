import { API_BASE_URL, getAuthHeader, handleApiResponse } from './utils'

export type Source = {
  id: number
  title: string
  relevance_score: number
}

export type Message = {
  id?: number
  role: 'user' | 'assistant'
  content: string
  created_at: string
  sources?: Source[]
}

export type Conversation = {
  id: number
  title: string
  created_at: string
  updated_at: string
  messages?: Message[]
}

export type ConversationsResponse = {
  items: Conversation[]
  total: number
}

export async function sendMessage(message: string, conversation_id?: number): Promise<{message: Message, conversation_id: number}> {
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader() as Record<string, string>
  }

  const response = await fetch(`${API_BASE_URL}/chat/send`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      message,
      conversation_id
    }),
  })

  return handleApiResponse(response)
}

export async function getConversations(skip: number = 0, limit: number = 10): Promise<Conversation[]> {
  const headers = getAuthHeader() as Record<string, string>

  const response = await fetch(`${API_BASE_URL}/chat/conversations?skip=${skip}&limit=${limit}`, {
    headers,
  })

  return handleApiResponse(response)
}

export async function getConversation(conversation_id: number): Promise<Conversation> {
  const headers = getAuthHeader() as Record<string, string>

  const response = await fetch(`${API_BASE_URL}/chat/conversations/${conversation_id}`, {
    headers,
  })

  return handleApiResponse(response)
}

export async function deleteConversation(conversation_id: number): Promise<{detail: string}> {
  const headers = getAuthHeader() as Record<string, string>

  const response = await fetch(`${API_BASE_URL}/chat/conversations/${conversation_id}`, {
    method: 'DELETE',
    headers,
  })

  return handleApiResponse(response)
} 