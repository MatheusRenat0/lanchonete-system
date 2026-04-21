import { useState, useCallback, useRef } from 'react'

export function useToast() {
  const [toast, setToast] = useState(null)
  const timer = useRef(null)

  const show = useCallback((message, type = 'success') => {
    clearTimeout(timer.current)
    setToast({ message, type })
    timer.current = setTimeout(() => setToast(null), 2800)
  }, [])

  return { toast, show }
}
