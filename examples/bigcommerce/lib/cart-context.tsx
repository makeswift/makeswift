import {
  addLineItem,
  createCart,
  deleteLineItem,
  getCheckoutURL,
  updateLineItem,
} from 'lib/bigcommerce'
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react'

import { CartResponse, RestResponse, LineItemRequest } from './bigcommerce/types'
import { useIsOnline } from './useIsOnline'

export const CartContext = createContext<{
  loading: boolean
  cart: CartResponse | null
  addItem: (lineItem: LineItemRequest) => Promise<void>
  updateItem: (productId: number, lineItem: LineItemRequest) => Promise<void>
  deleteItem: (productId: number) => Promise<void>
  getCheckoutURL: () => Promise<string | null>
} | null>(null)

const LOCAL_STORAGE_CART = '@@makeswift:bigcommerce-example:cart'
const LOCAL_STORAGE_OFFLINE_OPERATIONS = '@@makeswift:bigcommerce-example:offline-operations'

export type CartOperation =
  | {
      type: 'ADD'
      lineItem: LineItemRequest
    }
  | {
      type: 'UPDATE'
      productId: number
      lineItem: LineItemRequest
    }
  | {
      type: 'DELETE'
      productId: number
    }

export function applyOfflineOperationsToCart(
  cart: CartResponse | null,
  offlineOperations: CartOperation[],
) {
  if (cart == null) return null
  return offlineOperations?.reduce((acc, curr) => {
    let index: number
    switch (curr.type) {
      case 'ADD':
        index = acc.line_items.physical_items.findIndex(
          lineItem => lineItem.product_id === curr.lineItem.product_id,
        )
        if (index === -1) {
          acc.line_items.physical_items = [...acc.line_items.physical_items, curr.lineItem]
          acc.base_amount = acc.base_amount + curr.lineItem.original_price * curr.lineItem.quantity
        } else {
          acc.base_amount = acc.base_amount + curr.lineItem.quantity * curr.lineItem.original_price

          acc.line_items.physical_items[index].quantity =
            acc.line_items.physical_items[index].quantity + curr.lineItem.quantity
        }

        break
      case 'UPDATE':
        index = acc.line_items.physical_items.findIndex(
          lineItem => lineItem.product_id === curr.productId,
        )
        if (index !== -1) {
          const quantityDiff =
            curr.lineItem.quantity - acc.line_items.physical_items[index].quantity

          acc.base_amount = acc.base_amount + quantityDiff * curr.lineItem.original_price
          acc.line_items.physical_items[index].quantity = curr.lineItem.quantity
        }
        break
      case 'DELETE':
        index = acc.line_items.physical_items.findIndex(
          lineItem => lineItem.product_id === curr.productId,
        )
        if (index !== -1) {
          const lineItems = acc.line_items.physical_items
          const lineItem = lineItems[index]
          lineItems.splice(index, 1)
          acc.line_items.physical_items = lineItems
          acc.base_amount = acc.base_amount - lineItem.quantity * lineItem.original_price
        }
        break
    }

    return acc
  }, structuredClone(cart))
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartResponse | null>(null)
  const [offlineOperations, setOfflineOperations] = useState<CartOperation[]>([])
  const isOnline = useIsOnline()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const savedCart = localStorage.getItem(LOCAL_STORAGE_CART)
    const savedOfflineOperations = localStorage.getItem(LOCAL_STORAGE_OFFLINE_OPERATIONS)

    if (savedCart == null) {
      createNewCart()
    } else {
      const cart: CartResponse = JSON.parse(savedCart)
      setCart(cart)
      if (!window.navigator.onLine) {
        setOfflineOperations(savedOfflineOperations ? JSON.parse(savedOfflineOperations) : [])
      } else {
        syncExistingCart(savedCart, savedOfflineOperations)
      }
    }

    async function createNewCart() {
      try {
        setLoading(true)
        const cart = await createCart()
        setCart(cart)
        localStorage.setItem(LOCAL_STORAGE_CART, JSON.stringify(cart))
      } catch {}
      setLoading(false)
    }

    async function syncExistingCart(
      cartString?: string | null,
      offlineOperationsString?: string | null,
    ) {
      try {
        setLoading(true)
        if (cartString != null) {
          const cart: CartResponse = JSON.parse(cartString)
          const response = await fetch(`/api/cart?cartId=${cart.id}`)
          const result: RestResponse<CartResponse> = await response.json()
          setCart(result.data)

          if (offlineOperationsString != null) {
            const offlineOperations: CartOperation[] = JSON.parse(offlineOperationsString)

            setOfflineOperations(offlineOperations)
            let currentCart: CartResponse | null = cart
            for (let index = 0; index < offlineOperations.length; index++) {
              const curr: CartOperation = offlineOperations[index]
              switch (curr.type) {
                case 'ADD':
                  currentCart = await addLineItem(currentCart, curr.lineItem)
                  break
                case 'UPDATE':
                  currentCart = await updateLineItem(currentCart, curr.productId, curr.lineItem)
                  break
                case 'DELETE':
                  currentCart = await deleteLineItem(currentCart, curr.productId)
                  break
              }
            }

            setOfflineOperations([])
            localStorage.removeItem(LOCAL_STORAGE_OFFLINE_OPERATIONS)
            setCart(currentCart)
          }
        } else {
          const cart = await createCart()
          setCart(cart)
          localStorage.setItem(LOCAL_STORAGE_CART, JSON.stringify(cart))
          localStorage.removeItem(LOCAL_STORAGE_OFFLINE_OPERATIONS)
        }
      } catch {}
      setLoading(false)
    }
  }, [])

  const value = useMemo(() => {
    return {
      loading,
      cart: applyOfflineOperationsToCart(cart, offlineOperations),
      addItem: async (lineItem: LineItemRequest) => {
        if (!isOnline) {
          setOfflineOperations(prev => {
            const nextOfflineOperations: CartOperation[] = [...prev, { type: 'ADD', lineItem }]
            localStorage.setItem(
              LOCAL_STORAGE_OFFLINE_OPERATIONS,
              JSON.stringify(nextOfflineOperations),
            )
            return nextOfflineOperations
          })
        } else {
          const nextCart = await addLineItem(cart, lineItem)
          setCart(nextCart)
          localStorage.setItem(LOCAL_STORAGE_CART, JSON.stringify(nextCart))
        }
      },
      updateItem: async function (productId: number, lineItem: LineItemRequest) {
        if (!isOnline) {
          setOfflineOperations(prev => {
            const nextOfflineOperations: CartOperation[] = [
              ...prev,
              { type: 'UPDATE', productId, lineItem },
            ]
            localStorage.setItem(
              LOCAL_STORAGE_OFFLINE_OPERATIONS,
              JSON.stringify(nextOfflineOperations),
            )
            return nextOfflineOperations
          })
        } else {
          const nextCart = await updateLineItem(cart, productId, lineItem)
          setCart(nextCart)
          localStorage.setItem(LOCAL_STORAGE_CART, JSON.stringify(nextCart))
        }
      },
      deleteItem: async (productId: number) => {
        if (!isOnline) {
          setOfflineOperations(prev => {
            const nextOfflineOperations: CartOperation[] = [...prev, { type: 'DELETE', productId }]
            localStorage.setItem(
              LOCAL_STORAGE_OFFLINE_OPERATIONS,
              JSON.stringify(nextOfflineOperations),
            )
            return nextOfflineOperations
          })
        } else {
          const nextCart = await deleteLineItem(cart, productId)
          setCart(nextCart)
          localStorage.setItem(LOCAL_STORAGE_CART, JSON.stringify(nextCart))
        }
      },
      getCheckoutURL: async () => {
        return getCheckoutURL(cart)
      },
    }
  }, [cart, isOnline, loading, offlineOperations])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const cart = useContext(CartContext)

  if (cart != null) {
    return cart
  }

  throw new Error('useCart should only be used inside a CartProvider')
}
