'use client';

import { useQuery } from '@tanstack/react-query';

import { getCart } from '~/client/queries/get-cart';
import { ExistingResultType } from '~/client/util';

import { BaseCart } from './base';

type CartType = ExistingResultType<typeof getCart> | null;

const fetchCart = async () => {
  const response = await fetch('/api/cart');
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  const data = (await response.json()) as CartType;

  return data;
};

const useCart = () => {
  return useQuery({
    queryKey: ['cart'],
    queryFn: fetchCart,
  });
};

export const Cart = () => {
  const { data: cart } = useCart();

  if (!cart) {
    return <BaseCart />;
  }

  return <BaseCart cart={cart} />;
};
