const envOfflineMode = import.meta.env.VITE_OFFLINE_MODE

// Default to backend mode. Enable mocks only when explicitly requested.
export const isOfflineMode =
  typeof envOfflineMode === 'string' && envOfflineMode.toLowerCase() === 'true'
