import Image from 'next/image'
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
    <div className={`${className} flex gap-3 flex-wrap justify-center`}>
      {products.length === 0 && count !== 0 ? (
        <p className="font-sans text-lg">Looks like that category doesn't have any products</p>
      ) : (
        products.map(product => {
          return (
            <Link href={`/product/${product.entityId}`} key={product.entityId}>
              <a className="w-[325px] max-w-full group">
                <div className="relative z-0">
                  <Image
                    className=""
                    src={product.defaultImage.urlOriginal}
                    alt={product.defaultImage.altText}
                    width="325"
                    height="400"
                  ></Image>
                  <div className="absolute inset-0 group-hover:bg-white/10 group-hover:backdrop-saturate-10 transition-all"></div>
                </div>
                <div className="p-5 pt-3 flex flex-col gap-2">
                  <p className="font-light text-xl">{product.name}</p>
                  <p className="text-base text-gray-700 font-bold">
                    $ {product.prices.price.value}
                  </p>
                </div>
              </a>
            </Link>
          )
        })
      )}
    </div>
  )
}
