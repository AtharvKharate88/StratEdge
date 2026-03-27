import { useState, useCallback, useEffect } from 'react'
import Card, { CardHeader, CardTitle, CardContent } from '@/shared/components/Card.jsx'
import Button from '@/shared/components/Button.jsx'
import Skeleton from '@/shared/components/Skeleton.jsx'
import { predictionService } from '@/shared/services/api'
import { Sparkles, RefreshCw, X, AlertCircle } from 'lucide-react'

export default function ExplanationPanel({ prediction, isOpen, onClose }) {
  const [explanation, setExplanation] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchExplanation = useCallback(async () => {
    if (!prediction) return

    setIsLoading(true)
    setError(null)

    try {
      console.log("Sending payload:", prediction)

      const response = await predictionService.getExplanation({
        teamA: prediction.teamA,
        teamB: prediction.teamB,
        probability: prediction.probability,
        trustScore: prediction.trustScore,
        stats: prediction.stats,
        topPlayers: prediction.topPlayers,
        playerBattle: prediction.playerBattle,
        venueInsight: prediction.venueInsight,
      })

      if (response?.data?.success) {
        setExplanation(response.data.explanation)
      } else {
        throw new Error('Failed to get explanation')
      }
    } catch (err) {
      console.error("Explanation Error:", err)

      setError(
        err.response?.data?.message ||
        err.message ||
        'Server not reachable'
      )
    } finally {
      setIsLoading(false)
    }
  }, [prediction])

  // ✅ FIXED: useEffect instead of useState
  useEffect(() => {
    if (isOpen) {
      // Reset previous state when reopening
      setExplanation(null)
      setError(null)

      fetchExplanation()
    }
  }, [isOpen, fetchExplanation])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in">
      <Card className="w-full max-w-2xl max-h-[80vh] overflow-hidden">
        <CardHeader className="flex-row items-center justify-between border-b border-border pb-4">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            AI Explanation
          </CardTitle>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </CardHeader>

        <CardContent className="overflow-y-auto max-h-[60vh] pt-4">
          {isLoading && (
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center py-8 text-center">
              <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                <AlertCircle className="w-6 h-6 text-destructive" />
              </div>
              <p className="text-foreground font-medium mb-2">Failed to Generate Explanation</p>
              <p className="text-sm text-muted-foreground mb-4">{error}</p>
              <Button variant="outline" onClick={fetchExplanation}>
                <RefreshCw className="w-4 h-4" />
                Try Again
              </Button>
            </div>
          )}

          {!isLoading && !error && explanation && (
            <div className="prose prose-invert max-w-none">
              <div className="text-foreground whitespace-pre-wrap leading-relaxed">
                {explanation}
              </div>
            </div>
          )}

          {!isLoading && !error && !explanation && (
            <div className="flex flex-col items-center py-8 text-center">
              <Sparkles className="w-12 h-12 text-primary mb-4" />
              <p className="text-foreground font-medium mb-2">Generate AI Explanation</p>
              <p className="text-sm text-muted-foreground mb-4">
                Get a detailed analysis of this prediction powered by AI
              </p>
              <Button onClick={fetchExplanation}>
                <Sparkles className="w-4 h-4" />
                Generate Explanation
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}