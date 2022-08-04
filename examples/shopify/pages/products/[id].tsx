import "../../lib/makeswift/register-components";

import {
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from "next";
import {
  getStaticProps as makeswiftGetStaticProps,
  PageProps as MakeswiftPageProps,
  Page as MakeswiftPage,
} from "@makeswift/runtime/next";
import { ProductContext } from "../../lib/makeswift/context";
import { getProduct, getProducts } from "../../lib/shopify/shopify";

export async function getStaticPaths(): Promise<GetStaticPathsResult> {
  const data = await getProducts();

  const returnValue = {
    paths: data.products.edges.map(({ node }: any) => {
      return {
        params: { id: node?.id.split("/")[4] },
      };
    }),
    fallback: true,
  };

  return returnValue;
}

type Props = MakeswiftPageProps & {
  product: any;
};

export async function getStaticProps(
  ctx: GetStaticPropsContext<{ id: string }>
): Promise<GetStaticPropsResult<Props>> {
  const makeswiftResult = await makeswiftGetStaticProps({
    ...ctx,
    params: { ...ctx.params, path: ["__product__"] },
  });

  const product = await getProduct(ctx.params?.id);

  return {
    ...makeswiftResult,
    props: {
      // @ts-ignore
      ...makeswiftResult.props,
      product,
    },
  };
}

export default function Page({ product, ...restOfProps }: Props) {
  if (product == null) return;

  return (
    <ProductContext.Provider value={product}>
      <MakeswiftPage {...restOfProps} />
    </ProductContext.Provider>
  );
}
