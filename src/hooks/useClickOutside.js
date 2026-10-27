import { useEffect } from 'react'

export default function useClickOutside(ref, onClose, active) {
  useEffect(() => {
    if (!active) return
    const onMouseDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose()
    }
    const onKeyDown = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('mousedown', onMouseDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onMouseDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [ref, onClose, active])
}