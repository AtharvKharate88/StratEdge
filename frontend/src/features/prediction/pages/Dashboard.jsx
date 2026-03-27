import { useState, useEffect, useCallback } from 'react'
import { usePrediction } from '../hooks/usePrediction'
import { useBehaviorTracking } from '@/features/behavior/hooks/useBehaviorTracking'
import { usePlayerImpact } from '@/features/player-analytics/hooks/usePlayerImpact'
import { useAppContext } from '@/shared/context/AppContext.jsx'
import PredictionForm from '../components/PredictionForm.jsx'
import PredictionResult from '../components/PredictionResult.jsx'
import ExplanationPanel from '@/features/explanation/components/ExplanationPanel.jsx'
import MetricCard from '@/shared/components/MetricCard.jsx'
import { SkeletonCard } from '@/shared/components/Skeleton.jsx'
import { POPULAR_BATTERS, POPULAR_BOWLERS } from '@/shared/constants'
import { Activity, TrendingUp, Target, Users } from 'lucide-react'

export default function Dashboard() {
  const { prediction, isLoading, predict, reset } = usePrediction()
  const { players: impactPlayers } = usePlayerImpact(50)
  const { selectedTeam, setSelectedTeam } = useAppContext()
  const [showExplanation, setShowExplanation] = useState(false)
  const [isExplaining, setIsExplaining] = useState(false)

  const datasetPlayerNames = impactPlayers
    .map((player) => player?.player)
    .filter(Boolean)

  const batterOptions = Array.from(new Set([...datasetPlayerNames, ...POPULAR_BATTERS]))
  const bowlerOptions = Array.from(new Set([...datasetPlayerNames, ...POPULAR_BOWLERS]))

  // Behavior tracking
  const { startTracking, stopTracking, trackClick } = useBehaviorTracking()

  // Start tracking when prediction is displayed
  useEffect(() => {
    if (prediction?.id) {
      startTracking(prediction.id)
      return () => stopTracking()
    }
  }, [prediction?.id, startTracking, stopTracking])

  const handlePredict = useCallback(async (params) => {
    await predict(params)
  }, [predict])

  const handleExplain = useCallback(() => {
    trackClick()
    setShowExplanation(true)
  }, [trackClick])

  const handleReset = useCallback(() => {
    stopTracking()
    reset()
    setShowExplanation(false)
  }, [stopTracking, reset])

  const handlePredictionClick = useCallback(() => {
    trackClick()
  }, [trackClick])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          AI-powered cricket match predictions and analytics
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={Activity}
          title="Predictions Today"
          value={12}
          change={15}
          trend="up"
        />
        <MetricCard
          icon={Target}
          title="Accuracy Rate"
          value={87.5}
          suffix="%"
          change={3.2}
          trend="up"
        />
        <MetricCard
          icon={TrendingUp}
          title="Avg Trust Score"
          value={0.78}
          change={5}
          trend="up"
        />
        <MetricCard
          icon={Users}
          title="Players Analyzed"
          value={156}
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Prediction Form */}
        <div className="lg:col-span-1">
          <PredictionForm
            onSubmit={handlePredict}
            isLoading={isLoading}
            selectedTeam={selectedTeam}
            onTeamChange={setSelectedTeam}
            batterOptions={batterOptions}
            bowlerOptions={bowlerOptions}
          />
        </div>

        {/* Prediction Result */}
        <div className="lg:col-span-2" onClick={handlePredictionClick}>
          {isLoading && (
            <div className="space-y-6">
              <SkeletonCard />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SkeletonCard />
                <SkeletonCard />
              </div>
            </div>
          )}

          {!isLoading && prediction && (
            <PredictionResult
              prediction={prediction}
              onExplain={handleExplain}
              isExplaining={isExplaining}
              onReset={handleReset}
            />
          )}

          {!isLoading && !prediction && (
            <div className="glass-card rounded-xl p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Activity className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Ready to Predict
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Select two teams and generate an AI-powered prediction with detailed analytics, 
                player insights, and venue information.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Explanation Panel */}
      <ExplanationPanel
        prediction={prediction}
        isOpen={showExplanation}
        onClose={() => setShowExplanation(false)}
      />
    </div>
  )
}
