import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/lib/auth'
import { API_BASE_URL } from '@/lib/utils'
import { Eye, EyeOff } from 'lucide-react'

export function LoginForm() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    setIsLoading(true)
    setError(null)

    try {
      const formData = new URLSearchParams();
      formData.append('username', username);
      formData.append('password', password);

      const response = await fetch(`${API_BASE_URL}/auth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
        credentials: 'include',
      })
      
      if (!response.ok) {
        let errorMessage = 'Login failed'
        
        try {
          const errorData = await response.json()
          
          if (errorData.detail) {
            errorMessage = errorData.detail
          } else if (errorData.message) {
            errorMessage = errorData.message
          } else if (response.status === 401) {
            errorMessage = 'Invalid username or password'
          }
        } catch (parseError) {
          if (response.status === 401) {
            errorMessage = 'Invalid username or password'
          }
        }
        
        setError(errorMessage)
        setIsLoading(false)
        return
      }
      
      const data = await response.json()
      localStorage.setItem('token', data.access_token)
      
      // Set user state via auth context
      login(username, password).catch(console.error)
      
      setIsLoading(false)
      router.push('/dashboard')
      
    } catch (err) {
      setError('Network error. Please check your connection and try again.')
      setIsLoading(false)
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-3 py-2 sm:px-4 sm:py-3 rounded-lg text-xs sm:text-sm border border-red-200 dark:border-red-800">
            {error}
          </div>
        )}
        
        <div className="space-y-1 sm:space-y-2">
          <label htmlFor="username" className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
            Username
          </label>
          <Input
            id="username"
            type="text" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            className="w-full text-sm"
            required
          />
        </div>
        
        <div className="space-y-1 sm:space-y-2">
          <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
            Password
          </label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full text-sm pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full py-2 sm:py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-xs sm:text-sm"
          disabled={isLoading}
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>
    </div>
  )
} 