import { Ref, forwardRef, useId } from 'react';

import {
  Carousel,
  CarouselContent,
  CarouselNextIndicator,
  CarouselPreviousIndicator,
  CarouselSlide,
} from '@bigcommerce/components/carousel';

import { ProductPreview, type Props as ProductPreviewProps } from '../ui/product-preview';

// import { Pagination } from './pagination';

type Props = {
  className: string;
  title?: string;
  products: ProductPreviewProps[];
};

export const CarouselStatic = forwardRef(function CarouselStatic(
  { className, title, products }: Props,
  ref: Ref<HTMLDivElement>,
) {
  const id = useId();

  if (products.length === 0) {
    return <div className="bg-gray-100 p-4 text-center text-lg">No products have been added</div>;
  }

  // const groupedProducts = products.reduce<Array<Array<Partial<Product>>>>((batches, _, index) => {
  //   if (index % 4 === 0) {
  //     batches.push([]);
  //   }

  //   const product = products[index];

  //   if (batches[batches.length - 1] && product) {
  //     batches[batches.length - 1]?.push(product);
  //   }

  //   return batches;
  // }, []);

  return (
    <Carousel aria-labelledby="Carousel" className={className} ref={ref}>
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-black lg:text-4xl" id="title">
          {title}
        </h2>
        <span className="no-wrap flex">
          <CarouselPreviousIndicator />
          <CarouselNextIndicator />
        </span>
      </div>
      <CarouselContent>
        {products.map((product, index) => (
          <CarouselSlide
            aria-label={`${index + 1} of ${products.length}`}
            id={`${id}-slide-${index + 1}`}
            index={index}
            key={index}
          >
            <ProductPreview
              key={index}
              image={product.image}
              imageAlt={product.imageAlt}
              link={product.link}
              buttonText={product.buttonText}
            />
          </CarouselSlide>
        ))}
      </CarouselContent>
      {/* <Pagination groupedProducts={groupedProducts} id={id} /> */}
    </Carousel>
  );
});
