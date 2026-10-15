import { useState, useEffect, useRef } from 'react'
import { useTheme } from '../context/ThemeContext'

const OPTIONS = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
]

function Icon({ name }) {
  const common = {
    width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none',
    stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round',
  }
  if (name === 'light') {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </svg>
    )
  }
  if (name === 'dark') {
    return (
      <svg {...common}>
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    )
  }
  return (
    <svg {...common}>
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  )
}

export default function ThemeToggle({ floating = false }) {
  const { theme, setTheme } = useTheme()
  const [open, setOpen] = useState(false)
  const [hover, setHover] = useState(null)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const wrapperStyle = floating
    ? { position: 'fixed', right: '20px', bottom: '20px', zIndex: 9999 }
    : { position: 'relative', display: 'inline-block' }

  const menuPosition = floating
    ? { bottom: '52px', right: 0 }
    : { top: '48px', right: 0 }

  return (
    <div ref={ref} style={wrapperStyle}>
      <button
        type="button"
        aria-label="Change theme"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          color: '#334155',
          boxShadow: '0 4px 14px rgba(15, 23, 42, 0.15)',
        }}
      >
        <Icon name={theme} />
      </button>

      {open && (
        <div
          role="menu"
          style={{
            position: 'absolute',
            ...menuPosition,
            minWidth: '150px',
            padding: '6px',
            borderRadius: '12px',
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            boxShadow: '0 10px 30px rgba(15, 23, 42, 0.18)',
          }}
        >
          {OPTIONS.map((o) => {
            const active = theme === o.value
            return (
              <button
                key={o.value}
                type="button"
                role="menuitemradio"
                aria-checked={active}
                onClick={() => {
                  setTheme(o.value)
                  setOpen(false)
                }}
                onMouseEnter={() => setHover(o.value)}
                onMouseLeave={() => setHover(null)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '9px 10px',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  textAlign: 'left',
                  color: '#334155',
                  background: active ? '#eff6ff' : hover === o.value ? '#f1f5f9' : 'transparent',
                }}
              >
                <Icon name={o.value} />
                <span style={{ flex: 1 }}>{o.label}</span>
                {active && <span style={{ color: '#2563eb', fontWeight: 700 }}>✓</span>}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}