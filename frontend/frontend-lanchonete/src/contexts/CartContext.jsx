import { createContext, useContext, useReducer, useCallback } from 'react'

const CartContext = createContext(null)

const initialState = { items: {}, observacao: '' }

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const prev = state.items[action.produto.id]
      return {
        ...state,
        items: {
          ...state.items,
          [action.produto.id]: {
            produto: action.produto,
            qty: (prev?.qty ?? 0) + 1,
          },
        },
      }
    }
    case 'REMOVE': {
      const { [action.id]: _, ...rest } = state.items
      return { ...state, items: rest }
    }
    case 'DEC': {
      const item = state.items[action.id]
      if (!item || item.qty <= 1) {
        const { [action.id]: _, ...rest } = state.items
        return { ...state, items: rest }
      }
      return {
        ...state,
        items: { ...state.items, [action.id]: { ...item, qty: item.qty - 1 } },
      }
    }
    case 'SET_OBS':
      return { ...state, observacao: action.value }
    case 'CLEAR':
      return initialState
    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  const addItem    = useCallback((produto) => dispatch({ type: 'ADD', produto }), [])
  const removeItem = useCallback((id) => dispatch({ type: 'REMOVE', id }), [])
  const decItem    = useCallback((id) => dispatch({ type: 'DEC', id }), [])
  const setObs     = useCallback((value) => dispatch({ type: 'SET_OBS', value }), [])
  const clearCart  = useCallback(() => dispatch({ type: 'CLEAR' }), [])

  const entries = Object.values(state.items)
  const totalQty  = entries.reduce((s, i) => s + i.qty, 0)
  const totalPrice = entries.reduce((s, i) => s + i.produto.preco * i.qty, 0)

  const toPayload = () => ({
    itens: entries.map(({ produto, qty }) => ({ produtoId: produto.id, quantidade: qty, precoUnitario: produto.preco })),
    observacao: state.observacao,
    total: totalPrice,
  })

  return (
    <CartContext.Provider value={{ items: state.items, entries, totalQty, totalPrice, observacao: state.observacao, addItem, removeItem, decItem, setObs, clearCart, toPayload }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}
