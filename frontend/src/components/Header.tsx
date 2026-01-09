import { Link, useRouter } from '@tanstack/react-router'
import { BotIcon, LogIn } from 'lucide-react'

interface HeaderProps {
  title?: string
  showBack?: boolean
  showAddButton?: boolean
  showLoginButton?: boolean
}

export default function Header({
  showBack = false,
  showAddButton = false,
  showLoginButton = false,
}: HeaderProps) {
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
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          )}

          <Link to="/" className="flex items-center gap-2">
            <img src="/logo-videoclub.png" alt="Logo" className="h-8" />
          </Link>

          <Link
            to="/stats"
            className="flex items-center gap-1.5 px-3 py-1.5 text-[#E50914] text-sm font-medium rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
          >
            Stats
          </Link>

          <Link
            to="/assistant"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 border border-white/10"
          >
            <BotIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Assistant</span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          {showAddButton && (
            <Link
              to="/search"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#E50914] hover:bg-[#f40612] text-white text-sm font-medium rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
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
