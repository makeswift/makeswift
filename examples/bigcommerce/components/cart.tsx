/* eslint-disable @next/next/no-img-element */
import { Popover, Transition } from '@headlessui/react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import { useCart } from 'lib/cart-context'
import { useProductFromPath } from 'lib/product-context'
import { Cart34, Minus28, Minus36, Plus28, Plus36, Spinner22, Spinner28 } from './icons'
import { LineItemRequest } from 'lib/bigcommerce'
import { useProduct } from 'lib/products-context'
import { usePreviewableTranslation } from './locale'
import { useIsOnline } from 'lib/useIsOnline'

function formatPrice(value?: number) {
  return value == null ? '$0.00' : `$${value.toFixed(2)}`
}

type CartLineItemState = 'initial' | 'loading'

type CartLineItemProps = {
  lineItem: LineItemRequest
}

function CartLineItem({ lineItem }: CartLineItemProps) {
  const { updateItem, deleteItem } = useCart()
  const product = useProduct(lineItem.product_id)
  const [cartState, setCartItemState] = useState<CartLineItemState>('initial')
  const { t } = usePreviewableTranslation('cart')

  return (
    <Link
      href={`/product/${lineItem.product_id}`}
      className={`flex w-full space-x-4 items-end`}
      key={lineItem.id}
    >
      <img
        src={lineItem.image_url}
        alt={`${t('image-for')} ${product?.name ?? lineItem.name}`}
        width={70}
      />
      <div className="flex flex-col flex-grow items-start justify-between">
        <div className="text-base text-black">{product?.name ?? lineItem.name}</div>
        <div className="text-sm text-green mb-2">{formatPrice(lineItem.original_price)}</div>
        <div className="flex justify-center items-center space-x-2">
          <button
            disabled={cartState === 'loading'}
            className="disabled:cursor-not-allowed"
            aria-label={t<string>('decrease-quantity')}
            onClick={async e => {
              e.preventDefault()
              setCartItemState('loading')
              lineItem.quantity === 1
                ? await deleteItem(lineItem.product_id)
                : await updateItem(lineItem.product_id, {
                    ...lineItem,
                    quantity: lineItem.quantity - 1,
                  })
              setCartItemState('initial')
            }}
          >
            <Minus28 />
          </button>
          <div>{lineItem.quantity}</div>
          <button
            disabled={cartState === 'loading'}
            className="disabled:cursor-not-allowed"
            aria-label={t<string>('increase-quantity')}
            onClick={async e => {
              e.preventDefault()
              setCartItemState('loading')
              await updateItem(lineItem.product_id, {
                ...lineItem,
                quantity: lineItem.quantity + 1,
              })
              setCartItemState('initial')
            }}
          >
            <Plus28 />
          </button>
        </div>
      </div>
      <button
        disabled={cartState === 'loading'}
        onClick={async e => {
          e.preventDefault()
          setCartItemState('loading')
          await deleteItem(lineItem.product_id)
          setCartItemState('initial')
        }}
        className="h-8 px-3 text-xs border-2 border-solid border-[rgba(0,0,0,0.15)] rounded-full disabled:cursor-not-allowed"
      >
        {t('remove-from-cart')}
      </button>
    </Link>
  )
}

type CartState = 'initial' | 'loading' | 'redirecting' | 'error' | 'offline'

type CartProps = {
  className?: string
  disabled?: boolean
}

