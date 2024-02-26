import { cookies } from 'next/headers';

import { getCart } from '~/client/queries/get-cart';

import { BaseCart } from './base';

export const Cart = async () => {
  const cartId = cookies().get('cartId')?.value;

  if (!cartId) {
    return <BaseCart />;
  }

  const cart = await getCart(cartId);

  return <BaseCart cart={cart} />;
};
