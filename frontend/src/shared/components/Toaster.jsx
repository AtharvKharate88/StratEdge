import { useEffect, useState } from 'react'
import { cn } from '@/shared/utils'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'

// Global toast state
let toastListeners = []
let toastId = 0

export function toast({ title, description, variant = 'info', duration = 5000 }) {
  const id = ++toastId
  const newToast = { id, title, description, variant, duration }
  toastListeners.forEach((listener) => listener(newToast))
  return id
}

export function Toaster() {
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    const listener = (newToast) => {
      setToasts((prev) => [...prev, newToast])
      
      if (newToast.duration > 0) {
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== newToast.id))
        }, newToast.duration)
      }
    }
    
    toastListeners.push(listener)
    return () => {
      toastListeners = toastListeners.filter((l) => l !== listener)
    }
  }, [])

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <AlertCircle className="w-5 h-5 text-destructive" />,
    info: <Info className="w-5 h-5 text-accent" />,
  }

  const variants = {
    success: 'border-green-500/30',
    error: 'border-destructive/30',
    info: 'border-accent/30',
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            'glass-card rounded-lg p-4 min-w-[300px] max-w-[400px]',
            'animate-slide-in',
            variants[t.variant]
          )}
        >
          <div className="flex items-start gap-3">
            {icons[t.variant]}
            <div className="flex-1">
              <p className="font-medium text-foreground">{t.title}</p>
              {t.description && (
                <p className="text-sm text-muted-foreground mt-1">{t.description}</p>
              )}
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
