import { ComponentPropsWithoutRef } from 'react';

interface Props extends ComponentPropsWithoutRef<'p'> {
  storeName: string;
}

export const Copyright = ({ storeName, ...rest }: Props) => {
  return (
    <p className="text-gray-500 sm:order-first" {...rest}>
      © {new Date().getFullYear()} {storeName} – Powered by BigCommerce
    </p>
  );
};
