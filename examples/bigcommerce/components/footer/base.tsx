import React from 'react';

import { FooterNav, FooterSection, Footer as ReactantFooter } from '@bigcommerce/components/footer';
import { getBrands } from '~/client/queries/get-brands';
import { getCategoryTree } from '~/client/queries/get-category-tree';
import { getStoreSettings } from '~/client/queries/get-store-settings';
import { getWebPages } from '~/client/queries/get-web-pages';
import { ExistingResultType } from '~/client/util';

import { StoreLogo } from '../store-logo';

import { ContactInformation } from './contact-information';
import { Copyright } from './copyright';
import { BaseFooterMenu, BrandFooterMenu, CategoryFooterMenu } from './footer-menus';
import { WebPageFooterMenu } from './footer-menus/web-page-footer-menu';
import { PaymentMethods } from './payment-methods';
import { SocialIcons } from './social-icons';

type StoreSettings = ExistingResultType<typeof getStoreSettings>;
type CategoryTree = ExistingResultType<typeof getCategoryTree>;
type Brands = ExistingResultType<typeof getBrands>;
type WebPages = ExistingResultType<typeof getWebPages>;

interface Props {
  storeSettings: StoreSettings;
  categoryTree: CategoryTree;
  brands: Brands;
  webPages: WebPages;
}

export const BaseFooter = ({ brands, categoryTree, storeSettings, webPages }: Props) => {
  return (
    <ReactantFooter>
      <FooterSection>
        <FooterNav>
          <CategoryFooterMenu categoryTree={categoryTree} />
          <BrandFooterMenu brands={brands} />
          <WebPageFooterMenu webPages={webPages} />
          <BaseFooterMenu
            items={[
              { name: 'About Us', path: '/about-us' },
              { name: 'FAQ', path: '/faq' },
            ]}
            title="Help"
          />
        </FooterNav>
        <div className="flex shrink-0 grow flex-col gap-4 md:order-first">
          <h3 className="mb-4">
            <StoreLogo settings={storeSettings} />
          </h3>
          <ContactInformation contact={storeSettings.contact} />
          <SocialIcons storeSettings={storeSettings} />
        </div>
      </FooterSection>
      <FooterSection className="justify-between gap-10 sm:flex-row sm:gap-8 sm:py-6">
        <PaymentMethods />
        <Copyright storeName={storeSettings.storeName} />
      </FooterSection>
    </ReactantFooter>
  );
};
