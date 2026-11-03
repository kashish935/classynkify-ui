import { useEffect, useRef, useState } from 'react'

const MAX_SIZE = 5 * 1024 * 1024 // 5 MB, same limit as the server
const OK_TYPES = ['image/jpeg', 'image/png']

// Photo chooser with previews. It keeps its own list and reports the chosen File objects
// through onChange(files). To start over, unmount it (e.g. close the form).
export default function ImagePicker({ onChange, max = 5, accent = '#6366f1', label = 'Add photos' }) {
  const inputRef = useRef(null)
  const [items, setItems] = useState([]) // [{ file, url }]
  const itemsRef = useRef(items)
  const [error, setError] = useState('')

  useEffect(() => { itemsRef.current = items }, [items])

  // Free the preview URLs when the picker goes away
  useEffect(() => () => itemsRef.current.forEach((it) => URL.revokeObjectURL(it.url)), [])

  const commit = (next) => {
    setItems(next)
    onChange(next.map((it) => it.file))
  }

  const handlePick = (e) => {
    const picked = Array.from(e.target.files || [])
    e.target.value = '' // lets the same photo be chosen again later
    if (!picked.length) return

    const room = max - items.length
    const accepted = []
    let message = ''
    for (const f of picked) {
      if (!OK_TYPES.includes(f.type)) { message = 'Only JPG or PNG photos are allowed.'; continue }
      if (f.size > MAX_SIZE) { message = 'Each photo must be 5 MB or smaller.'; continue }
      if (accepted.length >= room) { message = `You can add up to ${max} photos.`; break }
      accepted.push({ file: f, url: URL.createObjectURL(f) })
    }
    setError(message)
    if (accepted.length) commit([...items, ...accepted])
  }

  const removeAt = (i) => {
    URL.revokeObjectURL(items[i].url)
    setError('')
    commit(items.filter((_, idx) => idx !== i))
  }

  const full = items.length >= max

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png"
        multiple
        onChange={handlePick}
        style={{ display: 'none' }}
        data-testid="image-input"
      />

      {items.length > 0 && (
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '10px' }}>
          {items.map((it, i) => (
            <div key={it.url} style={{ position: 'relative', width: '72px', height: '72px' }}>
              <img
                src={it.url}
                alt={`Selected photo ${i + 1}`}
                style={{
                  width: '100%', height: '100%', objectFit: 'cover', display: 'block',
                  borderRadius: '10px', border: '1px solid #e2e8f0',
                }}
              />
              <button
                type="button"
                onClick={() => removeAt(i)}
                aria-label={`Remove photo ${i + 1}`}
                style={{
                  position: 'absolute', top: '-6px', right: '-6px',
                  width: '20px', height: '20px', borderRadius: '50%', border: 'none',
                  background: '#ef4444', color: '#fff', fontSize: '10px', lineHeight: 1,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >✕</button>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={full}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '9px 14px', background: '#f8fafc',
            border: `1.5px dashed ${accent}`, borderRadius: '10px',
            color: accent, fontSize: '13px', fontWeight: '600', fontFamily: 'inherit',
            cursor: full ? 'not-allowed' : 'pointer', opacity: full ? 0.5 : 1,
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.8"/>
            <circle cx="9" cy="9" r="1.6" stroke="currentColor" strokeWidth="1.8"/>
            <path d="m21 15-4.5-4.5L8 19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {items.length ? `Add more (${items.length}/${max})` : label}
        </button>
        <span style={{ fontSize: '11px', color: '#94a3b8' }}>JPG or PNG, up to 5 MB each</span>
      </div>

      {error && (
        <p role="alert" style={{ fontSize: '12px', color: '#dc2626', marginTop: '8px' }}>{error}</p>
      )}
    </div>
  )
}