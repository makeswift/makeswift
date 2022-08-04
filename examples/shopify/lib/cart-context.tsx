import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { ProductFragment } from './shopify/types'

export const CartContext = createContext<{
  items: { product: ProductFragment; count: number }[]
  updateItem: (product: ProductFragment, count: number) => void
  deleteItem: (id: string) => void
} | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState(
    () => new Map<string, { product: ProductFragment; count: number }>(),
  )

  useEffect(() => {
    try {
      const storedCart = window.localStorage.getItem('cart')

      setItems(storedCart ? new Map(JSON.parse(storedCart)) : new Map())
    } catch {
      setItems(new Map())
    }
  }, [])

  useEffect(() => {
    if (items.size > 0) {
      window.localStorage.setItem('cart', JSON.stringify(Array.from(items)))
    }
  }, [items])

  const updateItem = useCallback(
    (product: ProductFragment, count: number) => {
      setItems(map => new Map(map).set(product.id, { product, count }))
    },
    [setItems],
  )

  const deleteItem = useCallback(
    (id: string) => {
      setItems(map => {
        const nextMap = new Map(map)

        nextMap.delete(id)

        return nextMap
      })
    },
    [setItems],
  )

  const value = useMemo(() => ({ items: Array.from(items.values()), updateItem, deleteItem }), [
    items,
    deleteItem,
    updateItem,
  ])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const cart = useContext(CartContext)

  if (cart != null) {
    return cart
  }

  throw new Error('useCart should only be used inside a CartProvider')
}
