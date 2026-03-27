import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function formatDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export function formatNumber(num, decimals = 1) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(decimals) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(decimals) + 'K'
  }
  return num.toString()
}

export function formatPercentage(value, decimals = 1) {
  return `${(value * 100).toFixed(decimals)}%`
}

/**
 * predict() stores probabilities as 0–100 strings in MongoDB. Normalize to 0–1 for display math.
 */
export function normalizeStoredProbability(raw) {
  const n = parseFloat(raw)
  if (!Number.isFinite(n)) return 0.5
  if (n > 1) return Math.min(Math.max(n / 100, 0), 1)
  return Math.min(Math.max(n, 0), 1)
}

/** Trust may be stored as 0–100 or 0–1. */
export function normalizeStoredTrust(raw) {
  const n = parseFloat(raw)
  if (!Number.isFinite(n)) return 0
  if (n > 1) return Math.min(Math.max(n / 100, 0), 1)
  return Math.min(Math.max(n, 0), 1)
}

export function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

export function getInitials(name) {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/** Axios/fetch aborted request (stable check across versions). */
export function isRequestAborted(error) {
  return (
    error?.name === 'CanceledError' ||
    error?.code === 'ERR_CANCELED' ||
    error?.message === 'canceled'
  )
}
