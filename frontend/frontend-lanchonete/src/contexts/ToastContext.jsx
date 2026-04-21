import { createContext, useContext } from 'react'

export const ToastContext = createContext(() => {})

export const useToastMsg = () => useContext(ToastContext)
