import { useContext, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ProductsContext } from './makeswift/context'

type Props = {
  className?: string
}

const ProductList = ({ className }: Props) => {
  const items = useContext(ProductsContext)

  console.log(items, className)

  return (
    <div className={`${className} flex gap-3 flex-wrap justify-start`}>
      {items.map(edge => {
        const product = edge.node

        return (
          <Link href={`/product/${product.entityId}`} key={product.entityId}>
            <a className="max-w-sm bg-white rounded-lg border border-gray-200 shadow-md w-52">
              <Image
                className="rounded-t-lg"
                src={product.defaultImage.url}
                alt="Product"
                width="208"
                height="208"
              />
              <div className="p-5 pt-3 flex flex-col gap-2">
                <p className="text-sm text-gray-700 max-h-16 overflow-hidden">{product.name}</p>
                <p className="text-base text-gray-700 font-bold">
                  {/* $ {node.priceRange.minVariantPrice.amount} */}
                </p>
              </div>
            </a>
          </Link>
        )
      })}
    </div>
  )
}

export default ProductList
