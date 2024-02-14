import { getBrands } from '~/client/queries/get-brands';
import { ExistingResultType } from '~/client/util';

import { BaseFooterMenu } from './base-footer-menu';

type Brands = ExistingResultType<typeof getBrands>;

interface Props {
  brands: Brands;
}

export const BrandFooterMenu = ({ brands }: Props) => {
  if (!brands.length) {
    return null;
  }

  return <BaseFooterMenu items={brands} title="Brands" />;
};
