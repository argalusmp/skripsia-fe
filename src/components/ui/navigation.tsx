'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'

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
              className={`px-3 py-2 rounded-md text-sm ${
                pathname.includes('/dashboard/admin') 
                  ? 'bg-primary/10 text-primary' 
                  : 'hover:bg-slate-100'
              }`}
            >
              Admin Dashboard
            </Link>
          )}
          
          <Link 
            href="/chat" 
            className={`px-3 py-2 rounded-md text-sm ${
              pathname === '/chat' 
                ? 'bg-primary/10 text-primary' 
                : 'hover:bg-slate-100'
            }`}
          >
            Chat
          </Link>

          <div className="border-l pl-4 flex items-center">
            <span className="text-sm mr-3">{user?.username}</span>
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