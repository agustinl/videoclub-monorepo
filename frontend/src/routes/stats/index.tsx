import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { api } from '@/fetchClient'

// Register Chart.js components required for the bar chart
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export const Route = createFileRoute('/stats/')({
  component: RouteComponent,
})

interface Stats {
  series_by_release_year: Record<string, number>
  series_by_imdb_rating: Record<string, number>
  series_by_total_seasons: Record<string, number>
  average_imdb_rating: number
  most_popular_year: string
  average_total_seasons: number
  series_with_rating_8_or_higher: number
  total_series_count: number
  series_by_genre: Record<string, number>
}

function RouteComponent() {
  const {
    data: stats,
    isLoading,
    isError,
  } = useQuery<Stats>({
    queryKey: ['stats'],
    queryFn: () => api.get('/stats/stats'),
  })

  const releaseYearData = {
    labels: Object.keys(stats?.series_by_release_year || {}),
    datasets: [
      {
        label: 'Series',
        data: Object.values(stats?.series_by_release_year || {}),
        backgroundColor: 'rgba(220, 38, 38, 0.8)',
        borderColor: 'rgb(220, 38, 38)',
        borderWidth: 2,
        borderRadius: 2,
      },
    ],
  }

  const genreData = {
    labels: Object.keys(stats?.series_by_genre || {}),
    datasets: [
      {
        label: 'Series',
        data: Object.values(stats?.series_by_genre || {}),
        backgroundColor: 'rgba(220, 38, 38, 0.8)',
        borderColor: 'rgb(220, 38, 38)',
        borderWidth: 2,
        borderRadius: 2,
      },
    ],
  }

  const imdbRatingData = {
    labels: Object.keys(stats?.series_by_imdb_rating || {}),
    datasets: [
      {
        label: 'Series',
        data: Object.values(stats?.series_by_imdb_rating || {}),
        backgroundColor: 'rgba(220, 38, 38, 0.8)',
        borderColor: 'rgb(220, 38, 38)',
        borderWidth: 2,
        borderRadius: 2,
      },
    ],
  }

  // Dummy data: Series count by total seasons
  const totalSeasonsData = {
    labels: Object.keys(stats?.series_by_total_seasons || {}),
    datasets: [
      {
        label: 'Series',
        data: Object.values(stats?.series_by_total_seasons || {}),
        backgroundColor: 'rgba(220, 38, 38, 0.8)',
        borderColor: 'rgb(220, 38, 38)',
        borderWidth: 2,
        borderRadius: 2,
      },
    ],
  }

  // Base chart options with pure black theme (no blue tints)
  const createChartOptions = (title: string, horizontal = false) => ({
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: horizontal ? ('y' as const) : ('x' as const),
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: title,
        color: '#ffffff',
        font: {
          size: 18,
          weight: 'bold' as const,
          family: 'Noto Sans, sans-serif',
        },
        padding: {
          bottom: 16,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
        titleColor: '#ffffff',
        bodyColor: '#a3a3a3',
        borderColor: 'rgba(220, 38, 38, 0.6)',
        borderWidth: 1,
        cornerRadius: 6,
        padding: 10,
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#737373', // Neutral gray without blue
          font: {
            size: 11,
          },
        },
        grid: {
          color: 'rgba(38, 38, 38, 0.8)', // Pure dark gray grid
        },
      },
      y: {
        ticks: {
          color: '#737373',
          font: {
            size: 11,
          },
        },
        grid: {
          color: 'rgba(38, 38, 38, 0.8)',
        },
      },
    },
  })

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError) {
    return <div>Error loading stats</div>
  }
  console.log(stats)

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="px-4 py-6 md:px-8 lg:px-12">
        <section className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold tracking-tight">
              📊 Statistics of the Videoclub
            </h1>
            <p className="text-neutral-500">
              Metrics and distribution of the catalog
            </p>
          </div>

          {/* Total Series Count Card */}
          <div className="mb-8 rounded-xl border border-neutral-800 bg-gradient-to-br from-[#141414] to-[#0f0f0f] p-8 shadow-2xl">
            <div className="flex items-center gap-6">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-red-600/20">
                <span className="text-4xl">🎬</span>
              </div>
              <div>
                <p className="text-sm font-medium uppercase tracking-wider text-neutral-500">
                  Total of Series in Catalog
                </p>
                <p className="text-5xl font-bold text-white">
                  {stats?.total_series_count.toString() || '0'}
                </p>
              </div>
            </div>
          </div>

          {/* Charts Grid - 2x2 layout */}
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            {/* Release Year Chart */}
            <div className="rounded-xl border border-neutral-800 bg-gradient-to-br from-[#141414] to-[#0f0f0f] p-6 shadow-2xl">
              <div className="h-[350px]">
                <Bar
                  data={releaseYearData}
                  options={createChartOptions('Series by Release Year')}
                />
              </div>
            </div>

            {/* IMDB Rating Chart */}
            <div className="rounded-xl border border-neutral-800 bg-gradient-to-br from-[#141414] to-[#0f0f0f] p-6 shadow-2xl">
              <div className="h-[350px]">
                <Bar
                  data={imdbRatingData}
                  options={createChartOptions('Series by IMDB Rating')}
                />
              </div>
            </div>

            {/* Genre Chart */}
            <div className="rounded-xl border border-neutral-800 bg-gradient-to-br from-[#141414] to-[#0f0f0f] p-6 shadow-2xl lg:col-span-2">
              <div className="h-[300px]">
                <Bar
                  data={genreData}
                  options={createChartOptions('Series by Genre')}
                />
              </div>
              <p className="mt-1 text-sm text-neutral-600">Took the first genre of each serie to group them</p>
            </div>

            {/* Total Seasons Chart */}
            <div className="rounded-xl border border-neutral-800 bg-gradient-to-br from-[#141414] to-[#0f0f0f] p-6 shadow-2xl lg:col-span-2">
              <div className="h-[300px]">
                <Bar
                  data={totalSeasonsData}
                  options={createChartOptions('Series by Total Seasons')}
                />
              </div>
            </div>
          </div>

          {/* Summary Stats Cards */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Average Rating"
              value={stats?.average_imdb_rating.toFixed(1) ?? '0'}
              subtitle="IMDB Score"
            />
            <StatCard
              title="Most Popular Year"
              value={stats?.most_popular_year || '0'}
              subtitle={`${stats?.series_by_release_year[stats.most_popular_year] || '0'} series released`}
            />
            <StatCard
              title="Average Seasons"
              value={stats?.average_total_seasons.toFixed(1) || '0'}
              subtitle="Per series"
            />
            <StatCard
              title="Series +8 Rating"
              value={stats?.series_with_rating_8_or_higher.toString() || '0'}
              subtitle={`${(((stats?.series_with_rating_8_or_higher ?? 0) / (stats?.total_series_count ?? 0)) * 100).toFixed(1)}% of the catalog`}
            />
          </div>
        </section>
      </div>
    </div>
  )
}

// Reusable stat card component for displaying key metrics
interface StatCardProps {
  title: string
  value: string
  subtitle: string
}

function StatCard({ title, value, subtitle }: StatCardProps) {
  return (
    <div className="rounded-xl border border-neutral-800 bg-gradient-to-br from-[#141414] to-[#0f0f0f] p-5 transition-all hover:border-red-600/50 hover:shadow-lg hover:shadow-red-600/10">
      <p className="text-sm text-neutral-500">{title}</p>
      <p className="mt-1 text-3xl font-bold">{value}</p>
      <p className="mt-1 text-sm text-neutral-600">{subtitle}</p>
    </div>
  )
}
