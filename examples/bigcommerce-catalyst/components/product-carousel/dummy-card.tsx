import {
  ProductCard,
  ProductCardImage,
  ProductCardInfo,
} from '@bigcommerce/components/product-card';
import { Rating } from '@bigcommerce/components/rating'
import { Skeleton } from '../ui/skeleton';

export const DummyCard = () => {
  return (
    <ProductCard>
      <ProductCardImage>
        <div
          className="relative flex-auto aspect-[4/5]"
        >
          <Skeleton className="h-full w-96" />
        </div>
      </ProductCardImage>
      <ProductCardInfo>
        <Skeleton className='w-20 h-4' />
        <Skeleton className='w-60 h-6' />
        <Rating value={5} className='animate-pulse text-gray-200' size={16} />
        <div className="flex flex-wrap items-end justify-between pt-2">
          <Skeleton className='w-32 h-4' />
        </div>
      </ProductCardInfo>
    </ProductCard>
  )
}
