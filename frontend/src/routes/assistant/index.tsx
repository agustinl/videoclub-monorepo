import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/fetchClient'

const isProduction = import.meta.env.PROD

export const Route = createFileRoute('/assistant/')({
  component: RouteComponent,
})

function RouteComponent() {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery<string>({
    queryKey: ['assistant-recommendation'],
    queryFn: () =>
      api.get('/assistant/assistant', {
        Authorization: `Bearer ${localStorage.getItem('videoclub_access_token')}`,
      }),
    enabled: false,
    staleTime: Infinity,
  })

  const handleGetRecommendation = () => {
    refetch()
  }

  const renderMarkdown = (text: string) => {
    const lines = text.split('\n')
    const elements: Array<React.ReactNode> = []
    let listItems: Array<string> = []
    let listKey = 0

    const flushList = () => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={`list-${listKey++}`} className="space-y-2 my-4">
            {listItems.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-gray-300">
                <span className="text-[#E50914] mt-1.5">•</span>
                <span dangerouslySetInnerHTML={{ __html: formatInline(item) }} />
              </li>
            ))}
          </ul>
        )
        listItems = []
      }
    }

    const formatInline = (content: string): string => {
      return content
        .replace(/\*\*\*(.*?)\*\*\*/g, '<strong class="text-white font-bold italic">$1</strong>')
        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
        .replace(/\*(.*?)\*/g, '<em class="text-amber-200/90">$1</em>')
        .replace(/`(.*?)`/g, '<code class="bg-white/10 px-1.5 py-0.5 rounded text-[#E50914] text-sm">$1</code>')
    }

    lines.forEach((line, index) => {
      const trimmedLine = line.trim()

      if (!trimmedLine) {
        flushList()
        return
      }

      // Headers
      if (trimmedLine.startsWith('## ')) {
        flushList()
        elements.push(
          <h2 key={index} className="text-xl font-bold text-white mt-6 mb-3 border-b border-white/10 pb-2">
            {trimmedLine.slice(3)}
          </h2>
        )
        return
      }

      if (trimmedLine.startsWith('# ')) {
        flushList()
        elements.push(
          <h1 key={index} className="text-2xl font-bold text-white mt-4 mb-4">
            {trimmedLine.slice(2)}
          </h1>
        )
        return
      }

      // Bold title with **
      if (trimmedLine.startsWith('**') && trimmedLine.endsWith('**') && !trimmedLine.slice(2, -2).includes('**')) {
        flushList()
        const title = trimmedLine.slice(2, -2)
        elements.push(
          <h3 key={index} className="text-xl font-bold text-[#E50914] mt-5 mb-2">
            {title}
          </h3>
        )
        return
      }

      // List items
      if (trimmedLine.startsWith('* ') || trimmedLine.startsWith('- ')) {
        listItems.push(trimmedLine.slice(2))
        return
      }

      // Regular paragraph
      flushList()
      elements.push(
        <p
          key={index}
          className="text-gray-300 leading-relaxed my-3"
          dangerouslySetInnerHTML={{ __html: formatInline(trimmedLine) }}
        />
      )
    })

    flushList()
    return elements
  }

  return (
    <div className="min-h-screen bg-[#141414] text-white">
      <div className="px-4 py-6 md:px-8 lg:px-12">
        {/* Header Section */}
        <div className="max-w-2xl mx-auto text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#E50914] to-[#b8070f] rounded-2xl shadow-lg shadow-[#E50914]/30 mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
              />
            </svg>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            AI Recommendation
          </h1>
          <p className="text-gray-400 text-sm md:text-base">
            Get personalized series recommendations based on your watchlist
          </p>
        </div>

        {/* Production Warning Note */}
        {isProduction && (
          <div className="max-w-xl mx-auto mb-8">
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <svg
                  className="w-5 h-5 text-amber-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-amber-400 font-medium text-sm mb-1">
                  AI Assistant Unavailable
                </h3>
                <p className="text-amber-200/70 text-sm leading-relaxed">
                  The AI recommendation feature is only available in local development with a configured <code className="bg-amber-500/20 px-1.5 py-0.5 rounded text-amber-300 text-xs">GOOGLE_API_KEY</code> (Gemini API).
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Get Recommendation Button */}
        {!data && !isLoading && !isFetching && (
          <div className="flex justify-center mb-8">
            <button
              onClick={handleGetRecommendation}
              disabled={isProduction}
              className={`group flex items-center gap-3 px-8 py-4 font-semibold rounded-xl transition-all duration-300 shadow-xl ${
                isProduction
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed shadow-none'
                  : 'bg-gradient-to-r from-[#E50914] to-[#b8070f] hover:from-[#f40612] hover:to-[#c9080f] text-white hover:scale-105 active:scale-95 shadow-[#E50914]/40'
              }`}
            >
              <svg
                className={`w-5 h-5 transition-transform duration-300 ${
                  isProduction ? '' : 'group-hover:rotate-12'
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
                />
              </svg>
              Get My Recommendation
            </button>
          </div>
        )}

        {/* Loading State */}
        {(isLoading || isFetching) && (
          <div className="flex flex-col justify-center items-center py-16">
            <div className="relative mb-6">
              <div className="w-16 h-16 border-4 border-[#E50914]/20 rounded-full" />
              <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-[#E50914] rounded-full animate-spin" />
            </div>
            <p className="text-gray-400 text-sm animate-pulse">
              AI is analyzing your watchlist...
            </p>
            <p className="text-gray-500 text-xs mt-2">
              This may take a few seconds
            </p>
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="max-w-md mx-auto text-center py-10">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-red-500/20 rounded-full mb-4">
              <svg
                className="w-7 h-7 text-[#E50914]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Something went wrong
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              {error instanceof Error ? error.message : 'Failed to get recommendation'}
            </p>
            <button
              onClick={handleGetRecommendation}
              className="px-5 py-2 bg-[#E50914] hover:bg-[#f40612] text-white text-sm font-medium rounded-lg transition-all duration-200 hover:scale-105"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Recommendation Result */}
        {Boolean(data) && !isLoading && !isFetching && (
          <div className="max-w-2xl mx-auto animate-fade-in">
            <div className="bg-gradient-to-br from-[#1e1e1e] to-[#252525] border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl shadow-black/40">
              {/* Card Header */}
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
                <div className="p-2 bg-[#E50914]/20 rounded-lg">
                  <svg
                    className="w-5 h-5 text-[#E50914]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-400">
                  Personalized Recommendation
                </span>
              </div>

              {/* Markdown Content */}
              <div className="prose prose-invert max-w-none">
                {data && renderMarkdown(data)}
              </div>

              {/* Get Another Button */}
              <div className="mt-8 pt-6 border-t border-white/10 flex justify-center">
                <button
                  onClick={handleGetRecommendation}
                  className="flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white text-sm font-medium rounded-lg transition-all duration-200 hover:scale-105"
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
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Get Another Recommendation
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
