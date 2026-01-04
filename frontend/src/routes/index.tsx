import { Link, createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/fetchClient'

interface Serie {
  title: string
  year: string
  poster: string
  imdbRating: string
  imdbID: string
}

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  const { data: series, isLoading, isError } = useQuery<Array<Serie>>({
    queryKey: ['all-series'],
    queryFn: () => api.get('/series/all'),
  })

  return (
    <div className="min-h-screen bg-[#141414] text-white">
      <div className="px-4 py-6 md:px-8 lg:px-12">
        {isLoading && (
          <div className="flex justify-center items-center py-16">
            <div className="relative">
              <div className="w-10 h-10 border-3 border-[#E50914]/20 rounded-full" />
              <div className="absolute inset-0 w-10 h-10 border-3 border-transparent border-t-[#E50914] rounded-full animate-spin" />
            </div>
          </div>
        )}

        {isError && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 mb-4 opacity-20">
              <svg className="w-full h-full text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-500 mb-1">No series yet</h3>
            <p className="text-gray-600 text-sm max-w-xs mb-4">
              Start building your collection by adding some series
            </p>
            <Link
              to="/search"
              className="flex items-center gap-1.5 px-4 py-2 bg-[#E50914] hover:bg-[#f40612] text-white text-sm font-semibold rounded-lg transition-all duration-300 hover:scale-105"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search Series
            </Link>
          </div>
        )}        

        {series && series.length > 0 && (
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {series.map((serie) => (
              <Link
                key={serie.imdbID}
                to="/series/$imdbID"
                params={{ imdbID: serie.imdbID }}
                className="group"
              >
                <div className="relative overflow-hidden rounded-lg shadow-md shadow-black/30 transition-transform duration-300 group-hover:scale-105">
                  <img
                    src={serie.poster !== 'N/A' ? serie.poster : 'https://placehold.co/300x445/1a1a1a/E50914?text=No+Poster'}
                    alt={serie.title}
                    className="w-full aspect-[2/3] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-2.5 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-sm font-semibold truncate">{serie.title}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-gray-300">
                      <span>{serie.year}</span>
                      {serie.imdbRating && serie.imdbRating !== 'N/A' && (
                        <span className="flex items-center gap-0.5 text-yellow-400">
                          <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                          {serie.imdbRating}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
