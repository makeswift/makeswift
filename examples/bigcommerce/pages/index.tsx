import { NextPage } from 'next'
import { useState } from 'react'
import useSWR from 'swr'
import { fetcher } from '../lib/fetcher'

const Home: NextPage = () => {
  const [page, setPage] = useState<string | null>(null)
  const { data, error } = useSWR(page ? `/api/products?cursor=${page}` : '/api/products', fetcher)

  if (error) return <div>failed to load</div>
  if (!data) return <div>loading...</div>
  console.log()
  return (
    <div>
      <div className="w-full flex flex-row">
        {data.data.site.products.edges.map(edge => {
          const product = edge.node
          console.log(product)
          return (
            <div key={product.name} className="flex flex-col">
              <h2>{product.name}</h2>
              {product.defaultImage && <img src={product.defaultImage.url} width={500} />}
            </div>
          )
        })}
      </div>

      {data.data.site.products.pageInfo.hasNextPage && (
        <button
          onClick={() => {
            return setPage(data.data.site.products.pageInfo.endCursor)
          }}
        >
          next
        </button>
      )}
    </div>
  )
}

export default Home
