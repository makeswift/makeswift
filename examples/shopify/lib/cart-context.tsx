import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react'

import { addLines, createCart, getCart, getCheckoutUrl, removeLines, updateLines } from './shopify'
import { CartFragment, CartLineFragment, CartLineInput, CartLineUpdateInput } from './shopify/types'

export const CartContext = createContext<{
  cart: CartFragment | null
  addLines: (lines: CartLineInput[]) => Promise<void>
  updateLines: (lines: CartLineUpdateInput[]) => Promise<void>
  removeLines: (lineIds: string[]) => Promise<void>
  getCheckoutUrl: () => Promise<string | null>
} | null>(null)

const LOCAL_STORAGE_CART_ID = '@@makeswift:bigcommerce-example:cart-id'

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartFragment | null>(null)

  useEffect(() => {
    const savedCart = localStorage.getItem(LOCAL_STORAGE_CART_ID)
    if (savedCart != null) initializeCart(savedCart)

    async function initializeCart(id?: string) {
      if (!id) return null

      try {
        const cart = await getCart(id)
        setCart(cart)
      } catch {
        setCart(null)
      }
    }
  }, [])

  const value = useMemo(
    () => ({
      cart,
      addLines: async (lines: CartLineInput[]) => {
        try {
          if (cart) {
            const result = await addLines(cart.id, lines)
            setCart(result)
            localStorage.setItem(LOCAL_STORAGE_CART_ID, result.id)
          } else {
            const result = await createCart(lines)
            setCart(result)
            localStorage.setItem(LOCAL_STORAGE_CART_ID, result.id)
          }
        } catch (e) {
          setCart(null)
          console.error(`"addLines" failed with: `, e)
        }
      },
      updateLines: async (lines: CartLineUpdateInput[]) => {
        if (!cart) return
        try {
          const result = await updateLines(cart.id, lines)
          setCart(result)
          localStorage.setItem(LOCAL_STORAGE_CART_ID, result.id)
        } catch (e) {
          setCart(null)
          console.error(`"updateItem" failed with: `, e)
        }
      },
      removeLines: async (lineIds: string[]) => {
        if (!cart) return
        try {
          const result = await removeLines(cart.id, lineIds)
          setCart(result)
          localStorage.setItem(LOCAL_STORAGE_CART_ID, result.id)
        } catch (e) {
          setCart(null)
          console.error(`"deleteItem" failed with: `, e)
        }
      },
      getCheckoutUrl: async () => {
        if (!cart) return null
        try {
          return await getCheckoutUrl(cart.id)
        } catch (e) {
          console.error(`"getCheckoutUrl" failed with: `, e)
          return null
        }
      },
    }),
    [cart],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const cart = useContext(CartContext)

  if (cart != null) {
    return cart
  }

  throw new Error('useCart should only be used inside a CartProvider')
}
