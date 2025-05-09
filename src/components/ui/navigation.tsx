'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { MessageSquare, Database, User } from 'lucide-react'
import { ThemeToggle } from '@/components/ui/theme-toggle'

export function Navigation() {
  const { user, logout, isAuthenticated } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <nav className="bg-background border-b border-border px-4 py-2">
      <div className="container mx-auto flex justify-between items-center">
        <Link 
          href="/dashboard" 
          className="font-bold text-xl text-foreground"
        >
          SkripsiA
        </Link>

        <div className="flex items-center space-x-4">
          {user?.role === 'admin' && (
            <Link 
              href="/dashboard/admin" 
              className={`px-3 py-2 rounded-md text-sm flex items-center ${
                pathname.includes('/dashboard/admin') 
                  ? 'bg-primary/10 text-primary' 
                  : 'hover:bg-accent text-foreground'
              }`}
            >
              <Database className="h-4 w-4 mr-2" />
              Knowledge Base
            </Link>
          )}
          
          <Link 
            href="/chat" 
            className={`px-3 py-2 rounded-md text-sm flex items-center ${
              pathname === '/chat' 
                ? 'bg-primary/10 text-primary' 
                : 'hover:bg-accent text-foreground'
            }`}
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Chat
          </Link>

          <Link 
            href="/chat/conversations" 
            className={`px-3 py-2 rounded-md text-sm flex items-center ${
              pathname === '/chat/conversations' 
                ? 'bg-primary/10 text-primary' 
                : 'hover:bg-accent text-foreground'
            }`}
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Conversations
          </Link>

          <ThemeToggle />

          <div className="border-l border-border pl-4 flex items-center">
            <span className="text-sm mr-3 flex items-center text-foreground">
              <User className="h-4 w-4 mr-2" />
              {user?.username}
              <span className="text-xs ml-2 px-2 py-0.5 bg-accent rounded-full">
                {user?.role}
              </span>
            </span>
            <button
              onClick={handleLogout}
              className="text-sm px-3 py-1 bg-destructive/10 text-destructive rounded-md hover:bg-destructive/20"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
} 