export function Cart({ className, disabled }: CartProps) {
  const { cart, getCheckoutURL, loading } = useCart()
  const router = useRouter()
  const [cartState, setCartState] = useState<CartState>('initial')
  const isOnline = useIsOnline()
  const { t } = usePreviewableTranslation('cart')
  const itemCount =
    cart?.line_items.physical_items.reduce((acc, curr) => curr.quantity + acc, 0) ?? 0

  useEffect(() => {
    isOnline ? setCartState('initial') : setCartState('offline')
  }, [isOnline])

  return (
    <Popover className={className}>
      <Popover.Button
        disabled={loading || disabled}
        className={`relative z-0 disabled:cursor-not-allowed`}
      >
        <Cart34 />
        <Transition
          className="absolute flex justify-center items-center bg-green text-white h-5 w-5 rounded-full text-xs -translate-x-4 -translate-y-1 top-1/2 left-1/2"
          enter="transition-opacity duration-150"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-150 delay-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          show={itemCount > 0 && !loading}
        >
          {itemCount}
        </Transition>
        <Transition
          className="absolute flex justify-center items-center bg-green text-white h-5 w-5 p-1 rounded-full text-xs -translate-x-4 -translate-y-1 top-1/2 left-1/2"
          enter="transition-opacity duration-150"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-150 delay-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          show={loading}
        >
          <Spinner22 className="animate-spin" />
        </Transition>
      </Popover.Button>
      <Transition
        className={'fixed left-5 right-5 sm:left-[unset] sm:right-[unset] sm:absolute z-10'}
        enter="transition duration-200 ease-out"
        enterFrom="transform translate-y-2 opacity-0"
        enterTo="transform translate-y-0 opacity-100"
        leave="transition duration-175 ease-out"
        leaveFrom="transform translate-y-0 opacity-100"
        leaveTo="transform translate-y-2 opacity-0"
      >
        <Popover.Panel className="translate-y-2 sm:relative sm:w-[400px] sm:-translate-x-[calc(100%-34px)] p-5 bg-white shadow-[0px_4px_16px_0px_#00000026] space-y-4 divide-solid">
          <div className="text-[22px] text-black text-sans">{t('my-cart')}</div>
          <div className="border-t-[1px]" />
          {!cart?.line_items.physical_items.length ? (
            <div className="text-green">{t('cart-is-empty')}</div>
          ) : (
            <>
              {cart?.line_items.physical_items.map(lineItem => {
                return <CartLineItem lineItem={lineItem} key={lineItem.id} />
              })}

              <div className="border-t-[1px] border-[rgba(0,0,0,0.15)] border-solid" />
              <div className="flex justify-between text-sm text-black font-sans font-bold">
                <div>Total</div>
                <div>{formatPrice(cart?.base_amount)}</div>
              </div>
              <button
                disabled={cartState !== 'initial'}
                className={`${className} ${
                  cartState === 'offline' ? 'bg-grey disabled:text-green' : ''
                } disabled:cursor-not-allowed block w-full h-11 text-base text-white bg-green text-center relative z-0`}
                onClick={async () => {
                  setCartState('loading')
                  const checkoutUrl = await getCheckoutURL()
                  if (checkoutUrl) {
                    setCartState('redirecting')
                    router.push(checkoutUrl)
                  } else {
                    setCartState('error')
                  }
                }}
              >
                <Transition
                  className={'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'}
                  show={cartState === 'loading'}
                  enter="transition-opacity duration-150"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="transition-opacity duration-150"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Spinner22 className="animate-spin" />
                </Transition>
                <Transition
                  show={cartState !== 'loading'}
                  enter="transition-opacity duration-150"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="transition-opacity duration-150"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  {
                    {
                      initial: t('proceed-to-checkout'),
                      loading: t('proceed-to-checkout'),
                      error: t('error-in-checkout'),
                      redirecting: t('redirecting-to-checkout'),
                      offline: t('proceed-to-checkout-offline'),
                    }[cartState]
                  }
                </Transition>
              </button>
            </>
          )}
        </Popover.Panel>
      </Transition>
    </Popover>
  )
}

type AddToCartState = 'initial' | 'loading' | 'confirming'

type ProductAddToCartButtonProps = {
  className?: string
}

export function ProductAddToCartButton({ className }: ProductAddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1)
  const [addToCartState, setAddToCartState] = useState<AddToCartState>('initial')
  const { addItem, loading: cartLoading } = useCart()
  const product = useProductFromPath()
  const { t } = usePreviewableTranslation('cart')

  return (
    <div className={`${className} space-x-5 flex`}>
      <div className="flex justify-center items-center space-x-3">
        <button
          aria-label="Decrease quantity"
          onClick={() => setQuantity(prev => (prev === 1 ? prev : prev - 1))}
        >
          <Minus36 />
        </button>
        <div className="text-lg w-4 text-center">{quantity}</div>
        <button aria-label="Increase quantity" onClick={() => setQuantity(prev => prev + 1)}>
          <Plus36 />
        </button>
      </div>
      <button
        disabled={cartLoading && addToCartState !== 'initial'}
        onClick={async () => {
          setAddToCartState('loading')
          await addItem({
            product_id: product.entityId,
            quantity,
            original_price: product.prices.price.value,
            image_url: product.images.edges?.[0].node.urlOriginal,
            name: product.name,
          })
          setQuantity(1)
          setAddToCartState('confirming')
          setTimeout(() => setAddToCartState('initial'), 2000)
        }}
        className={`min-w-[170px] h-16 text-xl text-white bg-green px-8 relative z-0`}
      >
        <Transition
          className={'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'}
          show={addToCartState === 'loading'}
          enter="transition-opacity duration-150"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Spinner28 className="animate-spin" />
        </Transition>

        <Transition
          show={addToCartState !== 'loading'}
          enter="transition-opacity duration-150"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          {
            {
              initial: t('add-to-cart'),
              loading: t('add-to-cart'),
              confirming: t('add-to-cart-confirming'),
            }[addToCartState]
          }
        </Transition>
      </button>
    </div>
  )
}
