import Card, { CardHeader, CardTitle, CardContent } from '@/shared/components/Card.jsx'
import Badge from '@/shared/components/Badge.jsx'
import { MapPin } from 'lucide-react'

export function VenueInsightCard({ insight }) {
  if (!insight) return null

  const { venue, avgRuns, matches, type } = insight

  const getTypeVariant = () => {
    if (type === 'Batting Friendly') return 'success'
    if (type === 'Bowling Friendly') return 'danger'
    return 'info'
  }

  const getTypeDescription = () => {
    if (type === 'Batting Friendly') return 'High scoring venue, expect big totals'
    if (type === 'Bowling Friendly') return 'Bowlers get assistance, lower scores expected'
    return 'Balanced conditions for both bat and ball'
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-accent" />
          Venue Insight
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Venue Name */}
          <div>
            <h4 className="text-xl font-bold text-foreground">{venue}</h4>
            <Badge variant={getTypeVariant()} className="mt-2">
              {type}
            </Badge>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground">
            {getTypeDescription()}
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
            <div>
              <p className="text-2xl font-bold text-foreground">{avgRuns?.toFixed(0) || '-'}</p>
              <p className="text-xs text-muted-foreground">Avg 1st Innings Score</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{matches || '-'}</p>
              <p className="text-xs text-muted-foreground">Matches Analyzed</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
