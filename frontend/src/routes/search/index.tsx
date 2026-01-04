import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { api } from '@/fetchClient'

interface SerieData {
  Title: string
  Year: string
  Rated: string
  Released: string
  Runtime: string
  Genre: string
  Director: string
  Writer: string
  Actors: string
  Plot: string
  Language: string
  Country: string
  Awards: string
  Poster: string
  Metascore: string
  imdbRating: string
  imdbVotes: string
  imdbID: string
  totalSeasons: string
  Response: string
}

export const Route = createFileRoute('/search/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [searchInput, setSearchInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data, isLoading, isError, error } = useQuery<SerieData>({
    queryKey: ['search-series', searchQuery],
    queryFn: () =>
      api.get(`/series/search?name=${searchQuery}`, {
        Authorization: `Bearer ${localStorage.getItem('videoclub_access_token')}`,
      }),
    enabled: !!searchQuery,
  })

  const addMutation = useMutation({
    mutationFn: (serieData: SerieData): Promise<{ imdbID: string }> =>
      api.post('/series/add', serieData, {
        Authorization: `Bearer ${localStorage.getItem('videoclub_access_token')}`,
      }),
    onSuccess: ({ imdbID }: { imdbID: string }) => {
      queryClient.invalidateQueries({ queryKey: ['all-series'] })
      navigate({ to: '/series/$imdbID', params: { imdbID } })
    },
    onError: (e: Error) => {
      alert(e.message)
    },
  })

  const handleSearch = () => {
    if (searchInput.trim()) {
      setSearchQuery(searchInput.trim())
    }
  }

  const handleAdd = () => {
    if (data) {
      addMutation.mutate(data)
    }
  }

  return (
    <div className="min-h-screen bg-[#141414] text-white">
      <div className="px-4 py-6 md:px-8 lg:px-12">
        <div className="max-w-md mx-auto mb-8">
          <div className="flex items-center bg-[#1e1e1e] border border-white/10 rounded-xl shadow-lg shadow-black/20 focus-within:border-[#E50914]/50 transition-all duration-300">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search for a series..."
              className="flex-1 bg-transparent px-3 py-2.5 text-white placeholder-gray-500 focus:outline-none text-sm"
            />
            <button
              onClick={handleSearch}
              disabled={!searchInput.trim() || isLoading}
              className="m-1.5 p-2 bg-[#E50914] hover:bg-[#f40612] disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
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
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {isLoading && (
          <div className="flex justify-center items-center py-16">
            <div className="relative">
              <div className="w-10 h-10 border-3 border-[#E50914]/20 rounded-full" />
              <div className="absolute inset-0 w-10 h-10 border-3 border-transparent border-t-[#E50914] rounded-full animate-spin" />
            </div>
          </div>
        )}

        {isError && (
          <div className="max-w-md mx-auto text-center py-10">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-red-500/20 rounded-full mb-3">
              <svg
                className="w-6 h-6 text-[#E50914]"
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
            <p className="text-gray-400 text-sm">
              {error instanceof Error ? error.message : 'Series not found'}
            </p>
          </div>
        )}

        {data && (
          <div className="flex flex-col items-center animate-fade-in">
            <div
              className="poster-card rounded-xl shadow-xl shadow-black/40 cursor-pointer transition-transform duration-300 hover:scale-105"
              onClick={handleAdd}
            >
              <img
                src={
                  data.Poster !== 'N/A'
                    ? data.Poster
                    : 'https://via.placeholder.com/300x445/1a1a1a/E50914?text=No+Poster'
                }
                alt={data.Title}
                className="w-44 md:w-52 rounded-xl"
              />
            </div>

            <h2 className="text-lg md:text-xl font-semibold mt-4 text-center">
              {data.Title}
            </h2>
            <p className="text-gray-400 text-sm">{data.Year}</p>

            <button
              onClick={handleAdd}
              disabled={addMutation.isPending}
              className="mt-4 flex items-center gap-1.5 px-5 py-2 bg-[#E50914] hover:bg-[#f40612] disabled:bg-[#E50914]/50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-[#E50914]/30"
            >
              {addMutation.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Adding...
                </>
              ) : (
                <>
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
                  Add to My List
                </>
              )}
            </button>
          </div>
        )}

        {!searchQuery && !isLoading && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 mb-4 opacity-20">
              <svg
                className="w-full h-full text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-500 mb-1">
              Search for a series
            </h3>
            <p className="text-gray-600 text-sm max-w-xs">
              Use the search bar to find any series
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
