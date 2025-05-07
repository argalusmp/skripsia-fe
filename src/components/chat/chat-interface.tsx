'use client'

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Copy, Download, ThumbsUp, ThumbsDown, Send } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Message, sendMessage } from "@/lib/chat"
import { useAuth } from "@/lib/auth"

export default function ChatInterface({ conversationId }: { conversationId?: string }) {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm your AI assistant. How may I help you today?",
      timestamp: new Date().toISOString(),
    }
  ])
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return
    
    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date().toISOString(),
    }
    
    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsLoading(true)
    
    try {
      const response = await sendMessage(input, conversationId)
      
      const assistantMessage: Message = {
        role: "assistant",
        content: response.content,
        timestamp: response.timestamp || new Date().toISOString(),
        id: response.id,
        conversationId: response.conversationId
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
          timestamp: new Date().toISOString(),
        }
      ])
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

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-64px)]">
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef as any}>
        <div className="space-y-4 max-w-3xl mx-auto">
          {messages.map((message, index) => (
            <div
              key={index}
              className={cn(
                "flex gap-3 max-w-full",
                message.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div className={cn(
                "space-y-2 max-w-[85%]",
                message.role === "user" ? "order-1" : "order-2"
              )}>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {message.role === "assistant" ? "AI Assistant" : user?.username || "You"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatTimestamp(message.timestamp)}
                  </span>
                </div>
                <div className={cn(
                  "p-3 rounded-lg whitespace-pre-wrap",
                  message.role === "assistant" 
                    ? "bg-muted/50 text-foreground" 
                    : "bg-primary text-primary-foreground"
                )}>
                  {message.content}
                </div>
                {message.role === "assistant" && (
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8" title="Copy to clipboard">
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" title="Download response">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" title="Helpful">
                      <ThumbsUp className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" title="Not helpful">
                      <ThumbsDown className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
              {message.role === "assistant" && (
                <div className="h-8 w-8 rounded-full bg-primary flex-shrink-0 order-1" />
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3">
              <div className="h-8 w-8 rounded-full bg-primary flex-shrink-0" />
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">AI Assistant</span>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg flex items-center space-x-2">
                  <div className="h-2 w-2 bg-foreground/50 rounded-full animate-bounce"></div>
                  <div className="h-2 w-2 bg-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="h-2 w-2 bg-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      <div className="p-4 border-t bg-background">
        <div className="flex gap-2 max-w-3xl mx-auto">
          <Textarea
            placeholder="Type your message here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="min-h-[44px] max-h-32 resize-none"
            disabled={isLoading}
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={isLoading || !input.trim()} 
            className="px-4"
          >
            <Send className="h-4 w-4 mr-2" />
            Send
          </Button>
        </div>
      </div>
    </div>
  )
} 