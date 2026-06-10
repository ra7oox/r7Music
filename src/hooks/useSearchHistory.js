import { useState, useCallback } from 'react'

const STORAGE_KEY = 'r7music-search-history'
const MAX_ITEMS = 10

const load = () => {
  try {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY)) || []
  } catch { return [] }
}

export const useSearchHistory = () => {
  const [history, setHistory] = useState(load)

  const addToHistory = useCallback((query) => {
    const trimmed = query.trim()
    if (!trimmed) return
    setHistory((prev) => {
      const next = [trimmed, ...prev.filter((q) => q !== trimmed)].slice(0, MAX_ITEMS)
      try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next)) } catch {}
      return next
    })
  }, [])

  const clearHistory = useCallback(() => {
    setHistory([])
    try { sessionStorage.removeItem(STORAGE_KEY) } catch {}
  }, [])

  return { history, addToHistory, clearHistory }
}
