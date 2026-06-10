const PREFIX = 'r7cache:'
const TTL = 10 * 60 * 1000 // 10 minutes

export const cacheGet = (key) => {
  try {
    const raw = sessionStorage.getItem(PREFIX + key)
    if (!raw) return null
    const { data, ts } = JSON.parse(raw)
    return Date.now() - ts < TTL ? data : null
  } catch { return null }
}

export const cacheSet = (key, data) => {
  try {
    sessionStorage.setItem(PREFIX + key, JSON.stringify({ data, ts: Date.now() }))
  } catch {}
}
