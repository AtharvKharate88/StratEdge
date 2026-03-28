import { Loader2 } from 'lucide-react'
import { StratEdgeMark } from '@/shared/components/StratEdgeBrand.jsx'

export default function LoadingScreen() {
  return (
    <div className="animated-bg min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="inline-flex flex-col items-center gap-2 mb-6 animate-pulse-glow px-4">
          <StratEdgeMark className="!h-auto !max-w-[220px]" />
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    </div>
  )
}
