import "../lib/makeswift/register-components";

import {
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from "next";
import {
  getServerSideProps as makeswiftGetServerSideProps,
  PageProps as MakeswiftPageProps,
  Page as MakeswiftPage,
} from "@makeswift/runtime/next";
import { ItemsContext, ProductContext } from "../lib/makeswift/context";
import { getProduct, getProducts } from "../lib/shopify/shopify";

type Props = MakeswiftPageProps & {
  items: any;
  product: any;
};

export async function getServerSideProps(
  ctx: GetStaticPropsContext
): Promise<GetStaticPropsResult<Props>> {
  // @ts-ignore
  const makeswiftResult = await makeswiftGetServerSideProps(ctx);

  const items = await getProducts();
  const product = await getProduct();

  return {
    ...makeswiftResult,
    props: {
      // @ts-ignore
      ...makeswiftResult.props,
      items,
      product,
    },
  };
}

export default function Page({ items, product, ...restOfProps }: Props) {
  return (
    <ItemsContext.Provider value={items}>
      <ProductContext.Provider value={product}>
        <MakeswiftPage {...restOfProps} />
      </ProductContext.Provider>
    </ItemsContext.Provider>
  );
}
