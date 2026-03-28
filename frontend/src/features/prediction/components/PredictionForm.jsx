import { useEffect, useState } from 'react'
import Card from '@/shared/components/Card.jsx'
import Button from '@/shared/components/Button.jsx'
import Select from '@/shared/components/Select.jsx'
import { CRICKET_TEAMS, POPULAR_VENUES, getTeamLogo } from '@/shared/constants'
import { useTeamSquad } from '../hooks/useTeamSquad.js'
import { Zap, ChevronDown, ChevronUp, Users, MapPin, Swords } from 'lucide-react'

export default function PredictionForm({
  onSubmit,
  isLoading,
  selectedTeam = '',
  onTeamChange,
}) {
  const [teamA, setTeamA] = useState(selectedTeam || '')
  const [teamB, setTeamB] = useState('')
  useEffect(() => {
    if (selectedTeam && selectedTeam !== teamA) {
      setTeamA(selectedTeam)
    }
  }, [selectedTeam, teamA])

  const handleTeamAChange = (value) => {
    setTeamA(value)
    if (onTeamChange) {
      onTeamChange(value)
    }
  }

  const [showAdvanced, setShowAdvanced] = useState(false)
  const [venue, setVenue] = useState('')
  const [batter, setBatter] = useState('')
  const [bowler, setBowler] = useState('')
  const [errors, setErrors] = useState({})

  const { players: batterOptions, season: batterSeason, isLoading: squadALoading } =
    useTeamSquad(teamA, 'batter')
  const { players: bowlerOptions, season: bowlerSeason, isLoading: squadBLoading } =
    useTeamSquad(teamB, 'bowler')

  useEffect(() => {
    setBatter('')
  }, [teamA])

  useEffect(() => {
    setBowler('')
  }, [teamB])

  const validate = () => {
    const newErrors = {}
    if (!teamA) newErrors.teamA = 'Please select Team A'
    if (!teamB) newErrors.teamB = 'Please select Team B'
    if (teamA && teamB && teamA === teamB) {
      newErrors.teamB = 'Teams must be different'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return

    onSubmit({
      teamA,
      teamB,
      venue: venue || undefined,
      batter: batter || undefined,
      bowler: bowler || undefined,
    })
  }

  const teamOptions = CRICKET_TEAMS.map((team) => ({
    value: team,
    label: team,
    icon: getTeamLogo(team),
  }))
  const availableTeamsForB = teamOptions.filter((t) => t.value !== teamA)
  const availableTeamsForA = teamOptions.filter((t) => t.value !== teamB)

  return (
    <Card className="animate-fade-in">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Team Selection */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Select Teams
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Team A
              </label>
              <Select
                value={teamA}
                onChange={handleTeamAChange}
                options={availableTeamsForA}
                placeholder="Select Team A"
                searchable
                error={errors.teamA}
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Team B
              </label>
              <Select
                value={teamB}
                onChange={setTeamB}
                options={availableTeamsForB}
                placeholder="Select Team B"
                searchable
                error={errors.teamB}
                disabled={isLoading}
              />
            </div>
          </div>
        </div>

        {/* Advanced Options Toggle */}
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          Advanced Options
        </button>

        {/* Advanced Options */}
        {showAdvanced && (
          <div className="space-y-6 pt-4 border-t border-border animate-fade-in">
            {/* Venue */}
            <div>
              <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-accent" />
                Venue (Optional)
              </h4>
              <Select
                value={venue}
                onChange={setVenue}
                options={POPULAR_VENUES}
                placeholder="Select venue for insights"
                searchable
                disabled={isLoading}
              />
            </div>

            {/* Player Battle — requires Team A + Team B from main form */}
            <div>
              <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                <Swords className="w-4 h-4 text-primary" />
                Player Battle (Optional)
              </h4>
              {!teamA || !teamB ? (
                <p className="text-xs text-muted-foreground">
                  Select Team A and Team B above first.
                </p>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-muted-foreground mb-2">
                        Batter ({teamA})
                        {batterSeason?.matchCount != null && (
                          <span className="text-[10px]">
                            {' '}
                            · {batterSeason.matchCount} matches{batterSeason?.usedFallback ? ' (all-time)' : ''}
                          </span>
                        )}
                      </label>
                      <Select
                        value={batter}
                        onChange={setBatter}
                        options={batterOptions}
                        placeholder={
                          squadALoading
                            ? 'Loading batters…'
                            : batterOptions.length
                              ? 'Select batter'
                              : 'No batters found for this team'
                        }
                        searchable
                        disabled={isLoading || squadALoading}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-muted-foreground mb-2">
                        Bowler ({teamB})
                        {bowlerSeason?.matchCount != null && (
                          <span className="text-[10px]">
                            {' '}
                            · {bowlerSeason.matchCount} matches{bowlerSeason?.usedFallback ? ' (all-time)' : ''}
                          </span>
                        )}
                      </label>
                      <Select
                        value={bowler}
                        onChange={setBowler}
                        options={bowlerOptions}
                        placeholder={
                          squadBLoading
                            ? 'Loading bowlers…'
                            : bowlerOptions.length
                              ? 'Select bowler'
                              : 'No bowlers found for this team'
                        }
                        searchable
                        disabled={isLoading || squadBLoading}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Submit */}
        <Button type="submit" className="w-full" isLoading={isLoading}>
          <Zap className="w-4 h-4" />
          Generate Prediction
        </Button>
      </form>
    </Card>
  )
}
