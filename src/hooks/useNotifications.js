import { useState, useEffect, useCallback, useMemo } from 'react'
import { useAuth } from '../context/AuthContext'
import { fetchNotifications } from '../services/notificationService'

const idOf = (n) => String(n.id ?? n._id)

export default function useNotifications(role = 'teacher') {
  const { user } = useAuth()
  const readKey = `classynkify_read_notifs_${role}_${user?._id || user?.id || 'me'}`

  const [raw, setRaw] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const readFromStorage = () => {
    try { return new Set(JSON.parse(localStorage.getItem(readKey) || '[]')) } catch { return new Set() }
  }
  const [readIds, setReadIds] = useState(readFromStorage)

  // Re-read stored state if the user changes (e.g. after login)
  useEffect(() => {
    setReadIds(readFromStorage())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [readKey])

  const saveReadIds = (set) => {
    setReadIds(set)
    try { localStorage.setItem(readKey, JSON.stringify([...set])) } catch { /* storage unavailable */ }
  }

  const load = useCallback(async () => {
    setLoading(true)
    try {
      setRaw(await fetchNotifications(role))
      setError(false)
    } catch {
      setError(true) // keep the previous list if a refresh fails
    } finally {
      setLoading(false)
    }
  }, [role])

  // Load now, then every minute
  useEffect(() => {
    load()
    const timer = setInterval(load, 60000)
    return () => clearInterval(timer)
  }, [load])

  const items = useMemo(
    () => raw.map((n) => ({ ...n, read: readIds.has(idOf(n)) })),
    [raw, readIds]
  )
  const unreadCount = items.filter((n) => !n.read).length

  const markAllRead = () => saveReadIds(new Set([...readIds, ...raw.map(idOf)]))
  const markRead = (id) => saveReadIds(new Set([...readIds, String(id)]))

  return { items, loading, error, unreadCount, reload: load, markAllRead, markRead }
}