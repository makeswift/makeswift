/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'

import { useProducts } from 'lib/products-context'

type Props = {
  className?: string
  categoryEntityId?: string
  count?: number
}

export function ProductList({ className, categoryEntityId, count }: Props) {
  const products = useProducts({ categoryEntityId, count })

  return (
    <div
      className={`${className} grid grid-cols-[repeat(auto-fit,minmax(325px,max-content))] justify-center gap-5`}
    >
      {products.length === 0 && count !== 0 ? (
        <p className="font-sans text-lg">Looks like that category doesn&apos;t have any products</p>
      ) : (
        products.map(product => {
          return (
            <Link
              href={`/product/${product.entityId}`}
              key={product.entityId}
              className="w-[325px] max-w-full group"
            >
              <div className="relative z-0">
                <img
                  className=""
                  src={product.defaultImage.urlOriginal}
                  alt={product.defaultImage.altText}
                  width="325"
                />
                <div className="absolute inset-0 group-hover:bg-white/10 group-hover:backdrop-saturate-10 transition-all"></div>
              </div>
              <div className="pt-3 flex flex-col">
                <p className="font-light text-xl">{product.name}</p>
                <p className="text-base text-green">$ {product.prices.price.value}</p>
              </div>
            </Link>
          )
        })
      )}
    </div>
  )
}
