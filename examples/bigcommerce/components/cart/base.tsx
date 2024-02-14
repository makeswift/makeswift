'use client';

import { ShoppingCart } from 'lucide-react';

import { getCart } from '~/client/queries/get-cart';
import { ExistingResultType } from '~/client/util';

import { Badge } from '../ui/badge';

type Cart = ExistingResultType<typeof getCart>;

interface Props {
  cart?: Cart;
}

export const BaseCart = ({ cart }: Props) => {
  if (!cart) {
    return <ShoppingCart aria-label="cart" />;
  }

  const count = cart.lineItems.totalQuantity;

  return (
    <p role="status">
      <span className="sr-only">Cart Items</span>
      <ShoppingCart aria-hidden="true" />
      {Boolean(count) && <Badge>{count}</Badge>}
    </p>
  );
};
