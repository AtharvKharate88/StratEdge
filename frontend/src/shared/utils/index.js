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

/** Player / label guard — blocks literal "undefined", NA, empty from API or bad CSV keys. */
export function isValidPlayerLabel(name) {
  if (name == null) return false
  const s = String(name).trim()
  return s.length > 0 && s.toLowerCase() !== 'undefined' && s.toUpperCase() !== 'NA'
}

/** Safe single-line UI text; never shows the word "undefined". */
export function safeText(value, fallback = '—') {
  if (value == null) return fallback
  const s = String(value).trim()
  if (!s || s.toLowerCase() === 'undefined') return fallback
  return s
}

export function getInitials(name) {
  if (!isValidPlayerLabel(name)) return '?'
  const parts = String(name)
    .trim()
    .split(/\s+/)
    .filter(Boolean)
  const initials = parts.map((w) => w[0]).join('')
  return initials.toUpperCase().slice(0, 2) || '?'
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
