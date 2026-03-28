import { useState, useEffect, useCallback } from 'react'
import { usePrediction } from '../hooks/usePrediction'
import { useDashboardMetrics } from '../hooks/useDashboardMetrics'
import { useBehaviorTracking } from '@/features/behavior/hooks/useBehaviorTracking'
import { useAppContext } from '@/shared/context/AppContext.jsx'
import PredictionForm from '../components/PredictionForm.jsx'
import PredictionResult from '../components/PredictionResult.jsx'
import ExplanationPanel from '@/features/explanation/components/ExplanationPanel.jsx'
import MetricCard from '@/shared/components/MetricCard.jsx'
import { SkeletonCard } from '@/shared/components/Skeleton.jsx'
import { Activity, TrendingUp, Target, Users } from 'lucide-react'

export default function Dashboard() {
  const { prediction, isLoading, predict, reset } = usePrediction()
  const { metrics, isLoading: metricsLoading } = useDashboardMetrics()
  const { selectedTeam, setSelectedTeam } = useAppContext()
  const [showExplanation, setShowExplanation] = useState(false)
  const [isExplaining, setIsExplaining] = useState(false)

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
        <h1 className="text-3xl font-bold text-foreground">Match predictions</h1>
        <p className="text-muted-foreground mt-1 max-w-3xl">
          Pick two IPL teams and get a modeled win probability plus supporting numbers. Optional extras:
          venue context, a batter-vs-bowler matchup from recent data, and an AI-written explanation.
        </p>
      </div>

      {/* Quick Stats — loaded from API */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={Activity}
          title="Predictions Today"
          value={metricsLoading ? undefined : metrics?.predictionsToday}
        />
        <MetricCard
          icon={Target}
          title="Accuracy Rate"
          value={
            metricsLoading ? undefined : metrics?.accuracyRate ?? null
          }
          suffix="%"
        />
        <MetricCard
          icon={TrendingUp}
          title="Avg Trust Score"
          value={metricsLoading ? undefined : metrics?.avgTrustScore}
          suffix="%"
        />
        <MetricCard
          icon={Users}
          title="Players Analyzed"
          value={metricsLoading ? undefined : metrics?.playersAnalyzed}
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
                Your output will show up here
              </h3>
              <p className="text-muted-foreground max-w-lg mx-auto text-sm leading-relaxed">
                Use the form on the left: submit two teams first. You will get win odds, a side-by-side
                team stats panel, top impact players from the model, and—if you used Advanced Options—venue
                and player battle cards.
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
