import {
  addLineItem,
  createCart,
  deleteLineItem,
  attemptGetCart,
  getCheckoutURL,
  updateLineItem,
  DEFAULT_CART,
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

function parseCart(cartString?: string | null): CartResponse | null {
  try {
    const potentialCart = JSON.parse(cartString ?? '')
    if (typeof potentialCart === 'object' && 'id' in potentialCart) {
      return potentialCart
    }
    return null
  } catch (error) {
    return null
  }
}

function parseOfflineOperations(offlineOperationString?: string | null): CartOperation[] {
  try {
    const potentialOfflineOperations = JSON.parse(offlineOperationString ?? '')
    if (potentialOfflineOperations instanceof Array) {
      return potentialOfflineOperations
    }
    return []
  } catch (error) {
    return []
  }
}

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
  if (typeof window === 'undefined') return DEFAULT_CART

  return offlineOperations.reduce((cart, operation) => {
    const nextCart = structuredClone(cart)
    let index: number
    switch (operation.type) {
      case 'ADD':
        index = cart.line_items.physical_items.findIndex(
          lineItem => lineItem.product_id === operation.lineItem.product_id,
        )
        if (index === -1) {
          nextCart.line_items.physical_items = [
            ...cart.line_items.physical_items,
            operation.lineItem,
          ]
          nextCart.base_amount =
            cart.base_amount + operation.lineItem.original_price * operation.lineItem.quantity
        } else {
          nextCart.base_amount =
            cart.base_amount + operation.lineItem.quantity * operation.lineItem.original_price

          nextCart.line_items.physical_items[index].quantity =
            cart.line_items.physical_items[index].quantity + operation.lineItem.quantity
        }
        break
      case 'UPDATE':
        index = cart.line_items.physical_items.findIndex(
          lineItem => lineItem.product_id === operation.productId,
        )
        if (index !== -1) {
          const quantityDiff =
            operation.lineItem.quantity - cart.line_items.physical_items[index].quantity

          nextCart.base_amount = cart.base_amount + quantityDiff * operation.lineItem.original_price
          nextCart.line_items.physical_items[index].quantity = operation.lineItem.quantity
        }
        break
      case 'DELETE':
        index = cart.line_items.physical_items.findIndex(
          lineItem => lineItem.product_id === operation.productId,
        )
        if (index !== -1) {
          const lineItems = [...cart.line_items.physical_items]
          const lineItem = lineItems[index]
          lineItems.splice(index, 1)
          nextCart.line_items.physical_items = lineItems
          nextCart.base_amount = cart.base_amount - lineItem.quantity * lineItem.original_price
        }
        break
    }

    return nextCart
  }, structuredClone(cart) ?? structuredClone(DEFAULT_CART))
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartResponse | null>(null)
  const [offlineOperations, setOfflineOperations] = useState<CartOperation[]>([])
  const isOnline = useIsOnline()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const savedCart = localStorage.getItem(LOCAL_STORAGE_CART)
    const savedOfflineOperations = localStorage.getItem(LOCAL_STORAGE_OFFLINE_OPERATIONS)

    if (!window.navigator.onLine) {
      setCart(parseCart(savedCart))
      setOfflineOperations(parseOfflineOperations(savedOfflineOperations))
    } else {
      if (savedOfflineOperations) {
        syncOfflineOperations(parseOfflineOperations(savedOfflineOperations), parseCart(savedCart))
      } else if (savedCart) {
        setCart(parseCart(savedCart))
      }
    }

    async function syncOfflineOperations(
      offlineOperations: CartOperation[],
      cart: CartResponse | null,
    ) {
      try {
        setLoading(true)
        let currentCart: CartResponse =
          (cart && (await attemptGetCart(cart.id))) ?? (await createCart())
        setCart(currentCart)
        setOfflineOperations(offlineOperations)
        let currentOperation: CartOperation | undefined

        while (typeof (currentOperation = offlineOperations.shift()) !== 'undefined') {
          switch (currentOperation.type) {
            case 'ADD':
              currentCart = await addLineItem(currentCart, currentOperation.lineItem)
              break
            case 'UPDATE':
              currentCart = await updateLineItem(
                currentCart,
                currentOperation.productId,
                currentOperation.lineItem,
              )
              break
            case 'DELETE':
              currentCart = await deleteLineItem(currentCart, currentOperation.productId)
              break
          }
          setOfflineOperations(offlineOperations)
          localStorage.setItem(LOCAL_STORAGE_OFFLINE_OPERATIONS, JSON.stringify(offlineOperations))
          setCart(currentCart)
          localStorage.setItem(LOCAL_STORAGE_CART, JSON.stringify(currentCart))
        }
      } catch (e) {
        console.error('There was an error syncing your cart', e)
      }
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
        } else if (cart) {
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
        } else if (cart) {
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
