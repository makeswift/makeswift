import { useCart } from 'lib/cart-context'
import { useProduct } from 'lib/product-context'

type ProductCartProps = {
  className?: string
}

export function ProductCart({ className }: ProductCartProps) {
  const { items } = useCart()

  return (
    <div className={`${className} relative z-0 `}>
      <svg
        width="34"
        height="34"
        viewBox="0 0 34 34"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10 8H26L27 27H9L10 8Z"
          fill="white"
          stroke="black"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M14 8H30L31 27H13L14 8Z"
          fill="white"
          stroke="black"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M13 6C13 3.23858 15.2386 1 18 1V1C20.7614 1 23 3.23858 23 6V8H13V6Z"
          stroke="black"
          strokeWidth="2"
        />
        <path
          d="M17 6C17 3.23858 19.2386 1 22 1V1C24.7614 1 27 3.23858 27 6V8H17V6Z"
          stroke="black"
          strokeWidth="2"
        />
      </svg>
      <div className="absolute flex justify-center items-center bg-green text-white h-5 w-5 rounded-full text-xs -translate-x-4 -translate-y-1 top-1/2 left-1/2">
        {items.length}
      </div>
    </div>
  )
}

type ProductAddToCartButtonProps = {
  className?: string
}

export function ProductAddToCartButton({ className }: ProductAddToCartButtonProps) {
  const { updateItem } = useCart()
  const product = useProduct()

  return (
    <button
      onClick={() => updateItem(product, 1)}
      className={`${className} text-xl text-white bg-green py-4 px-8`}
    >
      Add to cart
    </button>
  )
}
