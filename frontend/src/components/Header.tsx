import { Link, useRouter } from '@tanstack/react-router'
import { LogIn } from 'lucide-react'

interface HeaderProps {
  title?: string
  showBack?: boolean
  showAddButton?: boolean
  showLoginButton?: boolean
}

export default function Header({ title, showBack = false, showAddButton = false, showLoginButton = false }: HeaderProps) {
  const router = useRouter()

  const handleBack = () => {
    router.history.back()
  }

  return (
    <header className="sticky top-0 z-40 bg-[#141414]/90 backdrop-blur-sm border-b border-white/5">
      <div className="flex items-center justify-between px-4 py-3 md:px-8 lg:px-12">
        <div className="flex items-center gap-3">
          {showBack && (
            <button
              onClick={handleBack}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              aria-label="Go back"
            >
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {title ? (
            <h1 className="text-lg font-semibold text-white">{title}</h1>
          ) : (
            <Link to="/" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-gradient-to-br from-[#E50914] to-[#B20710] flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                </svg>
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-[#E50914] to-[#B20710] bg-clip-text text-transparent">
                VideoClub
              </span>
            </Link>
          )}
        </div>

        <div className="flex items-center gap-2">
          {showAddButton && (
            <Link
              to="/search"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#E50914] hover:bg-[#f40612] text-white text-sm font-medium rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span className="hidden sm:inline">Add Series</span>
            </Link>
          )}

          {showLoginButton && (
            <Link
              to="/login"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 border border-white/10"
            >
              <LogIn className="w-4 h-4" />
              <span className="hidden sm:inline">Sign In</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
