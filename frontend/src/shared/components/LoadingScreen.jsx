import { Activity, Loader2 } from 'lucide-react'

export default function LoadingScreen() {
  return (
    <div className="animated-bg min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 mb-4">
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center animate-pulse-glow">
            <Activity className="w-6 h-6 text-primary" />
          </div>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    </div>
  )
}
