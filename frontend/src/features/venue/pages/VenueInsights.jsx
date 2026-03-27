import { useState } from 'react'
import { useVenueInsight } from '../hooks/useVenueInsight'
import Card, { CardHeader, CardTitle, CardContent } from '@/shared/components/Card.jsx'
import Button from '@/shared/components/Button.jsx'
import Select from '@/shared/components/Select.jsx'
import Badge from '@/shared/components/Badge.jsx'
import { SkeletonCard } from '@/shared/components/Skeleton.jsx'
import { cn } from '@/shared/utils'
import { POPULAR_VENUES } from '@/shared/constants'
import { MapPin, Search, TrendingUp, Activity, BarChart3 } from 'lucide-react'

export default function VenueInsights() {
  const { insight, isLoading, fetchInsight, reset } = useVenueInsight()
  const [selectedVenue, setSelectedVenue] = useState('')

  const handleSearch = () => {
    if (selectedVenue) {
      fetchInsight(selectedVenue)
    }
  }

  const handleReset = () => {
    setSelectedVenue('')
    reset()
  }

  const getTypeInfo = (type) => {
    if (type === 'Batting Friendly') {
      return {
        variant: 'success',
        description: 'High scoring venue with flat pitches. Expect big totals and entertaining cricket.',
        icon: TrendingUp,
      }
    }
    if (type === 'Bowling Friendly') {
      return {
        variant: 'danger',
        description: 'Bowlers get assistance from the conditions. Lower scores expected.',
        icon: Activity,
      }
    }
    return {
      variant: 'info',
      description: 'Balanced conditions offering something for both batters and bowlers.',
      icon: BarChart3,
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Venue Insights</h1>
        <p className="text-muted-foreground mt-1">
          Explore venue statistics and conditions
        </p>
      </div>

      {/* Search Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5 text-primary" />
            Search Venue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Select
                value={selectedVenue}
                onChange={setSelectedVenue}
                options={POPULAR_VENUES}
                placeholder="Select or search for a venue"
                searchable
              />
            </div>
            <div className="flex gap-3">
              <Button
                onClick={handleSearch}
                disabled={!selectedVenue || isLoading}
                isLoading={isLoading}
              >
                <MapPin className="w-4 h-4" />
                Get Insights
              </Button>
              <Button variant="outline" onClick={handleReset}>
                Reset
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loading */}
      {isLoading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      )}

      {/* Venue Result */}
      {!isLoading && insight && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
          {/* Main Info Card */}
          <Card glow>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-7 h-7 text-accent" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-foreground">{insight.venue}</h2>
                  <Badge variant={getTypeInfo(insight.type).variant} className="mt-2">
                    {insight.type}
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-3">
                    {getTypeInfo(insight.type).description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Card */}
          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-secondary/30 text-center">
                  <p className="text-3xl font-bold text-foreground">
                    {insight.avgRuns?.toFixed(0) || '-'}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Avg 1st Innings Score
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-secondary/30 text-center">
                  <p className="text-3xl font-bold text-foreground">
                    {insight.matches || '-'}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Matches Analyzed
                  </p>
                </div>
              </div>

              {/* Visual indicator */}
              <div className="mt-6 pt-6 border-t border-border">
                <p className="text-sm text-muted-foreground mb-3">Pitch Condition</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-destructive">Bowler</span>
                  <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all duration-700',
                        insight.type === 'Batting Friendly' && 'bg-green-500 w-4/5',
                        insight.type === 'Bowling Friendly' && 'bg-destructive w-1/5',
                        insight.type === 'Balanced' && 'bg-accent w-1/2'
                      )}
                    />
                  </div>
                  <span className="text-xs text-green-500">Batter</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !insight && (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-accent" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Explore Venue Stats
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Select a venue to see detailed insights including average scores, 
              match count, and pitch conditions.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Popular Venues */}
      <Card>
        <CardHeader>
          <CardTitle>Popular Venues</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {POPULAR_VENUES.map((venue) => (
              <button
                key={venue}
                onClick={() => {
                  setSelectedVenue(venue)
                  fetchInsight(venue)
                }}
                className={cn(
                  'p-3 rounded-lg text-sm text-left transition-all',
                  'bg-secondary/30 hover:bg-secondary/50',
                  'border border-transparent hover:border-primary/30',
                  selectedVenue === venue && 'border-primary bg-primary/10'
                )}
              >
                <MapPin className="w-4 h-4 text-accent mb-1" />
                <span className="text-foreground font-medium line-clamp-2">{venue}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
