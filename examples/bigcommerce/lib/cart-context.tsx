import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { CartResponse, RestResponse, LineItem, RedirectURLResponse } from './bigcommerce/types'

export const CartContext = createContext<{
  cart: CartResponse | null
  addItem: (lineItem: LineItem) => Promise<void>
  updateItem: (lineItemId: string, lineItem: LineItem) => Promise<void>
  deleteItem: (lineItemId: string) => Promise<void>
  getCheckoutUrl: () => Promise<string | null>
} | null>(null)

const LOCAL_STORAGE_CART_ID = '@@makeswift:bigcommerce-example:cart-id'

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartResponse | null>(null)

  useEffect(() => {
    const savedCart = localStorage.getItem(LOCAL_STORAGE_CART_ID)
    if (savedCart != null) getCart(savedCart)

    async function getCart(cartId?: string) {
      if (!cartId) return null

      try {
        const response = await fetch(`/api/cart?cartId=${cartId}`)
        const result: RestResponse<CartResponse> = await response.json()
        setCart(result.data)
      } catch {
        setCart(null)
      }
    }
  }, [])

  const value = useMemo(
    () => ({
      cart,
      addItem: async (lineItem: LineItem) => {
        try {
          const response = await fetch(`/api/cart${cart ? `?cartId=${cart.id}` : ''}`, {
            method: 'POST',
            body: JSON.stringify({
              line_item: lineItem,
            }),
          })
          const result: RestResponse<CartResponse> = await response.json()
          setCart(result.data)
          localStorage.setItem(LOCAL_STORAGE_CART_ID, result.data.id)
        } catch (e) {
          setCart(null)
          console.error(`"addItem" failed with `, e)
        }
      },
      updateItem: async (lineItemId: string, lineItem: LineItem) => {
        if (!cart) return
        try {
          const response = await fetch(`/api/cart?cartId=${cart.id}&lineItemId=${lineItemId}`, {
            method: 'PUT',
            body: JSON.stringify({
              line_item: lineItem,
            }),
          })
          const result: RestResponse<CartResponse> = await response.json()
          setCart(result.data)
          localStorage.setItem(LOCAL_STORAGE_CART_ID, result.data.id)
        } catch (e) {
          setCart(null)
          console.error(`"updateItem" failed with: `, e)
        }
      },
      deleteItem: async (lineItemId: string) => {
        if (!cart) return
        try {
          const response = await fetch(`/api/cart?cartId=${cart.id}&lineItemId=${lineItemId}`, {
            method: 'DELETE',
          })
          const result: RestResponse<CartResponse | null> = await response.json()
          setCart(result.data)
          result.data
            ? localStorage.setItem(LOCAL_STORAGE_CART_ID, result.data.id)
            : localStorage.removeItem(LOCAL_STORAGE_CART_ID)
        } catch (e) {
          setCart(null)
          console.error(`"deleteItem" failed with: `, e)
        }
      },
      getCheckoutUrl: async () => {
        if (!cart) return null
        try {
          const response = await fetch(`/api/checkout?cartId=${cart.id}`)
          const result: RestResponse<RedirectURLResponse> = await response.json()
          return result.data.checkout_url
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
