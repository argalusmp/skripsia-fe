'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { MessageSquare, Database, User, Menu, X } from 'lucide-react'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { useState } from 'react'

export function Navigation() {
  const { user, logout, isAuthenticated } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <nav className="bg-background border-b border-border px-4 py-2 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link 
          href="/dashboard" 
          className="font-bold text-xl text-foreground"
        >
          SkripsiA
        </Link>

        {/* Mobile menu button */}
        <button 
          className="lg:hidden p-2 text-foreground"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>

        {/* Desktop navigation */}
        <div className="hidden lg:flex items-center space-x-4">
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

          {user?.role === 'student' && (
            <Link 
              href="/knowledge-sources" 
              className={`px-3 py-2 rounded-md text-sm flex items-center ${
                pathname === '/knowledge-sources' 
                  ? 'bg-primary/10 text-primary' 
                  : 'hover:bg-accent text-foreground'
              }`}
            >
              <Database className="h-4 w-4 mr-2" />
              Knowledge Sources
            </Link>
          )}

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

      {/* Mobile navigation dropdown */}
      {isMobileMenuOpen && (
        <div className="lg:hidden mt-2 bg-background border border-border rounded-lg shadow-lg p-4 absolute left-4 right-4 z-50">
          <div className="flex flex-col space-y-2">
            {user?.role === 'admin' && (
              <Link 
                href="/dashboard/admin" 
                className={`px-3 py-2 rounded-md text-sm flex items-center ${
                  pathname.includes('/dashboard/admin') 
                    ? 'bg-primary/10 text-primary' 
                    : 'hover:bg-accent text-foreground'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
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
              onClick={() => setIsMobileMenuOpen(false)}
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
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Conversations
            </Link>
            
            {user?.role === 'student' && (
              <Link 
                href="/knowledge-sources" 
                className={`px-3 py-2 rounded-md text-sm flex items-center ${
                  pathname === '/knowledge-sources' 
                    ? 'bg-primary/10 text-primary' 
                    : 'hover:bg-accent text-foreground'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Database className="h-4 w-4 mr-2" />
                Knowledge Sources
              </Link>
            )}
            
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2 text-foreground" />
                <span className="text-sm text-foreground">{user?.username}</span>
                <span className="text-xs ml-2 px-2 py-0.5 bg-accent rounded-full">
                  {user?.role}
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <ThemeToggle />
                <button
                  onClick={handleLogout}
                  className="text-sm px-3 py-1 bg-destructive/10 text-destructive rounded-md hover:bg-destructive/20"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
} 