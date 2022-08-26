import Image from 'next/image'
import Link from 'next/link'

import { useProducts } from 'lib/products-context'

type Props = {
  className?: string
  collectionId?: string
  count?: number
}

export function ProductList({ className, collectionId, count }: Props) {
  const products = useProducts({ collectionId, count })

  return (
    <div
      className={`${className} grid grid-cols-[repeat(auto-fit,minmax(325px,max-content))] justify-center gap-5`}
    >
      {products.length === 0 && count !== 0 ? (
        <p className="font-sans text-lg">Looks like that category doesn&apos;t have any products</p>
      ) : (
        products.map(product => {
          return (
            <Link href={`/product/${product.handle}`} key={product.id}>
              <a className="w-[325px] max-w-full group">
                <div className="relative z-0">
                  <Image
                    className=""
                    src={product.featuredImage.url}
                    alt={product.featuredImage.altText}
                    width="325"
                    height="400"
                  ></Image>
                  <div className="absolute inset-0 group-hover:bg-white/10 group-hover:backdrop-saturate-10 transition-all"></div>
                </div>
                <div className="pt-3 flex flex-col">
                  <p className="font-light text-xl">{product.title}</p>
                  <p className="text-base text-green">
                    $ {parseFloat(product.priceRange.minVariantPrice.amount).toFixed(0)}
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
