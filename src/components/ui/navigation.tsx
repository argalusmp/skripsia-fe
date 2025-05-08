'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { MessageSquare, Database, User } from 'lucide-react'

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
    <nav className="bg-white border-b px-4 py-2">
      <div className="container mx-auto flex justify-between items-center">
        <Link 
          href="/dashboard" 
          className="font-bold text-xl"
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
                  : 'hover:bg-slate-100'
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
                : 'hover:bg-slate-100'
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
                : 'hover:bg-slate-100'
            }`}
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Conversations
          </Link>

          <div className="border-l pl-4 flex items-center">
            <span className="text-sm mr-3 flex items-center">
              <User className="h-4 w-4 mr-2" />
              {user?.username}
              <span className="text-xs ml-2 px-2 py-0.5 bg-slate-100 rounded-full">
                {user?.role}
              </span>
            </span>
            <button
              onClick={handleLogout}
              className="text-sm px-3 py-1 bg-red-50 text-red-600 rounded-md hover:bg-red-100"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
} 