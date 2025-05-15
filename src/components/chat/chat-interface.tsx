'use client'

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Copy, Send, Trash, Calendar, Clock, UserCircle, Bot, Database } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Message, Source, sendMessage, getConversation, deleteConversation } from "@/lib/chat"
import { useAuth } from "@/lib/auth"
import { API_BASE_URL, getAuthHeader } from "@/lib/utils"

export default function ChatInterface({ conversation_id }: { conversation_id?: number }) {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! How can I help you today?",
      created_at: new Date().toISOString()
    }
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [currentConversationId, setCurrentConversationId] = useState<number | undefined>(conversation_id)
  const { user } = useAuth()
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const [showDateSeparators, setShowDateSeparators] = useState(true)
  const [expandedSources, setExpandedSources] = useState<number[]>([])
  
  // Fetch conversation if conversation_id is provided
  useEffect(() => {
    if (conversation_id) {
      const fetchConversation = async () => {
        try {
          setIsLoading(true)
          const conversation = await getConversation(conversation_id)
          if (conversation.messages) {
            setMessages(conversation.messages)
            setCurrentConversationId(conversation_id)
          }
        } catch (error) {
          console.error("Error fetching conversation:", error)
        } finally {
          setIsLoading(false)
        }
      }
      
      fetchConversation()
    }
  }, [conversation_id])

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  // Initial message for new chat
  useEffect(() => {
    if (!conversation_id) {
      setMessages([
        {
          role: "assistant",
          content: "Hello! How can I help you today? Ask me any questions and I'll draw from knowledge sources to answer you.",
          created_at: new Date().toISOString(),
          sources: [] // Empty sources array to indicate the feature exists
        }
      ])
    }
  }, [conversation_id])

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return
    
    const userMessage: Message = {
      role: "user",
      content: input,
      created_at: new Date().toISOString(),
    }
    
    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsLoading(true)
    
    try {
      const response = await sendMessage(input, currentConversationId)
      
      // Update conversation ID if this is a new conversation
      if (response.conversation_id && (!currentConversationId || currentConversationId !== response.conversation_id)) {
        setCurrentConversationId(response.conversation_id)
      }
      
      const assistantMessage: Message = {
        role: "assistant",
        content: response.message.content,
        created_at: response.message.created_at,
        id: response.message.id,
        sources: response.message.sources
      }
      
      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error sending message:", error)
      
      // Add error message
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, there was an error processing your request. Please try again.",
          created_at: new Date().toISOString(),
        }
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteConversation = async () => {
    if (!currentConversationId || isLoading) return
    
    try {
      setIsLoading(true)
      await deleteConversation(currentConversationId)
      // Reset conversation
      setMessages([{
        role: "assistant",
        content: "Conversation has been deleted. How may I help you today?",
        created_at: new Date().toISOString(),
      }])
      setCurrentConversationId(undefined)
    } catch (error) {
      console.error("Error deleting conversation:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    })
  }
  
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today'
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday'
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        alert('Copied to clipboard!')
      })
      .catch(err => {
        console.error('Could not copy text: ', err)
      })
  }
  
  // Group messages by date
  const groupedMessages = () => {
    if (!showDateSeparators) return [{ date: '', messages: messages }]
    
    const groups: { date: string; messages: Message[] }[] = []
    let currentDate = ''
    
    messages.forEach(message => {
      const messageDate = formatDate(message.created_at)
      
      if (messageDate !== currentDate) {
        currentDate = messageDate
        groups.push({ date: currentDate, messages: [message] })
      } else {
        groups[groups.length - 1].messages.push(message)
      }
    })
    
    return groups
  }

  const toggleSourceExpansion = (messageId: number) => {
    setExpandedSources(prev => 
      prev.includes(messageId) 
        ? prev.filter(id => id !== messageId) 
        : [...prev, messageId]
    )
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-2 sm:p-4 border-b">
        <div className="flex items-center">
          <h2 className="text-base sm:text-lg font-medium truncate">
            {currentConversationId ? `Ongoing Conversation` : 'New Conversation'}
          </h2>
        </div>
        
        <div className="flex items-center space-x-2">
          {currentConversationId && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleDeleteConversation}
              disabled={isLoading}
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              <Trash className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Delete Conversation</span>
            </Button>
          )}
        </div>
      </div>
      
      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4 sm:space-y-6 max-w-3xl mx-auto">
          {groupedMessages().map((group, groupIndex) => (
            <div key={groupIndex} className="space-y-3 sm:space-y-4">
              {/* Date Separator */}
              {showDateSeparators && (
                <div className="flex items-center justify-center">
                  <div className="bg-muted text-muted-foreground text-xs px-3 py-1 rounded-full flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {group.date}
                  </div>
                </div>
              )}
              
              {/* Messages in this group */}
              {group.messages.map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex gap-2 sm:gap-3 max-w-full",
                    message.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  {message.role === "assistant" && (
                    <div className="flex-shrink-0 h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-primary/10 flex items-center justify-center order-1">
                      <Bot className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    </div>
                  )}
                  
                  <div className={cn(
                    "space-y-1 sm:space-y-2 max-w-[80%] sm:max-w-[85%]",
                    message.role === "user" ? "order-1" : "order-2"
                  )}>
                    <div className="flex items-center gap-1 sm:gap-2">
                      <span className="text-sm sm:text-base font-medium">
                        {message.role === "assistant" ? "AI Assistant" : user?.username || "You"}
                      </span>
                      <span className="text-xs sm:text-sm text-muted-foreground flex items-center">
                        <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        {formatTimestamp(message.created_at)}
                      </span>
                    </div>
                    
                    <div className={cn(
                      "p-2 sm:p-3 rounded-lg whitespace-pre-wrap text-sm sm:text-base",
                      message.role === "assistant" 
                        ? "bg-muted/50 text-foreground" 
                        : "bg-primary text-primary-foreground"
                    )}>
                      {message.content}
                    </div>
                    
                    {message.role === "assistant" && message.sources && message.sources.length > 0 && (
                      <div className="mt-2">
                        <button 
                          onClick={() => toggleSourceExpansion(message.id || 0)}
                          className="flex items-center text-xs sm:text-sm text-primary hover:text-primary-dark font-medium"
                        >
                          <Database className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                          {expandedSources.includes(message.id || 0) 
                            ? "Hide sources" 
                            : `${message.sources.length} sources used`}
                        </button>
                        
                        {expandedSources.includes(message.id || 0) && (
                          <div className="mt-2 space-y-2 pl-2 border-l-2 border-primary/30">
                            {message.sources.map((source, idx) => (
                              <div key={idx} className="flex items-center justify-between bg-muted/30 p-2 rounded-md">
                                <span className="text-xs sm:text-sm truncate max-w-full">
                                  <strong>{source.title}</strong>
                                  <span className="ml-1 text-muted-foreground">
                                    ({Math.round(source.relevance_score * 100)}% match)
                                  </span>
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                    
                    {message.role === "assistant" && (
                      <div className="flex items-center gap-1 sm:gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7 sm:h-8 sm:w-8" 
                          title="Copy to clipboard"
                          onClick={() => copyToClipboard(message.content)}
                        >
                          <Copy className="h-4 w-4 sm:h-5 sm:w-5" />
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  {message.role === "user" && (
                    <div className="flex-shrink-0 h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-primary flex items-center justify-center order-2">
                      <UserCircle className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
          
          {/* Loading indicator */}
          {isLoading && (
            <div className="flex gap-2 sm:gap-3">
              <div className="flex-shrink-0 h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-primary/10 flex items-center justify-center">
                <Bot className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              </div>
              <div className="space-y-1 sm:space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm sm:text-base font-medium">AI Assistant</span>
                </div>
                <div className="p-2 sm:p-3 bg-muted/50 rounded-lg flex items-center space-x-2">
                  <div className="h-2 w-2 sm:h-2.5 sm:w-2.5 bg-foreground/50 rounded-full animate-bounce"></div>
                  <div className="h-2 w-2 sm:h-2.5 sm:w-2.5 bg-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="h-2 w-2 sm:h-2.5 sm:w-2.5 bg-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Input Area - Fixed at bottom */}
      <div className="p-2 sm:p-4 border-t bg-background">
        <div className="flex gap-2 max-w-3xl mx-auto">
          <Textarea
            placeholder="Type your message here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="min-h-[50px] max-h-32 resize-none text-sm sm:text-base"
            disabled={isLoading}
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={isLoading || !input.trim()} 
            className="px-3 sm:px-4 flex-shrink-0"
          >
            <Send className="h-5 w-5 sm:mr-2" />
            <span className="hidden sm:inline">Send</span>
          </Button>
        </div>
      </div>
    </div>
  )
} 