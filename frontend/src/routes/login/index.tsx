import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { Eye, EyeOff, Film, LogIn } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { api } from '@/fetchClient'

export const Route = createFileRoute('/login/')({
  component: LoginPage,
})

interface LoginResponse {
  access_token: string
}

function LoginPage() {
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loginMutation = useMutation({
    mutationFn: (): Promise<LoginResponse> =>
      api.postForm('/auth/token', {
        username,
        password,
      }),
    onSuccess: (data: LoginResponse) => {
      localStorage.setItem('videoclub_access_token', data.access_token)
      navigate({ to: '/' })
    },
    onError: (e: Error) => {
      setError(e.message)
    },
  })

  return (
    <div className="min-h-[calc(100vh-52px)] bg-[#141414] flex items-center justify-center p-3 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-radial from-[#E50914]/15 via-transparent to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-radial from-[#B20710]/10 via-transparent to-transparent rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative w-full max-w-sm animate-fade-in">
        <div className="backdrop-blur-xl bg-black/60 border border-white/10 rounded-xl p-6 shadow-2xl shadow-black/50">
          {/* Logo */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-[#E50914] to-[#B20710] mb-3 shadow-lg shadow-[#E50914]/30">
              <Film className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-1 tracking-tight">
              VideoClub
            </h1>
            <p className="text-gray-400 text-xs">Sign in to continue</p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-[#E50914]/10 border border-[#E50914]/30 text-[#E50914] text-xs text-center animate-fade-in">
              <span className="flex items-center justify-center gap-1.5">
                <svg
                  className="w-3.5 h-3.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {error}
              </span>
            </div>
          )}

          {/* Login form */}
          <form onSubmit={(e) => {
            e.preventDefault()
            loginMutation.mutate()
          }} className="space-y-4">
            {/* Username */}
            <div className="space-y-1.5">
              <label
                htmlFor="username"
                className="block text-xs font-medium text-gray-300"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
                disabled={loginMutation.isPending}
                className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 
                         focus:outline-none focus:border-[#E50914]/50 focus:ring-1 focus:ring-[#E50914]/20 
                         transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:border-white/20"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="block text-xs font-medium text-gray-300"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  disabled={loginMutation.isPending}
                  className="w-full px-3 py-2.5 pr-10 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 
                           focus:outline-none focus:border-[#E50914]/50 focus:ring-1 focus:ring-[#E50914]/20 
                           transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:border-white/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loginMutation.isPending}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 
                           transition-colors duration-200 disabled:cursor-not-allowed p-0.5 rounded"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loginMutation.isPending || !username || !password}
              className="w-full py-2.5 px-3 bg-gradient-to-r from-[#E50914] to-[#B20710] text-white text-sm font-semibold rounded-lg
                       hover:from-[#f40612] hover:to-[#c4080f] focus:outline-none focus:ring-2 focus:ring-[#E50914]/50
                       transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200
                       disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                       shadow-lg shadow-[#E50914]/25 flex items-center justify-center gap-1.5"
            >
              {loginMutation.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
