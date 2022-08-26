import { Popover, Transition } from '@headlessui/react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useState } from 'react'

import { useCart } from 'lib/cart-context'
import { useProduct } from 'lib/product-context'
import { CartLineFragment } from 'lib/shopify'
import { Cart34, Minus28, Minus36, Plus28, Plus36, Spinner22, Spinner28 } from './icons'

function formatPrice(value?: string) {
  return value == null ? '$0.00' : `$${parseFloat(value).toFixed(2)}`
}

type CartItemState = 'initial' | 'loading'

type CartItemProps = {
  line: CartLineFragment
}

function CartItem({ line }: CartItemProps) {
  const { updateLines, removeLines } = useCart()
  const [cartState, setCartItemState] = useState<CartItemState>('initial')
  return (
    <Link href={`/product/${line.merchandise.product.handle}`}>
      <a className={`flex w-full space-x-4 items-end`} key={line.id}>
        <Image
          src={line.merchandise.image.url}
          alt={line.merchandise.image.altText}
          layout="fixed"
          width={70}
          height={80}
        />
        <div className="flex flex-col flex-grow items-start justify-between">
          <div className="text-base text-black">{line.merchandise.product.title}</div>
          <div className="text-sm text-green mb-2">{formatPrice(line.cost.totalAmount.amount)}</div>
          <div className="flex justify-center items-center space-x-2">
            <button
              disabled={cartState === 'loading'}
              className="disabled:cursor-not-allowed"
              aria-label="Decrease quantity"
              onClick={async e => {
                e.preventDefault()
                if (line.quantity <= 0) return
                setCartItemState('loading')
                await updateLines([
                  {
                    id: line.id,
                    quantity: line.quantity - 1,
                  },
                ])
                setCartItemState('initial')
              }}
            >
              <Minus28 />
            </button>
            <div>{line.quantity}</div>
            <button
              disabled={cartState === 'loading'}
              className="disabled:cursor-not-allowed"
              aria-label="Increase quantity"
              onClick={async e => {
                e.preventDefault()
                setCartItemState('loading')
                await updateLines([
                  {
                    id: line.id,
                    quantity: line.quantity + 1,
                  },
                ])
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
            await removeLines([line.id])
            setCartItemState('initial')
          }}
          className="h-8 px-3 text-xs border-2 border-solid border-[rgba(0,0,0,0.15)] rounded-full disabled:cursor-not-allowed"
        >
          Remove
        </button>
      </a>
    </Link>
  )
}

type CartState = 'initial' | 'loading' | 'redirecting' | 'error'

type CartProps = {
  className?: string
}

export function Cart({ className }: CartProps) {
  const { cart, getCheckoutUrl } = useCart()
  const router = useRouter()
  const [cartState, setCartState] = useState<CartState>('initial')

  const itemCount = cart?.lines.edges.reduce((acc, curr) => curr.node.quantity + acc, 0) ?? 0
  return (
    <Popover className={className}>
      <Popover.Button className={'relative z-0'}>
        <Cart34 />
        <Transition
          className="absolute flex justify-center items-center bg-green text-white h-5 w-5 rounded-full text-xs -translate-x-4 -translate-y-1 top-1/2 left-1/2"
          enter="transition-opacity duration-150"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-150 delay-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          show={itemCount > 0}
        >
          {itemCount}
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
        <Popover.Panel className="translate-y-4 sm:relative sm:w-[400px] sm:-translate-x-[calc(100%-34px)] sm:translate-y-2 p-5 bg-white  shadow-[0px_4px_16px_0px_#00000026] space-y-4 divide-solid">
          <div className="text-[22px] text-black text-sans">My cart</div>
          <div className="border-t-[1px]" />
          {!cart?.lines.edges.length ? (
            <div className="text-green">Your cart is empty</div>
          ) : (
            <>
              {cart?.lines.edges.map(({ node }) => (
                <CartItem line={node} key={node.id} />
              ))}
              <div className="border-t-[1px] border-[rgba(0,0,0,0.15)] border-solid" />
              <div className="flex justify-between text-sm text-black font-sans font-bold">
                <div>Total</div>
                <div>{formatPrice(cart?.cost.totalAmount.amount)}</div>
              </div>
              <button
                disabled={cartState !== 'initial'}
                className={`${className} block w-full h-11 text-base text-white bg-green text-center relative z-0`}
                onClick={async () => {
                  setCartState('loading')
                  const checkoutUrl = await getCheckoutUrl()
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
                      initial: 'Proceed to checkout',
                      loading: 'Proceed to checkout',
                      error: "Something wen't wrong",
                      redirecting: 'Redirecting to checkout',
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

type AddToCartButtonProps = {
  className?: string
}

export function AddToCartButton({ className }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1)
  const [addToCartState, setAddToCartState] = useState<AddToCartState>('initial')
  const { addLines } = useCart()
  const product = useProduct()

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
        disabled={addToCartState !== 'initial'}
        onClick={async () => {
          const merchandiseId = product.variants.edges.at(0)?.node.id
          if (merchandiseId == null) return
          setAddToCartState('loading')
          await addLines([{ merchandiseId, quantity }])
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
              initial: 'Add to cart',
              loading: 'Add to cart',
              confirming: 'Added',
            }[addToCartState]
          }
        </Transition>
      </button>
    </div>
  )
}
