import { toast as showToast } from '@/shared/components/Toaster.jsx'

export function useToast() {
  return {
    toast: showToast,
  }
}
