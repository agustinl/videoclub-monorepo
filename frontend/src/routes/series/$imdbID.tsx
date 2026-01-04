import { Link, createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/fetchClient'

interface SerieDetail {
  id: number
  title: string
  year: string
  rated: string
  released: string
  runtime: string
  genre: string
  director: string
  writer: string
  actors: string
  plot: string
  language: string
  country: string
  awards: string
  poster: string
  metascore: string
  imdbRating: string
  imdbVotes: string
  imdbID: string
  totalSeasons: string
}

export const Route = createFileRoute('/series/$imdbID')({
  component: SerieDetailPage,
})

function SerieDetailPage() {
  const { imdbID } = Route.useParams()

  const { data, isLoading, isError } = useQuery<SerieDetail>({
    queryKey: ['serie', imdbID],
    queryFn: () => api.get(`/series/${imdbID}`),
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#141414] flex justify-center items-center">
        <div className="relative">
          <div className="w-10 h-10 border-3 border-[#E50914]/20 rounded-full" />
          <div className="absolute inset-0 w-10 h-10 border-3 border-transparent border-t-[#E50914] rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen bg-[#141414] flex flex-col items-center justify-center text-white">
        <div className="w-16 h-16 mb-4 opacity-20">
          <svg className="w-full h-full text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-gray-400 mb-3">Series not found</h2>
        <Link
          to="/"
          className="px-4 py-2 bg-[#E50914] hover:bg-[#f40612] text-white text-sm font-semibold rounded-lg transition-all duration-300 hover:scale-105"
        >
          Back to Collection
        </Link>
      </div>
    )
  }

  const hasValue = (val: string | undefined) => val && val !== 'N/A'

  return (
    <div className="min-h-screen bg-[#141414] text-white">
      <div className="px-4 py-6 md:px-8 lg:px-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0 mx-auto md:mx-0">
              <img
                src={hasValue(data.poster) ? data.poster : 'https://via.placeholder.com/300x445/1a1a1a/E50914?text=No+Poster'}
                alt={data.title}
                className="w-44 md:w-52 rounded-xl shadow-xl shadow-black/40"
              />
            </div>

            <div className="flex-1">
              <h1 className="text-xl md:text-2xl font-bold mb-2">
                {data.title}
              </h1>

              <div className="flex flex-wrap items-center gap-2 mb-3">
                {hasValue(data.imdbRating) && (
                  <span className="flex items-center gap-1 px-2 py-0.5 bg-yellow-500/20 text-yellow-400 rounded font-semibold text-xs">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    {data.imdbRating}
                  </span>
                )}
                {hasValue(data.imdbVotes) && (
                  <span className="text-gray-500 text-xs">({data.imdbVotes} votes)</span>
                )}
                {hasValue(data.metascore) && (
                  <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded text-xs font-semibold">
                    Metascore: {data.metascore}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2 mb-3 text-xs text-gray-400">
                {hasValue(data.year) && <span>{data.year}</span>}
                {hasValue(data.rated) && (
                  <span className="px-1.5 py-0.5 border border-gray-600 rounded">{data.rated}</span>
                )}
                {hasValue(data.runtime) && <span>{data.runtime}</span>}
                {hasValue(data.totalSeasons) && (
                  <span className="px-2 py-0.5 bg-[#E50914]/20 text-[#E50914] rounded font-semibold">
                    {data.totalSeasons} Seasons
                  </span>
                )}
              </div>

              {hasValue(data.genre) && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {data.genre.split(', ').map((genre) => (
                    <span
                      key={genre}
                      className="px-2 py-0.5 bg-white/10 rounded-full text-xs text-gray-300 border border-white/10"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              )}

              {hasValue(data.plot) && (
                <p className="text-gray-300 text-sm leading-relaxed mb-4">
                  {data.plot}
                </p>
              )}

              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs mb-4">
                {hasValue(data.director) && (
                  <div>
                    <span className="text-gray-500 uppercase tracking-wider">Director</span>
                    <p className="text-gray-300 mt-0.5">{data.director}</p>
                  </div>
                )}
                {hasValue(data.writer) && (
                  <div>
                    <span className="text-gray-500 uppercase tracking-wider">Writer</span>
                    <p className="text-gray-300 mt-0.5">{data.writer}</p>
                  </div>
                )}
                {hasValue(data.actors) && (
                  <div className="col-span-2">
                    <span className="text-gray-500 uppercase tracking-wider">Cast</span>
                    <p className="text-gray-300 mt-0.5">{data.actors}</p>
                  </div>
                )}
                {hasValue(data.released) && (
                  <div>
                    <span className="text-gray-500 uppercase tracking-wider">Released</span>
                    <p className="text-gray-300 mt-0.5">{data.released}</p>
                  </div>
                )}
                {hasValue(data.language) && (
                  <div>
                    <span className="text-gray-500 uppercase tracking-wider">Language</span>
                    <p className="text-gray-300 mt-0.5">{data.language}</p>
                  </div>
                )}
                {hasValue(data.country) && (
                  <div>
                    <span className="text-gray-500 uppercase tracking-wider">Country</span>
                    <p className="text-gray-300 mt-0.5">{data.country}</p>
                  </div>
                )}
              </div>

              {hasValue(data.awards) && (
                <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <div className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    <p className="text-yellow-200 text-xs">{data.awards}</p>
                  </div>
                </div>
              )}

              <a
                href={`https://www.imdb.com/title/${data.imdbID}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-yellow-500 hover:bg-yellow-400 text-black text-xs font-semibold rounded-lg transition-all duration-300 hover:scale-105"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14.31 10.3l-.7 3.6h1.4l-.7-3.6zm-8.31-5.3v14h4v-14h-4zm6 0l-1.5 14h3l.3-2h2.4l.3 2h3l-1.5-14h-6z"/>
                </svg>
                View on IMDb
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
